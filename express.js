var express = require('express');
var app = express();

var request = require('request');

var fs = require("fs");

var multer = require('multer');
var upload = multer({dest: './images'});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pictures');
var conn = mongoose.connection;

var Grid = require('gridfs-stream');

var logger = require('morgan');

var imgFileName=""; //saves the name of the image. such as "dog.jpg". Used to load the image

var currentImageId = ""; //saves the unique id of each image to this var. Will be used when saving tags.

conn.on('error', console.error.bind(console, 'connection error:'));
conn.on('open',function() {

//below var is the schema for a tag. Each tag contains the html code of that tag and the associated imageId
  var tagSchema = mongoose.Schema({
    tagString: String,
    imageId: String //this is to load the correct tag for the image loaded.
  });

  var Tag = mongoose.model('Tag', tagSchema);

  var gfs = Grid(conn.db, mongoose.mongo);

  app.use(logger('dev'));

  app.use(express.static(__dirname + '/public')); //static middleware

  app.get("/", function(req,res){
    res.render("home");  //loads up home.ejs
  });

  app.post("/", upload.single("avatar"), function(req, res, next){
    imgFileName = req.file.originalname; //save the name of the file to be loaded.
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });

    fs.createReadStream("./images/" + req.file.filename)
      .on("end", function(){fs.unlink("./images/"+ req.file.filename, function(err){res.redirect("http://localhost:3000/imageTagging")})})
      .on("err", function(){res.send("Error uploading image")})
      .pipe(writestream);

    currentImageId = writestream.id.toString(); //save unique id to be used later.
  });



  //goes to imageTagging.ejs
  app.get("/imageTagging",function(req,res){
    res.render("imageTagging");
  });

  //goes to imageTranslating.ejs
  app.get("/imageTranslating",function(req,res){
    res.render("imageTranslating");
  });

  //gets the loaded image's name and returns it.
  app.get('/getImage', function (req, res) {
    res.send(imgFileName);
  });

  //takes tag html and imageid and saves to mongoose schema. Then saves the schema to database
  app.get('/saveTags', function (req, res) {
    console.log(req.query.tags);
    var tagData = new Tag({
      tagString: req.query.tags,
      imageId: currentImageId
    });
    tagData.save(function(error, uploadTag) {
      tagId = uploadTag.id;
      if (error) {
        console.error(error);
      }
    });
    res.send('Sent tags');
  });

  //The way we update tags is by deleting all old tags and then adding new ones.
  //This function deletes all tags in the database that are linked the currentImageId
  app.get('/removeTags', function(req, res) {
    var tagResponse = Tag.remove({'imageId': currentImageId }, function(err) {
      if(err) {
        console.error(err);
      }
    });
    res.send('delete tags');
  });


  //Sends all tags to the client that have the currentImageId
  app.get('/loadTags', function(req, res) {
    Tag.find({ imageId: currentImageId}, function(err,tagData) {
      res.send(tagData);
    });
  });

  //Takes a term and queries the api for the concept data. Then sends the concepts over to the client
  app.get('/sendTerm', function (req,res) {
    console.log(req.query.term);
    var url = 'https://kamusi.org/preD/termTranslate/' + req.query.term + '/' + req.query.from + '/' + req.query.to;
    request(url, function(error, response, body)
    {
      var json = JSON.parse(body);
      res.send(json);
    });
  });

  //gets the image name in the url and returns the corresponding image.
  app.get("/:filename",function(req,res){
    var readstream = gfs.createReadStream({filename: req.params.filename});
    readstream.on("error", function(err){
      res.send("No image found with that title");
    });
    readstream.pipe(res);
  });

  app.get('*', function(req,res){
    res.send('Hello World');
  });
});

app.set("view engine", "ejs");
app.set("views", "./views");


if (!module.parent) {
  app.listen(3000);
  console.log('Listening on port 3000');
}

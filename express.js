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

var imgFileName="";
//var tagId="";
var tagId = new mongoose.Types.ObjectId;

conn.on('error', console.error.bind(console, 'connection error:'));
conn.on('open',function() {

  var tagSchema = mongoose.Schema({
    tagString: String
  });

  var Tag = mongoose.model('Tag', tagSchema);

  var gfs = Grid(conn.db, mongoose.mongo);

  app.use(logger('dev'));

  app.use(express.static(__dirname + '/public')); //static middleware

  app.get("/", function(req,res){
    //renders a multipart/form-data form
    res.render("home");
  });

  app.post("/", upload.single("avatar"), function(req, res, next){
    imgFileName = req.file.originalname;
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });

    fs.createReadStream("./images/" + req.file.filename)
      .on("end", function(){fs.unlink("./images/"+ req.file.filename, function(err){res.redirect("http://localhost:3000/imageTagging")})})
      .on("err", function(){res.send("Error uploading image")})
      .pipe(writestream);
  });

  //test
  app.get("/imageTagging",function(req,res){
    res.render("imageTagging");
  });

  app.get('/getImage', function (req, res) {
    res.send(imgFileName);
  });

  app.get('/sendTags', function (req, res) {
    var tagData = new Tag({ tagString: req.query.tags });
    tagData.save(function(error, uploadTag) {
      tagId = uploadTag.id;
      if (error) {
        console.error(error);
      }
    });
    res.send('Sent tags');
  });


  app.get('/removeOldTags', function(req, res) {
    var tagResponse = Tag.remove({'_id': tagId }, function(err) {
      if(err) {
        console.error(err);
      }
    });
    res.send('delete tags');
  });

  app.get('/TranslateData', function (req, res) {
    var url = 'https://kamusi.org/preD/termTranslate/' + req.query.word + '/' + req.query.from + '/' + req.query.to;
    console.log(url);
    request(url, function(error, response, body)
    {
      var json = JSON.parse(body);
      if(json[0].target_terms[0] == undefined)
      {
        console.log("Undefined");
      }
      else
      {
        var strJSON = JSON.stringify(json[0].target_terms[0].lemma_accent);
        console.log(strJSON);
      }
    });


  });



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

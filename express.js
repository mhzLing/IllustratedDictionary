var express = require('express');
var app = express();

var fs = require("fs");

var multer = require('multer');
var upload = multer({dest: './images'});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pictures');
var conn = mongoose.connection;

var Grid = require('gridfs-stream');

var logger = require('morgan');

var imgFileName="";

conn.on('error', console.error.bind(console, 'connection error:'));
conn.on('open',function() {
  /*
  var pictureSchema = mongoose.Schema({
    _id = String
  });
  var picture = mongoose.model('picture',pictureSchema);
  */

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

  app.get('/ajaxURL', function (req, res) {
    res.send(imgFileName);
  });

  app.get("/:filename",function(req,res){
    var readstream = gfs.createReadStream({filename: req.params.filename});
    readstream.on("error", function(err){
      res.send("No image found with that title");
    });
    readstream.pipe(res);
  });

  /*
  app.get('/books/:bookTitle/:name', function(req, res) {
    var bookData = {title: req.params.bookTitle , author: req.params.name};
    res.render('bookView.ejs',{book: bookData});
  });

  app.get('/books', function(req, res){
    res.send('A list of books should go here');
  });
  */


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

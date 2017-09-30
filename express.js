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

conn.on('error', console.error.bind(console, 'connection error:'));
conn.on('open',function() {
  var gfs = Grid(conn.db, mongoose.mongo);

  app.use(logger('dev'));

  app.get("/", function(req,res){
    //renders a multipart/form-data form
    res.render("home");
  });

  app.post("/", upload.single("avatar"), function(req, res, next){
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });

    fs.createReadStream("./images/" + req.file.filename)
      .on("end", function(){fs.unlink("./images/"+ req.file.filename, function(err){res.send("success")})})
      .on("err", function(){res.send("Error uploading image")})
      .pipe(writestream);
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

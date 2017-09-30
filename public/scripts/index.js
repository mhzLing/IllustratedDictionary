//test
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/tag";

var saveTags = function() {
  var save = getDocumentById('planetmap');
  console.log(save.outerHTML);
};

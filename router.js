var _ = require("underscore");
var url = require('url'),
    path = require('path'),
    fs = require('fs-extra'),
    marked = require('marked');

var settings  = require('./content/settings.js');

  var chapterFolder = settings.folder;
  var contentFolder = "content/";
  // var imagesFolder = "images";
  var longFolder = "long";
  var shortFolder = "short";
  var pdfFolder = "pdf";

  // var imageFolderPath = contentFolder+chapterFolder+imagesFolder;
  var longFolderPath = contentFolder+chapterFolder+longFolder;
  var shortFolderPath = contentFolder+chapterFolder+shortFolder;
  var pdfFolderPath = contentFolder+chapterFolder+pdfFolder;


module.exports = function(app,io,m){

  /**
  * routing event
  */
  app.get("/", getIndex);

  /**
  * routing functions
  */

  // GET
  function getIndex(req, res) {
    
    var dataToSend = {
      title: "Machine Research",
      // longIndex: longTextData.index,
      // longFile: longTextData.file,
      // shortIndex: shortTextData.index,
      // shortFile: shortTextData.file,
      // imageIndex: ImageData.index,
      // imageFile: ImageData.file
    }
    // console.log(dataToSend.longFile);
    res.render("index", dataToSend);

  };

  // function getImages(imageDir, callback) {
  //   var fileType = ['.jpg', '.jpeg', '.png'],
  //       files = [];
  //   var arrayOfFiles = fs.readdirSync(imageDir);
  //   arrayOfFiles.forEach( function (file) {
  //     if(fileType.indexOf(path.extname(file))>-1) {
  //       files.push(file); //store the file name into the array files
  //     }
  //   });
  //   var randomIndex = files.length - 1;
  //   var randomFile = files[randomIndex];
  //   return {index: randomIndex, file: randomFile};
  // }

  function getText(textDir){
    // List text
    var textArray = [];
    var arrayOfFiles = fs.readdirSync(textDir);

    arrayOfFiles.forEach( function (file) {
      var textInFile = fs.readFileSync(textDir+'/'+file, 'utf8');
      textArray.push(textInFile);
    });
    var randomIndex = textArray.length - 1;
    var randomFile = marked(textArray[randomIndex]);
    return {index: randomIndex, file: randomFile};
  }

};

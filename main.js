var fs = require('fs-extra'),
	junk = require('junk'),
	glob = require("glob"),
	moment = require('moment'),
	path = require("path"),
	exec = require('child_process').exec,
	parsedown = require('woods-parsedown'),
	phantom = require('phantom');

	var _ph, _page, _outObj;
	var settings  = require('./content/settings.js');
	var readPageSettings = fs.readFileSync('./content/page.json', 'utf-8');
	var pageSettings = JSON.parse(readPageSettings)

	var chapterFolder = settings.folder;
	var contentFolder = "content/";
	var pdfFolderPath = contentFolder+'/pdf';
	console.log(pdfFolderPath);

module.exports = function(app, io){

	console.log("main module initialized");
	
	io.on("connection", function(socket){

		socket.on('test', function(info){
			console.log(info);
		});

		//INDEX
		createDataFile(socket);
		socket.on( 'listFiles', function (data){ onListFolders(socket); });
		
		socket.on('changeText', onChangeText);

		socket.on('zoomIn', onZoomIn);
		socket.on('zoomOut', onZoomOut);
		
		socket.on('moveRight', onMoveRight);
		socket.on('moveLeft', onMoveLeft);
		socket.on('moveDown', onMoveDown);
		socket.on('moveUp', onMoveUp);


		socket.on('increaseWordSpacing', onIncreaseWordSpacing);
		socket.on('decreaseWordSpacing', onDecreaseWordSpacing);
		
		socket.on('changeFont', onChangeFont);
		socket.on('removeFont', onRemoveFont);

		socket.on('changeBlockSize', onChangeBlockSize);

		socket.on('reset', function(){onReset(socket)});

		socket.on('cleanForPrint', onCleanPrint);
		socket.on('printSecondPage', onPrintSecondPage);
		socket.on('resetPrint', onPrintReset);
		socket.on('generate', generatePdf);

	});


// ------------- F U N C T I O N S -------------------
	function onListFolders( socket){
		console.log( "EVENT - onListFolders");
		var printVar = getBaseFolderMeta('');
		sendEventWithContent('displayPrintPage', printVar);



    listAllFolders().then(function( allFoldersData) {
    	// console.log(allFoldersData)
      sendEventWithContent( 'displayPageEvents', allFoldersData, socket);
    }, function(error) {
      console.error("Failed to list folders! Error: ", error);
    });
	}

	// save data in json file
	function createDataFile(socket, event){
		for(var i in settings.architecture){
			var folder = contentFolder+chapterFolder+'/'+settings.architecture[i][0];
			var left = parseInt(pageSettings.page.marginleft) + ((parseInt(pageSettings.page.widthPage) /3.8)* i) ;
			if(settings.architecture[i][1] == 'text'){
				if(event == 'reset'){
					fs.unlinkSync(folder + '/' + settings.confMetafilename+ settings.metaFileext);
					io.sockets.emit('pdfIsGenerated');
				}
				console.log('TEXT');
				var txt = readTxtDir(folder);
				var folderObj = {
					path: folder,
					txt : txt[txt.length-1],
					index : txt.length,
					zoom : 1,
					xPos : left,
					yPos : 1,
					wordSpace : 0, 
					nbOfFiles : txt.length, 
					blockSize: 8
				}
			}
			// if(settings.architecture[i][1] == 'img'){
			// 	console.log('IMAGE');
			// 	console.log(settings.architecture[i][1]);
			// 	var images = readImagesDir(folder);
			// 	var folderObj = {
			// 		path: folder,
			// 		currentImage : images[images.length-1],
			// 		images: images,
			// 		index : images.length,
			// 		zoom : 1,
			// 		xPos : left,
			// 		yPos : 1,
			// 		wordSpace : 0, 
			// 		nbOfFiles : images.length, 
			// 	}
			// }

			// console.log(folderObj);
			createNewData(folderObj).then(function(newpdata) {
				console.log('newpdata: '+newpdata);
	      sendEventWithContent('displayPageEvents', newpdata);
	    }, function(errorpdata) {
	      console.log(errorpdata);

	    });
		}
	}

	// reset 
	function onReset(socket){
		createDataFile(socket, 'reset');
	}
	
	function onChangeText(element){
		var dir = element.path;
		var arrayOfFiles = readTxtDir(dir);

    var prevIndex = parseInt((element.index)-1);
    console.log("ON CHANGE TEXT EVENTS");

    if(prevIndex < 0){
    	prevIndex = arrayOfFiles.length - 1;
    }

    console.log(prevIndex, element.index);

    var newData = {
    	'text': arrayOfFiles[prevIndex],
    	'index': prevIndex,
    	"slugFolderName" : element.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
    	console.log(currentDataJSON);
      sendEventWithContent( 'changeTextEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });
	}

// -------  Z O O M     F U N C T I O N S ----------- 
	
	function onZoomIn(data){
		console.log("ON ZOOM IN");
		var newZoom = zoomIn(parseFloat(data.zoom));
		

    var newData = {
    	'zoom': newZoom, 
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'zoomEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });

	}

	function onZoomOut(data){
		console.log("ON ZOOM OUT");
		var zoom = zoomOut(parseFloat(data.zoom));

    var newData = {
    	'zoom': zoom,
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'zoomEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });

	}

	function zoomIn(zoom){
	  var maxZoom = settings.maxZoom,
	      zoomStep = settings.zoomStep;
	  
	  if(zoom > maxZoom){
	  	zoom = zoom;
	  }
	  else{ 
	  	zoom += zoomStep;
	  }
	  return zoom;
	}

	function zoomOut(zoom){
	  var minZoom = settings.minZoom, 
	      zoomStep = settings.zoomStep;

	  if(zoom < minZoom) zoom = zoom; 
	  else zoom -= zoomStep; 
	  return zoom;
	}

// -------  E N D       Z O O M     F U N C T I O N S ----------- 

// -------  M O V E     F U N C T I O N S ----------- 

	function onMoveRight(data){
		console.log("ON MOVE RIGHT");
		var xStep = settings.xStep;

		var newXPos = parseFloat(data.xPos) + xStep;

    var newData = {
    	'xPos': newXPos, 
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'moveEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });

	}

	function onMoveLeft(data){
		console.log("ON MOVE RIGHT");
		var xStep = settings.xStep;

		var newXPos = parseFloat(data.xPos) - xStep;

    var newData = {
    	'xPos': newXPos, 
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'moveEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });
	}

	function onMoveDown(data){
		console.log("ON MOVE RIGHT");
		var yStep = settings.yStep;

		var newYPos = parseFloat(data.yPos) + yStep;

    var newData = {
    	'yPos': newYPos, 
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'moveEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });

	}

	function onMoveUp(data){
		console.log("ON MOVE RIGHT");
		var yStep = settings.yStep;

		var newYPos = parseFloat(data.yPos) - yStep;

    var newData = {
    	'yPos': newYPos, 
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'moveEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });

	}

// -------  E N D       M O V E     F U N C T I O N S ----------- 

// -------  W O R D    S P A C I N G     F U N C T I O N S -----------
	
	function onIncreaseWordSpacing(data){
		console.log("ON INCREASE WORDSPACING");

		var spacePlus = settings.spacePlus;

		var newSpace = parseFloat(data.wordSpace) + spacePlus;

    var newData = {
    	'wordSpace': newSpace, 
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'wordSpacingEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });

	}

	function onDecreaseWordSpacing(data){
		console.log("ON DECREASE WORDSPACING");
		var spaceMinus = settings.spaceMinus;

		var newSpace = parseFloat(data.wordSpace) - spaceMinus;

    var newData = {
    	'wordSpace': newSpace, 
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'wordSpacingEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });
	}

// ------- E N D        W O R D    S P A C I N G     F U N C T I O N S -----------

// -------  C H A N G E    F O N T    F U N C T I O N S -----------

	function onChangeFont(data, word){
		console.log("ON CHANGE FONT");
		var newTextWTags = wrapInTag('span', 'change-font', word, data);
		

    var newData = {
    	'text': newTextWTags, 
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'changeFontEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });
	}

	function wrapInTag(tag, className, word, data){
		var tag = tag, 
	  regex = RegExp(word, 'gi'), // case insensitive
	  classname = className || 'none',
	  replacement = '<'+ tag +' class="'+classname+'">$&</'+ tag +'>';
	  console.log(regex, replacement);

	  return data.text.replace(regex, replacement);

	}

	function onRemoveFont(data){
		console.log("ON REMOVE FONT STYLE");
		
		var tag = 'span', 
		classname = 'change-font',
		regex = RegExp('<'+ tag +' class="'+classname+'">', 'gi'), 
		spanRegex = RegExp('</'+ tag +'>', 'gi'), 
		newText = data.text.replace(regex, '').replace(spanRegex, '');
		
		console.log(newText);

    var newData = {
    	'text': newText, 
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'changeFontEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });
	}

// -------  E N D      C H A N G E    F O N T    F U N C T I O N S -----------

// -------  C H A N G E    B L O C K   S I Z E   F U N C T I O N S -----------

	function onChangeBlockSize(data){
		console.log("ON CHANGE BLOCK SIZE");
		
		var newBlockSize = changeSizeFunction(parseFloat(data.blockSize));

    var newData = {
    	'blockSize': newBlockSize, 
    	"slugFolderName" : data.slugFolderName
    }

    updateFolderMeta(newData).then(function( currentDataJSON) {
      sendEventWithContent( 'changeBlockSizeEvents', currentDataJSON);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });
	}

	function changeSizeFunction(size){
		var maxBlockSize = 29;
		var minBlockSize = 3;
		var sizeStep = 1;
	  
	  if(size > maxBlockSize){
	  	size = minBlockSize;
	  }
	  else{ 
	  	size += sizeStep;
	  }
	  return size;
	}

// -------  E N D      C H A N G E   B L O C K   S I Z E    F U N C T I O N S -----------

//------------- PDF -------------------

	function onCleanPrint(){
		console.log("ON CLEAN PRINT");

    var newData = {
    	'sidebar': true, 
    	"slugFolderName" : ''
    }

    updateFolderMeta(newData, 'print').then(function( currentDataJSON) {
      sendEventWithContent( 'cleanForPrintEv', currentDataJSON);
      generatePdf(false);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });
	}

	function onPrintSecondPage(){
		console.log("ON PRINT SECOND PAGE");
    var newData = {
    	'print': true, 
    	"slugFolderName" : ''
    }

    updateFolderMeta(newData, 'print').then(function( currentDataJSON) {
      // sendEventWithContent( 'printSecondPage', currentDataJSON);
      	generatePdf(true);
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });

	}

	function onPrintReset(){
		console.log("ON RESET PRINT");
    var newData = {
    	'print': false, 
    	'sidebar': false,
    	"slugFolderName" : ''
    }

    updateFolderMeta(newData, 'print').then(function( currentDataJSON) {
    	console.log('Print Reset')
    }, function(error) {
      console.error("Failed to update a folder! Error: ", error);
    });

	}

	function generatePdf(pdf){	
		console.log('generate pdf');
		var date = getCurrentDate();
		var url = 'http://localhost:1337/';
		var filePath = pdfFolderPath+'/'+date+'-'+chapterFolder+'.pdf';

		phantom.create([
	  '--ignore-ssl-errors=yes',
	  '--ssl-protocol=any', 
	  '--load-images=yes',
	  '--local-to-remote-url-access=yes'
		]).then(function(ph) {
		  ph.createPage().then(function(page) {
		  	page.open(url)
		  	.then(function(){
		  		// page.property('viewportSize', {width: '42cm', height: '34cm'});
		  		// page.property('paperSize', {format: 'A4', orientation: 'landscape'})
		  		// page.property('paperSize', {width: '42cm', height: '34cm', orientation: 'landscape'})
		  		page.property('paperSize', {width: 1660, height: 1300, orientation: 'landscape'})
		  		// page.property('clipRect', {top: 0, left: 1000, width:3000,height:890})
		  		.then(function() { 
			  		return page.property('content')
			    	.then(function() {
				      setTimeout(function(){
					      page.render(filePath).then(function() {
					      	console.log('success', pdf);
					      	// if(pdf == true){
					      		io.sockets.emit('pdfIsGenerated');
					      	// }
					      	page.close();
						    	ph.exit();
					      });
				     	}, 2000)
				    });
				  });
		    });
		  });
		});

	}
//------ E N D        P D F -------------------

// -------------- Folders method !! ------------
	
	function readTxtDir(textDir){
    // List text
    console.log('COMMON - Read text files');
    var textArray = [];
    var arrayOfFiles = fs.readdirSync(textDir);
    var arrayOfFiles = arrayOfFiles.filter(junk.not);
    console.log(arrayOfFiles);
    arrayOfFiles.forEach( function (file) {
    	if(file != settings.confMetafilename + settings.metaFileext){
    		console.log(path.extname(file));
    		if(path.extname(file) == '.txt'){
		      var textInFile = fs.readFileSync(textDir+'/'+file, 'utf8');
		      console.log('file: '+file);
		      textArray.push(textInFile);
	      }
	    }
    });
    return textArray;
  }

 	function readImagesDir(dir){
 		console.log('COMMON - Read images files');
		var fileType = ['.jpg', '.jpeg', '.png'],
        files = [];
    var arrayOfFiles = fs.readdirSync(dir);
    var arrayOfFiles = arrayOfFiles.filter(junk.not);
    arrayOfFiles.forEach( function (file) {
    	// console.log(fileType.indexOf(path.extname(file))>-1, file);
      if(fileType.indexOf(path.extname(file))>-1) {
        files.push(file); //store the file name into the array files
      }
    });
    console.log(files);
    return files;
	}

	function listAllFolders() {
    return new Promise(function(resolve, reject) {
  		fs.readdir(settings.contentDir+'/'+settings.folder, function (err, filenames) {
        if (err) return console.log( 'Couldn\'t read content dir : ' + err);

        var folders = filenames.filter( function(slugFolderName){ return new RegExp("^([^.]+)$", 'i').test( slugFolderName); });
  	    console.log( "Number of folders in " + settings.contentDir + " = " + folders.length + ". Folders are " + folders);

  	    var foldersProcessed = 0;
  	    var allFoldersData = [];
  		  folders.forEach( function( slugFolderName) {
  		  	console.log(slugFolderName);
  		    if( new RegExp("^([^.]+)$", 'i').test( slugFolderName) && slugFolderName != 'pdf'){
          	var fmeta = getFolderMeta( slugFolderName);
          	fmeta.slugFolderName = slugFolderName;
            allFoldersData.push( fmeta);
          }

          foldersProcessed++;
          if( foldersProcessed === folders.length && allFoldersData.length > 0) {
            console.log( "- - - - all folders JSON have been processed.");
            resolve( allFoldersData);
          }
  		  });
  		});
    });
	}

	function createNewData(folderData) {
    return new Promise(function(resolve, reject) {
    	console.log("COMMON — create data file of folder");
    	var path =  folderData.path;
			var txt = folderData.txt;
			var index = folderData.index;

			fs.access(getMetaFileOfFolder(path), fs.F_OK, function( err) {
				if (err) {
					console.log("New data file created");
					if(txt != undefined){
						var fmeta =
			      {
			        "path" : path,
			        "index" : index,
			        "zoom" : folderData.zoom,
							"xPos" : folderData.xPos,
							"yPos" : folderData.yPos,
							"wordSpace" : folderData.wordSpace, 
							"nbOfFiles" : folderData.nbOfFiles, 
			        "text" : txt,
			        'blockSize': folderData.blockSize
			      };
			    }
			   //  if(folderData.currentImage != undefined){
			   //  	var fmeta =
			   //    {
				  //   	"path" : path,
			   //      "index" : index,
			   //      "zoom" : folderData.zoom,
						// 	"xPos" : folderData.xPos,
						// 	"yPos" : folderData.yPos,
						// 	"wordSpace" : folderData.wordSpace, 
						// 	"nbOfFiles" : folderData.nbOfFiles, 
			   //      "currentImage" : folderData.currentImage,
						// 	'images': folderData.images,
				  //   };
				  // }
		      storeData( getMetaFileOfFolder(path), fmeta, "create").then(function( meta) {
		      	// console.log('sucess ' + meta)
		        resolve( meta);
		      });
		    } else {
          // if there's already something at path
          reject( 'data file already exist');
        }
      });

    });
  }

  function updateFolderMeta( folderData, print) {
    return new Promise(function(resolve, reject) {
      console.log( "COMMON — updateFolderMeta");
      // console.log(folderData);
      var slugFolderName = folderData.slugFolderName;
      if(print == 'print'){
      	var folderPath = getFullBasePath( slugFolderName);
      }
      else{
      	var folderPath = getFullPath( slugFolderName);
      }
      
      var newText = folderData.text;
      var newIndex = folderData.index;
      var newZoom = folderData.zoom;
      var newXPos = folderData.xPos;
      var newYPos = folderData.yPos;
      var newSpace = folderData.wordSpace;
      var newPrint = folderData.print;
      var newBar = folderData.sidebar;
      var newBlockSize = folderData.blockSize;


      // récupérer les infos sur le folder
      if(print == 'print'){
      	var fmeta = getBaseFolderMeta( slugFolderName);
      }
      else{
      	var fmeta = getFolderMeta( slugFolderName);
      }
      if(newText != undefined)
      	fmeta.text = newText;
      if(newIndex != undefined)
      	fmeta.index = newIndex;
      if(newZoom != undefined)
      	fmeta.zoom = newZoom;
      if(newXPos != undefined)
      	fmeta.xPos = newXPos;
      if(newYPos != undefined)
      	fmeta.yPos = newYPos;
      if(newSpace != undefined)
      	fmeta.wordSpace = newSpace;
     	if(newPrint != undefined)
      	fmeta.print = newPrint;
      if(newBar != undefined)
      	fmeta.sidebar = newBar;
      if(newBlockSize != undefined)
      	fmeta.blockSize = newBlockSize;

      // envoyer les changements dans le JSON du folder
      storeData( getMetaFileOfFolder( folderPath), fmeta, "update").then(function( ufmeta) {
        ufmeta.slugFolderName = slugFolderName;
        resolve( ufmeta);
      });
    });
  }

  function textifyObj( obj) {
    var str = '';
    console.log( '1. will prepare string for storage');
    for (var prop in obj) {
      var value = obj[prop];
      console.log('2. value ? ' + value);
      // if value is a string, it's all good
      // but if it's an array (like it is for medias in publications) we'll need to make it into a string
      if( typeof value === 'array')
        value = value.join(', ');
      // check if value contains a delimiter
      if( typeof value === 'string' && value.indexOf('\n----\n') >= 0) {
        console.log( '2. WARNING : found a delimiter in string, replacing it with a backslash');
        // prepend with a space to neutralize it
        value = value.replace('\n----\n', '\n ----\n');
      }
      str += prop + ': ' + value + settings.textFieldSeparator;
    }
    console.log( '3. textified object : ' + str);
    return str;
  }

  function storeData( mpath, d, e) {
    return new Promise(function(resolve, reject) {
      console.log('Will store data', mpath);
      var textd = textifyObj(d);
      if( e === "create") {
        fs.appendFile( mpath, textd, function(err) {
          if (err) reject( err);
          resolve(parseData(textd));
        });
      }
		  if( e === "update") {
        fs.writeFile( mpath, textd, function(err) {
        if (err) reject( err);
          resolve(parseData(textd));
        });
      }
    });
	}

	function getFolderMeta( slugFolderName) {
		console.log( "COMMON — getFolderMeta");
    var folderPath = getFullPath( slugFolderName);
  	var folderMetaFile = getMetaFileOfFolder( folderPath);

		var folderData = fs.readFileSync( folderMetaFile, settings.textEncoding);
		var folderMetadata = parseData( folderData);

    return folderMetadata;
  }

  function getBaseFolderMeta(slugFolderName){
  	console.log( "COMMON — getBaseFolderMeta", slugFolderName);
    var folderPath = getFullBasePath( slugFolderName);
  	var folderMetaFile = getMetaFileOfFolder( folderPath);

		var folderData = fs.readFileSync( folderMetaFile, settings.textEncoding);
		var folderMetadata = parseData( folderData);

    return folderMetadata;

  }

	function getMetaFileOfFolder( folderPath) {
    return folderPath + '/' + settings.confMetafilename + settings.metaFileext;
  }

	function sendEventWithContent( sendEvent, objectContent, socket) {
    io.sockets.emit( sendEvent,objectContent);
  }

  function getFullPath( path) {
    return settings.contentDir +'/'+ settings.folder + '/'+ path;
  }

   function getFullBasePath( path) {
    return settings.contentDir +'/'+ path;
  }

	function getCurrentDate() {
    return moment().format("YYYYMMDD_HHmmss");
  }

  function parseData(d) {
  	var parsed = parsedown(d);
		return parsed;
	}

	 // C O M M O N     F U N C T I O N S
  function eventAndContent( sendEvent, objectJson) {
    var eventContentJSON =
    {
      "socketevent" : sendEvent,
      "content" : objectJson
    };
    return eventContentJSON;
  }

  function sendEventWithContent( sendEvent, objectContent, socket) {
    var eventAndContentJson = eventAndContent( sendEvent, objectContent);
    console.log("eventAndContentJson " + JSON.stringify( eventAndContentJson, null, 4));
    if( socket === undefined)
      io.sockets.emit( eventAndContentJson["socketevent"], eventAndContentJson["content"]);
    else
      socket.emit( eventAndContentJson["socketevent"], eventAndContentJson["content"]);
  }


// - - - END FUNCTIONS - - - 
};

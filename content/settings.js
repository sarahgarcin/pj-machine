var folder = 'nicolas_maleve';

var settings = {
	"architecture" : [['01', 'text'],['02', 'text'],['03', 'text'],['04', 'text'],['pdf', 'pdf']],
	"folder": folder,
	"words" :['machine', 'research', 'computer', 'vision', 'network', 'data', 'algorithm', 'learning', 'AEO', 'AMB', 'ANO', 'DSP'],

	"contentDir" : "content",
  "metaFileext" : ".md",
  "confMetafilename" : "data",

  "metaDateFormat" : "YYYYMMDD_HHmmss",
  "textEncoding" : "UTF-8",
  "textFieldSeparator" : "\n\n----\n\n",

  // ZOOM settings
  "maxZoom" : 4,
  "minZoom" : 0.2,
	"zoomStep" : 0.05, 

	// MOVE ELEMENTS settings
	"maxX" : 15,
	"minX" : -20,
	"xStep" : 0.2,
	"maxY" : 18,
	"minY" : -12,
	"yStep" : 0.2,

	//WORD SPACING SETTINGS
	"spacePlus" : 5,
	"spaceMinus" : 3

}

try {
	if (typeof exports !== 'undefined') {
	  if (typeof module !== 'undefined' && module.exports) {
	    exports = module.exports = settings;
	  }
	}
} catch( err) {
	console.log(err);
}
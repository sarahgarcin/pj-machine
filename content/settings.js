var folder = 'nathan_jones_sam_skinner';

var settings = {
	"architecture" : [['01', 'text'],['01b', 'text'],['01c', 'text'],['02', 'text'],['03', 'text'],['04', 'text'],['05', 'text'],['06', 'text'],['07', 'text'],['08', 'text'],['09', 'text'],['10', 'text'],['11', 'text'],['12', 'text'],['13', 'text'],['pdf', 'pdf']],
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
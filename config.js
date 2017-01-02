var favicon = require('serve-favicon');
var settings  = require('./content/settings.js');

module.exports = function(app,express){
  app.set("port", 1337); //Server's port number
  app.set("views", __dirname + "/views"); //Specify the views folder
  app.set("view engine", "jade"); //View engine is Jade
  app.use(express.static(__dirname + "/public")); //Specify where the static content is
  app.use(express.static(__dirname + "/content")); //Specify where the static content is
	app.use(express.static(__dirname + '/content/'+settings.folder));
}
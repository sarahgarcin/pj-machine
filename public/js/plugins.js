(function ( $ ) {
 
  $.fn.zoom = function( zoom, transform ) {

    return this.css({
      'transform': 'scale('+zoom+')',
      'transform-origin': transform,
    });

  };

  $.fn.move = function( posX, posY ) {

    return this.css({
      'left': posX+'cm',
      'top':posY+'cm'
    });

  };

  $.fn.wordSpacing = function( space ) {

    return this.css('word-spacing', ''+space +'px');

  };

  $.fn.blockSize = function( size) {

    return this.css({
      'width': size + 'cm',
    });

  };
 
}( jQuery ));





// Go prev content
function prevContent(element, eventToSend){
  // get element class
  var dataIndex = element.index;
  var prevIndex = parseInt((dataIndex)-1);
  var folder = element.slugFolderName;
  var path = element.path;
  socket.emit(eventToSend, {newIndex:prevIndex, folder:folder, path:path});

}
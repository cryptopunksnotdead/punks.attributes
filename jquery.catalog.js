

var catalog_builder_new = function( catalog_id, url ) {

  // use module pattern (see JavaScript - The Good Parts)
  //   for now

  function _debug( msg ) {
       console.log( "[debug] " + msg ); 
  }

  // read in JSON files
  function _fetch( url, success ) {

    // $.getJSON( url+"?callback=?", function( data ) {
    $.getJSON( url, function( data ) {
        console.log( "readJSON success" );
        console.log( "type: " + typeof data );
        console.log( data );

/*     // check: not need for $.getJSON (only if using $.get -- ??
       if( typeof data == 'string' ) {
         // convert data to json if returned as "plain" text
         data = JSON.parse( data );
       }
*/
       success( data );
       });
  } // fn readJSON


  function _getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function _getRndDownloads() { return _getRndInt(1, 500)*_getRndInt(1, 500)*_getRndInt(1, 500); }
  function _getRndStars()     { return _getRndInt(2, 23000); }


  function _handleCards( data ) {

    for( i=0; i<data.length; ++i) {
        var gem = data[i];
        console.log( "  [debug] build card " + i + " - " + gem.name );
        var snippet = _buildCard( gem );
        // console.log( "  [debug] snippet: " + snippet );
        // add to catalog
        $catalog.append( snippet );
    }
     
    _sorter = catalog_sorter_new( $catalog );   // setup catalog sorter
  } // fn handleData


  function _buildCard( data ) {
    // return html snippets as string
    //  todo/fix: use a template later
    var buf = '';
    buf += "<div class='card'>";
    // todo/fix: add tags
    //  <ul>
    //     <li>#webframeworks</li>
    //     <li>#rails</li>
    //  </ul>
    buf += "<ul><li>"+ data.categories  +"</li></ul>"   // fix: dummy hard-coded for now
    buf += "  <h4>" + data.name + "</h4>";
    buf += "<div class='desc'>" + data.desc + "</div>";
    buf += "  <div>v" +
               data.latest_version + "  - ↓↑ " +
               "<span class='dlv'>" + data.latest_version_downloads + "</span> / " +
               "<span class='dl'>"  + data.downloads + "</span>, " +
               "★ <span class='stars'>" + _getRndStars()+ "</div>";
    buf += "<div class='deps'>" + data.deps + "</div>";
    buf += "</div>";
    return buf;
  }


  var $catalog,
      _url,
      _sorter;

  function _init( catalog_id, url ) {
    $catalog = $( catalog_id );
    console.log( $catalog );

    // $catalog.prepend( "<p>testing prepend</p>" );

    _sorter = null_catalog_sorter_new();   // init w/ dummy sorter (avoids calling methods on undefined)

    _url     = url;
    _fetch( _url, _handleCards );
  } // fn init


  _init( catalog_id, url );


  return {
      sort_by_dl:    function() {  _sorter.sort_by_dl();    return this; },
      sort_by_dlv:   function() {  _sorter.sort_by_dlv();   return this; },
      sort_by_stars: function() {  _sorter.sort_by_stars(); return this; }
  };  
}; // module catalog_builder_new



var null_catalog_sorter_new = function() {
  return {
    sort_by_dl:    function() { return this; },
    sort_by_dlv:   function() { return this; },
    sort_by_stars: function() { return this; }
  };    
};

var catalog_sorter_new = function( catalog_id ) {

    // use module pattern (see JavaScript - The Good Parts)
    //   for now

    function _debug( msg ) {
       console.log( "[debug] " + msg ); 
    }

    function _sortInt(left,right) {
       return right - left;   // note sort descending (largest number first)
    }
    function _convInt(text) {
        var i = parseInt( text.replace( /,/g, ''), 10 );
        return (isNaN(i)) ? 0 : i;
    }


    function _byDownloadsTotal( $div ) {
      return _convInt( $div.find('.dl').text() );
    }

    function _byDownloadsLatestVersion( $div ) {
      return _convInt( $div.find('.dlv').text() );
    }

    function _byStars( $div ) {
       return _convInt( $div.find('.stars').text() );
    }


  function _sort( keyFunc, sortFunc )   // keyFunc e.g. use _byDownloads or  _byStars, etc.
  {
     _debug( "call _sort" );

      $cards.each( function( rowIndex, row ) {
            row.sortKey = keyFunc( $(row) );
            row.sortPos = rowIndex;   // NB: stable sort hack, part i - on equal use sortPos to keep stable sort with unstable sort
            _debug( "["+rowIndex+"] => " + row.sortKey );
      }); // each rows

      $cards.sort( function( left, right ) {
          var result = sortFunc( left.sortKey, right.sortKey );

          // NB: stable sort hack, part ii
          if( result == 0 )
            result = left.sortPos - right.sortPos;
            
          return result;
      }); // sort

      $cards.each( function( rowIndex, row ) {
        $catalog.append( row );
          // row.sortKey = null;
          // row.sortPos = null;
       });
  } // function _sort_col


  var $catalog, // container div
      $cards;   // nested div

  function _init( catalog_id )
  {
    // nb: will find w/ selector or wrap vanilla javascript this in jquery wrapped $(this)
    $catalog = $( catalog_id );
    
    $cards = $catalog.find( 'div.card' );   // todo - use single level nested instead of class?
    // console.log( $cards );
  } // function _init
  
  _init( catalog_id );

  
    return {
      sort_by_dl:    function() { _sort( _byDownloadsTotal, _sortInt );         return this;  },
      sort_by_dlv:   function() { _sort( _byDownloadsLatestVersion, _sortInt ); return this;  },
      sort_by_stars: function() { _sort( _byStars, _sortInt );                  return this;  }
    };  
};

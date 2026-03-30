tinymce.PluginManager.add( 'awhitepen_columns', function( editor ) {
	function trimContent( value ) {
		return ( value || '' ).replace( /^\s+|\s+$/g, '' );
	}

	function splitColumnsContent( content, count ) {
		var segments = ( content || '' ).split(
			/(?:<p>\s*)?(?:<!--\s*column\s*-->|\[column\])(?:\s*<\/p>)?/i
		);
		var leadingSegments = [];
		var remainingSegments = [];

		segments = segments.map( function( segment ) {
			return trimContent( segment );
		} );

		if ( segments.length > count ) {
			leadingSegments = segments.slice( 0, count - 1 );
			remainingSegments = segments.slice( count - 1 );
			leadingSegments.push( remainingSegments.join( '\n\n' ) );
			segments = leadingSegments;
		}

		while ( segments.length < count ) {
			segments.push( '' );
		}

		return segments;
	}

	function columnsToPreviewHtml( shortcodeName, innerContent ) {
		var count = 'three_col' === shortcodeName ? 3 : 2;
		var columns = splitColumnsContent( innerContent, count );
		var html =
			'<div class="awhitepen-columns awhitepen-columns--' +
			count +
			' awhitepen-columns--preview" data-awhitepen-shortcode="' +
			shortcodeName +
			'">';
		var i = 0;
		var columnHtml = '';

		for ( i = 0; i < columns.length; i += 1 ) {
			columnHtml = trimContent( columns[ i ] );

			if ( '' === columnHtml ) {
				columnHtml = '<p>&nbsp;</p>';
			}

			html += '<div class="awhitepen-column">' + columnHtml + '</div>';
		}

		html += '</div>';

		return html;
	}

	function shortcodesToPreview( content ) {
		return ( content || '' ).replace(
			/\[(two_col|three_col)\]([\s\S]*?)\[\/\1\]/gi,
			function( _match, shortcodeName, innerContent ) {
				return columnsToPreviewHtml( shortcodeName.toLowerCase(), innerContent );
			}
		);
	}

	function insertVisualColumns( count ) {
		var shortcodeName = 3 === count ? 'three_col' : 'two_col';
		var templateInner = 3 === count
			? 'First column content.\n\n[column]\n\nSecond column content.\n\n[column]\n\nThird column content.'
			: 'Left column content.\n\n[column]\n\nRight column content.';

		editor.insertContent( columnsToPreviewHtml( shortcodeName, templateInner ) + '<p></p>' );
	}

	editor.addButton( 'awhitepen_columns', {
		type: 'menubutton',
		text: 'Columns',
		icon: false,
		menu: [
			{
				text: 'Insert 2 columns',
				onclick: function() {
					insertVisualColumns( 2 );
				},
			},
			{
				text: 'Insert 3 columns',
				onclick: function() {
					insertVisualColumns( 3 );
				},
			},
		],
	} );

	editor.on( 'BeforeSetContent', function( event ) {
		event.content = shortcodesToPreview( event.content );
	} );
} );

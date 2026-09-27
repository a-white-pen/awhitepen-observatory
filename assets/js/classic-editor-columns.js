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

	/**
	 * Turn the preview back into its shortcode.
	 *
	 * The editor shows columns as real markup so they can be typed into. What
	 * gets saved is the shortcode, so the post stores something readable in the
	 * Text tab rather than the editor's own scaffolding.
	 */
	function previewToShortcodes( content ) {
		var wrapper = document.createElement( 'div' );
		var shortcodes = [];
		var previews;
		var i;
		var html;

		if ( ! content || content.indexOf( 'awhitepen-columns--preview' ) === -1 ) {
			return content;
		}

		wrapper.innerHTML = content;
		previews = wrapper.querySelectorAll( '.awhitepen-columns--preview' );

		for ( i = 0; i < previews.length; i += 1 ) {
			( function( preview, index ) {
				var name = preview.getAttribute( 'data-awhitepen-shortcode' ) || 'two_col';
				var columns = preview.children;
				var parts = [];
				var marker = document.createElement( 'div' );
				var j;

				for ( j = 0; j < columns.length; j += 1 ) {
					parts.push( trimContent( columns[ j ].innerHTML ) );
				}

				shortcodes[ index ] =
					'[' + name + ']\n\n' +
					parts.join( '\n\n[column]\n\n' ) +
					'\n\n[/' + name + ']';

				// A marker, not the shortcode text: writing the text here would
				// be escaped on serialisation, and un-escaping afterwards would
				// also damage entities elsewhere in the post.
				marker.setAttribute( 'data-awhitepen-col', String( index ) );
				preview.parentNode.replaceChild( marker, preview );
			}( previews[ i ], i ) );
		}

		html = wrapper.innerHTML;

		for ( i = 0; i < shortcodes.length; i += 1 ) {
			html = html.replace(
				new RegExp( '<div data-awhitepen-col="' + i + '"><\\/div>' ),
				shortcodes[ i ]
			);
		}

		return html;
	}

	editor.on( 'BeforeSetContent', function( event ) {
		event.content = shortcodesToPreview( event.content );
	} );

	editor.on( 'GetContent', function( event ) {
		event.content = previewToShortcodes( event.content );
	} );
} );

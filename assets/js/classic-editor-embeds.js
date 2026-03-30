tinymce.PluginManager.add( 'awhitepen_embeds', function( editor ) {
	function preserveEmptyOverlayAnchors( html ) {
		return ( html || '' ).replace(
			/<a([^>]*\bhref\s*=\s*(['"])[^'"]+\2[^>]*)>\s*<\/a>/gi,
			'<a$1><span class="screen-reader-text">Open link</span></a>'
		);
	}

	function insertRawEmbedHtml( html ) {
		var content = preserveEmptyOverlayAnchors( html ).replace( /^\s+|\s+$/g, '' );

		if ( ! content ) {
			return;
		}

		editor.insertContent( content + '<p></p>' );
	}

	function promptForEmbedHtml() {
		if ( editor.windowManager && typeof editor.windowManager.open === 'function' ) {
			editor.windowManager.open( {
				title: 'Insert embed HTML',
				body: [
					{
						type: 'textbox',
						name: 'embed_html',
						multiline: true,
						minWidth: 520,
						minHeight: 240,
						value: '',
					},
				],
				onsubmit: function( event ) {
					insertRawEmbedHtml( event.data.embed_html );
				},
			} );
			return;
		}

		insertRawEmbedHtml( window.prompt( 'Paste embed HTML:' ) );
	}

	editor.addButton( 'awhitepen_embeds', {
		type: 'button',
		text: 'Embed HTML',
		icon: false,
		tooltip: 'Paste raw embed HTML',
		onclick: promptForEmbedHtml,
	} );
} );

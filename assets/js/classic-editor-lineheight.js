tinymce.PluginManager.add( 'awhitepen_lineheight', function( editor ) {
	var lineHeightOptions = {
		single: {
			className: 'awhitepen-lh-single',
			value: '1',
		},
		onehalf: {
			className: 'awhitepen-lh-15',
			value: '1.5',
		},
		double: {
			className: 'awhitepen-lh-double',
			value: '2',
		},
	};
	var lineHeightClassList =
		lineHeightOptions.single.className +
		' ' +
		lineHeightOptions.onehalf.className +
		' ' +
		lineHeightOptions.double.className;
	var targetSelector = 'p,li,blockquote,h1,h2,h3,h4';

	function isTargetBlock( node ) {
		if ( ! node || ! node.nodeName ) {
			return false;
		}

		var name = node.nodeName.toLowerCase();
		return (
			'p' === name ||
			'li' === name ||
			'blockquote' === name ||
			'h1' === name ||
			'h2' === name ||
			'h3' === name ||
			'h4' === name
		);
	}

	function getClosestTargetBlock( node ) {
		if ( ! node ) {
			return null;
		}

		if ( isTargetBlock( node ) ) {
			return node;
		}

		return editor.dom.getParent( node, function( parent ) {
			return isTargetBlock( parent );
		}, editor.getBody() );
	}

	function addBlockIfUnique( node, list ) {
		if ( ! node ) {
			return;
		}

		if ( list.indexOf( node ) !== -1 ) {
			return;
		}

		list.push( node );
	}

	function addTargetDescendants( node, list ) {
		if ( ! node ) {
			return;
		}

		tinymce.each( editor.dom.select( targetSelector, node ), function( target ) {
			addBlockIfUnique( target, list );
		} );
	}

	function getTargetBlocks() {
		var blocks = [];
		var selectedBlocks = [];
		var startTarget = null;
		var endTarget = null;

		if ( editor.selection && typeof editor.selection.getSelectedBlocks === 'function' ) {
			selectedBlocks = editor.selection.getSelectedBlocks() || [];
		}

		tinymce.each( selectedBlocks, function( block ) {
			var target = getClosestTargetBlock( block );
			addBlockIfUnique( target, blocks );
			addTargetDescendants( block, blocks );
		} );

		startTarget = getClosestTargetBlock( editor.selection.getStart() );
		endTarget = getClosestTargetBlock( editor.selection.getEnd() );

		addBlockIfUnique( startTarget, blocks );
		addBlockIfUnique( endTarget, blocks );

		if ( blocks.length ) {
			return blocks;
		}

		addTargetDescendants( editor.selection.getNode(), blocks );

		return blocks;
	}

	function applyLineHeightOption( optionKey ) {
		var option = optionKey && lineHeightOptions[ optionKey ] ? lineHeightOptions[ optionKey ] : null;

		editor.undoManager.transact( function() {
			var blocks = getTargetBlocks();

			if ( ! blocks.length ) {
				return;
			}

			tinymce.each( blocks, function( block ) {
				editor.dom.removeClass( block, lineHeightClassList );
				editor.dom.setStyle( block, 'line-height', '' );

				if ( option ) {
					editor.dom.addClass( block, option.className );
					editor.dom.setStyle( block, 'line-height', option.value );
				}
			} );

			editor.nodeChanged();
		} );
	}

	editor.addButton( 'awhitepen_lineheight', {
		type: 'menubutton',
		text: 'Line spacing',
		icon: false,
		menu: [
			{
				text: 'Single (1.0)',
				onclick: function() {
					applyLineHeightOption( 'single' );
				},
			},
			{
				text: '1.5 lines',
				onclick: function() {
					applyLineHeightOption( 'onehalf' );
				},
			},
			{
				text: 'Double (2.0)',
				onclick: function() {
					applyLineHeightOption( 'double' );
				},
			},
			{
				text: 'Default',
				onclick: function() {
					applyLineHeightOption( null );
				},
			},
		],
	} );
} );

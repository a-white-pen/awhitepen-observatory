tinymce.PluginManager.add('awhitepen_fontsize', function(editor) {
	function sanitizeSize(value) {
		var size = parseFloat(value);
		if (!size || isNaN(size)) {
			return null;
		}
		return Math.max(8, Math.min(96, size));
	}

	function applyPxSize(rawSize) {
		var size = sanitizeSize(rawSize);
		if (!size) {
			return;
		}

		editor.undoManager.transact(function() {
			// Use TinyMCE's native inline font-size behavior so highlighted text can be styled
			// without forcing the entire paragraph/list block to resize.
			editor.execCommand('FontSize', false, size + 'px');
			editor.nodeChanged();
		});
	}

	function promptCustomSize() {
		var value = window.prompt('Enter font size in px (e.g. 17):', '');
		if (value === null) {
			return;
		}
		applyPxSize(value);
	}

	editor.addButton('awhitepen_fontsize_named', {
		type: 'menubutton',
		text: 'Font Size',
		icon: false,
		menu: [
			{
				text: 'Very small',
				onclick: function() {
					applyPxSize(14);
				}
			},
			{
				text: 'Small',
				onclick: function() {
					applyPxSize(15);
				}
			},
			{
				text: 'Regular',
				onclick: function() {
					applyPxSize(18);
				}
			},
			{
				text: 'Large',
				onclick: function() {
					applyPxSize(20);
				}
			},
			{
				text: 'Very large',
				onclick: function() {
					applyPxSize(24);
				}
			},
			{
				text: 'Set custom px...',
				onclick: promptCustomSize
			}
		]
	});
});

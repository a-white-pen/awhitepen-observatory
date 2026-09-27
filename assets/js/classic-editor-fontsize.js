/**
 * One Size control.
 *
 * The named sizes write a class, so they follow the post's own type scale and
 * shrink on a phone. Only Custom px writes a fixed pixel value.
 */
tinymce.PluginManager.add('awhitepen_fontsize', function (editor) {
	var SIZES = [
		{ key: 'xsmall', text: 'Very small', hint: '12.5px', className: 'fs-xsmall' },
		{ key: 'small', text: 'Small', hint: '15px', className: 'fs-small' },
		{ key: 'body', text: 'Body', hint: '19px', className: '' },
		{ key: 'large', text: 'Large', hint: '21px', className: 'fs-large' },
		{ key: 'xlarge', text: 'Very large', hint: '24px', className: 'fs-xlarge' }
	];

	editor.on('init', function () {
		SIZES.forEach(function (size) {
			if (size.className) {
				editor.formatter.register('awhitepen_' + size.key, {
					inline: 'span',
					classes: size.className
				});
			}
		});
	});

	// Clears the named sizes and the inline pixel sizes left by the old toolbar.
	function clearSize() {
		SIZES.forEach(function (size) {
			if (size.className) {
				editor.formatter.remove('awhitepen_' + size.key, null, null, true);
			}
		});
		editor.formatter.remove('fontsize', null, null, true);
	}

	function applyNamed(size) {
		editor.undoManager.transact(function () {
			clearSize();

			if (size.className) {
				editor.formatter.apply('awhitepen_' + size.key);
			}

			editor.nodeChanged();
		});
	}

	function applyCustom(rawSize) {
		var size = parseFloat(rawSize);

		if (!size || isNaN(size)) {
			return;
		}

		size = Math.max(8, Math.min(96, size));

		editor.undoManager.transact(function () {
			clearSize();
			editor.execCommand('FontSize', false, size + 'px');
			editor.nodeChanged();
		});
	}

	function promptCustomSize() {
		editor.windowManager.open({
			title: 'Custom size',
			body: [
				{
					type: 'textbox',
					name: 'size',
					label: 'Size',
					value: '',
					tooltip: 'Whole or half pixels, e.g. 17 or 16.5'
				}
			],
			onsubmit: function (event) {
				applyCustom(event.data.size);
			}
		});
	}

	var menu = SIZES.map(function (size) {
		return {
			text: size.text,
			shortcut: size.hint,
			onclick: function () {
				applyNamed(size);
			}
		};
	});

	menu.push({ text: '-' });
	menu.push({ text: 'Custom px…', onclick: promptCustomSize });

	editor.addButton('awhitepen_fontsize', {
		type: 'menubutton',
		text: 'Size',
		icon: false,
		menu: menu
	});
});

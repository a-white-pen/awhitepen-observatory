( function( $ ) {
	function isClassicEditorScreen() {
		return (
			$( '#postdivrich' ).length > 0 &&
			$( '.wp-editor-wrap' ).length > 0 &&
			! document.body.classList.contains( 'block-editor-page' )
		);
	}

	function isSafeSaveShortcut( event ) {
		var key = String( event.key || '' ).toLowerCase();
		return 's' === key && ( event.metaKey || event.ctrlKey ) && event.shiftKey;
	}

	function applyVisualEditorPadding() {
		if ( ! isClassicEditorScreen() ) {
			return;
		}

		if ( typeof window.tinyMCE === 'undefined' || ! window.tinyMCE.editors ) {
			return;
		}

		window.tinyMCE.editors.forEach( function( editor ) {
			if ( ! editor || ! editor.initialized || typeof editor.getBody !== 'function' ) {
				return;
			}

			var body = editor.getBody();

			if ( ! body ) {
				return;
			}

			body.classList.add( 'awhitepen-editor-content' );
		} );
	}

	function syncTinyMCE() {
		if ( typeof window.tinyMCE !== 'undefined' && window.tinyMCE.triggerSave ) {
			window.tinyMCE.triggerSave();
		}
	}

	function getPostStatus() {
		return String( $( '#post_status' ).val() || '' ).toLowerCase();
	}

	function isDraftStatus( status ) {
		return 'draft' === status || 'auto-draft' === status;
	}

	function getSnapshotStorageKey() {
		var postId = String( $( '#post_ID' ).val() || 'new' );
		return 'awhitepen_safe_save_' + postId;
	}

	function getCurrentEditorState() {
		syncTinyMCE();

		return {
			savedAt: Date.now(),
			title: String( $( '#title' ).val() || '' ),
			content: String( $( '#content' ).val() || '' ),
			excerpt: String( $( '#excerpt' ).val() || '' ),
			status: getPostStatus(),
		};
	}

	function saveSnapshotToLocalStorage() {
		var data = getCurrentEditorState();

		try {
			window.localStorage.setItem( getSnapshotStorageKey(), JSON.stringify( data ) );
			return true;
		} catch ( error ) {
			return false;
		}
	}

	function getSnapshotFromLocalStorage() {
		var raw = '';

		try {
			raw = window.localStorage.getItem( getSnapshotStorageKey() );
		} catch ( error ) {
			return null;
		}

		if ( ! raw ) {
			return null;
		}

		try {
			return JSON.parse( raw );
		} catch ( error ) {
			return null;
		}
	}

	function clearSnapshotFromLocalStorage() {
		try {
			window.localStorage.removeItem( getSnapshotStorageKey() );
		} catch ( error ) {
			// Ignore storage cleanup errors.
		}
	}

	function triggerWordPressAutosave() {
		var triggered = false;

		if (
			window.wp &&
			window.wp.autosave &&
			window.wp.autosave.server &&
			typeof window.wp.autosave.server.triggerSave === 'function'
		) {
			window.wp.autosave.server.triggerSave();
			triggered = true;
		} else if ( typeof window.autosave === 'function' ) {
			window.autosave();
			triggered = true;
		}

		if ( window.wp && window.wp.heartbeat && typeof window.wp.heartbeat.connectNow === 'function' ) {
			window.wp.heartbeat.connectNow();
		}

		return triggered;
	}

	function markEditorClean() {
		if ( typeof window.tinyMCE !== 'undefined' && window.tinyMCE.editors ) {
			window.tinyMCE.editors.forEach( function( editor ) {
				if ( editor && typeof editor.setDirty === 'function' ) {
					editor.setDirty( false );
				}
			} );
		}

		if ( window.wp && window.wp.autosave ) {
			if ( typeof window.wp.autosave.getCompareString === 'function' ) {
				window.wp.autosave.initialCompareString = window.wp.autosave.getCompareString();
			}

			if ( window.wp.autosave.server && Object.prototype.hasOwnProperty.call( window.wp.autosave.server, 'postChanged' ) ) {
				window.wp.autosave.server.postChanged = false;
			}
		}
	}

	function showSafeSaveNotice( message, type ) {
		var $existing = $( '#awhitepen-safe-save-notice' );
		var noticeType = type || 'info';
		var noticeClass = 'notice notice-' + noticeType + ' is-dismissible';
		var html = '<div id="awhitepen-safe-save-notice" class="' + noticeClass + '"><p>' + message + '</p></div>';
		var $target = $( '#poststuff' );

		if ( $existing.length ) {
			$existing.remove();
		}

		if ( $target.length ) {
			$target.before( html );
		} else {
			$( '.wrap h1' ).first().after( html );
		}
	}

	function safeSaveDraft() {
		var $saveDraftButton = $( '#save-post' );

		if ( ! $saveDraftButton.length || $saveDraftButton.prop( 'disabled' ) ) {
			return false;
		}

		syncTinyMCE();
		$saveDraftButton.trigger( 'click' );
		return true;
	}

	function safeSaveNonDraft() {
		var autosaveTriggered = triggerWordPressAutosave();
		var snapshotSaved = saveSnapshotToLocalStorage();
		markEditorClean();

		if ( autosaveTriggered && snapshotSaved ) {
			showSafeSaveNotice( 'Safe save captured locally. Live content was not updated. You can leave this page safely.', 'success' );
		} else if ( autosaveTriggered ) {
			showSafeSaveNotice( 'Safe save requested via autosave only. Live content was not updated.', 'warning' );
		} else if ( snapshotSaved ) {
			showSafeSaveNotice( 'Safe save captured locally. Live content was not updated.', 'success' );
		} else {
			showSafeSaveNotice( 'Safe save could not store a backup right now. Your live content remains unchanged.', 'error' );
		}

		return autosaveTriggered || snapshotSaved;
	}

	function formatSnapshotTime( timestamp ) {
		if ( ! timestamp ) {
			return 'recently';
		}

		try {
			return new Date( timestamp ).toLocaleString();
		} catch ( error ) {
			return 'recently';
		}
	}

	function showRestoreSnapshotNotice( snapshot ) {
		var message =
			'Found a safe save from ' +
			formatSnapshotTime( snapshot.savedAt ) +
			'. Restore it?';
		var html =
			'<div id="awhitepen-safe-save-restore" class="notice notice-warning">' +
				'<p>' +
					message +
					' <button type="button" class="button button-small" id="awhitepen-restore-safe-save">Restore</button>' +
					' <button type="button" class="button button-small" id="awhitepen-dismiss-safe-save">Dismiss</button>' +
				'</p>' +
			'</div>';
		var $existing = $( '#awhitepen-safe-save-restore' );
		var $target = $( '#poststuff' );

		if ( $existing.length ) {
			$existing.remove();
		}

		if ( $target.length ) {
			$target.before( html );
		} else {
			$( '.wrap h1' ).first().after( html );
		}
	}

	function restoreSnapshot( snapshot ) {
		if ( ! snapshot ) {
			return;
		}

		$( '#title' ).val( snapshot.title || '' );
		$( '#content' ).val( snapshot.content || '' );
		$( '#excerpt' ).val( snapshot.excerpt || '' );

		if ( typeof window.tinyMCE !== 'undefined' && window.tinyMCE.get ) {
			var editor = window.tinyMCE.get( 'content' );
			if ( editor && typeof editor.setContent === 'function' ) {
				editor.setContent( snapshot.content || '' );
				editor.nodeChanged();
				editor.setDirty( true );
			}
		}

		showSafeSaveNotice( 'Safe save restored into the editor. Click Update when you want changes to go live.', 'success' );
		clearSnapshotFromLocalStorage();
		$( '#awhitepen-safe-save-restore' ).remove();
	}

	function maybeOfferSnapshotRestore() {
		var snapshot = getSnapshotFromLocalStorage();
		var currentState = null;

		if ( ! snapshot ) {
			return;
		}

		currentState = getCurrentEditorState();

		if (
			snapshot.title === currentState.title &&
			snapshot.content === currentState.content &&
			snapshot.excerpt === currentState.excerpt
		) {
			return;
		}

		showRestoreSnapshotNotice( snapshot );
	}

	function performSafeSaveShortcut() {
		var status = getPostStatus();

		if ( isDraftStatus( status ) ) {
			return safeSaveDraft();
		}

		return safeSaveNonDraft();
	}

	function handleSaveShortcut( event ) {
		if ( ! isClassicEditorScreen() || ! isSafeSaveShortcut( event ) ) {
			return;
		}

		event.preventDefault();
		performSafeSaveShortcut();
	}

	function bindIframeShortcut( editor ) {
		if ( ! editor || ! editor.initialized || typeof editor.getDoc !== 'function' ) {
			return;
		}

		var doc = editor.getDoc();

		if ( ! doc || doc.__awhitepenSaveShortcutBound ) {
			return;
		}

		doc.addEventListener( 'keydown', handleSaveShortcut, true );
		doc.__awhitepenSaveShortcutBound = true;
	}

	function getClosestLink( startNode ) {
		var node = startNode || null;

		while ( node && node !== document ) {
			if ( node.nodeType === 1 && node.nodeName && 'a' === node.nodeName.toLowerCase() && node.getAttribute( 'href' ) ) {
				return node;
			}

			node = node.parentNode;
		}

		return null;
	}

	function bindIframeLinkOpen( editor ) {
		if ( ! editor || ! editor.initialized || typeof editor.getDoc !== 'function' ) {
			return;
		}

		var doc = editor.getDoc();

		if ( ! doc || doc.__awhitepenEditorLinkOpenBound ) {
			return;
		}

		doc.addEventListener( 'click', function( event ) {
			if ( ! event.metaKey && ! event.ctrlKey ) {
				return;
			}

			var link = getClosestLink( event.target );
			var href = '';
			var target = '_blank';

			if ( ! link ) {
				return;
			}

			href = String( link.getAttribute( 'href' ) || '' ).trim();

			if ( ! href || '#' === href.charAt( 0 ) ) {
				return;
			}

			target = String( link.getAttribute( 'target' ) || '_blank' );

			event.preventDefault();
			event.stopPropagation();

			window.open( href, target, 'noopener,noreferrer' );
		}, true );

		doc.__awhitepenEditorLinkOpenBound = true;
	}

	function bindExistingEditorsShortcut() {
		if ( typeof window.tinyMCE === 'undefined' || ! window.tinyMCE.editors ) {
			return;
		}

		window.tinyMCE.editors.forEach( function( editor ) {
			bindIframeShortcut( editor );
			bindIframeLinkOpen( editor );
		} );
	}

	$( document ).on( 'keydown', function( event ) {
		handleSaveShortcut( event );
	} );

	$( document ).ready( function() {
		if ( ! isClassicEditorScreen() ) {
			return;
		}

		applyVisualEditorPadding();
		bindExistingEditorsShortcut();
		maybeOfferSnapshotRestore();
		window.setTimeout( applyVisualEditorPadding, 200 );
		window.setTimeout( applyVisualEditorPadding, 600 );
		window.setTimeout( bindExistingEditorsShortcut, 200 );
		window.setTimeout( bindExistingEditorsShortcut, 600 );
		window.setTimeout( bindExistingEditorsShortcut, 1200 );
	} );

	$( document ).on( 'tinymce-editor-init', function( _event, editor ) {
		if ( ! isClassicEditorScreen() ) {
			return;
		}

		bindIframeShortcut( editor );
		bindIframeLinkOpen( editor );
		applyVisualEditorPadding();
	} );

	$( document ).on( 'click', '#awhitepen-restore-safe-save', function() {
		restoreSnapshot( getSnapshotFromLocalStorage() );
	} );

	$( document ).on( 'click', '#awhitepen-dismiss-safe-save', function() {
		clearSnapshotFromLocalStorage();
		$( '#awhitepen-safe-save-restore' ).remove();
	} );

	$( '#post' ).on( 'submit', function() {
		syncTinyMCE();
		clearSnapshotFromLocalStorage();
	} );
}( window.jQuery ) );

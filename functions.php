<?php
/**
 * Theme functions for AWhitePen.
 *
 * @package AWhitePen
 */

if ( ! defined( 'AWHITEPEN_VERSION' ) ) {
	define( 'AWHITEPEN_VERSION', '1.0.0' );
}

if ( ! defined( 'AWHITEPEN_PATH' ) ) {
	define( 'AWHITEPEN_PATH', get_template_directory() );
}

if ( ! defined( 'AWHITEPEN_URI' ) ) {
	define( 'AWHITEPEN_URI', get_template_directory_uri() );
}

/**
 * Google Fonts for the design: Schibsted Grotesk for display, Figtree for body
 * (with italics), Plex Mono for dates and code. Used by the site and the editor.
 */
function awhitepen_google_fonts_url() {
	return 'https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;600;700;800&family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=IBM+Plex+Mono:wght@400;500&display=swap';
}

function awhitepen_setup() {
	load_theme_textdomain( 'awhitepen', AWHITEPEN_PATH . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array(
			'gallery',
			'caption',
			'search-form',
			'script',
			'style',
		)
	);
	add_theme_support( 'editor-styles' );
	add_editor_style(
		array(
			awhitepen_google_fonts_url(),
			'assets/css/main.css',
			'assets/css/classic-editor-content.css',
		)
	);
}
add_action( 'after_setup_theme', 'awhitepen_setup' );

function awhitepen_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'awhitepen_content_width', 880 );
}
add_action( 'after_setup_theme', 'awhitepen_content_width', 0 );

function awhitepen_classic_editor_toolbar_row_1( $buttons, $editor_id ) {
	if ( ! in_array( $editor_id, array( 'content', 'classic-block' ), true ) ) {
		return $buttons;
	}

	// Row one is what gets reached for while writing a sentence.
	return array(
		'undo',
		'redo',
		'awhitepen_fontsize',
		'formatselect',
		'blockquote',
		'bold',
		'italic',
		'underline',
		'strikethrough',
		'link',
		'unlink',
	);
}
add_filter( 'mce_buttons', 'awhitepen_classic_editor_toolbar_row_1', 20, 2 );

function awhitepen_classic_editor_external_plugins( $plugins ) {
	$plugins = is_array( $plugins ) ? $plugins : array();

	$plugins['awhitepen_fontsize'] = add_query_arg(
		'ver',
		rawurlencode( awhitepen_asset_version( '/assets/js/classic-editor-fontsize.js' ) ),
		AWHITEPEN_URI . '/assets/js/classic-editor-fontsize.js'
	);
	$plugins['awhitepen_columns'] = add_query_arg(
		'ver',
		rawurlencode( awhitepen_asset_version( '/assets/js/classic-editor-columns.js' ) ),
		AWHITEPEN_URI . '/assets/js/classic-editor-columns.js'
	);
	$plugins['awhitepen_embeds'] = add_query_arg(
		'ver',
		rawurlencode( awhitepen_asset_version( '/assets/js/classic-editor-embeds.js' ) ),
		AWHITEPEN_URI . '/assets/js/classic-editor-embeds.js'
	);

	return $plugins;
}
add_filter( 'mce_external_plugins', 'awhitepen_classic_editor_external_plugins' );

/**
 * Row two: shaping what is already written. Always shown, never behind the
 * kitchen-sink toggle (see wordpress_adv_hidden).
 */
function awhitepen_classic_editor_toolbar_row_2( $buttons, $editor_id ) {
	if ( ! in_array( $editor_id, array( 'content', 'classic-block' ), true ) ) {
		return $buttons;
	}

	return array(
		'alignleft',
		'aligncenter',
		'alignright',
		'outdent',
		'indent',
		'bullist',
		'numlist',
		'forecolor',
		'backcolor',
		'awhitepen_columns',
		'awhitepen_embeds',
		'charmap',
		'removeformat',
		'wp_help',
	);
}
add_filter( 'mce_buttons_2', 'awhitepen_classic_editor_toolbar_row_2', 20, 2 );

function awhitepen_classic_editor_settings( $init, $editor_id ) {
	if ( ! in_array( $editor_id, array( 'content', 'classic-block' ), true ) ) {
		return $init;
	}

	// Text and highlight have separate palettes now: text is dark and saturated,
	// highlight is a set of pale tints so the text on them stays readable. The
	// last three text colours are the white-pen ones, which hide on the page.
	$text_color_map = array(
		'201D16', 'Body text',
		'16140E', 'Ink',
		'28496A', 'Accent blue dark',
		'35618E', 'Accent blue',
		'B3352A', 'Red',
		'2B7549', 'Green',
		'857E70', 'Muted text',
		'E5E0D5', 'Edge',
		'F4F2EC', 'Page background',
		'FFFFFF', 'Surface',
	);

	$highlight_color_map = array(
		'F2E3A0', 'Yellow',
		'F5D9BF', 'Peach',
		'F2CFC9', 'Red',
		'E5D8EE', 'Lilac',
		'D6E2EE', 'Blue',
		'CFE6E4', 'Teal',
		'D5E6CC', 'Green',
		'E5E0D5', 'Sand',
	);

	$init['wordpress_adv_hidden'] = false;
	$init['block_formats']        = 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;Quote=blockquote;Quote source=quotesource;Code block=pre';

	/*
	 * TinyMCE writes strikethrough and underline as styled spans, which the
	 * design has no rule for. It styles <del> and <u>, so the buttons write
	 * those instead and new text matches what is already in the posts.
	 */
	$init['formats'] = wp_json_encode(
		array(
			'strikethrough' => array( 'inline' => 'del' ),
			'underline'     => array( 'inline' => 'u' ),
			// The source line inside a quote. The design adds the dash and size.
			'quotesource'   => array(
				'block'   => 'p',
				'classes' => 'quote-source',
			),
		)
	);
	// Four across, plus the "No color" cell the plugin appends to each grid.
	$init['forecolor_map']  = wp_json_encode( $text_color_map );
	$init['backcolor_map']  = wp_json_encode( $highlight_color_map );
	$init['forecolor_rows'] = 3;
	$init['backcolor_rows'] = 3;
	$init['textcolor_cols'] = 4;
	$init['schema']               = 'html5';
	$init['extended_valid_elements'] = trim(
		( isset( $init['extended_valid_elements'] ) ? (string) $init['extended_valid_elements'] . ',' : '' ) .
		'p[class|style],' .
		'li[class|style],' .
		'blockquote[class|style],' .
		'h1[class|style],' .
		'h2[class|style],' .
		'h3[class|style],' .
		'h4[class|style],' .
		'a[id|class|href|target|rel|title|style|aria-label],' .
		'div[id|class|style],' .
		'span[id|class|style|aria-label],' .
		'img[src|alt|title|width|height|style|class],' .
		'iframe[src|width|height|title|style|class|loading|allow|allowfullscreen|frameborder]'
	);
	$init['valid_children'] = trim(
		( isset( $init['valid_children'] ) ? (string) $init['valid_children'] . ',' : '' ) .
		'+div[a],+a[div|span|img],+div[iframe]'
	);
	// `entry` makes the design's post typography apply to the editor body.
	$init['body_class']           = trim(
		( isset( $init['body_class'] ) ? (string) $init['body_class'] : '' ) . ' awhitepen-editor-content entry'
	);

	return $init;
}
add_filter( 'tiny_mce_before_init', 'awhitepen_classic_editor_settings', 20, 2 );

function awhitepen_split_columns_content( $content, $columns_count ) {
	$content = is_string( $content ) ? trim( $content ) : '';

	if ( '' === $content ) {
		return array_fill( 0, $columns_count, '' );
	}

	$segments = preg_split(
		'/(?:<p>\s*)?(?:<!--\s*column\s*-->|\[column\])(?:\s*<\/p>)?/i',
		$content
	);

	if ( ! is_array( $segments ) || empty( $segments ) ) {
		$segments = array( $content );
	}

	$segments = array_map( 'trim', $segments );

	if ( count( $segments ) > $columns_count ) {
		$leading_segments   = array_slice( $segments, 0, $columns_count - 1 );
		$remaining_segments = array_slice( $segments, $columns_count - 1 );
		$leading_segments[] = implode( "\n\n", $remaining_segments );
		$segments           = $leading_segments;
	}

	if ( count( $segments ) < $columns_count ) {
		$segments = array_pad( $segments, $columns_count, '' );
	}

	return $segments;
}

function awhitepen_render_columns_shortcode( $content, $columns_count ) {
	$columns_count = (int) $columns_count;
	$columns_count = max( 2, min( 3, $columns_count ) );

	// wpautop runs before shortcodes, so an enclosing shortcode spanning several
	// paragraphs arrives with an orphan </p> at the front and <p> at the end.
	$content = preg_replace( '#^\s*</p>#', '', (string) $content );
	$content = preg_replace( '#<p>\s*$#', '', $content );

	$segments = awhitepen_split_columns_content( $content, $columns_count );

	$html = '<div class="awhitepen-columns awhitepen-columns--' . $columns_count . '">';

	foreach ( $segments as $segment ) {
		$column_content = do_shortcode( shortcode_unautop( $segment ) );
		$column_content = trim( wpautop( $column_content ) );
		$html          .= '<div class="awhitepen-column">' . $column_content . '</div>';
	}

	$html .= '</div>';

	return $html;
}

function awhitepen_shortcode_two_col( $atts, $content = null ) {
	return awhitepen_render_columns_shortcode( $content, 2 );
}
add_shortcode( 'two_col', 'awhitepen_shortcode_two_col' );

function awhitepen_shortcode_three_col( $atts, $content = null ) {
	return awhitepen_render_columns_shortcode( $content, 3 );
}
add_shortcode( 'three_col', 'awhitepen_shortcode_three_col' );

function awhitepen_enqueue_classic_editor_admin_assets( $hook_suffix ) {
	if ( ! in_array( $hook_suffix, array( 'post.php', 'post-new.php' ), true ) ) {
		return;
	}

	wp_enqueue_style( 'awhitepen-fonts', awhitepen_google_fonts_url(), array(), null );

	wp_enqueue_style(
		'awhitepen-classic-editor-admin',
		AWHITEPEN_URI . '/assets/css/classic-editor-admin.css',
		array( 'awhitepen-fonts' ),
		awhitepen_asset_version( '/assets/css/classic-editor-admin.css' )
	);

	wp_enqueue_script(
		'awhitepen-classic-editor-admin',
		AWHITEPEN_URI . '/assets/js/classic-editor-admin.js',
		array( 'jquery' ),
		awhitepen_asset_version( '/assets/js/classic-editor-admin.js' ),
		true
	);
}
add_action( 'admin_enqueue_scripts', 'awhitepen_enqueue_classic_editor_admin_assets' );

function awhitepen_asset_version( $relative_path ) {
	$absolute_path = AWHITEPEN_PATH . $relative_path;

	if ( file_exists( $absolute_path ) ) {
		return (string) filemtime( $absolute_path );
	}

	return AWHITEPEN_VERSION;
}

function awhitepen_status_api_url( $endpoint ) {
	return 'https://project-b-2t23se6ira-as.a.run.app/api/data-visualisation/' . $endpoint;
}

function awhitepen_enqueue_assets() {
	wp_enqueue_style( 'awhitepen-fonts', awhitepen_google_fonts_url(), array(), null );

	wp_enqueue_style(
		'awhitepen-main',
		AWHITEPEN_URI . '/assets/css/main.css',
		array( 'awhitepen-fonts' ),
		awhitepen_asset_version( '/assets/css/main.css' )
	);

	wp_enqueue_script(
		'awhitepen-main',
		AWHITEPEN_URI . '/assets/js/main.js',
		array(),
		awhitepen_asset_version( '/assets/js/main.js' ),
		true
	);

	// The page picks this template by its slug, or by an explicit assignment.
	if ( is_page( 'portfolio' ) || is_page_template( 'page-portfolio.php' ) ) {
		wp_enqueue_script(
			'awhitepen-portfolio',
			AWHITEPEN_URI . '/assets/js/portfolio.js',
			array(),
			awhitepen_asset_version( '/assets/js/portfolio.js' ),
			true
		);
	}

	// page-status.php is picked by the 'status' slug. One stylesheet for the whole
	// page; one script per dashboard, each reading its own endpoint.
	if ( is_page( 'status' ) ) {
		wp_enqueue_style(
			'awhitepen-status',
			AWHITEPEN_URI . '/assets/css/status.css',
			array( 'awhitepen-main' ),
			awhitepen_asset_version( '/assets/css/status.css' )
		);

		// Everything more than one dashboard needs — macro targets, fixed monthly
		// costs, formatting, the skeleton, the failure card — lives in one script
		// the other four depend on.
		wp_enqueue_script(
			'awhitepen-status-shared',
			AWHITEPEN_URI . '/assets/js/status-shared.js',
			array(),
			awhitepen_asset_version( '/assets/js/status-shared.js' ),
			true
		);

		// The failure card is written per kind of failure, not per dashboard: the
		// reader wants to know whether it is broken, slow or rate limited.
		wp_localize_script(
			'awhitepen-status-shared',
			'awhitepenStatusText',
			array(
				'retry'     => __( 'Try again', 'awhitepen' ),
				'retryWait' => __( 'Try again shortly', 'awhitepen' ),
				'triedAt'   => __( 'Tried at', 'awhitepen' ),
				'server'    => array(
					'tag'   => __( 'Error 5xx', 'awhitepen' ),
					'head'  => __( 'The server’s having a lie-down.', 'awhitepen' ),
					'lead1' => __( 'That one’s on me.', 'awhitepen' ),
					'body1' => __( 'My server tripped over something while fetching the numbers.', 'awhitepen' ),
					'lead2' => __( 'Nothing to fix on your end.', 'awhitepen' ),
					'body2' => __( 'Try again in a few minutes. The other tabs may have better luck.', 'awhitepen' ),
				),
				'network'   => array(
					'tag'   => __( 'Timed out', 'awhitepen' ),
					'head'  => __( 'The numbers got lost on the way.', 'awhitepen' ),
					'lead1' => __( 'Could be you, could be me.', 'awhitepen' ),
					'body1' => __( 'Either your connection dropped or my server took too long to reply. From here I can’t tell which.', 'awhitepen' ),
					'lead2' => __( 'Check you’re online, then try again.', 'awhitepen' ),
					'body2' => __( 'If it keeps happening, it’s probably me.', 'awhitepen' ),
				),
				'rate'      => array(
					'tag'   => __( '429', 'awhitepen' ),
					'head'  => __( 'Too many requests, too quickly.', 'awhitepen' ),
					'lead1' => __( 'That’s my speed limit, not a fault.', 'awhitepen' ),
					'body1' => __( 'The server wants a short breather before it answers again.', 'awhitepen' ),
					'lead2' => __( 'Give it a moment.', 'awhitepen' ),
					'body2' => __( 'The button below wakes up when it’s ready. Nothing is broken.', 'awhitepen' ),
				),
			)
		);

		// handle => [ endpoint, the name the failure card shows ].
		$status_scripts = array(
			'status'    => array( 'today', __( 'TODAY', 'awhitepen' ) ),
			'body'      => array( 'body', __( 'BODY', 'awhitepen' ) ),
			'fuel'      => array( 'fuel', __( 'FUEL', 'awhitepen' ) ),
			'resources' => array( 'resources', __( 'RESOURCES', 'awhitepen' ) ),
		);

		foreach ( $status_scripts as $name => $script ) {
			$file = '/assets/js/' . $name . '.js';

			wp_enqueue_script(
				'awhitepen-' . $name,
				AWHITEPEN_URI . $file,
				array( 'awhitepen-status-shared' ),
				awhitepen_asset_version( $file ),
				true
			);

			wp_localize_script(
				'awhitepen-' . $name,
				'awhitepen' . ucfirst( $name ),
				array(
					'url'   => awhitepen_status_api_url( $script[0] ),
					'label' => $script[1],
				)
			);
		}
	}

	wp_localize_script(
		'awhitepen-main',
		'awhitepenTheme',
		array(
			'expandLabel'     => __( 'Open menu', 'awhitepen' ),
			'collapseLabel'   => __( 'Close menu', 'awhitepen' ),
			'darkModeLabel'   => __( 'Enable dark mode', 'awhitepen' ),
			'lightModeLabel'  => __( 'Enable light mode', 'awhitepen' ),
			'codeMoreLabel'   => __( 'Continue', 'awhitepen' ),
			'codeLessLabel'   => __( 'Less', 'awhitepen' ),
			'themeStorageKey' => 'awhitepen-theme',
		)
	);
}
add_action( 'wp_enqueue_scripts', 'awhitepen_enqueue_assets' );

function awhitepen_font_preconnect( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = array(
			'href' => 'https://fonts.googleapis.com',
		);
		$urls[] = array(
			'href'        => 'https://fonts.gstatic.com',
			'crossorigin' => '',
		);
	}

	return $urls;
}
add_filter( 'wp_resource_hints', 'awhitepen_font_preconnect', 10, 2 );

/**
 * Wrap post tables so they can scroll.
 *
 * The design gives tables a 600px minimum and puts them in a .tbl box that
 * scrolls sideways. The editor writes a bare <table>, so add the box here or a
 * table pushes the whole page wider than the phone it is read on.
 */
function awhitepen_wrap_content_tables( $content ) {
	if ( false === stripos( $content, '<table' ) || false !== stripos( $content, 'class="tbl"' ) ) {
		return $content;
	}

	if ( substr_count( strtolower( $content ), '<table' ) !== substr_count( strtolower( $content ), '</table>' ) ) {
		return $content;
	}

	$content = preg_replace( '#<table\b#i', '<div class="tbl"><table', $content );

	return preg_replace( '#</table>#i', '</table></div>', $content );
}
add_filter( 'the_content', 'awhitepen_wrap_content_tables', 20 );

/**
 * Stop WordPress swapping emoji for Twemoji images.
 *
 * Core replaces every emoji with an SVG fetched from s.w.org, which renders in
 * Twitter's style rather than the reader's own. Unhooking the conversion leaves
 * the characters as typed and drops a script, a stylesheet and the prefetch.
 */
function awhitepen_disable_emoji_conversion() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
}
add_action( 'init', 'awhitepen_disable_emoji_conversion' );

// The classic editor loads the same conversion as a TinyMCE plugin.
function awhitepen_remove_tinymce_emoji( $plugins ) {
	return is_array( $plugins ) ? array_diff( $plugins, array( 'wpemoji' ) ) : array();
}
add_filter( 'tiny_mce_plugins', 'awhitepen_remove_tinymce_emoji' );

// Without the conversion there is nothing left to fetch from s.w.org.
function awhitepen_remove_emoji_prefetch( $urls, $relation_type ) {
	if ( 'dns-prefetch' !== $relation_type ) {
		return $urls;
	}

	return array_values(
		array_filter(
			$urls,
			function ( $url ) {
				$href = is_array( $url ) && isset( $url['href'] ) ? $url['href'] : $url;

				return ! ( is_string( $href ) && false !== strpos( $href, 's.w.org' ) );
			}
		)
	);
}
add_filter( 'wp_resource_hints', 'awhitepen_remove_emoji_prefetch', 10, 2 );

function awhitepen_output_theme_bootstrap_script() {
	?>
	<script id="awhitepen-theme-bootstrap">
		(function () {
			var storageKey = 'awhitepen-theme';
			var root = document.documentElement;
			var stored = null;
			var theme = null;

			try {
				stored = window.localStorage.getItem(storageKey);
			} catch (error) {
				stored = null;
			}

			if ( stored === 'light' || stored === 'dark' ) {
				theme = stored;
			}

			if (!theme) {
				theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			}

			root.setAttribute('data-theme', theme);
			root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
		})();
	</script>
	<?php
}
add_action( 'wp_head', 'awhitepen_output_theme_bootstrap_script', 0 );

function awhitepen_favicon_tags() {
	if ( function_exists( 'has_site_icon' ) && has_site_icon() ) {
		return;
	}

	$favicon_base = AWHITEPEN_URI . '/assets/favicon';
	?>
	<link rel="icon" href="<?php echo esc_url( $favicon_base . '/favicon.svg' ); ?>" sizes="any" type="image/svg+xml">
	<link rel="icon" href="<?php echo esc_url( $favicon_base . '/favicon-48x48.png' ); ?>" sizes="48x48" type="image/png">
	<link rel="icon" href="<?php echo esc_url( $favicon_base . '/favicon-32x32.png' ); ?>" sizes="32x32" type="image/png">
	<link rel="icon" href="<?php echo esc_url( $favicon_base . '/favicon-16x16.png' ); ?>" sizes="16x16" type="image/png">
	<link rel="shortcut icon" href="<?php echo esc_url( $favicon_base . '/favicon.ico' ); ?>" type="image/x-icon">
	<link rel="apple-touch-icon" href="<?php echo esc_url( $favicon_base . '/apple-touch-icon.png' ); ?>" sizes="180x180">
	<link rel="manifest" href="<?php echo esc_url( $favicon_base . '/site.webmanifest' ); ?>">
	<?php
}
add_action( 'wp_head', 'awhitepen_favicon_tags', 1 );

function awhitepen_posts_page_url() {
	$posts_page_id = (int) get_option( 'page_for_posts' );

	if ( $posts_page_id > 0 ) {
		$posts_page_url = get_permalink( $posts_page_id );

		if ( $posts_page_url ) {
			return $posts_page_url;
		}
	}

	return home_url( '/blog/' );
}

function awhitepen_virtual_blog_request() {
	static $blog_request = null;

	if ( null !== $blog_request ) {
		return $blog_request;
	}

	if ( is_admin() || empty( $_SERVER['REQUEST_URI'] ) ) {
		$blog_request = false;
		return $blog_request;
	}

	$request_uri  = wp_unslash( $_SERVER['REQUEST_URI'] );
	$request_path = wp_parse_url( $request_uri, PHP_URL_PATH );
	$home_path    = wp_parse_url( home_url( '/' ), PHP_URL_PATH );

	if ( ! is_string( $request_path ) ) {
		$blog_request = false;
		return $blog_request;
	}

	$request_path = trim( $request_path, '/' );

	if ( is_string( $home_path ) && '' !== $home_path && '/' !== $home_path ) {
		$home_path = trim( $home_path, '/' );

		if ( $request_path === $home_path ) {
			$request_path = '';
		} elseif ( 0 === strpos( $request_path, $home_path . '/' ) ) {
			$request_path = substr( $request_path, strlen( $home_path ) + 1 );
		}
	}

	if ( ! preg_match( '#^blog(?:/page/([0-9]+))?$#', $request_path, $matches ) ) {
		$blog_request = false;
		return $blog_request;
	}

	$blog_request = array(
		'paged' => ! empty( $matches[1] ) ? max( 1, (int) $matches[1] ) : 1,
		'path'  => $request_path,
	);

	return $blog_request;
}

function awhitepen_is_virtual_blog_request() {
	return false !== awhitepen_virtual_blog_request();
}

function awhitepen_parse_virtual_blog_request( $wp ) {
	$blog_request = awhitepen_virtual_blog_request();

	if ( ! $blog_request ) {
		return;
	}

	$wp->query_vars = array(
		'post_type'           => 'post',
		'paged'               => $blog_request['paged'],
		'posts_per_page'      => (int) get_option( 'posts_per_page' ),
		'orderby'             => 'date',
		'order'               => 'DESC',
		'ignore_sticky_posts' => false,
	);
}
add_action( 'parse_request', 'awhitepen_parse_virtual_blog_request', 0 );

function awhitepen_prepare_virtual_blog_query( $query ) {
	if ( is_admin() || ! $query->is_main_query() || ! awhitepen_is_virtual_blog_request() ) {
		return;
	}

	$blog_request = awhitepen_virtual_blog_request();

	$query->set( 'post_type', 'post' );
	$query->set( 'paged', $blog_request['paged'] );
	$query->set( 'posts_per_page', (int) get_option( 'posts_per_page' ) );
	$query->set( 'orderby', 'date' );
	$query->set( 'order', 'DESC' );
	$query->set( 'ignore_sticky_posts', false );

	$query->is_home       = true;
	$query->is_posts_page = true;
	$query->is_archive    = false;
	$query->is_page       = false;
	$query->is_singular   = false;
	$query->is_404        = false;
}
add_action( 'pre_get_posts', 'awhitepen_prepare_virtual_blog_query' );

function awhitepen_prevent_virtual_blog_404( $preempt, $query ) {
	if ( is_admin() || ! $query->is_main_query() || ! awhitepen_is_virtual_blog_request() ) {
		return $preempt;
	}

	$query->is_404 = false;
	status_header( 200 );

	return true;
}
add_filter( 'pre_handle_404', 'awhitepen_prevent_virtual_blog_404', 10, 2 );

function awhitepen_virtual_blog_template( $template ) {
	if ( ! awhitepen_is_virtual_blog_request() ) {
		return $template;
	}

	$blog_template = locate_template( array( 'home.php', 'index.php' ) );

	return $blog_template ? $blog_template : $template;
}
add_filter( 'template_include', 'awhitepen_virtual_blog_template' );

function awhitepen_default_category_id() {
	return (int) get_option( 'default_category' );
}

function awhitepen_get_blog_category_terms( $parent = 0 ) {
	$terms = get_terms(
		array(
			'taxonomy'   => 'category',
			'parent'     => (int) $parent,
			'hide_empty' => false,
			'orderby'    => 'name',
			'order'      => 'ASC',
		)
	);

	if ( is_wp_error( $terms ) ) {
		return array();
	}

	$default_category_id = awhitepen_default_category_id();

	return array_values(
		array_filter(
			$terms,
			static function ( $term ) use ( $default_category_id ) {
				return $term instanceof WP_Term && $term->term_id !== $default_category_id;
			}
		)
	);
}

function awhitepen_get_category_root_term_id( $term ) {
	$term = get_term( $term, 'category' );

	if ( ! $term instanceof WP_Term ) {
		return 0;
	}

	$ancestors = get_ancestors( $term->term_id, 'category', 'taxonomy' );

	if ( empty( $ancestors ) ) {
		return (int) $term->term_id;
	}

	return (int) end( $ancestors );
}

function awhitepen_term_is_in_branch( $branch_term_id, $current_term_id ) {
	$branch_term_id  = (int) $branch_term_id;
	$current_term_id = (int) $current_term_id;

	if ( $branch_term_id <= 0 || $current_term_id <= 0 ) {
		return false;
	}

	if ( $branch_term_id === $current_term_id ) {
		return true;
	}

	$ancestors = get_ancestors( $current_term_id, 'category', 'taxonomy' );

	return in_array( $branch_term_id, array_map( 'intval', $ancestors ), true );
}

function awhitepen_get_preferred_post_category( $post = null ) {
	$post       = get_post( $post );
	$categories = $post instanceof WP_Post ? get_the_category( $post->ID ) : array();

	if ( empty( $categories ) ) {
		return null;
	}

	$default_category_id = awhitepen_default_category_id();
	$preferred_category  = null;
	$highest_depth       = -1;

	foreach ( $categories as $category ) {
		if ( ! $category instanceof WP_Term ) {
			continue;
		}

		if ( $category->term_id === $default_category_id && count( $categories ) > 1 ) {
			continue;
		}

		$category_depth = count( get_ancestors( $category->term_id, 'category', 'taxonomy' ) );

		if ( $category_depth > $highest_depth ) {
			$preferred_category = $category;
			$highest_depth      = $category_depth;
		}
	}

	if ( $preferred_category instanceof WP_Term ) {
		return $preferred_category;
	}

	return $categories[0] instanceof WP_Term ? $categories[0] : null;
}

function awhitepen_get_current_blog_category_context() {
	if ( is_category() ) {
		$queried_object = get_queried_object();

		return $queried_object instanceof WP_Term ? $queried_object : null;
	}

	if ( is_singular( 'post' ) ) {
		return awhitepen_get_preferred_post_category( get_queried_object_id() );
	}

	return null;
}

/**
 * Categories for a meta line.
 *
 * Every category the post carries, in alphabetical order. A child is shown as
 * "Parent > Child" and replaces its parent, so a post filed under both Life and
 * Projects reads "Life > Projects" once. The default category is never printed.
 */
function awhitepen_get_post_category_meta_html( $post = null ) {
	$post       = get_post( $post );
	$categories = $post instanceof WP_Post ? get_the_category( $post->ID ) : array();

	if ( empty( $categories ) ) {
		return '';
	}

	$default_category_id = awhitepen_default_category_id();
	$terms               = array();

	foreach ( $categories as $category ) {
		if ( $category instanceof WP_Term && $category->term_id !== $default_category_id ) {
			$terms[ $category->term_id ] = $category;
		}
	}

	// A parent whose child is also on the post is already in that child's label.
	foreach ( $terms as $term ) {
		unset( $terms[ $term->parent ] );
	}

	$links = array();

	foreach ( $terms as $term ) {
		$link = get_term_link( $term );

		if ( is_wp_error( $link ) ) {
			continue;
		}

		$label = esc_html( $term->name );
		$parent = $term->parent ? get_term( $term->parent, 'category' ) : null;

		if ( $parent instanceof WP_Term && $parent->term_id !== $default_category_id ) {
			$label = esc_html( $parent->name ) . '<span class="meta-cats__sep">&rsaquo;</span>' . $label;
		}

		$links[ wp_strip_all_tags( $label ) ] = sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( $link ),
			$label
		);
	}

	if ( empty( $links ) ) {
		return '';
	}

	ksort( $links );

	return '<span class="meta-cats">' . implode( '', $links ) . '</span>';
}

function awhitepen_render_blog_section_nav() {
	$current_term    = awhitepen_get_current_blog_category_context();
	$current_root_id = $current_term instanceof WP_Term ? awhitepen_get_category_root_term_id( $current_term ) : 0;
	$top_level_terms = awhitepen_get_blog_category_terms( 0 );
	?>
	<nav class="category-rail" aria-label="<?php esc_attr_e( 'Blog sections', 'awhitepen' ); ?>">
		<a class="category-chip<?php echo 0 === $current_root_id ? ' is-active' : ''; ?>" href="<?php echo esc_url( awhitepen_posts_page_url() ); ?>">
			<?php esc_html_e( 'All posts', 'awhitepen' ); ?>
		</a>
		<?php foreach ( $top_level_terms as $term ) : ?>
			<?php $term_link = get_term_link( $term ); ?>
			<?php if ( is_wp_error( $term_link ) ) : ?>
				<?php continue; ?>
			<?php endif; ?>
			<a class="category-chip<?php echo awhitepen_term_is_in_branch( $term->term_id, $current_term instanceof WP_Term ? $current_term->term_id : 0 ) ? ' is-active' : ''; ?>" href="<?php echo esc_url( $term_link ); ?>">
				<?php echo esc_html( $term->name ); ?>
			</a>
		<?php endforeach; ?>
	</nav>
	<?php
}
/**
 * Primary navigation.
 *
 * The five items are fixed and the Blog dropdown is built from the live category
 * terms, so there is no WordPress menu to assign or maintain.
 */
function awhitepen_render_primary_nav() {
	$is_blog = is_home() || is_archive() || is_single() || is_search() || awhitepen_is_virtual_blog_request();
	$pages   = array(
		'portfolio' => __( 'Portfolio', 'awhitepen' ),
		'status'    => __( 'Status', 'awhitepen' ),
		'about'     => __( 'About', 'awhitepen' ),
		'contact'   => __( 'Contact', 'awhitepen' ),
	);
	?>
	<div class="nav-item has-sub">
		<a<?php echo $is_blog ? ' class="on"' : ''; ?> href="<?php echo esc_url( awhitepen_posts_page_url() ); ?>">
			<?php esc_html_e( 'Blog', 'awhitepen' ); ?>
			<svg class="caret" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 9l7 7 7-7"></path></svg>
		</a>
		<ul class="sub-menu">
			<li><a href="<?php echo esc_url( awhitepen_posts_page_url() ); ?>"><?php esc_html_e( 'All posts', 'awhitepen' ); ?></a></li>
			<?php foreach ( awhitepen_get_blog_category_terms( 0 ) as $term ) : ?>
				<?php $term_link = get_term_link( $term ); ?>
				<?php if ( is_wp_error( $term_link ) ) : ?>
					<?php continue; ?>
				<?php endif; ?>
				<li><a href="<?php echo esc_url( $term_link ); ?>"<?php echo is_category( $term->term_id ) ? ' aria-current="true"' : ''; ?>><?php echo esc_html( $term->name ); ?></a></li>
			<?php endforeach; ?>
		</ul>
	</div>
	<?php foreach ( $pages as $slug => $label ) : ?>
		<a<?php echo is_page( $slug ) ? ' class="on"' : ''; ?> href="<?php echo esc_url( home_url( '/' . $slug . '/' ) ); ?>"><?php echo esc_html( $label ); ?></a>
	<?php endforeach; ?>
	<?php
}


/**
 * Contextual label shown beside the wordmark in the header.
 */
function awhitepen_brand_tag() {
	if ( is_page( 'status' ) ) {
		return __( 'Status', 'awhitepen' );
	}

	return '';
}

function awhitepen_footer_social_rows() {
	return array(
		array(
			array(
				'label' => 'Mastodon',
				'url'   => 'https://mastodon.social/@awhitepen',
			),
			array(
				'label' => 'Threads',
				'url'   => 'https://www.threads.com/@a_whitepen_',
			),
			array(
				'label' => 'X',
				'url'   => 'https://x.com/a_whitepen',
			),
		),
		array(
			array(
				'label' => 'Instagram',
				'url'   => 'https://www.instagram.com/a_whitepen_/',
			),
			array(
				'label' => 'TikTok',
				'url'   => 'https://www.tiktok.com/@a_whitepen',
			),
			array(
				'label' => 'YouTube',
				'url'   => 'https://www.youtube.com/@awhitepen',
			),
		),
		array(
			array(
				'label' => 'GitHub',
				'url'   => 'https://github.com/a-white-pen',
			),
			array(
				'label' => 'LinkedIn',
				'url'   => 'https://www.linkedin.com/in/belinda-wan/',
			),
		),
	);
}

function awhitepen_get_footer_social_profile_url( $label ) {
	$label = is_string( $label ) ? trim( $label ) : '';

	if ( '' === $label ) {
		return '';
	}

	foreach ( awhitepen_footer_social_rows() as $row ) {
		if ( ! is_array( $row ) ) {
			continue;
		}

		foreach ( $row as $item ) {
			if (
				is_array( $item ) &&
				! empty( $item['label'] ) &&
				! empty( $item['url'] ) &&
				$label === (string) $item['label']
			) {
				return (string) $item['url'];
			}
		}
	}

	return '';
}

function awhitepen_render_footer_module_eyebrow( $label, $url = '' ) {
	$label = is_string( $label ) ? trim( $label ) : '';
	$url   = is_string( $url ) ? trim( $url ) : '';

	if ( '' === $label ) {
		return;
	}
	?>
	<p class="footer-embed-card__eyebrow">
		<?php if ( '' !== $url ) : ?>
			<a class="footer-embed-card__eyebrow-link" href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener noreferrer">
				<?php echo esc_html( $label ); ?>
			</a>
		<?php else : ?>
			<?php echo esc_html( $label ); ?>
		<?php endif; ?>
	</p>
	<?php
}

function awhitepen_footer_social_icon_svg( $label ) {
	$icons = array(
		'Mastodon'  => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg>',
		'Threads'   => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/></svg>',
		'X'         => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></svg>',
		'Instagram' => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>',
		'TikTok'    => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
		'YouTube'   => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
		'GitHub'    => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
		'LinkedIn'  => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
		'RSS'       => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z"/></svg>',
	);

	return isset( $icons[ $label ] ) ? $icons[ $label ] : '';
}

function awhitepen_get_mastodon_footer_config() {
	return array(
		'profile_url'  => 'https://mastodon.social/@awhitepen',
		'account_acct' => 'awhitepen@mastodon.social',
		'instance_url' => 'https://mastodon.social',
	);
}

function awhitepen_get_mastodon_json( $url, $headers = array() ) {
	$response = wp_remote_get(
		$url,
		array(
			'timeout' => 15,
			'headers' => array_merge(
				array(
					'Accept' => 'application/json',
				),
				$headers
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		return $response;
	}

	$status_code = (int) wp_remote_retrieve_response_code( $response );
	$body        = json_decode( wp_remote_retrieve_body( $response ), true );

	if ( 200 !== $status_code || ! is_array( $body ) ) {
		return new WP_Error(
			'awhitepen_mastodon_invalid_response',
			__( 'Mastodon returned an invalid response.', 'awhitepen' ),
			array(
				'status' => $status_code,
				'body'   => $body,
			)
		);
	}

	return $body;
}

/**
 * Numeric account id for the configured handle.
 *
 * Uses the public REST API. The ActivityPub actor endpoint is not usable here:
 * mastodon.social requires signed requests for it and answers 401 otherwise.
 */
function awhitepen_get_mastodon_account_id( $config ) {
	$handle = strtok( $config['account_acct'], '@' );

	if ( ! is_string( $handle ) || '' === $handle ) {
		return '';
	}

	$lookup = awhitepen_get_mastodon_json(
		add_query_arg(
			array( 'acct' => $handle ),
			trailingslashit( $config['instance_url'] ) . 'api/v1/accounts/lookup'
		)
	);

	if ( is_wp_error( $lookup ) || empty( $lookup['id'] ) ) {
		return '';
	}

	return (string) $lookup['id'];
}

function awhitepen_normalize_mastodon_excerpt( $html ) {
	$html = is_string( $html ) ? $html : '';

	if ( '' === trim( $html ) ) {
		return '';
	}

	$text = html_entity_decode( wp_strip_all_tags( $html, true ), ENT_QUOTES, get_bloginfo( 'charset' ) );
	$text = preg_replace( '/\s+/', ' ', $text );

	return trim( (string) $text );
}

function awhitepen_format_mastodon_timestamp( $published ) {
	$published = is_string( $published ) ? trim( $published ) : '';

	if ( '' === $published ) {
		return '';
	}

	$timestamp = strtotime( $published );

	if ( ! $timestamp ) {
		return '';
	}

	return wp_date( 'M j', $timestamp );
}

function awhitepen_footer_module_state_payload( $args = array() ) {
	$args = wp_parse_args(
		is_array( $args ) ? $args : array(),
		array(
			'state'       => 'unavailable',
			'eyebrow'     => '',
			'title'       => '',
			'meta'        => '',
			'profile_url' => '',
		)
	);

	return array(
		'state'       => (string) $args['state'],
		'eyebrow'     => (string) $args['eyebrow'],
		'title'       => (string) $args['title'],
		'meta'        => (string) $args['meta'],
		'profile_url' => (string) $args['profile_url'],
	);
}

function awhitepen_build_footer_mastodon_feed_data() {
	$config     = awhitepen_get_mastodon_footer_config();
	$eyebrow    = __( 'Mastodon', 'awhitepen' );
	$unavailable = awhitepen_footer_module_state_payload(
		array(
			'state'       => 'unavailable',
			'eyebrow'     => $eyebrow,
			'title'       => __( 'Recent Mastodon posts could not be loaded just now.', 'awhitepen' ),
			'meta'        => __( 'Please try again shortly.', 'awhitepen' ),
			'profile_url' => $config['profile_url'],
		)
	);

	$account_id = awhitepen_get_mastodon_account_id( $config );

	if ( '' === $account_id ) {
		return $unavailable;
	}

	$statuses = awhitepen_get_mastodon_json(
		add_query_arg(
			array(
				'limit'            => 10,
				'exclude_replies'  => 'true',
				'exclude_reblogs'  => 'true',
			),
			trailingslashit( $config['instance_url'] ) . 'api/v1/accounts/' . rawurlencode( $account_id ) . '/statuses'
		)
	);

	if ( is_wp_error( $statuses ) ) {
		return $unavailable;
	}

	$posts = array();

	foreach ( $statuses as $status ) {
		if ( count( $posts ) >= 8 ) {
			break;
		}

		if ( ! is_array( $status ) || empty( $status['url'] ) || ! is_string( $status['url'] ) ) {
			continue;
		}

		$excerpt = awhitepen_normalize_mastodon_excerpt( isset( $status['content'] ) ? $status['content'] : '' );

		if ( '' === $excerpt ) {
			$excerpt = __( 'A recent public post on Mastodon.', 'awhitepen' );
		}

		$posts[] = array(
			'excerpt'   => $excerpt,
			'url'       => trim( $status['url'] ),
			'timestamp' => awhitepen_format_mastodon_timestamp( isset( $status['created_at'] ) ? $status['created_at'] : '' ),
		);
	}

	if ( empty( $posts ) ) {
		return awhitepen_footer_module_state_payload(
			array(
				'state'       => 'empty',
				'eyebrow'     => $eyebrow,
				'title'       => __( 'No recent public Mastodon posts are available yet.', 'awhitepen' ),
				'meta'        => __( 'Fresh posts will appear here automatically.', 'awhitepen' ),
				'profile_url' => $config['profile_url'],
			)
		);
	}

	return array(
		'state'       => 'ready',
		'eyebrow'     => $eyebrow,
		'posts'       => $posts,
		'profile_url' => $config['profile_url'],
	);
}

function awhitepen_get_footer_mastodon_feed() {
	$cache_key   = 'awhitepen_footer_mastodon_feed';
	$cached_feed = get_transient( $cache_key );

	if ( is_array( $cached_feed ) && ! empty( $cached_feed['state'] ) ) {
		return $cached_feed;
	}

	$feed      = awhitepen_build_footer_mastodon_feed_data();
	$cache_ttl = 'ready' === $feed['state'] ? 15 * MINUTE_IN_SECONDS : 5 * MINUTE_IN_SECONDS;

	set_transient( $cache_key, $feed, $cache_ttl );

	return $feed;
}

function awhitepen_render_footer_mastodon_module() {
	$mastodon_feed = awhitepen_get_footer_mastodon_feed();
	$module_classes = array( 'footer-embed-card__module', 'footer-embed-card__module--mastodon' );

	if ( 'ready' !== $mastodon_feed['state'] ) {
		$module_classes[] = 'footer-embed-card__module--placeholder';
	}
	?>
	<div class="<?php echo esc_attr( implode( ' ', $module_classes ) ); ?>" data-module="mastodon-feed">
		<?php awhitepen_render_footer_module_eyebrow( $mastodon_feed['eyebrow'], ! empty( $mastodon_feed['profile_url'] ) ? $mastodon_feed['profile_url'] : '' ); ?>
			<?php if ( 'ready' === $mastodon_feed['state'] && ! empty( $mastodon_feed['posts'] ) ) : ?>
				<div class="footer-mastodon-list">
					<?php foreach ( $mastodon_feed['posts'] as $post ) : ?>
						<article class="footer-mastodon-item">
							<p class="footer-mastodon-item__excerpt">
								<a class="footer-mastodon-item__link" href="<?php echo esc_url( $post['url'] ); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html( $post['excerpt'] ); ?></a>
							</p>
							<?php if ( ! empty( $post['timestamp'] ) ) : ?>
								<p class="footer-mastodon-item__meta"><?php echo esc_html( $post['timestamp'] ); ?></p>
							<?php endif; ?>
						</article>
					<?php endforeach; ?>
				</div>
		<?php else : ?>
			<?php if ( ! empty( $mastodon_feed['title'] ) ) : ?>
				<p class="footer-embed-card__body footer-embed-card__body--compact"><?php echo esc_html( $mastodon_feed['title'] ); ?></p>
			<?php endif; ?>
			<?php if ( ! empty( $mastodon_feed['meta'] ) ) : ?>
				<p class="footer-embed-card__meta"><?php echo esc_html( $mastodon_feed['meta'] ); ?></p>
			<?php endif; ?>
		<?php endif; ?>
	</div>
	<?php
}

function awhitepen_format_activity_type( $activity_type ) {
	$activity_type = is_string( $activity_type ) ? trim( $activity_type ) : '';

	if ( '' === $activity_type ) {
		return __( 'Activity', 'awhitepen' );
	}

	$activity_type = str_replace( '_', ' ', $activity_type );
	$activity_type = preg_replace( '/(?<!^)([A-Z])/', ' $1', $activity_type );

	return trim( (string) $activity_type );
}

function awhitepen_is_strength_activity( $activity_type ) {
	$activity_type = is_string( $activity_type ) ? strtolower( trim( $activity_type ) ) : '';

	if ( '' === $activity_type ) {
		return false;
	}

	$normalized_type = preg_replace( '/[^a-z]/', '', $activity_type );

	return in_array( $normalized_type, array( 'weighttraining', 'strengthtraining' ), true );
}

function awhitepen_format_activity_distance( $distance_metres ) {
	$distance_kilometres = max( 0, (float) $distance_metres ) / 1000;

	return sprintf(
		/* translators: %s: distance in kilometres. */
		__( '%s km', 'awhitepen' ),
		number_format_i18n( $distance_kilometres, 1 )
	);
}

function awhitepen_format_activity_moving_time( $moving_time_seconds ) {
	$moving_time_seconds = max( 0, (int) $moving_time_seconds );

	if ( 0 === $moving_time_seconds ) {
		return __( '0 min', 'awhitepen' );
	}

	$hours   = (int) floor( $moving_time_seconds / HOUR_IN_SECONDS );
	$minutes = (int) floor( ( $moving_time_seconds % HOUR_IN_SECONDS ) / MINUTE_IN_SECONDS );

	if ( $hours > 0 ) {
		if ( $minutes > 0 ) {
			return sprintf(
				/* translators: 1: hours, 2: minutes. */
				__( '%1$sh %2$sm', 'awhitepen' ),
				number_format_i18n( $hours ),
				number_format_i18n( $minutes )
			);
		}

		return sprintf(
			/* translators: %s: hours. */
			__( '%sh', 'awhitepen' ),
			number_format_i18n( $hours )
		);
	}

	return sprintf(
		/* translators: %s: minutes. */
		__( '%s min', 'awhitepen' ),
		number_format_i18n( max( 1, (int) round( $moving_time_seconds / MINUTE_IN_SECONDS ) ) )
	);
}

function awhitepen_format_activity_timestamp( $activity ) {
	if ( ! is_array( $activity ) || empty( $activity['started_at'] ) || ! is_string( $activity['started_at'] ) ) {
		return '';
	}

	try {
		$date = new DateTimeImmutable( trim( $activity['started_at'] ) );
	} catch ( Exception $exception ) {
		return '';
	}

	try {
		$timezone = new DateTimeZone( ! empty( $activity['timezone'] ) ? (string) $activity['timezone'] : 'UTC' );
	} catch ( Exception $exception ) {
		$timezone = new DateTimeZone( 'UTC' );
	}

	$date_label = wp_date( 'M j', $date->getTimestamp(), $timezone );
	$time_label = strtolower( wp_date( 'g:i a', $date->getTimestamp(), $timezone ) );

	return sprintf(
		/* translators: 1: activity date, 2: activity time. */
		__( '%1$s at %2$s', 'awhitepen' ),
		$date_label,
		$time_label
	);
}

function awhitepen_get_activity_detail_items( $activity ) {
	if ( ! is_array( $activity ) ) {
		return array();
	}

	$activity_type = ! empty( $activity['sport_type'] ) ? $activity['sport_type'] : '';
	$detail_items  = array(
		awhitepen_format_activity_type( $activity_type ),
	);

	if ( ! awhitepen_is_strength_activity( $activity_type ) ) {
		$detail_items[] = awhitepen_format_activity_distance( isset( $activity['distance_m'] ) ? $activity['distance_m'] : 0 );
	}

	$detail_items[] = awhitepen_format_activity_moving_time( isset( $activity['moving_seconds'] ) ? $activity['moving_seconds'] : 0 );

	return array_values( array_filter( $detail_items ) );
}

function awhitepen_build_garmin_footer_activity_item( $activity ) {
	if ( ! is_array( $activity ) || empty( $activity['url'] ) || ! is_string( $activity['url'] ) ) {
		return array();
	}

	$activity_title = ! empty( $activity['name'] ) ? wp_strip_all_tags( (string) $activity['name'], true ) : __( 'Recent activity', 'awhitepen' );

	return array(
		'title'        => $activity_title,
		'detail_items' => awhitepen_get_activity_detail_items( $activity ),
		'timestamp'    => awhitepen_format_activity_timestamp( $activity ),
		'url'          => $activity['url'],
		'media_url'    => ! empty( $activity['media_url'] ) && is_string( $activity['media_url'] ) ? $activity['media_url'] : '',
	);
}

function awhitepen_build_garmin_footer_activity_data() {
	$eyebrow     = __( 'Garmin', 'awhitepen' );
	$unavailable = awhitepen_footer_module_state_payload(
		array(
			'state'   => 'unavailable',
			'eyebrow' => $eyebrow,
			'title'   => __( 'The latest Garmin activities could not be loaded just now.', 'awhitepen' ),
			'meta'    => __( 'Please try again shortly.', 'awhitepen' ),
		)
	);

	$response = wp_remote_get(
		awhitepen_status_api_url( 'fitness' ),
		array(
			'timeout' => 15,
			'headers' => array( 'Accept' => 'application/json' ),
		)
	);

	if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
		return $unavailable;
	}

	$body = json_decode( wp_remote_retrieve_body( $response ), true );

	if ( ! is_array( $body ) || empty( $body['data'] ) || ! is_array( $body['data'] ) ) {
		return $unavailable;
	}

	$feed              = $body['data'];
	$activities        = ! empty( $feed['activities'] ) && is_array( $feed['activities'] ) ? array_slice( $feed['activities'], 0, 5 ) : array();
	$footer_activities = array();

	foreach ( $activities as $activity ) {
		$footer_activity = awhitepen_build_garmin_footer_activity_item( $activity );

		if ( ! empty( $footer_activity ) ) {
			$footer_activities[] = $footer_activity;
		}
	}

	if ( empty( $footer_activities ) ) {
		return awhitepen_footer_module_state_payload(
			array(
				'state'   => 'empty',
				'eyebrow' => $eyebrow,
				'title'   => __( 'No recent activities are available yet.', 'awhitepen' ),
				'meta'    => __( 'Fresh activity data will appear here automatically.', 'awhitepen' ),
			)
		);
	}

	return array(
		'state'       => 'ready',
		'eyebrow'     => $eyebrow,
		'activities'  => $footer_activities,
		'profile_url' => ! empty( $feed['profile_url'] ) && is_string( $feed['profile_url'] ) ? $feed['profile_url'] : '',
	);
}

/**
 * The Fitness feed is live in Project B, so the card refreshes every minute: a workout
 * shows, or goes, within a minute of Project B recording or removing it. When a refresh
 * fails, the last card that loaded stays up instead of the error.
 */
function awhitepen_get_footer_garmin_activity() {
	$cache_key       = 'awhitepen_footer_garmin_feed';
	$last_good_key   = 'awhitepen_footer_garmin_feed_last_good';
	$cached_activity = get_transient( $cache_key );

	if (
		is_array( $cached_activity ) &&
		! empty( $cached_activity['state'] ) &&
		( 'ready' !== $cached_activity['state'] || ! empty( $cached_activity['activities'] ) )
	) {
		return $cached_activity;
	}

	$activity = awhitepen_build_garmin_footer_activity_data();

	if ( 'ready' === $activity['state'] ) {
		update_option( $last_good_key, $activity, false );
	} elseif ( 'unavailable' === $activity['state'] ) {
		$last_good = get_option( $last_good_key );

		if ( is_array( $last_good ) && ! empty( $last_good['activities'] ) ) {
			$activity = $last_good;
		}
	}

	set_transient( $cache_key, $activity, MINUTE_IN_SECONDS );

	return $activity;
}

function awhitepen_render_footer_garmin_module() {
	$garmin_activity = awhitepen_get_footer_garmin_activity();
	$module_classes  = array( 'footer-embed-card__module', 'footer-embed-card__module--garmin' );

	if ( 'ready' !== $garmin_activity['state'] ) {
		$module_classes[] = 'footer-embed-card__module--placeholder';
	}
	?>
	<div class="<?php echo esc_attr( implode( ' ', $module_classes ) ); ?>" data-module="garmin-latest-activity">
		<?php awhitepen_render_footer_module_eyebrow( $garmin_activity['eyebrow'], ! empty( $garmin_activity['profile_url'] ) ? $garmin_activity['profile_url'] : '' ); ?>

		<?php if ( 'ready' === $garmin_activity['state'] && ! empty( $garmin_activity['activities'] ) ) : ?>
			<div class="footer-garmin-list">
				<?php foreach ( $garmin_activity['activities'] as $index => $activity ) : ?>
					<?php
					$item_classes    = array( 'footer-garmin-item' );
					$activity_label  = sprintf(
						/* translators: %s: activity title. */
						__( 'View %s on Garmin Connect', 'awhitepen' ),
						$activity['title']
					);
					$has_media       = ! empty( $activity['media_url'] );
					$is_media_right  = 1 === ( $index % 2 );

					$item_classes[] = 'footer-garmin-item--with-slot';

					if ( $is_media_right ) {
						$item_classes[] = 'footer-garmin-item--media-right';
					}
					?>
						<a class="<?php echo esc_attr( implode( ' ', $item_classes ) ); ?>" href="<?php echo esc_url( $activity['url'] ); ?>" aria-label="<?php echo esc_attr( $activity_label ); ?>" target="_blank" rel="noopener noreferrer">
						<span class="footer-garmin-item__media<?php echo ! $has_media ? ' footer-garmin-item__media--empty' : ''; ?>" aria-hidden="true">
							<?php if ( $has_media ) : ?>
								<img class="footer-garmin-item__image" src="<?php echo esc_url( $activity['media_url'] ); ?>" alt="" loading="lazy" decoding="async">
							<?php endif; ?>
						</span>

						<span class="footer-garmin-item__content">
							<span class="footer-embed-card__body footer-embed-card__body--compact footer-garmin-item__title"><?php echo esc_html( $activity['title'] ); ?></span>
							<?php if ( ! empty( $activity['detail_items'] ) ) : ?>
								<span class="footer-embed-card__details footer-garmin-item__details">
									<?php foreach ( $activity['detail_items'] as $detail_index => $detail_item ) : ?>
										<?php if ( $detail_index > 0 ) : ?>
											<span aria-hidden="true">&middot;</span>
										<?php endif; ?>
										<span><?php echo esc_html( $detail_item ); ?></span>
									<?php endforeach; ?>
								</span>
							<?php endif; ?>
							<?php if ( ! empty( $activity['timestamp'] ) ) : ?>
								<span class="footer-garmin-item__timestamp"><?php echo esc_html( $activity['timestamp'] ); ?></span>
							<?php endif; ?>
						</span>
					</a>
				<?php endforeach; ?>
			</div>
		<?php elseif ( ! empty( $garmin_activity['meta'] ) ) : ?>
			<p class="footer-embed-card__body footer-embed-card__activity-title"><?php echo esc_html( $garmin_activity['title'] ); ?></p>
			<p class="footer-embed-card__meta"><?php echo esc_html( $garmin_activity['meta'] ); ?></p>
		<?php elseif ( ! empty( $garmin_activity['title'] ) ) : ?>
			<p class="footer-embed-card__body footer-embed-card__activity-title"><?php echo esc_html( $garmin_activity['title'] ); ?></p>
		<?php endif; ?>
	</div>
	<?php
}

function awhitepen_get_stored_instagram_access_token() {
	$stored_access_token = get_option( 'awhitepen_instagram_access_token', '' );

	if ( is_string( $stored_access_token ) && '' !== trim( $stored_access_token ) ) {
		return trim( $stored_access_token );
	}

	return defined( 'INSTAGRAM_ACCESS_TOKEN' ) ? trim( (string) INSTAGRAM_ACCESS_TOKEN ) : '';
}

function awhitepen_get_instagram_footer_config() {
	$config = array(
		'user_id'      => defined( 'INSTAGRAM_USER_ID' ) ? trim( (string) INSTAGRAM_USER_ID ) : '',
		'access_token' => awhitepen_get_stored_instagram_access_token(),
	);

	$config['is_configured'] = '' !== $config['access_token'] && '' !== $config['user_id'];

	return $config;
}

function awhitepen_get_footer_instagram_media_items( $config = null ) {
	$config = is_array( $config ) ? $config : awhitepen_get_instagram_footer_config();

	if ( empty( $config['is_configured'] ) ) {
		return array();
	}

	$cache_key    = 'awhitepen_footer_instagram_media';
	$cached_items = get_transient( $cache_key );

	if ( is_array( $cached_items ) ) {
		$items = $cached_items;
	} else {
		$request_url = add_query_arg(
			array(
				'fields'       => 'id,media_type,media_url,thumbnail_url,permalink,timestamp',
				'limit'        => 9,
				'access_token' => $config['access_token'],
			),
			'https://graph.instagram.com/me/media'
		);

		$response = wp_remote_get(
			$request_url,
			array(
				'timeout' => 15,
				'headers' => array(
					'Accept' => 'application/json',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			set_transient( $cache_key, array(), 5 * MINUTE_IN_SECONDS );
			return array();
		}

		$response_code = (int) wp_remote_retrieve_response_code( $response );
		$body          = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( 200 !== $response_code || ! is_array( $body ) || empty( $body['data'] ) || ! is_array( $body['data'] ) ) {
			set_transient( $cache_key, array(), 5 * MINUTE_IN_SECONDS );
			return array();
		}

		$items = array_values( array_slice( $body['data'], 0, 9 ) );

		set_transient( $cache_key, $items, 15 * MINUTE_IN_SECONDS );
	}

	$items = apply_filters( 'awhitepen_footer_instagram_media_items', $items, $config );

	if ( ! is_array( $items ) ) {
		return array();
	}

	return array_values( array_slice( $items, 0, 9 ) );
}

function awhitepen_get_instagram_media_tile_url( $item ) {
	if ( ! is_array( $item ) ) {
		return '';
	}

	$media_type = ! empty( $item['media_type'] ) ? strtoupper( (string) $item['media_type'] ) : '';

	if ( in_array( $media_type, array( 'VIDEO', 'REELS' ), true ) && ! empty( $item['thumbnail_url'] ) ) {
		return (string) $item['thumbnail_url'];
	}

	if ( 'CAROUSEL_ALBUM' === $media_type && ! empty( $item['children'] ) ) {
		$children = $item['children'];

		if ( isset( $children['data'] ) && is_array( $children['data'] ) ) {
			$children = $children['data'];
		}

		if ( is_array( $children ) && ! empty( $children[0] ) ) {
			return awhitepen_get_instagram_media_tile_url( $children[0] );
		}
	}

	if ( ! empty( $item['media_url'] ) ) {
		return (string) $item['media_url'];
	}

	return '';
}

function awhitepen_get_instagram_media_permalink( $item ) {
	if ( ! is_array( $item ) || empty( $item['permalink'] ) ) {
		return '';
	}

	return (string) $item['permalink'];
}

function awhitepen_render_footer_instagram_module() {
	$config         = awhitepen_get_instagram_footer_config();
	$media_items    = awhitepen_get_footer_instagram_media_items( $config );
	$module_classes = array( 'footer-embed-card__module', 'footer-embed-card__module--instagram' );
	$body_copy      = '';
	$meta_copy      = '';

	if ( ! $config['is_configured'] ) {
		$module_classes[] = 'footer-embed-card__module--placeholder';
		$body_copy        = __( 'Latest Instagram media will appear here once the Instagram API is connected.', 'awhitepen' );
		$meta_copy        = __( 'Add INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN in wp-config.php to enable this module.', 'awhitepen' );
	} elseif ( empty( $media_items ) ) {
		$module_classes[] = 'footer-embed-card__module--placeholder';
		$body_copy        = __( 'The latest Instagram media could not be loaded just now.', 'awhitepen' );
		$meta_copy        = __( 'Please try again shortly.', 'awhitepen' );
	}
	?>
	<div class="<?php echo esc_attr( implode( ' ', $module_classes ) ); ?>" data-module="instagram-feed">
		<?php awhitepen_render_footer_module_eyebrow( __( 'Instagram', 'awhitepen' ), awhitepen_get_footer_social_profile_url( 'Instagram' ) ); ?>
		<div class="footer-instagram-grid" aria-label="<?php esc_attr_e( 'Latest Instagram media', 'awhitepen' ); ?>">
			<?php for ( $index = 0; $index < 9; $index++ ) : ?>
				<?php
				$item      = isset( $media_items[ $index ] ) && is_array( $media_items[ $index ] ) ? $media_items[ $index ] : null;
				$image_url = $item ? awhitepen_get_instagram_media_tile_url( $item ) : '';
				$permalink = $item ? awhitepen_get_instagram_media_permalink( $item ) : '';
				?>
					<?php if ( $item && '' !== $permalink ) : ?>
						<a
							class="footer-instagram-grid__tile footer-instagram-grid__tile--media"
							href="<?php echo esc_url( $permalink ); ?>"
							aria-label="<?php esc_attr_e( 'View Instagram post', 'awhitepen' ); ?>"
							target="_blank"
							rel="noopener noreferrer"
						>
						<?php if ( '' !== $image_url ) : ?>
							<img class="footer-instagram-grid__image" src="<?php echo esc_url( $image_url ); ?>" alt="" loading="lazy">
						<?php else : ?>
							<span class="footer-instagram-grid__fallback-mark" aria-hidden="true"></span>
						<?php endif; ?>
					</a>
				<?php else : ?>
					<span class="footer-instagram-grid__tile footer-instagram-grid__tile--placeholder" aria-hidden="true"></span>
				<?php endif; ?>
			<?php endfor; ?>
		</div>
		<?php if ( '' !== $body_copy ) : ?>
			<p class="footer-embed-card__body footer-embed-card__body--compact"><?php echo esc_html( $body_copy ); ?></p>
		<?php endif; ?>
		<?php if ( '' !== $meta_copy ) : ?>
			<p class="footer-embed-card__meta"><?php echo esc_html( $meta_copy ); ?></p>
		<?php endif; ?>
	</div>
	<?php
}

function awhitepen_brand_name() {
	$site_name = get_bloginfo( 'name' );

	if ( ! is_string( $site_name ) || '' === $site_name ) {
		return 'awhitepen';
	}

	$brand_name = preg_replace( '/-local$/i', '', $site_name );

	return $brand_name ? trim( $brand_name ) : 'awhitepen';
}

function awhitepen_page_context( $post = null ) {
	$post = $post ? get_post( $post ) : get_post();

	if ( ! $post instanceof WP_Post ) {
		return array(
			'eyebrow' => __( 'Page', 'awhitepen' ),
			'intro'   => '',
			'intro_html' => '',
		);
	}

	$contexts = array(
		'about'     => array(
			'eyebrow' => __( 'About', 'awhitepen' ),
			'intro'   => '',
			'intro_html' => sprintf(
				/* translators: %s: URL to dictionary entry for kaypoh. */
				__( 'More on the human-bot powering this corner of the internet. Why you so <a href="%s" target="_blank" rel="noopener noreferrer"><em>kaypoh</em></a>?', 'awhitepen' ),
				esc_url( 'https://www.oed.com/dictionary/kaypoh_n?tl=true' )
			),
		),
		'contact'   => array(
			'eyebrow' => __( 'Contact', 'awhitepen' ),
			'intro' => __( "Don't be shy — I don't bite.", 'awhitepen' ),
			'intro_html' => '',
		),
	);

	if ( isset( $contexts[ $post->post_name ] ) ) {
		return $contexts[ $post->post_name ];
	}

	return array(
		'eyebrow' => __( 'Page', 'awhitepen' ),
		'intro'   => '',
		'intro_html' => '',
	);
}

function awhitepen_excerpt_more( $more ) {
	if ( is_admin() ) {
		return $more;
	}

	return '&hellip;';
}
add_filter( 'excerpt_more', 'awhitepen_excerpt_more' );

function awhitepen_excerpt_length( $length ) {
	if ( is_admin() ) {
		return $length;
	}

	return 22;
}
add_filter( 'excerpt_length', 'awhitepen_excerpt_length' );

function awhitepen_get_clean_excerpt( $post = null, $word_limit = 42 ) {
	$post = get_post( $post );

	if ( ! $post instanceof WP_Post ) {
		return '';
	}

	$word_limit = max( 1, (int) $word_limit );
	$excerpt    = has_excerpt( $post ) ? $post->post_excerpt : $post->post_content;

	if ( ! has_excerpt( $post ) ) {
		$excerpt = strip_shortcodes( $excerpt );

		if ( function_exists( 'excerpt_remove_blocks' ) ) {
			$excerpt = excerpt_remove_blocks( $excerpt );
		}

		$excerpt = preg_replace( '#<(iframe|script|style|object|embed|video|audio)[^>]*>.*?</\1>#is', ' ', $excerpt );
		$excerpt = preg_replace( '#<img[^>]*>#is', ' ', $excerpt );
		$excerpt = preg_replace( '#<figure[^>]*class=(["\'])[^"\']*wp-block-(?:embed|image)[^"\']*\1[^>]*>.*?</figure>#is', ' ', $excerpt );
		$excerpt = preg_replace( '#<!--\s*/?wp:[^>]*-->#is', ' ', $excerpt );
		$excerpt = preg_replace( '/^\s*https?:\/\/\S+\s*$/mi', ' ', $excerpt );
	}

	$excerpt = html_entity_decode( wp_strip_all_tags( $excerpt, true ), ENT_QUOTES | ENT_HTML5, get_bloginfo( 'charset' ) );
	$excerpt = preg_replace( '/\bSources?:\s*/i', ' ', $excerpt );
	$excerpt = preg_replace( '#https?://[^\s<>()]+#i', ' ', $excerpt );
	$excerpt = trim( preg_replace( '/\s+/', ' ', $excerpt ) );

	if ( '' === $excerpt ) {
		return '';
	}

	// Prefer the first real body copy when posts open with editorial notes before a synopsis label.
	foreach ( array( 'Synopsis:', 'Summary:' ) as $marker ) {
		$marker_position = stripos( $excerpt, $marker );

		if ( false === $marker_position || 280 < $marker_position ) {
			continue;
		}

		$excerpt_after_marker = trim( substr( $excerpt, $marker_position + strlen( $marker ) ) );

		if ( '' !== $excerpt_after_marker ) {
			$excerpt = $excerpt_after_marker;
		}

		break;
	}

	return wp_trim_words( $excerpt, $word_limit, '...' );
}

function awhitepen_get_stream_excerpt( $post = null, $word_limit = 40 ) {
	return awhitepen_get_clean_excerpt( $post, $word_limit );
}

function awhitepen_get_stream_excerpt_words() {
	return 42;
}

/**
 * Top-level category slug for a post, used by the blog pager to filter cards.
 * A post in "Life > Projects" reports "life".
 */
function awhitepen_get_stream_category_slug( $post = null ) {
	$category = awhitepen_get_preferred_post_category( $post );

	if ( ! $category instanceof WP_Term ) {
		return '';
	}

	$root = get_term( awhitepen_get_category_root_term_id( $category ), 'category' );

	return $root instanceof WP_Term ? $root->slug : $category->slug;
}

function awhitepen_render_notebook_stream( $query = null ) {
	global $wp_query;

	if ( ! $query instanceof WP_Query ) {
		$query = $wp_query;
	}

	if ( ! $query instanceof WP_Query ) {
		return;
	}

	$has_posts = $query->have_posts();
	?>
	<div class="story-list story-list--notebook">
		<?php
		while ( $query->have_posts() ) :
			$query->the_post();
			$category_meta_html = awhitepen_get_post_category_meta_html( get_post() );
			$excerpt            = awhitepen_get_stream_excerpt( get_post(), awhitepen_get_stream_excerpt_words() );
			$category_slug      = awhitepen_get_stream_category_slug( get_post() );
			?>
			<article id="post-<?php the_ID(); ?>" data-cat="<?php echo esc_attr( $category_slug ); ?>" class="story-card">
				<p class="story-card__meta">
					<span><?php echo esc_html( get_the_date( 'M j, Y' ) ); ?></span>
					<?php echo wp_kses_post( $category_meta_html ); ?>
				</p>
				<h2 class="story-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
				<?php if ( $excerpt ) : ?>
					<div class="story-card__excerpt">
						<p><?php echo esc_html( $excerpt ); ?></p>
					</div>
				<?php endif; ?>
				<p class="story-card__cta"><a class="text-link" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Continue reading', 'awhitepen' ); ?></a></p>
			</article>
			<?php
		endwhile;
		?>
		<p class="story-empty"<?php echo $has_posts ? ' hidden' : ''; ?>><?php esc_html_e( 'Nothing here yet.', 'awhitepen' ); ?></p>
	</div>
	<nav class="blog-pager" aria-label="<?php esc_attr_e( 'Blog pages', 'awhitepen' ); ?>" hidden>
		<button type="button" class="text-link" data-pg="-1">&larr; <?php esc_html_e( 'Previous', 'awhitepen' ); ?></button>
		<span class="blog-pager__n"></span>
		<button type="button" class="text-link" data-pg="1"><?php esc_html_e( 'Next', 'awhitepen' ); ?> &rarr;</button>
	</nav>
	<?php
}

function awhitepen_render_stream_browse_section() {
	?>
	<section class="editorial-section editorial-section--compact">
		<header class="section-header">
			<p class="section-kicker"><?php esc_html_e( 'Browse More', 'awhitepen' ); ?></p>
		</header>
		<?php awhitepen_render_blog_section_nav(); ?>
		<p class="section-link"><a class="text-link" href="<?php echo esc_url( awhitepen_posts_page_url() ); ?>"><?php esc_html_e( 'See more posts', 'awhitepen' ); ?></a></p>
	</section>
	<?php
}

function awhitepen_render_notebook_header( $kicker = '' ) {
	?>
	<header class="archive-hero archive-hero--home">
		<?php if ( '' !== $kicker ) : ?>
			<p class="section-kicker"><?php echo esc_html( $kicker ); ?></p>
		<?php endif; ?>
		<h1 class="page-title"><?php esc_html_e( 'On B’s mind lately…', 'awhitepen' ); ?></h1>
		<p class="archive-dek">
			<?php esc_html_e( 'A running stream of thoughts, observations, and learnings.', 'awhitepen' ); ?><br>
			<?php esc_html_e( 'Opinions subject to potential updates.', 'awhitepen' ); ?><br>
			<?php esc_html_e( 'Persuasive counterarguments welcome.', 'awhitepen' ); ?>
		</p>
	</header>
	<?php
}

/**
 * Posts rendered into the blog stream in one go.
 *
 * The stream pages 5 at a time in the browser (see the blog pager in main.js), so the
 * whole set is rendered and the pager hides the cards it is not showing. The cap keeps
 * the page from growing without limit; move paging back to the server if it is reached.
 */
const AWHITEPEN_STREAM_POST_CAP = 100;

function awhitepen_blog_stream_query( $query ) {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}

	if ( ! $query->is_home() && ! $query->is_category() ) {
		return;
	}

	$query->set( 'posts_per_page', AWHITEPEN_STREAM_POST_CAP );
	$query->set( 'ignore_sticky_posts', true );
	$query->set( 'orderby', 'date' );
	$query->set( 'order', 'DESC' );
}
add_action( 'pre_get_posts', 'awhitepen_blog_stream_query' );

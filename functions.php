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

function awhitepen_setup() {
	load_theme_textdomain( 'awhitepen', AWHITEPEN_PATH . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array(
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'search-form',
			'script',
			'style',
		)
	);
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 80,
			'width'       => 240,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support( 'editor-styles' );
	add_editor_style(
		array(
			'assets/css/main.css',
			'assets/css/classic-editor-content.css',
		)
	);

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'awhitepen' ),
			'footer'  => __( 'Footer Menu', 'awhitepen' ),
		)
	);
}
add_action( 'after_setup_theme', 'awhitepen_setup' );

function awhitepen_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'awhitepen_content_width', 880 );
}
add_action( 'after_setup_theme', 'awhitepen_content_width', 0 );

function awhitepen_widgets_init() {
	register_sidebar(
		array(
			'name'          => __( 'Footer Info', 'awhitepen' ),
			'id'            => 'footer-info',
			'description'   => __( 'Optional footer widget area.', 'awhitepen' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'awhitepen_widgets_init' );

function awhitepen_classic_editor_toolbar_row_1( $buttons, $editor_id ) {
	if ( ! in_array( $editor_id, array( 'content', 'classic-block' ), true ) ) {
		return $buttons;
	}

	return array(
		'formatselect',
		'awhitepen_fontsize_named',
		'fontsizeselect',
		'awhitepen_lineheight',
		'awhitepen_columns',
		'awhitepen_embeds',
		'bold',
		'italic',
		'underline',
		'strikethrough',
		'bullist',
		'numlist',
		'blockquote',
		'alignleft',
		'aligncenter',
		'alignright',
		'link',
		'unlink',
		'removeformat',
		'charmap',
		'forecolor',
		'backcolor',
		'outdent',
		'indent',
		'undo',
		'redo',
		'wp_help',
	);
}
add_filter( 'mce_buttons', 'awhitepen_classic_editor_toolbar_row_1', 20, 2 );

function awhitepen_classic_editor_external_plugins( $plugins ) {
	$plugins = is_array( $plugins ) ? $plugins : array();

	$plugins['awhitepen_lineheight'] = add_query_arg(
		'ver',
		rawurlencode( awhitepen_asset_version( '/assets/js/classic-editor-lineheight.js' ) ),
		AWHITEPEN_URI . '/assets/js/classic-editor-lineheight.js'
	);
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

function awhitepen_classic_editor_toolbar_row_2( $buttons, $editor_id ) {
	if ( ! in_array( $editor_id, array( 'content', 'classic-block' ), true ) ) {
		return $buttons;
	}

	return array();
}
add_filter( 'mce_buttons_2', 'awhitepen_classic_editor_toolbar_row_2', 20, 2 );

function awhitepen_classic_editor_settings( $init, $editor_id ) {
	if ( ! in_array( $editor_id, array( 'content', 'classic-block' ), true ) ) {
		return $init;
	}

	$color_map = array(
		'222222', 'Body text',
		'505050', 'Muted text',
		'35566B', 'Link blue',
		'4F6B57', 'Green',
		'8A4B4B', 'Red',
		'F4E7C8', 'Warm highlight',
		'E3EBE2', 'Soft sage highlight',
		'F0E1E1', 'Soft rose highlight',
	);

	$init['wordpress_adv_hidden'] = false;
	$init['block_formats']        = 'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Code block=pre';
	$init['fontsize_formats']     = '14px 15px 18px 20px 24px 32px';
	$init['textcolor_map']        = wp_json_encode( $color_map );
	$init['color_map']            = wp_json_encode( $color_map );
	$init['textcolor_rows']       = 2;
	$init['color_cols']           = 4;
	$init['custom_colors']        = true;
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
	$init['body_class']           = trim(
		( isset( $init['body_class'] ) ? (string) $init['body_class'] : '' ) . ' awhitepen-editor-content'
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
	$segments      = awhitepen_split_columns_content( $content, $columns_count );

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

	wp_enqueue_style(
		'awhitepen-classic-editor-admin',
		AWHITEPEN_URI . '/assets/css/classic-editor-admin.css',
		array(),
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

function awhitepen_enqueue_assets() {
	wp_enqueue_style(
		'awhitepen-main',
		AWHITEPEN_URI . '/assets/css/main.css',
		array(),
		awhitepen_asset_version( '/assets/css/main.css' )
	);

	wp_enqueue_script(
		'awhitepen-main',
		AWHITEPEN_URI . '/assets/js/main.js',
		array(),
		awhitepen_asset_version( '/assets/js/main.js' ),
		true
	);

	wp_localize_script(
		'awhitepen-main',
		'awhitepenTheme',
		array(
			'expandLabel'     => __( 'Open menu', 'awhitepen' ),
			'collapseLabel'   => __( 'Close menu', 'awhitepen' ),
			'darkModeLabel'   => __( 'Enable dark mode', 'awhitepen' ),
			'lightModeLabel'  => __( 'Enable light mode', 'awhitepen' ),
			'themeStorageKey' => 'awhitepen-theme',
		)
	);
}
add_action( 'wp_enqueue_scripts', 'awhitepen_enqueue_assets' );

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

function awhitepen_get_category_hierarchy_label( $term ) {
	$term = get_term( $term, 'category' );

	if ( ! $term instanceof WP_Term ) {
		return '';
	}

	$trail_ids = array_reverse( get_ancestors( $term->term_id, 'category', 'taxonomy' ) );
	$trail_ids[] = $term->term_id;

	$default_category_id = awhitepen_default_category_id();
	$labels              = array();

	foreach ( $trail_ids as $trail_id ) {
		$trail_term = get_term( $trail_id, 'category' );

		if ( ! $trail_term instanceof WP_Term ) {
			continue;
		}

		if ( $trail_term->term_id === $default_category_id && count( $trail_ids ) > 1 ) {
			continue;
		}

		$labels[] = $trail_term->name;
	}

	return implode( ' > ', $labels );
}

function awhitepen_get_post_category_meta_html( $post = null ) {
	$category = awhitepen_get_preferred_post_category( $post );

	if ( ! $category instanceof WP_Term ) {
		return '';
	}

	$label         = awhitepen_get_category_hierarchy_label( $category );
	$category_link = get_term_link( $category );

	if ( is_wp_error( $category_link ) || '' === $label ) {
		return esc_html( $label );
	}

	return sprintf(
		'<a href="%1$s">%2$s</a>',
		esc_url( $category_link ),
		esc_html( $label )
	);
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

function awhitepen_render_blog_menu_terms( $parent = 0, $current_term_id = 0 ) {
	$terms = awhitepen_get_blog_category_terms( $parent );

	if ( empty( $terms ) ) {
		return;
	}
	?>
	<ul class="sub-menu">
		<?php foreach ( $terms as $term ) : ?>
			<?php
			$term_link = get_term_link( $term );

			if ( is_wp_error( $term_link ) ) {
				continue;
			}

			$children = awhitepen_get_blog_category_terms( $term->term_id );
			$classes  = array( 'menu-item', 'menu-item-type-taxonomy', 'menu-item-object-category' );

			if ( ! empty( $children ) ) {
				$classes[] = 'menu-item-has-children';
			}

			if ( $current_term_id === (int) $term->term_id ) {
				$classes[] = 'current-menu-item';
			} elseif ( awhitepen_term_is_in_branch( $term->term_id, $current_term_id ) ) {
				$classes[] = 'current-menu-ancestor';
			}
			?>
			<li class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>">
				<a href="<?php echo esc_url( $term_link ); ?>">
					<?php echo esc_html( $term->name ); ?>
				</a>
				<?php if ( ! empty( $children ) ) : ?>
					<?php awhitepen_render_blog_menu_terms( $term->term_id, $current_term_id ); ?>
				<?php endif; ?>
			</li>
		<?php endforeach; ?>
	</ul>
	<?php
}

function awhitepen_is_blog_menu_item( $item ) {
	if ( ! is_object( $item ) ) {
		return false;
	}

	$posts_page_id  = (int) get_option( 'page_for_posts' );
	$posts_page_url = awhitepen_normalize_path_for_compare( wp_parse_url( awhitepen_posts_page_url(), PHP_URL_PATH ) );
	$item_url       = awhitepen_normalize_path_for_compare( isset( $item->url ) ? wp_parse_url( $item->url, PHP_URL_PATH ) : '' );

	if ( $posts_page_id > 0 && isset( $item->object_id ) && (int) $item->object_id === $posts_page_id ) {
		return true;
	}

	if ( '' !== $posts_page_url && '' !== $item_url ) {
		return $posts_page_url === $item_url;
	}

	$item_title = isset( $item->title ) ? trim( wp_strip_all_tags( (string) $item->title ) ) : '';

	if ( '' !== $item_title && 0 === strcasecmp( $item_title, 'blog' ) ) {
		return true;
	}

	return false;
}

function awhitepen_normalize_path_for_compare( $path ) {
	if ( ! is_string( $path ) || '' === trim( $path ) ) {
		return '';
	}

	$normalized = untrailingslashit( rawurldecode( $path ) );

	return '' === $normalized ? '/' : $normalized;
}

function awhitepen_current_request_path() {
	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	$path        = wp_parse_url( $request_uri, PHP_URL_PATH );

	return awhitepen_normalize_path_for_compare( is_string( $path ) ? $path : '' );
}

function awhitepen_is_about_menu_item( $item ) {
	if ( ! is_object( $item ) ) {
		return false;
	}

	static $about_page_id = null;

	if ( null === $about_page_id ) {
		$about_page    = get_page_by_path( 'about' );
		$about_page_id = $about_page instanceof WP_Post ? (int) $about_page->ID : 0;
	}

	$about_url_path = awhitepen_normalize_path_for_compare( wp_parse_url( home_url( '/about/' ), PHP_URL_PATH ) );
	$item_url_path  = awhitepen_normalize_path_for_compare( isset( $item->url ) ? wp_parse_url( $item->url, PHP_URL_PATH ) : '' );

	if ( $about_page_id > 0 && isset( $item->object_id ) && (int) $item->object_id === $about_page_id ) {
		return true;
	}

	if ( '' !== $about_url_path && '' !== $item_url_path ) {
		return $about_url_path === $item_url_path;
	}

	$item_title = isset( $item->title ) ? trim( wp_strip_all_tags( (string) $item->title ) ) : '';

	if ( '' !== $item_title && 0 === strcasecmp( $item_title, 'about' ) ) {
		return true;
	}

	return false;
}

function awhitepen_menu_item_descends_from( $item, $ancestor_id, $items_by_id ) {
	if ( ! is_object( $item ) ) {
		return false;
	}

	$parent_id = isset( $item->menu_item_parent ) ? (int) $item->menu_item_parent : 0;

	while ( $parent_id > 0 ) {
		if ( $parent_id === (int) $ancestor_id ) {
			return true;
		}

		if ( empty( $items_by_id[ $parent_id ] ) ) {
			break;
		}

		$parent_id = (int) $items_by_id[ $parent_id ]->menu_item_parent;
	}

	return false;
}

function awhitepen_build_dynamic_blog_menu_items( $parent_item_id, $parent_term_id, &$next_id, $current_term_id = 0 ) {
	$dynamic_items = array();
	$terms         = awhitepen_get_blog_category_terms( $parent_term_id );

	foreach ( $terms as $term ) {
		$children = awhitepen_get_blog_category_terms( $term->term_id );
		$classes  = array(
			'menu-item',
			'menu-item-type-taxonomy',
			'menu-item-object-category',
			'menu-item-' . $term->term_id,
		);

		if ( ! empty( $children ) ) {
			$classes[] = 'menu-item-has-children';
		}

		if ( $current_term_id === (int) $term->term_id ) {
			$classes[] = 'current-menu-item';
		} elseif ( awhitepen_term_is_in_branch( $term->term_id, $current_term_id ) ) {
			$classes[] = 'current-menu-ancestor';
		}

		$term_link = get_term_link( $term );

		if ( is_wp_error( $term_link ) ) {
			continue;
		}

		$item                    = new stdClass();
		$item->ID                = $next_id++;
		$item->db_id             = $item->ID;
		$item->menu_item_parent  = (int) $parent_item_id;
		$item->object_id         = (int) $term->term_id;
		$item->object            = 'category';
		$item->type              = 'taxonomy';
		$item->type_label        = __( 'Category', 'awhitepen' );
		$item->title             = $term->name;
		$item->url               = $term_link;
		$item->target            = '';
		$item->attr_title        = '';
		$item->description       = '';
		$item->classes           = $classes;
		$item->xfn               = '';
		$item->status            = 'publish';
		$item->current           = in_array( 'current-menu-item', $classes, true );
		$item->current_item_ancestor = in_array( 'current-menu-ancestor', $classes, true );
		$item->current_item_parent   = false;
		$item->menu_order        = $item->ID;

		$dynamic_items[] = $item;

		if ( ! empty( $children ) ) {
			$dynamic_items = array_merge(
				$dynamic_items,
				awhitepen_build_dynamic_blog_menu_items( $item->ID, $term->term_id, $next_id, $current_term_id )
			);
		}
	}

	return $dynamic_items;
}

function awhitepen_inject_dynamic_blog_categories_into_menu( $items, $args ) {
	if ( empty( $args->theme_location ) || 'primary' !== $args->theme_location ) {
		return $items;
	}

	if ( isset( $args->depth ) && 1 === (int) $args->depth ) {
		return $items;
	}

	$blog_item = null;

	foreach ( $items as $item ) {
		if ( isset( $item->menu_item_parent ) && 0 === (int) $item->menu_item_parent && awhitepen_is_blog_menu_item( $item ) ) {
			$blog_item = $item;
			break;
		}
	}

	if ( ! $blog_item ) {
		return $items;
	}

	$current_term = awhitepen_get_current_blog_category_context();
	$current_term_id = $current_term instanceof WP_Term ? (int) $current_term->term_id : 0;
	$top_level_terms = awhitepen_get_blog_category_terms( 0 );

	if ( ! empty( $top_level_terms ) ) {
		$blog_item->classes   = isset( $blog_item->classes ) && is_array( $blog_item->classes ) ? $blog_item->classes : array();
		$blog_item->classes[] = 'menu-item-has-children';
		$blog_item->classes   = array_unique( $blog_item->classes );
	}

	if ( awhitepen_is_virtual_blog_request() || is_home() || is_archive() || is_single() || is_search() ) {
		$blog_item->classes[] = 'current-menu-item';
		$blog_item->classes[] = 'current-menu-ancestor';
		$blog_item->classes   = array_unique( $blog_item->classes );
	}

	$items_by_id = array();

	foreach ( $items as $item ) {
		$items_by_id[ (int) $item->ID ] = $item;
	}

	$next_id   = max( array_map( 'intval', array_keys( $items_by_id ) ) ) + 1000;
	$new_items = array();

	foreach ( $items as $item ) {
		if ( awhitepen_menu_item_descends_from( $item, $blog_item->ID, $items_by_id ) ) {
			continue;
		}

		$new_items[] = $item;

		if ( (int) $item->ID === (int) $blog_item->ID ) {
			$new_items = array_merge(
				$new_items,
				awhitepen_build_dynamic_blog_menu_items( $blog_item->ID, 0, $next_id, $current_term_id )
			);
		}
	}

	return $new_items;
}
add_filter( 'wp_nav_menu_objects', 'awhitepen_inject_dynamic_blog_categories_into_menu', 10, 2 );

function awhitepen_build_static_submenu_item( $parent_item_id, &$next_id, $title, $url, $is_current = false ) {
	$is_current = (bool) $is_current;
	$item                   = new stdClass();
	$item->ID               = $next_id++;
	$item->db_id            = $item->ID;
	$item->menu_item_parent = (int) $parent_item_id;
	$item->object_id        = 0;
	$item->object           = 'custom';
	$item->type             = 'custom';
	$item->type_label       = __( 'Custom Link', 'awhitepen' );
	$item->title            = $title;
	$item->url              = $url;
	$item->target           = '';
	$item->attr_title       = '';
	$item->description      = '';
	$item->classes          = array(
		'menu-item',
		'menu-item-type-custom',
		'menu-item-object-custom',
	);

	if ( $is_current ) {
		$item->classes[] = 'current-menu-item';
	}

	$item->xfn                 = '';
	$item->status              = 'publish';
	$item->current             = $is_current;
	$item->current_item_ancestor = false;
	$item->current_item_parent   = false;
	$item->menu_order            = $item->ID;

	return $item;
}

function awhitepen_inject_about_submenu_into_menu( $items, $args ) {
	if ( empty( $args->theme_location ) || 'primary' !== $args->theme_location ) {
		return $items;
	}

	if ( isset( $args->depth ) && 1 === (int) $args->depth ) {
		return $items;
	}

	$about_item = null;

	foreach ( $items as $item ) {
		if ( isset( $item->menu_item_parent ) && 0 === (int) $item->menu_item_parent && awhitepen_is_about_menu_item( $item ) ) {
			$about_item = $item;
			break;
		}
	}

	if ( ! $about_item ) {
		return $items;
	}

	$items_by_id = array();

	foreach ( $items as $item ) {
		$items_by_id[ (int) $item->ID ] = $item;
	}

	foreach ( $items as $item ) {
		if ( awhitepen_menu_item_descends_from( $item, $about_item->ID, $items_by_id ) ) {
			return $items;
		}
	}

	$about_item->classes   = isset( $about_item->classes ) && is_array( $about_item->classes ) ? $about_item->classes : array();
	$about_item->classes[] = 'menu-item-has-children';
	$about_item->classes   = array_unique( $about_item->classes );

	$current_path = awhitepen_current_request_path();
	$specs_url    = home_url( '/about-specs/' );
	$goals_url    = home_url( '/about-goals/' );
	$specs_path   = awhitepen_normalize_path_for_compare( wp_parse_url( $specs_url, PHP_URL_PATH ) );
	$goals_path   = awhitepen_normalize_path_for_compare( wp_parse_url( $goals_url, PHP_URL_PATH ) );

	$is_specs_current = '' !== $current_path && $current_path === $specs_path;
	$is_goals_current = '' !== $current_path && $current_path === $goals_path;

	if ( $is_specs_current || $is_goals_current ) {
		$about_item->classes[]             = 'current-menu-ancestor';
		$about_item->classes[]             = 'current-menu-parent';
		$about_item->classes               = array_unique( $about_item->classes );
		$about_item->current               = false;
		$about_item->current_item_ancestor = true;
		$about_item->current_item_parent   = true;
	}

	$next_id = ! empty( $items_by_id ) ? max( array_map( 'intval', array_keys( $items_by_id ) ) ) + 1000 : 1000;
	$children = array(
		awhitepen_build_static_submenu_item(
			$about_item->ID,
			$next_id,
			__( '"specs"', 'awhitepen' ),
			$specs_url,
			$is_specs_current
		),
		awhitepen_build_static_submenu_item(
			$about_item->ID,
			$next_id,
			__( 'Goals', 'awhitepen' ),
			$goals_url,
			$is_goals_current
		),
	);

	$new_items = array();

	foreach ( $items as $item ) {
		$new_items[] = $item;

		if ( (int) $item->ID === (int) $about_item->ID ) {
			$new_items = array_merge( $new_items, $children );
		}
	}

	return $new_items;
}
add_filter( 'wp_nav_menu_objects', 'awhitepen_inject_about_submenu_into_menu', 11, 2 );

function awhitepen_primary_navigation_fallback( $args = array() ) {
	$menu_id         = ! empty( $args['menu_id'] ) ? $args['menu_id'] : 'primary-menu';
	$menu_class      = ! empty( $args['menu_class'] ) ? $args['menu_class'] : 'menu';
	$is_blog         = is_home() || is_archive() || is_single() || is_search() || awhitepen_is_virtual_blog_request();
	$pages           = array(
		array(
			'slug'  => 'portfolio',
			'label' => __( 'Portfolio', 'awhitepen' ),
		),
		array(
			'slug'  => 'about',
			'label' => __( 'About', 'awhitepen' ),
		),
		array(
			'slug'  => 'contact',
			'label' => __( 'Contact', 'awhitepen' ),
		),
	);
	?>
	<ul id="<?php echo esc_attr( $menu_id ); ?>" class="<?php echo esc_attr( $menu_class ); ?>">
		<li class="menu-item<?php echo $is_blog ? ' current-menu-item current-menu-ancestor' : ''; ?>">
			<a href="<?php echo esc_url( awhitepen_posts_page_url() ); ?>"><?php esc_html_e( 'Blog', 'awhitepen' ); ?></a>
		</li>
		<?php foreach ( $pages as $page ) : ?>
			<li class="menu-item<?php echo is_page( $page['slug'] ) ? ' current-menu-item' : ''; ?>">
				<a href="<?php echo esc_url( home_url( '/' . $page['slug'] . '/' ) ); ?>">
					<?php echo esc_html( $page['label'] ); ?>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
	<?php
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

function awhitepen_get_mastodon_actor_url( $config ) {
	$webfinger_url = add_query_arg(
		array(
			'resource' => 'acct:' . $config['account_acct'],
		),
		trailingslashit( $config['instance_url'] ) . '.well-known/webfinger'
	);

	$webfinger = awhitepen_get_mastodon_json( $webfinger_url );

	if ( is_wp_error( $webfinger ) || empty( $webfinger['links'] ) || ! is_array( $webfinger['links'] ) ) {
		return '';
	}

	foreach ( $webfinger['links'] as $link ) {
		if (
			is_array( $link ) &&
			! empty( $link['rel'] ) &&
			'self' === $link['rel'] &&
			! empty( $link['href'] ) &&
			is_string( $link['href'] )
		) {
			return trim( $link['href'] );
		}
	}

	return '';
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
	$config    = awhitepen_get_mastodon_footer_config();
	$actor_url = awhitepen_get_mastodon_actor_url( $config );
	$eyebrow   = __( 'Mastodon', 'awhitepen' );

	if ( '' === $actor_url ) {
		return awhitepen_footer_module_state_payload(
			array(
				'state'       => 'unavailable',
				'eyebrow'     => $eyebrow,
				'title'       => __( 'Recent Mastodon posts could not be loaded just now.', 'awhitepen' ),
				'meta'        => __( 'Please try again shortly.', 'awhitepen' ),
				'profile_url' => $config['profile_url'],
			)
		);
	}

	$actor = awhitepen_get_mastodon_json(
		$actor_url,
		array(
			'Accept' => 'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
		)
	);

	if ( is_wp_error( $actor ) || empty( $actor['outbox'] ) || ! is_string( $actor['outbox'] ) ) {
		return awhitepen_footer_module_state_payload(
			array(
				'state'       => 'unavailable',
				'eyebrow'     => $eyebrow,
				'title'       => __( 'Recent Mastodon posts could not be loaded just now.', 'awhitepen' ),
				'meta'        => __( 'Please try again shortly.', 'awhitepen' ),
				'profile_url' => $config['profile_url'],
			)
		);
	}

	$outbox = awhitepen_get_mastodon_json(
		$actor['outbox'],
		array(
			'Accept' => 'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
		)
	);

	if ( is_wp_error( $outbox ) ) {
		return awhitepen_footer_module_state_payload(
			array(
				'state'       => 'unavailable',
				'eyebrow'     => $eyebrow,
				'title'       => __( 'Recent Mastodon posts could not be loaded just now.', 'awhitepen' ),
				'meta'        => __( 'Please try again shortly.', 'awhitepen' ),
				'profile_url' => $config['profile_url'],
			)
		);
	}

	$ordered_items = array();

	if ( ! empty( $outbox['orderedItems'] ) && is_array( $outbox['orderedItems'] ) ) {
		$ordered_items = $outbox['orderedItems'];
	} elseif ( ! empty( $outbox['first'] ) ) {
		$first_page = $outbox['first'];

		if ( is_string( $first_page ) ) {
			$first_page = awhitepen_get_mastodon_json(
				$first_page,
				array(
					'Accept' => 'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
				)
			);
		}

		if ( is_array( $first_page ) && ! empty( $first_page['orderedItems'] ) && is_array( $first_page['orderedItems'] ) ) {
			$ordered_items = $first_page['orderedItems'];
		}
	}

	if ( empty( $ordered_items ) ) {
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

	$posts = array();

	foreach ( $ordered_items as $item ) {
		if ( count( $posts ) >= 3 ) {
			break;
		}

		if ( ! is_array( $item ) ) {
			continue;
		}

		$type   = ! empty( $item['type'] ) ? $item['type'] : '';
		$object = array();

		if ( 'Create' === $type && ! empty( $item['object'] ) && is_array( $item['object'] ) ) {
			$object = $item['object'];
		} elseif ( 'Note' === $type ) {
			$object = $item;
		} else {
			continue;
		}

		$excerpt = awhitepen_normalize_mastodon_excerpt( isset( $object['content'] ) ? $object['content'] : '' );

		if ( '' === $excerpt ) {
			$excerpt = __( 'A recent public post on Mastodon.', 'awhitepen' );
		}

		$url = '';

		if ( ! empty( $object['url'] ) && is_string( $object['url'] ) ) {
			$url = trim( $object['url'] );
		} elseif ( ! empty( $item['url'] ) && is_string( $item['url'] ) ) {
			$url = trim( $item['url'] );
		} elseif ( ! empty( $object['id'] ) && is_string( $object['id'] ) ) {
			$url = trim( $object['id'] );
		}

		if ( '' === $url ) {
			continue;
		}

		$posts[] = array(
			'excerpt'   => $excerpt,
			'url'       => $url,
			'timestamp' => awhitepen_format_mastodon_timestamp(
				! empty( $object['published'] ) ? $object['published'] : ( ! empty( $item['published'] ) ? $item['published'] : '' )
			),
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

function awhitepen_get_strava_credentials() {
	$client_id                = defined( 'STRAVA_CLIENT_ID' ) ? trim( (string) STRAVA_CLIENT_ID ) : '';
	$client_secret            = defined( 'STRAVA_CLIENT_SECRET' ) ? trim( (string) STRAVA_CLIENT_SECRET ) : '';
	$refresh_token_candidates = awhitepen_get_strava_refresh_token_candidates();
	$refresh_token            = ! empty( $refresh_token_candidates ) ? $refresh_token_candidates[0]['value'] : '';

	if ( '' === $client_id || '' === $client_secret || '' === $refresh_token ) {
		return new WP_Error(
			'awhitepen_strava_missing_credentials',
			__( 'Strava credentials are not fully configured.', 'awhitepen' )
		);
	}

	return array(
		'client_id'                => $client_id,
		'client_secret'            => $client_secret,
		'refresh_token'            => $refresh_token,
		'refresh_token_candidates' => $refresh_token_candidates,
	);
}

function awhitepen_get_strava_refresh_token_candidates() {
	$candidates           = array();
	$stored_refresh_token = get_option( 'awhitepen_strava_refresh_token', '' );
	$constant_token       = defined( 'STRAVA_REFRESH_TOKEN' ) ? trim( (string) STRAVA_REFRESH_TOKEN ) : '';

	if ( is_string( $stored_refresh_token ) && '' !== trim( $stored_refresh_token ) ) {
		$candidates[] = array(
			'value'  => trim( $stored_refresh_token ),
			'source' => 'stored option',
		);
	}

	if ( '' !== $constant_token ) {
		$existing_values = wp_list_pluck( $candidates, 'value' );

		if ( ! in_array( $constant_token, $existing_values, true ) ) {
			$candidates[] = array(
				'value'  => $constant_token,
				'source' => 'wp-config constant',
			);
		}
	}

	return $candidates;
}

function awhitepen_store_strava_refresh_token( $refresh_token ) {
	$refresh_token = is_string( $refresh_token ) ? trim( $refresh_token ) : '';

	if ( '' === $refresh_token ) {
		return;
	}

	update_option( 'awhitepen_strava_refresh_token', $refresh_token, false );
}

function awhitepen_request_strava_access_token( $credentials, $refresh_token_candidate ) {
	$response = wp_remote_post(
		'https://www.strava.com/oauth/token',
		array(
			'timeout' => 15,
			'body'    => array(
				'client_id'     => $credentials['client_id'],
				'client_secret' => $credentials['client_secret'],
				'grant_type'    => 'refresh_token',
				'refresh_token' => $refresh_token_candidate['value'],
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		return new WP_Error(
			'awhitepen_strava_token_request_failed',
			__( 'Unable to refresh the Strava access token.', 'awhitepen' ),
			$response->get_error_message()
		);
	}

	$response_code = (int) wp_remote_retrieve_response_code( $response );
	$body          = json_decode( wp_remote_retrieve_body( $response ), true );

	if ( 200 !== $response_code || ! is_array( $body ) || empty( $body['access_token'] ) ) {
		return new WP_Error(
			'awhitepen_strava_token_invalid_response',
			__( 'Strava returned an invalid access token response.', 'awhitepen' ),
			array(
				'status' => $response_code,
				'body'   => $body,
			)
		);
	}

	if ( ! empty( $body['refresh_token'] ) && is_string( $body['refresh_token'] ) ) {
		awhitepen_store_strava_refresh_token( $body['refresh_token'] );
	}

	return $body;
}

function awhitepen_get_strava_access_token() {
	$cached_access_token = get_transient( 'awhitepen_strava_access_token' );

	if ( is_string( $cached_access_token ) && '' !== trim( $cached_access_token ) ) {
		return trim( $cached_access_token );
	}

	$credentials = awhitepen_get_strava_credentials();

	if ( is_wp_error( $credentials ) ) {
		return $credentials;
	}

	$token_response = null;
	$last_error     = null;

	foreach ( $credentials['refresh_token_candidates'] as $refresh_token_candidate ) {
		$token_response = awhitepen_request_strava_access_token( $credentials, $refresh_token_candidate );

		if ( ! is_wp_error( $token_response ) ) {
			break;
		}

		$last_error = $token_response;
	}

	if ( is_wp_error( $token_response ) ) {
		return $last_error ? $last_error : $token_response;
	}

	$access_token = trim( (string) $token_response['access_token'] );
	$expires_at   = isset( $token_response['expires_at'] ) ? (int) $token_response['expires_at'] : 0;
	$cache_ttl    = HOUR_IN_SECONDS;

	if ( $expires_at > time() ) {
		$cache_ttl = max( MINUTE_IN_SECONDS, $expires_at - time() - ( 5 * MINUTE_IN_SECONDS ) );
	}

	set_transient( 'awhitepen_strava_access_token', $access_token, $cache_ttl );

	return $access_token;
}

function awhitepen_format_strava_activity_type( $activity_type ) {
	$activity_type = is_string( $activity_type ) ? trim( $activity_type ) : '';

	if ( '' === $activity_type ) {
		return __( 'Activity', 'awhitepen' );
	}

	$activity_type = str_replace( '_', ' ', $activity_type );
	$activity_type = preg_replace( '/(?<!^)([A-Z])/', ' $1', $activity_type );

	return trim( (string) $activity_type );
}

function awhitepen_is_strava_strength_activity( $activity_type ) {
	$activity_type = is_string( $activity_type ) ? strtolower( trim( $activity_type ) ) : '';

	if ( '' === $activity_type ) {
		return false;
	}

	$normalized_type = preg_replace( '/[^a-z]/', '', $activity_type );

	return in_array( $normalized_type, array( 'weighttraining', 'strengthtraining' ), true );
}

function awhitepen_format_strava_distance( $distance_metres ) {
	$distance_kilometres = max( 0, (float) $distance_metres ) / 1000;

	return sprintf(
		/* translators: %s: distance in kilometres. */
		__( '%s km', 'awhitepen' ),
		number_format_i18n( $distance_kilometres, 1 )
	);
}

function awhitepen_format_strava_moving_time( $moving_time_seconds ) {
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

function awhitepen_format_strava_activity_timestamp( $activity ) {
	if ( ! is_array( $activity ) ) {
		return '';
	}

	$date_string = '';

	if ( ! empty( $activity['start_date_local'] ) && is_string( $activity['start_date_local'] ) ) {
		$date_string = trim( $activity['start_date_local'] );
	} elseif ( ! empty( $activity['start_date'] ) && is_string( $activity['start_date'] ) ) {
		$date_string = trim( $activity['start_date'] );
	}

	if ( '' === $date_string ) {
		return '';
	}

	try {
		$date = new DateTimeImmutable( $date_string );
	} catch ( Exception $exception ) {
		return '';
	}

	$date_label = wp_date( 'M j', $date->getTimestamp(), $date->getTimezone() );
	$time_label = strtolower( wp_date( 'g:i a', $date->getTimestamp(), $date->getTimezone() ) );

	return sprintf(
		/* translators: 1: activity date, 2: activity time. */
		__( '%1$s at %2$s', 'awhitepen' ),
		$date_label,
		$time_label
	);
}

function awhitepen_get_strava_activity_detail_items( $activity ) {
	if ( ! is_array( $activity ) ) {
		return array();
	}

	$activity_type = ! empty( $activity['sport_type'] ) ? $activity['sport_type'] : ( ! empty( $activity['type'] ) ? $activity['type'] : '' );
	$detail_items  = array(
		awhitepen_format_strava_activity_type( $activity_type ),
	);

	if ( ! awhitepen_is_strava_strength_activity( $activity_type ) ) {
		$detail_items[] = awhitepen_format_strava_distance( isset( $activity['distance'] ) ? $activity['distance'] : 0 );
	}

	$detail_items[] = awhitepen_format_strava_moving_time( isset( $activity['moving_time'] ) ? $activity['moving_time'] : 0 );

	return array_values( array_filter( $detail_items ) );
}

function awhitepen_strava_api_get_json( $path, $access_token = '', $allow_retry = true ) {
	$access_token = is_string( $access_token ) ? trim( $access_token ) : '';

	if ( '' === $access_token ) {
		$access_token = awhitepen_get_strava_access_token();

		if ( is_wp_error( $access_token ) ) {
			return $access_token;
		}
	}

	$response = wp_remote_get(
		'https://www.strava.com' . $path,
		array(
			'timeout' => 15,
			'headers' => array(
				'Authorization' => 'Bearer ' . $access_token,
				'Accept'        => 'application/json',
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		return new WP_Error(
			'awhitepen_strava_request_failed',
			__( 'Unable to load data from Strava.', 'awhitepen' ),
			$response->get_error_message()
		);
	}

	$response_code = (int) wp_remote_retrieve_response_code( $response );
	$body          = json_decode( wp_remote_retrieve_body( $response ), true );

	if ( 401 === $response_code && $allow_retry ) {
		delete_transient( 'awhitepen_strava_access_token' );

		return awhitepen_strava_api_get_json( $path, '', false );
	}

	if ( 200 !== $response_code ) {
		return new WP_Error(
			'awhitepen_strava_invalid_response',
			__( 'Strava returned an invalid response.', 'awhitepen' ),
			array(
				'status' => $response_code,
				'body'   => $body,
			)
		);
	}

	return array(
		'status' => $response_code,
		'body'   => $body,
	);
}

function awhitepen_extract_strava_activity_media_url( $activity ) {
	if ( ! is_array( $activity ) || empty( $activity['photos'] ) || ! is_array( $activity['photos'] ) ) {
		return '';
	}

	$primary = isset( $activity['photos']['primary'] ) && is_array( $activity['photos']['primary'] ) ? $activity['photos']['primary'] : array();

	if ( empty( $primary ) ) {
		return '';
	}

	if ( ! empty( $primary['urls'] ) ) {
		$urls = $primary['urls'];

		if ( is_string( $urls ) && '' !== trim( $urls ) ) {
			return trim( $urls );
		}

		if ( is_array( $urls ) ) {
			foreach ( array( '600', '300', '100', '2800', '0', 'default' ) as $preferred_key ) {
				if ( ! empty( $urls[ $preferred_key ] ) && is_string( $urls[ $preferred_key ] ) ) {
					return trim( $urls[ $preferred_key ] );
				}
			}

			foreach ( $urls as $candidate ) {
				if ( is_string( $candidate ) && '' !== trim( $candidate ) ) {
					return trim( $candidate );
				}
			}
		}
	}

	if ( ! empty( $primary['url'] ) && is_string( $primary['url'] ) ) {
		return trim( $primary['url'] );
	}

	return '';
}

function awhitepen_get_strava_activity_media_url( $activity, $access_token ) {
	$media_url = awhitepen_extract_strava_activity_media_url( $activity );

	if ( '' !== $media_url ) {
		return $media_url;
	}

	if (
		! is_array( $activity ) ||
		empty( $activity['id'] ) ||
		( empty( $activity['photo_count'] ) && empty( $activity['total_photo_count'] ) )
	) {
		return '';
	}

	$detail_response = awhitepen_strava_api_get_json( '/api/v3/activities/' . absint( $activity['id'] ), $access_token );

	if ( is_wp_error( $detail_response ) || empty( $detail_response['body'] ) || ! is_array( $detail_response['body'] ) ) {
		return '';
	}

	return awhitepen_extract_strava_activity_media_url( $detail_response['body'] );
}

function awhitepen_build_strava_footer_activity_item( $activity, $access_token ) {
	if ( ! is_array( $activity ) || empty( $activity['id'] ) ) {
		return array();
	}

	$activity_title = ! empty( $activity['name'] ) ? wp_strip_all_tags( (string) $activity['name'], true ) : __( 'Recent activity', 'awhitepen' );

	return array(
		'title'        => $activity_title,
		'detail_items' => awhitepen_get_strava_activity_detail_items( $activity ),
		'timestamp'    => awhitepen_format_strava_activity_timestamp( $activity ),
		'url'          => 'https://www.strava.com/activities/' . absint( $activity['id'] ),
		'media_url'    => awhitepen_get_strava_activity_media_url( $activity, $access_token ),
	);
}

function awhitepen_build_strava_footer_activity_data() {
	$credentials = awhitepen_get_strava_credentials();
	$eyebrow     = __( 'Strava', 'awhitepen' );

	if ( is_wp_error( $credentials ) ) {
		return awhitepen_footer_module_state_payload(
			array(
				'state'   => 'missing_credentials',
				'eyebrow' => $eyebrow,
				'title'   => __( 'Latest activity data will appear here once Strava is connected.', 'awhitepen' ),
				'meta'    => __( 'Add the Strava constants in wp-config.php to enable this module.', 'awhitepen' ),
			)
		);
	}

	$access_token = awhitepen_get_strava_access_token();

	if ( is_wp_error( $access_token ) ) {
		return awhitepen_footer_module_state_payload(
			array(
				'state'   => 'unavailable',
				'eyebrow' => $eyebrow,
				'title'   => __( 'The latest Strava activities could not be loaded just now.', 'awhitepen' ),
				'meta'    => __( 'Please try again shortly.', 'awhitepen' ),
			)
		);
	}

	$activity_response = awhitepen_strava_api_get_json( '/api/v3/athlete/activities?per_page=5&page=1', $access_token );

	if ( is_wp_error( $activity_response ) || empty( $activity_response['body'] ) || ! is_array( $activity_response['body'] ) ) {
		return awhitepen_footer_module_state_payload(
			array(
				'state'   => 'unavailable',
				'eyebrow' => $eyebrow,
				'title'   => __( 'The latest Strava activities could not be loaded just now.', 'awhitepen' ),
				'meta'    => __( 'Please try again shortly.', 'awhitepen' ),
			)
		);
	}

	$activities         = array_values( array_slice( $activity_response['body'], 0, 5 ) );
	$footer_activities  = array();

	foreach ( $activities as $activity ) {
		$footer_activity = awhitepen_build_strava_footer_activity_item( $activity, $access_token );

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
		'eyebrow'     => __( 'Strava', 'awhitepen' ),
		'activities'  => $footer_activities,
		'profile_url' => ! empty( $activities[0]['athlete']['id'] ) ? 'https://www.strava.com/athletes/' . absint( $activities[0]['athlete']['id'] ) : '',
	);
}

function awhitepen_get_footer_strava_activity() {
	$cache_key       = 'awhitepen_footer_strava_feed_v3';
	$cached_activity = get_transient( $cache_key );

	if (
		is_array( $cached_activity ) &&
		! empty( $cached_activity['state'] ) &&
		( 'ready' !== $cached_activity['state'] || ! empty( $cached_activity['activities'] ) )
	) {
		return $cached_activity;
	}

	$activity  = awhitepen_build_strava_footer_activity_data();
	$cache_ttl = 'ready' === $activity['state'] ? 15 * MINUTE_IN_SECONDS : 5 * MINUTE_IN_SECONDS;

	set_transient( $cache_key, $activity, $cache_ttl );

	return $activity;
}

function awhitepen_render_footer_strava_module() {
	$strava_activity = awhitepen_get_footer_strava_activity();
	$module_classes  = array( 'footer-embed-card__module', 'footer-embed-card__module--strava' );

	if ( 'ready' !== $strava_activity['state'] ) {
		$module_classes[] = 'footer-embed-card__module--placeholder';
	}
	?>
	<div class="<?php echo esc_attr( implode( ' ', $module_classes ) ); ?>" data-module="strava-latest-activity">
		<?php awhitepen_render_footer_module_eyebrow( $strava_activity['eyebrow'], ! empty( $strava_activity['profile_url'] ) ? $strava_activity['profile_url'] : '' ); ?>

		<?php if ( 'ready' === $strava_activity['state'] && ! empty( $strava_activity['activities'] ) ) : ?>
			<div class="footer-strava-list">
				<?php foreach ( $strava_activity['activities'] as $index => $activity ) : ?>
					<?php
					$item_classes    = array( 'footer-strava-item' );
					$activity_label  = sprintf(
						/* translators: %s: activity title. */
						__( 'View %s on Strava', 'awhitepen' ),
						$activity['title']
					);
					$has_media       = ! empty( $activity['media_url'] );
					$is_media_right  = 1 === ( $index % 2 );

					$item_classes[] = 'footer-strava-item--with-slot';

					if ( $is_media_right ) {
						$item_classes[] = 'footer-strava-item--media-right';
					}
					?>
						<a class="<?php echo esc_attr( implode( ' ', $item_classes ) ); ?>" href="<?php echo esc_url( $activity['url'] ); ?>" aria-label="<?php echo esc_attr( $activity_label ); ?>" target="_blank" rel="noopener noreferrer">
						<span class="footer-strava-item__media<?php echo ! $has_media ? ' footer-strava-item__media--empty' : ''; ?>" aria-hidden="true">
							<?php if ( $has_media ) : ?>
								<img class="footer-strava-item__image" src="<?php echo esc_url( $activity['media_url'] ); ?>" alt="" loading="lazy" decoding="async">
							<?php endif; ?>
						</span>

						<span class="footer-strava-item__content">
							<span class="footer-embed-card__body footer-embed-card__body--compact footer-strava-item__title"><?php echo esc_html( $activity['title'] ); ?></span>
							<?php if ( ! empty( $activity['detail_items'] ) ) : ?>
								<span class="footer-embed-card__details footer-strava-item__details">
									<?php foreach ( $activity['detail_items'] as $detail_index => $detail_item ) : ?>
										<?php if ( $detail_index > 0 ) : ?>
											<span aria-hidden="true">&middot;</span>
										<?php endif; ?>
										<span><?php echo esc_html( $detail_item ); ?></span>
									<?php endforeach; ?>
								</span>
							<?php endif; ?>
							<?php if ( ! empty( $activity['timestamp'] ) ) : ?>
								<span class="footer-strava-item__timestamp"><?php echo esc_html( $activity['timestamp'] ); ?></span>
							<?php endif; ?>
						</span>
					</a>
				<?php endforeach; ?>
			</div>
		<?php elseif ( ! empty( $strava_activity['meta'] ) ) : ?>
			<p class="footer-embed-card__body footer-embed-card__activity-title"><?php echo esc_html( $strava_activity['title'] ); ?></p>
			<p class="footer-embed-card__meta"><?php echo esc_html( $strava_activity['meta'] ); ?></p>
		<?php elseif ( ! empty( $strava_activity['title'] ) ) : ?>
			<p class="footer-embed-card__body footer-embed-card__activity-title"><?php echo esc_html( $strava_activity['title'] ); ?></p>
		<?php endif; ?>
	</div>
	<?php
}

function awhitepen_get_instagram_footer_config() {
	$config = array(
		'user_id'      => defined( 'INSTAGRAM_USER_ID' ) ? trim( (string) INSTAGRAM_USER_ID ) : '',
		'access_token' => defined( 'INSTAGRAM_ACCESS_TOKEN' ) ? trim( (string) INSTAGRAM_ACCESS_TOKEN ) : '',
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
		'portfolio' => array(
			'eyebrow' => __( 'Portfolio', 'awhitepen' ),
			'intro'   => __( 'Selected work, case studies, and public-facing projects collected in one quiet place.', 'awhitepen' ),
		),
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

function awhitepen_body_classes( $classes ) {
	if ( is_singular() ) {
		$classes[] = 'is-singular';
	} else {
		$classes[] = 'is-archive-view';
	}

	if ( is_front_page() ) {
		$classes[] = 'is-front-page';
	}

	if ( is_home() ) {
		$classes[] = 'is-home-view';
	}

	if ( is_search() ) {
		$classes[] = 'is-search-view';
	}

	return $classes;
}
add_filter( 'body_class', 'awhitepen_body_classes' );

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

function awhitepen_get_stream_excerpt( $post = null, $word_limit = 40 ) {
	$post = get_post( $post );

	if ( ! $post instanceof WP_Post ) {
		return '';
	}

	$word_limit = max( 1, (int) $word_limit );
	$excerpt    = has_excerpt( $post ) ? $post->post_excerpt : $post->post_content;

	$excerpt = strip_shortcodes( $excerpt );

	if ( function_exists( 'excerpt_remove_blocks' ) ) {
		$excerpt = excerpt_remove_blocks( $excerpt );
	}

	$excerpt = wp_strip_all_tags( $excerpt, true );
	$excerpt = trim( preg_replace( '/\s+/', ' ', $excerpt ) );

	if ( '' === $excerpt ) {
		return '';
	}

	return wp_trim_words( $excerpt, $word_limit, '…' );
}

function awhitepen_get_stream_story_classes( $story_index ) {
	$classes = array( 'story-card', 'story-card--notebook' );

	if ( 0 === (int) $story_index ) {
		$classes[] = 'story-card--featured';
	} elseif ( (int) $story_index < 3 ) {
		$classes[] = 'story-card--medium';
	} else {
		$classes[] = 'story-card--compact';
	}

	return $classes;
}

function awhitepen_get_stream_excerpt_words( $story_index ) {
	if ( 0 === (int) $story_index ) {
		return 88;
	}

	if ( (int) $story_index < 3 ) {
		return 50;
	}

	return 22;
}

function awhitepen_render_notebook_stream( $query = null ) {
	global $wp_query;

	if ( ! $query instanceof WP_Query ) {
		$query = $wp_query;
	}

	if ( ! $query instanceof WP_Query || ! $query->have_posts() ) {
		return;
	}

	$story_index = 0;
	?>
	<div class="story-list story-list--notebook">
		<?php
		while ( $query->have_posts() ) :
			$query->the_post();
			$category_meta_html = awhitepen_get_post_category_meta_html( get_post() );
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class( awhitepen_get_stream_story_classes( $story_index ) ); ?>>
				<p class="story-card__meta">
					<span><?php echo esc_html( get_the_date() ); ?></span>
					<?php if ( $category_meta_html ) : ?>
						<span><?php echo wp_kses_post( $category_meta_html ); ?></span>
					<?php endif; ?>
				</p>
				<h2 class="story-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
				<div class="story-card__excerpt">
					<p><?php echo esc_html( awhitepen_get_stream_excerpt( get_post(), awhitepen_get_stream_excerpt_words( $story_index ) ) ); ?></p>
				</div>
				<p class="story-card__cta"><a class="text-link" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Continue reading', 'awhitepen' ); ?></a></p>
			</article>
			<?php
			++$story_index;
		endwhile;
		?>
	</div>
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
		<p class="archive-dek"><?php esc_html_e( 'A running stream of thoughts, observations, and learnings. Opinions subject to potential updates. Persuasive counterarguments welcome.', 'awhitepen' ); ?></p>
	</header>
	<?php
}

function awhitepen_category_archive_query( $query ) {
	if ( is_admin() || ! $query->is_main_query() || ! $query->is_category() ) {
		return;
	}

	$query->set( 'posts_per_page', 8 );
	$query->set( 'ignore_sticky_posts', true );
	$query->set( 'orderby', 'date' );
	$query->set( 'order', 'DESC' );
}
add_action( 'pre_get_posts', 'awhitepen_category_archive_query' );

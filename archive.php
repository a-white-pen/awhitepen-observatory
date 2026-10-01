<?php
/**
 * Archive template.
 *
 * @package AWhitePen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Loaded through WordPress, never on its own.
}

get_header();

// Categories have their own template; this covers tags, dates and authors.
$archive_eyebrow = is_tag() ? __( 'Tag', 'awhitepen' ) : __( 'Archive', 'awhitepen' );
?>

<main id="p-list" class="site-main">
	<div class="site-shell">
		<header class="archive-hero">
			<p class="page__eyebrow"><?php echo esc_html( $archive_eyebrow ); ?></p>
			<h1 class="page-title"><?php the_archive_title(); ?></h1>
			<?php the_archive_description( '<div class="archive-dek">', '</div>' ); ?>
		</header>

		<?php awhitepen_render_notebook_stream(); ?>

		<?php awhitepen_render_stream_browse_section(); ?>
	</div>
</main>

<?php
get_footer();

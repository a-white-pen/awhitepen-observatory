<?php
/**
 * Category archive template.
 *
 * @package AWhitePen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Loaded through WordPress, never on its own.
}

get_header();

$category_description = category_description();
?>

<main id="p-list" class="site-main">
	<div class="site-shell">
		<header class="archive-hero">
			<p class="page__eyebrow"><?php esc_html_e( 'Category', 'awhitepen' ); ?></p>
			<h1 class="page-title"><?php echo esc_html( single_cat_title( '', false ) ); ?></h1>
			<?php if ( '' !== trim( wp_strip_all_tags( $category_description ) ) ) : ?>
				<div class="archive-dek"><?php echo wp_kses_post( $category_description ); ?></div>
			<?php endif; ?>
		</header>

		<?php awhitepen_render_notebook_stream(); ?>

		<?php awhitepen_render_stream_browse_section(); ?>
	</div>
</main>

<?php
get_footer();

<?php
/**
 * Category archive template.
 *
 * @package AWhitePen
 */

get_header();

$category_description = category_description();
?>

<main id="primary" class="site-main">
	<div class="site-shell">
		<div class="content-column">
			<header class="archive-hero archive-hero--home">
				<h1 class="page-title"><?php echo esc_html( single_cat_title( '', false ) ); ?></h1>
				<?php if ( '' !== trim( wp_strip_all_tags( $category_description ) ) ) : ?>
					<div class="archive-dek"><?php echo wp_kses_post( $category_description ); ?></div>
				<?php endif; ?>
			</header>

			<?php if ( have_posts() ) : ?>
				<?php awhitepen_render_notebook_stream(); ?>
			<?php else : ?>
				<section class="empty-state">
					<h2><?php esc_html_e( 'Nothing here yet', 'awhitepen' ); ?></h2>
					<p><?php esc_html_e( 'Try another section, or return to the broader post stream.', 'awhitepen' ); ?></p>
				</section>
			<?php endif; ?>

			<?php awhitepen_render_stream_browse_section(); ?>

			<?php the_posts_navigation(); ?>
		</div>
	</div>
</main>

<?php
get_footer();

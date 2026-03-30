<?php
/**
 * Home template.
 *
 * @package AWhitePen
 */

get_header();
?>

<main id="primary" class="site-main">
	<div class="site-shell">
		<div class="content-column">
			<?php awhitepen_render_notebook_header( __( 'Blog', 'awhitepen' ) ); ?>

			<?php awhitepen_render_blog_section_nav(); ?>

			<?php if ( have_posts() ) : ?>
				<?php awhitepen_render_notebook_stream(); ?>
				<?php the_posts_navigation(); ?>
			<?php else : ?>
				<section class="empty-state">
					<h2><?php esc_html_e( 'No posts yet', 'awhitepen' ); ?></h2>
					<p><?php esc_html_e( 'Once posts are published, this page becomes the primary editorial archive.', 'awhitepen' ); ?></p>
				</section>
			<?php endif; ?>
		</div>
	</div>
</main>

<?php
get_footer();

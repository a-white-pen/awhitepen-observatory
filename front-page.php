<?php
/**
 * Front page template.
 *
 * @package AWhitePen
 */

get_header();

$recent_posts   = new WP_Query(
	array(
		'posts_per_page'      => 8,
		'ignore_sticky_posts' => true,
	)
);
?>

<main id="primary" class="site-main">
	<div class="site-shell">
		<div class="content-column">
			<?php awhitepen_render_notebook_header(); ?>

			<?php if ( $recent_posts->have_posts() ) : ?>
				<?php awhitepen_render_notebook_stream( $recent_posts ); ?>
				<?php wp_reset_postdata(); ?>
			<?php else : ?>
				<section class="empty-state">
					<h2><?php esc_html_e( 'No posts yet', 'awhitepen' ); ?></h2>
					<p><?php esc_html_e( 'Publish the first few entries and the homepage will turn into a live notebook of current writing.', 'awhitepen' ); ?></p>
				</section>
			<?php endif; ?>

			<?php awhitepen_render_stream_browse_section(); ?>
		</div>
	</div>
</main>

<?php
get_footer();

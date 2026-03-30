<?php
/**
 * Main index template.
 *
 * @package AWhitePen
 */

get_header();
?>

<main id="primary" class="site-main">
	<div class="site-shell">
		<div class="content-column">
			<header class="archive-hero">
				<p class="section-kicker"><?php esc_html_e( 'Latest writing', 'awhitepen' ); ?></p>
				<h1 class="page-title"><?php bloginfo( 'name' ); ?></h1>
				<p class="archive-dek"><?php bloginfo( 'description' ); ?></p>
			</header>

			<?php awhitepen_render_blog_section_nav(); ?>

			<?php if ( have_posts() ) : ?>
				<?php awhitepen_render_notebook_stream(); ?>
				<?php the_posts_navigation(); ?>
			<?php else : ?>
				<section class="empty-state">
					<h2><?php esc_html_e( 'No posts yet', 'awhitepen' ); ?></h2>
					<p><?php esc_html_e( 'Start publishing and the story stream will begin to populate here.', 'awhitepen' ); ?></p>
				</section>
			<?php endif; ?>
		</div>
	</div>
</main>

<?php
get_footer();

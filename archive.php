<?php
/**
 * Archive template.
 *
 * @package AWhitePen
 */

get_header();

$archive_eyebrow = __( 'Archive', 'awhitepen' );

if ( is_category() ) {
	$archive_eyebrow = __( 'Category', 'awhitepen' );
} elseif ( is_tag() ) {
	$archive_eyebrow = __( 'Tag', 'awhitepen' );
}
?>

<main id="primary" class="site-main">
	<div class="site-shell">
		<div class="content-column">
			<header class="archive-hero">
				<p class="section-kicker"><?php echo esc_html( $archive_eyebrow ); ?></p>
				<h1 class="page-title"><?php the_archive_title(); ?></h1>
				<?php the_archive_description( '<div class="archive-dek">', '</div>' ); ?>
			</header>

			<?php awhitepen_render_blog_section_nav(); ?>

			<?php if ( have_posts() ) : ?>
				<?php awhitepen_render_notebook_stream(); ?>
				<?php the_posts_navigation(); ?>
			<?php else : ?>
				<section class="empty-state">
					<h2><?php esc_html_e( 'Nothing found', 'awhitepen' ); ?></h2>
					<p><?php esc_html_e( 'Try a different archive, or return to the main blog stream.', 'awhitepen' ); ?></p>
				</section>
			<?php endif; ?>
		</div>
	</div>
</main>

<?php
get_footer();

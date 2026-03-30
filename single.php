<?php
/**
 * Single post template.
 *
 * @package AWhitePen
 */

get_header();
?>

<main id="primary" class="site-main">
	<div class="site-shell">
		<?php
		while ( have_posts() ) :
			the_post();
			$category_meta_html = awhitepen_get_post_category_meta_html( get_post() );
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'story-entry' ); ?>>
				<header class="content-column entry-hero entry-hero--single">
					<p class="section-kicker"><?php esc_html_e( 'Blog', 'awhitepen' ); ?></p>
					<h1 class="entry-title"><?php the_title(); ?></h1>

					<?php if ( has_excerpt() ) : ?>
						<p class="entry-dek"><?php echo esc_html( get_the_excerpt() ); ?></p>
					<?php endif; ?>

					<p class="entry-meta">
						<span><?php echo esc_html( get_the_date() ); ?></span>
						<?php if ( $category_meta_html ) : ?>
							<span><?php echo wp_kses_post( $category_meta_html ); ?></span>
						<?php endif; ?>
					</p>
				</header>

				<?php if ( has_post_thumbnail() ) : ?>
					<figure class="content-column entry-thumbnail">
						<?php the_post_thumbnail( 'large' ); ?>
					</figure>
				<?php endif; ?>

				<div class="content-column entry-content">
					<?php
					the_content();

					wp_link_pages(
						array(
							'before' => '<nav class="page-links" aria-label="' . esc_attr__( 'Page', 'awhitepen' ) . '">',
							'after'  => '</nav>',
						)
					);
					?>
				</div>

				<?php
				$post_tags = get_the_tag_list( '<p class="post-tags">', ' ', '</p>' );

				if ( $post_tags ) :
					?>
					<footer class="content-column entry-footer">
						<?php echo wp_kses_post( $post_tags ); ?>
					</footer>
				<?php endif; ?>

				<div class="content-column">
					<?php awhitepen_render_stream_browse_section(); ?>
				</div>

				<footer class="content-column entry-footer">
					<?php
					the_post_navigation(
						array(
							'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous', 'awhitepen' ) . '</span><span class="nav-title">%title</span>',
							'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next', 'awhitepen' ) . '</span><span class="nav-title">%title</span>',
						)
					);
					?>
				</footer>
			</article>
		<?php endwhile; ?>
	</div>
</main>

<?php
get_footer();

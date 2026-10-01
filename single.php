<?php
/**
 * Single post template.
 *
 * @package AWhitePen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Loaded through WordPress, never on its own.
}

get_header();
?>

<main class="site-main">
	<div class="site-shell">
		<?php
		while ( have_posts() ) :
			the_post();

			$category_meta_html = awhitepen_get_post_category_meta_html( get_post() );
			$previous_post      = get_previous_post();
			$next_post          = get_next_post();
			?>
			<article class="post">
				<a class="text-link post__crumb" href="<?php echo esc_url( awhitepen_posts_page_url() ); ?>"><?php esc_html_e( 'Blog', 'awhitepen' ); ?></a>

				<p class="post__meta">
					<time datetime="<?php echo esc_attr( get_the_date( 'Y-m-d' ) ); ?>"><?php echo esc_html( get_the_date( 'F j, Y' ) ); ?></time>
					<?php echo wp_kses_post( $category_meta_html ); ?>
				</p>

				<h1 class="post__title"><?php the_title(); ?></h1>

				<div class="entry">
					<?php the_content(); ?>
				</div>

				<?php if ( $previous_post || $next_post ) : ?>
					<nav class="post-nav" aria-label="<?php esc_attr_e( 'Post navigation', 'awhitepen' ); ?>">
						<?php if ( $previous_post ) : ?>
							<a class="post-nav__prev" href="<?php echo esc_url( get_permalink( $previous_post ) ); ?>">
								<span class="post-nav__k">&larr; <?php esc_html_e( 'Previous', 'awhitepen' ); ?></span>
								<span class="post-nav__t"><?php echo esc_html( get_the_title( $previous_post ) ); ?></span>
							</a>
						<?php endif; ?>
						<?php if ( $next_post ) : ?>
							<a class="post-nav__next" href="<?php echo esc_url( get_permalink( $next_post ) ); ?>">
								<span class="post-nav__k"><?php esc_html_e( 'Next', 'awhitepen' ); ?> &rarr;</span>
								<span class="post-nav__t"><?php echo esc_html( get_the_title( $next_post ) ); ?></span>
							</a>
						<?php endif; ?>
					</nav>
				<?php endif; ?>
			</article>
		<?php endwhile; ?>
	</div>
</main>

<?php
get_footer();

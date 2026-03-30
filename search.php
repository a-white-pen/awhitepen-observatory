<?php
/**
 * Search results template.
 *
 * @package AWhitePen
 */

get_header();

global $wp_query;
?>

<main id="primary" class="site-main">
	<div class="site-shell">
		<div class="content-column">
			<header class="archive-hero">
				<p class="section-kicker"><?php esc_html_e( 'Search', 'awhitepen' ); ?></p>
				<h1 class="page-title">
					<?php
					printf(
						/* translators: %s: search query. */
						esc_html__( 'Results for “%s”', 'awhitepen' ),
						esc_html( get_search_query() )
					);
					?>
				</h1>
				<p class="archive-dek">
					<?php
					printf(
						/* translators: %d: result count. */
						esc_html( _n( '%d result found across posts and pages.', '%d results found across posts and pages.', (int) $wp_query->found_posts, 'awhitepen' ) ),
						(int) $wp_query->found_posts
					);
					?>
				</p>
			</header>

			<div class="search-block">
				<?php get_search_form(); ?>
			</div>

			<?php if ( have_posts() ) : ?>
				<div class="story-list">
					<?php
					while ( have_posts() ) :
						the_post();

						$post_type_object = get_post_type_object( get_post_type() );
						$post_type_label  = $post_type_object ? $post_type_object->labels->singular_name : __( 'Entry', 'awhitepen' );
						?>
						<article id="post-<?php the_ID(); ?>" <?php post_class( 'story-card' ); ?>>
							<p class="story-card__meta">
								<span><?php echo esc_html( $post_type_label ); ?></span>
								<span><?php echo esc_html( get_the_date() ); ?></span>
							</p>
							<h2 class="story-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
							<div class="story-card__excerpt"><?php the_excerpt(); ?></div>
							<p class="story-card__cta"><a class="text-link" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Continue reading', 'awhitepen' ); ?></a></p>
						</article>
					<?php endwhile; ?>
				</div>

				<?php the_posts_navigation(); ?>
			<?php else : ?>
				<section class="empty-state">
					<h2><?php esc_html_e( 'No results matched that search.', 'awhitepen' ); ?></h2>
					<p><?php esc_html_e( 'Try a broader phrase, or move through the main blog sections instead.', 'awhitepen' ); ?></p>
				</section>
				<?php awhitepen_render_blog_section_nav(); ?>
			<?php endif; ?>
		</div>
	</div>
</main>

<?php
get_footer();

<?php
/**
 * Search results template.
 *
 * @package AWhitePen
 */

get_header();

global $wp_query;
?>

<main id="p-list" class="site-main">
	<div class="site-shell">
		<header class="archive-hero">
			<p class="page__eyebrow"><?php esc_html_e( 'Search', 'awhitepen' ); ?></p>
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
				$found = (int) $wp_query->found_posts;

				if ( 0 === $found ) {
					esc_html_e( 'No posts match.', 'awhitepen' );
				} else {
					printf(
						/* translators: %d: result count. */
						esc_html( _n( '%d result found across posts and pages.', '%d results found across posts and pages.', $found, 'awhitepen' ) ),
						$found
					);
				}
				?>
			</p>

			<form role="search" method="get" class="search-form search-form--page list-search" action="<?php echo esc_url( home_url( '/' ) ); ?>">
				<label class="screen-reader-text" for="search-field-page"><?php esc_html_e( 'Search for:', 'awhitepen' ); ?></label>
				<div class="search-form__inner">
					<input id="search-field-page" type="search" class="search-field" placeholder="<?php esc_attr_e( 'Search the blog', 'awhitepen' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s">
					<button type="submit" class="search-submit" aria-label="<?php esc_attr_e( 'Submit search', 'awhitepen' ); ?>">
						<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16L21 21"></path></svg>
					</button>
				</div>
			</form>
		</header>

		<?php if ( have_posts() ) : ?>
			<div class="story-list">
				<?php
				while ( have_posts() ) :
					the_post();

					$post_type_object = get_post_type_object( get_post_type() );
					$post_type_label  = $post_type_object ? $post_type_object->labels->singular_name : __( 'Entry', 'awhitepen' );
					?>
					<article id="post-<?php the_ID(); ?>" class="story-card">
						<p class="story-card__meta">
							<span><?php echo esc_html( $post_type_label ); ?></span>
							<span><?php echo esc_html( get_the_date( 'M j, Y' ) ); ?></span>
						</p>
						<h2 class="story-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
						<div class="story-card__excerpt"><?php the_excerpt(); ?></div>
						<p class="story-card__cta"><a class="text-link" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Continue reading', 'awhitepen' ); ?></a></p>
					</article>
				<?php endwhile; ?>
			</div>

			<nav class="blog-pager" aria-label="<?php esc_attr_e( 'Result pages', 'awhitepen' ); ?>" hidden>
				<button type="button" class="text-link" data-pg="-1">&larr; <?php esc_html_e( 'Previous', 'awhitepen' ); ?></button>
				<span class="blog-pager__n"></span>
				<button type="button" class="text-link" data-pg="1"><?php esc_html_e( 'Next', 'awhitepen' ); ?> &rarr;</button>
			</nav>

		<?php else : ?>
			<p class="story-empty">
				<?php
				printf(
					/* translators: %s: search query. */
					esc_html__( 'Nothing here matches “%s” yet. Try a different word, or browse a section below.', 'awhitepen' ),
					esc_html( get_search_query() )
				);
				?>
			</p>
		<?php endif; ?>

		<?php awhitepen_render_stream_browse_section(); ?>
	</div>
</main>

<?php
get_footer();

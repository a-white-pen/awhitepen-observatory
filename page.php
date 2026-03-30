<?php
/**
 * Page template.
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

			$page_context = awhitepen_page_context( get_post() );
			$intro_markup = '';

			if ( ! empty( $page_context['intro_html'] ) ) {
				$intro_markup = wp_kses(
					$page_context['intro_html'],
					array(
						'a' => array(
							'href'   => array(),
							'target' => array(),
							'rel'    => array(),
						),
						'em' => array(),
					)
				);
			} elseif ( ! empty( $page_context['intro'] ) ) {
				$intro_markup = esc_html( $page_context['intro'] );
			}
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'page-entry' ); ?>>
				<header class="content-column entry-hero entry-hero--page">
					<p class="section-kicker"><?php echo esc_html( $page_context['eyebrow'] ); ?></p>
					<h1 class="entry-title"><?php the_title(); ?></h1>
					<?php if ( '' !== $intro_markup ) : ?>
						<p class="entry-dek"><?php echo $intro_markup; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
					<?php endif; ?>
				</header>

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
			</article>
		<?php endwhile; ?>
	</div>
</main>

<?php
get_footer();

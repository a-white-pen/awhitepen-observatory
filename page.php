<?php
/**
 * Page template.
 *
 * @package AWhitePen
 */

get_header();
?>

<main class="site-main">
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
			<article class="page">
				<p class="page__eyebrow"><?php echo esc_html( $page_context['eyebrow'] ); ?></p>
				<h1 class="page-title"><?php the_title(); ?></h1>
				<?php if ( '' !== $intro_markup ) : ?>
					<p class="page__dek"><?php echo $intro_markup; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
				<?php endif; ?>

				<div class="entry">
					<?php the_content(); ?>
				</div>
			</article>
		<?php endwhile; ?>
	</div>
</main>

<?php
get_footer();

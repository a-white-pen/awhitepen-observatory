<?php
/**
 * Footer template.
 *
 * @package AWhitePen
 */

$footer_social_rows = awhitepen_footer_social_rows();
?>
		<footer class="site-footer">
			<div class="site-shell">
				<section class="site-footer__embeds" aria-label="<?php esc_attr_e( 'Embedded updates', 'awhitepen' ); ?>">
					<div class="site-footer__embed-grid">
						<article class="footer-embed-card footer-embed-card--mastodon">
							<h2 class="footer-embed-card__title"><?php esc_html_e( '280 Characters', 'awhitepen' ); ?></h2>
							<div class="footer-embed-card__frame footer-embed-card__frame--module" data-platform="mastodon">
								<?php awhitepen_render_footer_mastodon_module(); ?>
							</div>
						</article>

						<article class="footer-embed-card footer-embed-card--instagram">
							<h2 class="footer-embed-card__title"><?php esc_html_e( 'Curated', 'awhitepen' ); ?></h2>
							<div class="footer-embed-card__frame footer-embed-card__frame--module" data-platform="instagram">
								<?php awhitepen_render_footer_instagram_module(); ?>
							</div>
						</article>

						<article class="footer-embed-card footer-embed-card--strava">
							<h2 class="footer-embed-card__title"><?php esc_html_e( 'Fitness', 'awhitepen' ); ?></h2>
							<div class="footer-embed-card__frame footer-embed-card__frame--module" data-platform="strava">
								<?php awhitepen_render_footer_strava_module(); ?>
							</div>
						</article>
					</div>
				</section>

				<div class="site-footer__grid">
					<nav class="site-footer__socials" aria-label="<?php esc_attr_e( 'Social links', 'awhitepen' ); ?>">
						<?php foreach ( $footer_social_rows as $row ) : ?>
							<ul class="footer-link-row">
								<?php foreach ( $row as $link ) : ?>
									<li>
										<a class="footer-social-link" href="<?php echo esc_url( $link['url'] ); ?>" aria-label="<?php echo esc_attr( $link['label'] ); ?>" target="_blank" rel="noopener noreferrer">
											<?php echo awhitepen_footer_social_icon_svg( $link['label'] ); ?>
										</a>
									</li>
								<?php endforeach; ?>
							</ul>
						<?php endforeach; ?>
						<p class="footer-rss-row">
							<a class="footer-rss-link" href="https://awhitepen.com/feed/" aria-label="<?php esc_attr_e( 'Subscribe via RSS', 'awhitepen' ); ?>" target="_blank" rel="noopener noreferrer">
								<?php echo awhitepen_footer_social_icon_svg( 'RSS' ); ?>
								<span class="footer-rss-label"><?php esc_html_e( 'Subscribe via RSS', 'awhitepen' ); ?></span>
							</a>
						</p>
					</nav>
				</div>

				<div class="site-footer__story">
					<p><?php esc_html_e( 'This WordPress theme was vibe-coded by AWhitePen with support from Codex.', 'awhitepen' ); ?></p>
					<p>
						<?php esc_html_e( 'Read the full build story ', 'awhitepen' ); ?>
						<a href="https://www.awhitepen.com/vibe-coding-with-codex/"><?php esc_html_e( 'here', 'awhitepen' ); ?></a>
					</p>
				</div>

				<div class="site-footer__meta">
					<p><?php esc_html_e( '© 2026 AWhitePen. All rights reserved.', 'awhitepen' ); ?></p>
				</div>
			</div>
		</footer>
	</div>
<?php wp_footer(); ?>
</body>
</html>

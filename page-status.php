<?php
/**
 * Status page template.
 *
 * @package AWhitePen
 */

get_header();
?>

<main id="primary" class="site-main site-main--status">
	<div class="site-shell">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'page-entry page-entry--status' ); ?>>
				<header class="content-column entry-hero entry-hero--page">
					<p class="section-kicker"><?php esc_html_e( 'Status', 'awhitepen' ); ?></p>
					<h1 class="entry-title"><?php the_title(); ?></h1>
				</header>

				<div class="status-widget-shell">
					<iframe
						class="status-widget-frame"
						data-status-widget-frame
						src="<?php echo esc_url( AWHITEPEN_URI . '/assets/status/macros-widget-standalone.html' ); ?>"
						title="<?php esc_attr_e( 'Macros status widget', 'awhitepen' ); ?>"
						loading="eager"
						scrolling="no"
					></iframe>
				</div>
				<script>
					(function () {
						var frame = document.querySelector('[data-status-widget-frame]');

						if (!frame) {
							return;
						}

						function resizeFrame() {
							var doc;
							var body;
							var html;
							var height;

							try {
								doc = frame.contentDocument || frame.contentWindow.document;
							} catch (error) {
								return;
							}

							if (!doc) {
								return;
							}

							body = doc.body;
							html = doc.documentElement;

							if (!body || !html) {
								return;
							}

							height = Math.max(
								body.scrollHeight,
								body.offsetHeight,
								html.clientHeight,
								html.scrollHeight,
								html.offsetHeight
							);

							if (height > 0) {
								frame.style.height = height + 'px';
							}
						}

						function observeFrame() {
							var doc;

							resizeFrame();

							try {
								doc = frame.contentDocument || frame.contentWindow.document;
							} catch (error) {
								return;
							}

							if (!doc || !window.ResizeObserver) {
								return;
							}

							new ResizeObserver(resizeFrame).observe(doc.documentElement);

							if (doc.body) {
								new ResizeObserver(resizeFrame).observe(doc.body);
							}
						}

						frame.addEventListener('load', observeFrame);
						window.addEventListener('resize', resizeFrame);

						setTimeout(observeFrame, 250);
						setTimeout(observeFrame, 1000);
						setTimeout(observeFrame, 2500);
					})();
				</script>
			</article>
		<?php endwhile; ?>
	</div>
</main>

<?php
get_footer();

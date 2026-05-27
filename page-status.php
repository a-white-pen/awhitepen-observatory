<?php
/**
 * Status page template.
 *
 * @package AWhitePen
 */

get_header();

$status_dashboards = array(
	array(
		'slug'        => 'today',
		'label'       => __( 'TODAY', 'awhitepen' ),
		'description' => array( __( 'now', 'awhitepen' ), __( 'current', 'awhitepen' ) ),
		'accent'      => '#2F1608',
	),
	array(
		'slug'        => 'mind',
		'label'       => __( 'MIND', 'awhitepen' ),
		'description' => array( __( 'focus', 'awhitepen' ), __( 'attention', 'awhitepen' ) ),
		'accent'      => '#5B57C8',
	),
	array(
		'slug'        => 'body',
		'label'       => __( 'BODY', 'awhitepen' ),
		'description' => array( __( 'sleep', 'awhitepen' ), __( 'weight', 'awhitepen' ), __( 'move', 'awhitepen' ) ),
		'accent'      => '#B14C66',
	),
	array(
		'slug'        => 'fuel',
		'label'       => __( 'FUEL', 'awhitepen' ),
		'description' => array( __( 'food', 'awhitepen' ), __( 'macros', 'awhitepen' ), __( 'meals', 'awhitepen' ) ),
		'accent'      => '#C35A1E',
	),
	array(
		'slug'        => 'resources',
		'label'       => __( 'RESOURCES', 'awhitepen' ),
		'description' => array( __( 'money', 'awhitepen' ), __( 'spend', 'awhitepen' ) ),
		'accent'      => '#0D7A8C',
	),
);

$default_status_dashboard = 'fuel';
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

				<div class="status-dashboard" data-status-dashboard data-default-tab="<?php echo esc_attr( $default_status_dashboard ); ?>">
					<div class="status-dashboard-nav-shell">
						<nav class="status-dashboard-nav" aria-label="<?php esc_attr_e( 'Status dashboards', 'awhitepen' ); ?>">
							<div class="status-dashboard-nav__scroll" role="tablist">
								<?php foreach ( $status_dashboards as $dashboard ) : ?>
									<?php $is_active = $default_status_dashboard === $dashboard['slug']; ?>
									<a
										id="status-tab-<?php echo esc_attr( $dashboard['slug'] ); ?>"
										class="status-dashboard-tab status-dashboard-tab--<?php echo esc_attr( $dashboard['slug'] ); ?><?php echo $is_active ? ' is-active' : ''; ?>"
										href="#<?php echo esc_attr( $dashboard['slug'] ); ?>"
										role="tab"
										aria-selected="<?php echo $is_active ? 'true' : 'false'; ?>"
										aria-controls="<?php echo esc_attr( $dashboard['slug'] ); ?>"
										data-status-tab="<?php echo esc_attr( $dashboard['slug'] ); ?>"
										style="--status-tab-accent: <?php echo esc_attr( $dashboard['accent'] ); ?>;"
									>
										<span class="status-dashboard-tab__label"><?php echo esc_html( $dashboard['label'] ); ?></span>
										<span class="status-dashboard-tab__description">
											<?php foreach ( $dashboard['description'] as $index => $description ) : ?>
												<?php if ( 0 < $index ) : ?>
													<span class="status-dashboard-tab__dot" aria-hidden="true">&bull;</span>
												<?php endif; ?>
												<span><?php echo esc_html( $description ); ?></span>
											<?php endforeach; ?>
										</span>
									</a>
								<?php endforeach; ?>
							</div>
						</nav>
					</div>

					<?php foreach ( $status_dashboards as $dashboard ) : ?>
						<?php $is_active = $default_status_dashboard === $dashboard['slug']; ?>
						<section
							id="<?php echo esc_attr( $dashboard['slug'] ); ?>"
							class="status-dashboard-panel status-dashboard-panel--<?php echo esc_attr( $dashboard['slug'] ); ?><?php echo $is_active ? ' is-active' : ''; ?>"
							role="tabpanel"
							aria-labelledby="status-tab-<?php echo esc_attr( $dashboard['slug'] ); ?>"
							data-status-panel="<?php echo esc_attr( $dashboard['slug'] ); ?>"
							<?php echo $is_active ? '' : 'hidden'; ?>
						>
							<?php if ( 'fuel' === $dashboard['slug'] ) : ?>
								<div class="status-widget-shell">
									<iframe
										class="status-widget-frame"
										data-status-widget-frame
										src="<?php echo esc_url( AWHITEPEN_URI . '/assets/status/macros-widget-standalone.html' ); ?>"
										title="<?php esc_attr_e( 'Fuel dashboard', 'awhitepen' ); ?>"
										loading="eager"
										scrolling="no"
									></iframe>
								</div>
							<?php else : ?>
								<div class="status-dashboard-placeholder" style="--status-tab-accent: <?php echo esc_attr( $dashboard['accent'] ); ?>;">
									<p class="status-dashboard-placeholder__eyebrow"><?php echo esc_html( $dashboard['label'] ); ?></p>
									<h2 class="status-dashboard-placeholder__title"><?php esc_html_e( 'Coming soon', 'awhitepen' ); ?></h2>
									<p class="status-dashboard-placeholder__text">
										<?php
										printf(
											/* translators: %s: status dashboard label. */
											esc_html__( '%s dashboard is getting its own view.', 'awhitepen' ),
											esc_html( strtolower( $dashboard['label'] ) )
										);
										?>
									</p>
								</div>
							<?php endif; ?>
						</section>
					<?php endforeach; ?>
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

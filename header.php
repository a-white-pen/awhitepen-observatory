<?php
/**
 * Header template.
 *
 * @package AWhitePen
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
	<header class="site-header">
			<div class="site-shell site-header__inner">
				<div class="site-branding">
					<a class="site-branding__logo-link" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" aria-label="<?php esc_attr_e( 'AWhitePen home', 'awhitepen' ); ?>">
						<img
							class="site-branding__logo"
							src="<?php echo esc_url( AWHITEPEN_URI . '/assets/img/site-logo.svg' ); ?>"
							alt="<?php echo esc_attr( awhitepen_brand_name() ); ?>"
							width="420"
							height="84"
							loading="eager"
							decoding="async"
						>
					</a>
				</div>

			<div class="site-header__controls">
				<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation-wrap">
					<span class="menu-toggle__label"><?php esc_html_e( 'Menu', 'awhitepen' ); ?></span>
				</button>

				<div id="site-navigation-wrap" class="site-navigation-wrap">
					<nav id="site-navigation" class="site-navigation" aria-label="<?php esc_attr_e( 'Primary menu', 'awhitepen' ); ?>">
						<?php
						wp_nav_menu(
							array(
								'theme_location' => 'primary',
								'menu_id'        => 'primary-menu',
								'menu_class'     => 'menu primary-menu',
								'container'      => false,
								'depth'          => 1,
								'fallback_cb'    => 'awhitepen_primary_navigation_fallback',
							)
						);
						?>
					</nav>
					<div class="site-header__utility">
						<div class="site-header__search">
							<?php get_search_form( array( 'context' => 'header' ) ); ?>
						</div>
						<button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="<?php esc_attr_e( 'Enable dark mode', 'awhitepen' ); ?>">
							<span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
								<svg viewBox="0 0 24 24" focusable="false">
									<circle cx="12" cy="12" r="4.5"></circle>
									<path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"></path>
								</svg>
							</span>
							<span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
								<svg viewBox="0 0 24 24" focusable="false">
									<path d="M14.5 3.8a8.4 8.4 0 0 0 5.7 13.9a8.8 8.8 0 1 1-5.7-13.9z"></path>
								</svg>
							</span>
							<span class="screen-reader-text theme-toggle__screen-label"><?php esc_html_e( 'Enable dark mode', 'awhitepen' ); ?></span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</header>

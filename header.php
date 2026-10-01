<?php
/**
 * Header template.
 *
 * @package AWhitePen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Loaded through WordPress, never on its own.
}

?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="header">
	<div class="hrow">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" aria-label="<?php echo esc_attr( awhitepen_brand_name() ); ?>">
			<span class="pen">
				<svg viewBox="-150 -300 420 476" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
					<defs>
						<linearGradient id="gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E7CE86"/><stop offset="0.45" stop-color="#C9A24B"/><stop offset="1" stop-color="#A07D2C"/></linearGradient>
						<linearGradient id="sp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDEDF2"/><stop offset="1" stop-color="#A9AAB4"/></linearGradient>
					</defs>
					<g transform="rotate(38 60 176)">
						<rect x="36" y="-244" width="48" height="210" rx="22" fill="var(--accent)"/>
						<rect x="34" y="-66" width="52" height="16" rx="4" fill="url(#gp)" stroke="#A07D2C" stroke-width="0.8"/>
						<ellipse cx="60" cy="-244" rx="24" ry="10" fill="var(--accent-dk)"/>
						<rect x="78" y="-232" width="6" height="120" rx="3" fill="url(#gp)"/>
						<circle cx="81" cy="-110" r="4.5" fill="url(#gp)"/>
						<rect x="30" y="-40" width="60" height="74" rx="16" fill="var(--accent-dk)"/>
						<rect x="27" y="18" width="66" height="18" rx="5" fill="var(--accent-dk)"/>
						<path fill="url(#gp)" stroke="#A07D2C" stroke-width="1.2" d="M22 44 C22 28 34 20 60 20 C86 20 98 28 98 44 C98 52 96 64 92 78 C84 108 73 140 63 168 L60 176 L57 168 C47 140 36 108 28 78 C24 64 22 52 22 44 Z"/>
						<path fill="none" stroke="#86671F" stroke-width="1.4" d="M26 46 C42 56 78 56 94 46"/>
						<circle cx="60" cy="92" r="11" fill="none" stroke="#9A7A2C" stroke-width="1" opacity="0.75"/>
						<circle cx="60" cy="118" r="6" fill="#141310"/>
						<path d="M60 124 L60 170" stroke="#141310" stroke-width="2.4" stroke-linecap="round"/>
						<path fill="url(#sp)" stroke="#8A8B95" stroke-width="0.8" d="M49 150 C53 162 57 170 60 176 C63 170 67 162 71 150 C67 156 53 156 49 150 Z"/>
						<path d="M60 152 L60 175" stroke="#141310" stroke-width="1.6" stroke-linecap="round"/>
					</g>
				</svg>
				<svg class="sq" viewBox="0 0 130 20" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M4 11 C 10 5, 17 4, 22 9 C 26 14, 20 17, 16 13 C 12 9, 22 5, 34 9 C 60 16, 104 13, 128 2"/></svg>
			</span>
			<span class="wmwrap">
				<span class="wm"><?php echo esc_html( awhitepen_brand_name() ); ?></span>
				<?php $brand_tag = awhitepen_brand_tag(); ?>
				<span class="tag" id="brandtag"<?php echo $brand_tag ? '' : ' hidden'; ?>><?php echo esc_html( $brand_tag ); ?></span>
			</span>
		</a>

		<button class="nav-toggle" type="button" aria-label="<?php esc_attr_e( 'Open menu', 'awhitepen' ); ?>" aria-expanded="false" aria-controls="nav">
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
		</button>

		<nav class="nav" id="nav" aria-label="<?php esc_attr_e( 'Primary menu', 'awhitepen' ); ?>">
			<?php awhitepen_render_primary_nav(); ?>
		</nav>

		<div class="site-header__utility">
			<div class="site-header__search">
				<?php get_search_form( array( 'context' => 'header' ) ); ?>
			</div>
			<button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="<?php esc_attr_e( 'Enable dark mode', 'awhitepen' ); ?>">
				<svg data-theme-icon="moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.5 3.8a8.4 8.4 0 0 0 5.7 13.9a8.8 8.8 0 1 1-5.7-13.9z"></path></svg>
				<svg data-theme-icon="sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false" hidden><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M2.5 12h2M19.5 12h2M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5"></path></svg>
				<span class="screen-reader-text theme-toggle__screen-label"><?php esc_html_e( 'Enable dark mode', 'awhitepen' ); ?></span>
			</button>
		</div>
	</div>
</header>

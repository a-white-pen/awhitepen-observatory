<?php
/**
 * Status page template.
 *
 * TODAY, BODY, FUEL and RESOURCES are each rendered by their own script from the
 * status API; MIND shows an under-construction card until it is built. Every
 * live panel ships with a skeleton already in it, which its script clears once
 * the first render lands.
 *
 * @package AWhitePen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Loaded through WordPress, never on its own.
}

get_header();

/*
 * Tabs are rendered here so their labels remain translatable. `live` marks a
 * panel filled by its dashboard script; the rest show the under-construction card.
 */
$status_tabs = array(
	array(
		'live'  => true,
		'slug'  => 'today',
		'label' => __( 'TODAY', 'awhitepen' ),
		'desc'  => __( 'now · current', 'awhitepen' ),
	),
	array(
		'slug'  => 'mind',
		'label' => __( 'MIND', 'awhitepen' ),
		'desc'  => __( 'focus · attention · sleep', 'awhitepen' ),
	),
	array(
		'live'  => true,
		'slug'  => 'body',
		'label' => __( 'BODY', 'awhitepen' ),
		'desc'  => __( 'weight · invisalign · vitals', 'awhitepen' ),
	),
	array(
		'live'   => true,
		'slug'  => 'fuel',
		'label' => __( 'FUEL', 'awhitepen' ),
		'desc'  => __( 'food · macros · meals', 'awhitepen' ),
	),
	array(
		'live'   => true,
		'slug'  => 'resources',
		'label' => __( 'RESOURCES', 'awhitepen' ),
		'desc'  => __( 'money · spend', 'awhitepen' ),
	),
);

$default_tab = 'today';
?>

<main class="site-main status" id="primary">
	<div class="wrap">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<header class="phead">
				<div>
					<p class="phead__eyebrow"><?php esc_html_e( 'B’s system status', 'awhitepen' ); ?></p>
					<h1 class="phead__title"><?php the_title(); ?></h1>
				</div>
			</header>

			<nav class="tabs" aria-label="<?php esc_attr_e( 'Status dashboards', 'awhitepen' ); ?>" role="tablist">
				<?php foreach ( $status_tabs as $tab ) : ?>
					<?php $is_current = $default_tab === $tab['slug']; ?>
					<button
						type="button"
						class="tab<?php echo $is_current ? ' on' : ''; ?>"
						id="tab-<?php echo esc_attr( $tab['slug'] ); ?>"
						role="tab"
						aria-selected="<?php echo $is_current ? 'true' : 'false'; ?>"
						aria-controls="panel-<?php echo esc_attr( $tab['slug'] ); ?>"
						data-tab="<?php echo esc_attr( $tab['slug'] ); ?>"
					><b><?php echo esc_html( $tab['label'] ); ?></b><span><?php echo esc_html( $tab['desc'] ); ?></span></button>
				<?php endforeach; ?>
			</nav>

			<?php foreach ( $status_tabs as $tab ) : ?>
				<?php $is_current = $default_tab === $tab['slug']; ?>
				<section
					class="panel<?php echo empty( $tab['live'] ) ? '' : ' sk'; ?>"
					<?php echo empty( $tab['live'] ) ? '' : 'aria-busy="true"'; ?>
					id="panel-<?php echo esc_attr( $tab['slug'] ); ?>"
					role="tabpanel"
					aria-labelledby="tab-<?php echo esc_attr( $tab['slug'] ); ?>"
					data-panel="<?php echo esc_attr( $tab['slug'] ); ?>"
					<?php echo $is_current ? '' : 'hidden'; ?>
				>
					<?php if ( ! empty( $tab['live'] ) ) : ?>
						<?php get_template_part( 'template-parts/skeleton', $tab['slug'] ); ?>
						<noscript>
							<div class="card">
								<p class="tcl__n--q"><?php esc_html_e( 'This dashboard needs JavaScript to read the live numbers.', 'awhitepen' ); ?></p>
							</div>
						</noscript>
					<?php else : ?>
						<div class="wip">
							<span class="wip__tape"></span>
							<div class="wip__in">
								<p class="wip__k"><?php esc_html_e( 'Under construction', 'awhitepen' ); ?></p>
								<h2 class="wip__h"><?php esc_html_e( 'Coming soon', 'awhitepen' ); ?></h2>
							</div>
							<span class="wip__tape"></span>
						</div>
					<?php endif; ?>
				</section>
			<?php endforeach; ?>
		<?php endwhile; ?>
	</div>
</main>

<?php
get_footer();

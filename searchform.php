<?php
/**
 * Search form template.
 *
 * @package AWhitePen
 */

$search_field_id = wp_unique_id( 'search-field-' );
$search_context  = isset( $args['context'] ) && is_string( $args['context'] ) ? $args['context'] : 'default';
$search_classes  = 'search-form';
$placeholder     = __( 'Search posts and pages', 'awhitepen' );

if ( 'header' === $search_context ) {
	$search_classes .= ' search-form--header';
	$placeholder     = __( 'Search', 'awhitepen' );
}
?>
<form role="search" method="get" class="<?php echo esc_attr( $search_classes ); ?>" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="<?php echo esc_attr( $search_field_id ); ?>"><?php esc_html_e( 'Search for:', 'awhitepen' ); ?></label>
	<div class="search-form__inner">
		<input id="<?php echo esc_attr( $search_field_id ); ?>" type="search" class="search-field" placeholder="<?php echo esc_attr( $placeholder ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s">
		<button type="submit" class="search-submit" aria-label="<?php esc_attr_e( 'Submit search', 'awhitepen' ); ?>">
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<circle cx="11" cy="11" r="6.5"></circle>
				<path d="M16 16L21 21"></path>
			</svg>
			<span class="screen-reader-text"><?php esc_html_e( 'Search', 'awhitepen' ); ?></span>
		</button>
	</div>
</form>

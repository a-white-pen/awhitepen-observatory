<?php
/**
 * Main index template.
 *
 * @package AWhitePen
 */

get_header();
?>

<main id="p-blog" class="site-main">
	<div class="site-shell">
		<?php awhitepen_render_notebook_header(); ?>

		<?php awhitepen_render_notebook_stream(); ?>

		<?php awhitepen_render_stream_browse_section(); ?>
	</div>
</main>

<?php
get_footer();

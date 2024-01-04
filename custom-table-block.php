<?php
function custom_table_block_init() {
    // Register the block script.
    wp_register_script(
        'custom-table-block-script',
        plugins_url('script.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor')
    );

    // Check if it's the admin area (backend)
    if (is_admin()) {
        // Register the backend block style.
        wp_register_style(
            'custom-table-block-style-backend',
            plugins_url('style-backend.css', __FILE__),
            array('wp-edit-blocks')
        );

        // Enqueue the backend block style.
        wp_enqueue_style('custom-table-block-style-backend');
    } else {
        // Register the frontend block style.
        wp_register_style(
            'custom-table-block-style-frontend',
            plugins_url('style-frontend.css', __FILE__),
            array('wp-block-editor')
        );

        // Enqueue the frontend block style.
        wp_enqueue_style('custom-table-block-style-frontend');
    }

    // Register the block.
    register_block_type('custom-table-block/custom-table', array(
        'editor_script' => 'custom-table-block-script',
    ));
}

// Hook to register the block.
add_action('init', 'custom_table_block_init');




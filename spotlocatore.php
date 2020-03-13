<?php
/*
Plugin Name: Spots Locator From Api
Plugin URI: #
Description: Wordpress plugin allow to search/find locations in the map
Author: Oussama Elmaaroufy
Version: 1.0
Author URI: #
*/

  
define( 'SPOT_LOCATOR__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SPOT_LOCATOR__PLUGIN_URL', __FILE__);

require_once( SPOT_LOCATOR__PLUGIN_DIR . '/includes/load-resources.php' );  
require_once( SPOT_LOCATOR__PLUGIN_DIR . '/includes/shortcodes/map_view_api.php' );

// Actions 
add_action( 'wp_enqueue_scripts', 'load_resources'); 

// Shortcode 
add_shortcode( 'map_view_api', 'map_view_api' );

 
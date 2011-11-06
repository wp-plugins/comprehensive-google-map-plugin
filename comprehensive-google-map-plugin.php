<?php
/*
Plugin Name: Comprehensive Google Map Plugin
Plugin URI: http://initbinder.com/comprehensive-google-map-plugin
Description: A simple and intuitive, yet elegant and fully documented Google map plugin that installs as a widget and a short code. The plugin is packed with useful features. Widget and shortcode enabled. Offers extensive configuration options for marker, controls, size, KML files, location by latitude/longitude, location by address, info window, traffic/bike lanes and more. 
Version: 1.0.1
Author: Alexander Zagniotov
Author URI: http://initbinder.com
License: GPLv2


This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

if ( !function_exists( 'add_action' ) ) {
	echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
	exit;
}

define('CGMP_GOOGLE_API_URL', 'http://maps.googleapis.com/maps/api/js?sensor=false');
define('CGMP_VERSION', '1.0.1');
define('CGMP_PLUGIN_DIR', dirname( __FILE__ ));
define('CGMP_PLUGIN_URI', plugin_dir_url( __FILE__ ));
define('CGMP_PLUGIN_ASSETS_URI', CGMP_PLUGIN_URI.'assets');
define('CGMP_PLUGIN_CSS', CGMP_PLUGIN_ASSETS_URI . '/css');
define('CGMP_PLUGIN_IMAGES', CGMP_PLUGIN_CSS . '/images');
define('CGMP_PLUGIN_JS', CGMP_PLUGIN_ASSETS_URI . '/js');
define('CGMP_PLUGIN_HTML', CGMP_PLUGIN_DIR . '/assets/html');

define('CGMP_FIELDSETNAME_WIDGETTITLE', 'Widget Title');
define('CGMP_FIELDSETNAME_BASICSETTINGS', 'Basic Settings');
define('CGMP_FIELDSETNAME_MARKER_CONFIG', 'Marker Configuration');
define('CGMP_FIELDSETNAME_MARKER_INFOBUBBLE', 'Marker Info Bubble Configuration');
define('CGMP_FIELDSETNAME_DESTINATION_ADDR_INFO', 'Destination Address Information');
define('CGMP_FIELDSETNAME_BIKE_TRAFFIC_PATH', 'Bike Paths and Traffic Information');
define('CGMP_FIELDSETNAME_CONTROL_CONFIG', 'Control Handle Configuration');
define('CGMP_FIELDSETNAME_KML', 'KML/GeoRSS Configuration');

$global_fieldset_names = array();
$global_fieldset_names["LEGEND_BASIC_SETTINGS"] = CGMP_FIELDSETNAME_BASICSETTINGS;
$global_fieldset_names["LEGEND_MARKER"] = CGMP_FIELDSETNAME_MARKER_CONFIG;
$global_fieldset_names["LEGEND_CONTROL"] = CGMP_FIELDSETNAME_CONTROL_CONFIG;
$global_fieldset_names["LEGEND_INFOBUBBLE"] = CGMP_FIELDSETNAME_MARKER_INFOBUBBLE;
$global_fieldset_names["LEGEND_ADDRESS"] = CGMP_FIELDSETNAME_DESTINATION_ADDR_INFO;
$global_fieldset_names["LEGEND_WIDGETTITLE"] = CGMP_FIELDSETNAME_WIDGETTITLE;
$global_fieldset_names["LEGEND_BIKE_AND_TRAFFIC"] = CGMP_FIELDSETNAME_BIKE_TRAFFIC_PATH;
$global_fieldset_names["LEGEND_KML"] = CGMP_FIELDSETNAME_KML;

$doc_url = get_option('siteurl')."/wp-admin/admin.php?page=menu.php";
$global_fieldset_names["DOC_URL"] = $doc_url;
//define('CGMP_FIELDSETNAME_', '');
//define('CGMP_FIELDSETNAME_', '');
//define('CGMP_FIELDSETNAME_', '');

require_once (CGMP_PLUGIN_DIR . '/functions.php');
require_once (CGMP_PLUGIN_DIR . '/widget.php');
require_once (CGMP_PLUGIN_DIR . '/shortcode.php');
require_once (CGMP_PLUGIN_DIR . '/metabox.php');
require_once (CGMP_PLUGIN_DIR . '/menu.php');
require_once (CGMP_PLUGIN_DIR . '/head.php');

add_action('admin_init', 'cgmp_google_map_admin_add_style');
add_action('admin_init', 'cgmp_google_map_admin_add_script');
add_action('admin_menu', 'cgmp_google_map_meta_boxes');
add_action('admin_menu', 'cgmp_google_map_plugin_menu');
add_action('widgets_init', create_function('', 'return register_widget("ComprehensiveGoogleMap_Widget");'));
add_action('wp_head', 'cgmp_google_map_head_scripts', 10);
add_shortcode('google-map-v3', 'cgmp_shortcode_googlemap_handler');

?>

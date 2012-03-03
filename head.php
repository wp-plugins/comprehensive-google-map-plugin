<?php
/*
Copyright (C) 2011  Alexander Zagniotov

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

if ( !function_exists('cgmp_google_map_admin_add_style') ):
        function cgmp_google_map_admin_add_style()  {
       			wp_enqueue_style('comprehensive-google-map-style', CGMP_PLUGIN_CSS . '/cgmp.admin.css', false, CGMP_VERSION, "screen");
        }
endif;


if ( !function_exists('cgmp_google_map_admin_add_script') ):
		function cgmp_google_map_admin_add_script()  {

				$whitelist = array('localhost', '127.0.0.1');

              	wp_enqueue_script('cgmp-jquery-tools-tooltip', CGMP_PLUGIN_JS .'/jquery.tools.tooltip.min.js', array('jquery'), '1.2.5.a', true);
				
				if (!in_array($_SERVER['HTTP_HOST'], $whitelist)) {
 					wp_enqueue_script('cgmp-jquery-tokeninput', CGMP_PLUGIN_JS. '/cgmp.tokeninput.min.js', array('jquery'), CGMP_VERSION, true);
				} else {
					wp_enqueue_script('cgmp-jquery-tokeninput', CGMP_PLUGIN_JS. '/cgmp.tokeninput.js', array('jquery'), CGMP_VERSION, true);
				}

				wp_localize_script('cgmp-jquery-tokeninput', 'CGMPGlobal', array('sep' => CGMP_SEP, 'customMarkersUri' => CGMP_PLUGIN_IMAGES."/markers/"));
				
				if (!in_array($_SERVER['HTTP_HOST'], $whitelist)) {
					wp_enqueue_script('comprehensive-google-map-plugin', CGMP_PLUGIN_JS. '/cgmp.admin.min.js', array('jquery'), CGMP_VERSION, true);
				} else {
					wp_enqueue_script('comprehensive-google-map-plugin', CGMP_PLUGIN_JS. '/cgmp.admin.js', array('jquery'), CGMP_VERSION, true);
				}
		}
endif;

if ( !function_exists('cgmp_google_map_tab_script') ):
    	function cgmp_google_map_tab_script()  {
             	wp_enqueue_script('cgmp-jquery-tools-tabs', CGMP_PLUGIN_JS .'/jquery.tools.tabs.min.js', array('jquery'), '1.2.5', true);
        }
endif;

if ( !function_exists('cgmp_google_map_init_scripts') ):
		function cgmp_google_map_init_scripts()  {

			$whitelist = array('localhost', '127.0.0.1');

			if (!is_admin()) {
				wp_enqueue_style('cgmp-google-map-styles', CGMP_PLUGIN_URI . 'style.css', false, CGMP_VERSION, "screen");
				wp_enqueue_script('cgmp-google-map-api', CGMP_GOOGLE_API_URL, array('jquery'), false);
			
				if (!in_array($_SERVER['HTTP_HOST'], $whitelist)) {
					wp_enqueue_script('cgmp-google-map-wrapper-framework-final', CGMP_PLUGIN_JS. '/cgmp.framework.min.js', array('jquery'), CGMP_VERSION, false);
				} else {
					wp_enqueue_script('cgmp-google-map-wrapper-framework-final', CGMP_PLUGIN_JS. '/cgmp.framework.js', array('jquery'), CGMP_VERSION, false);
				}

				wp_localize_script('cgmp-google-map-wrapper-framework-final', 'CGMPGlobal', array('maps' => array(), 'sep' => CGMP_SEP, 'customMarkersUri' => CGMP_PLUGIN_IMAGES."/markers/", 'errors' => array('msgNoGoogle' => "ATTENTION! (by Comprehensive Google Map Plugin)\n\nDear blog/website owner,\nIt looks like Google map API could not be reached. Map generation was aborted!\n\nPlease check that Google API script was loaded in the HTML source of your web page", "msgApiV2" => "ATTENTION! (by Comprehensive Google Map Plugin)\n\nDear blog/website owner,\nIt looks like your webpage has reference to the older Google API v2, in addition to the API v3 used by Comprehensive Google Map! An example of plugin using the older API v2, can be 'jquery.gmap plugin'.\n\nPlease disable conflicting plugin(s). In the meanwhile, map generation is aborted!", "msgMissingMarkers" => "ATTENTION! (by Comprehensive Google Map Plugin)\n\nDear blog/website owner,\nIt looks like you did not specify any marker locations for the Google map!\n\nPlease check the following when adding marker locations: \n[a] \tIn the shortcode builder, did you click the 'Add Marker' button before clicking 'Send to Editor'?\n[b] \tIn the widget, did you click the 'Add Marker' button before clicking 'Save'?\n\nPlease revisit and reconfigure your widget or shortcode configuration.\n\nThe map requires at least one marker location to be added..", "badAddresses" => "ATTENTION! (by Comprehensive Google Map Plugin)\n\nGoogle found the following address(es) as NON-geographic and could not find them:\n\n[REPLACE]\nConsider revising the address(es). Did you make a mistake when creating marker locations or did not provide a full geo-address? Alternatively use Google web to validate the address(es)", "kmlNotFound" => "The KML file could not be found. Most likely it is an invalid URL, or the document is not publicly available.", "kmlTooLarge" => "The KML file exceeds the file size limits of KmlLayer.", "kmlFetchError" => "The KML file could not be fetched.", "kmlDocInvalid" => "The KML file is not a valid KML, KMZ or GeoRSS document.", "kmlRequestInvalid" => "The KmlLayer is invalid.", "kmlLimits" => "The KML file exceeds the feature limits of KmlLayer.", "kmlTimedOut" => "The KML file could not be loaded within a reasonable amount of time.", "kmlUnknown" => "The KML file failed to load for an unknown reason.", "kml" => "ATTENTION! (by Comprehensive Google Map Plugin)\n\nDear blog/website owner,\nGoogle returned the following error when trying to load KML file:\n\n[MSG] ([STATUS])")));
			}

		}
endif;


?>

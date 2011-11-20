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
                        wp_enqueue_style('comprehensive-google-map-style', CGMP_PLUGIN_CSS . '/style.css', false, CGMP_VERSION, "screen");
                        wp_enqueue_style('token-input-style', CGMP_PLUGIN_CSS . '/token-input.css', false, CGMP_VERSION, "screen");
        }
endif;


if ( !function_exists('cgmp_google_map_admin_add_script') ):
                function cgmp_google_map_admin_add_script()  {
                        wp_enqueue_script('jquery-ui', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js', array('jquery'), '1.8.6');
                        wp_enqueue_script('cgmp-jquery-tools-tooltip', CGMP_PLUGIN_JS .'/jquery.tools.tooltip.min.js', array('jquery'), '1.2.5', true);
                        wp_enqueue_script('cgmp-jquery-tokeninput', CGMP_PLUGIN_JS. '/jquery.tokeninput.js', array('jquery'), CGMP_VERSION, true);
                        wp_enqueue_script('comprehensive-google-map-plugin', CGMP_PLUGIN_JS. '/comprehensive-google-map-plugin.js', array('jquery'), CGMP_VERSION, true);

        }
endif;

if ( !function_exists('cgmp_google_map_tab_script') ):
                function cgmp_google_map_tab_script()  {
                        wp_enqueue_script('cgmp-jquery-tools-tabs', CGMP_PLUGIN_JS .'/jquery.tools.tabs.min.js', array('jquery'), '1.2.5', true);
        }
endif;

if ( !function_exists('cgmp_google_map_init_scripts') ):
                function cgmp_google_map_init_scripts()  {
                        wp_enqueue_style('cgmp-google-map-override', CGMP_PLUGIN_CSS . '/override.css', false, CGMP_VERSION, "screen");
                        wp_enqueue_script('cgmp-google-map-api', CGMP_GOOGLE_API_URL, array('jquery'), false);
                        wp_enqueue_script('cgmp-google-map-wrapper-framework-final', CGMP_PLUGIN_JS. '/plugin-framework.js', array('jquery'), CGMP_VERSION);
                }
endif;
?>

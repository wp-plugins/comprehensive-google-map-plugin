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


if ( !function_exists('cgmp_google_map_meta_boxes') ):
function cgmp_google_map_meta_boxes() {
		$id = "google_map_shortcode_builder";
		$title = "AZ :: Google Map Shortcode Builder"; 
		$context = "normal";
		add_meta_box($id, $title, 'cgmp_render_shortcode_builder_form', 'post', $context, 'high');
		add_meta_box($id, $title, 'cgmp_render_shortcode_builder_form', 'page', $context, 'high');
}
endif;


if ( !function_exists('cgmp_render_shortcode_builder_form') ):
function cgmp_render_shortcode_builder_form() {

		$bools = array("Show" => "true", "Hide" => "false");
		$bools2 = array("Enable" => "false", "Disable" => "true");
		$bools3 = array("Enable" => "true", "Disable" => "false");
		$types = array("Roadmap"=>"ROADMAP", "Satellite"=>"SATELLITE", "Hybrid"=>"HYBRID", "Terrain" => "TERRAIN");
		$animations = array("Drop"=>"DROP", "Bounce"=>"BOUNCE");
		$aligns = array("Center"=>"center", "Right"=>"right", "Left" => "left");

		$template = file_get_contents(CGMP_PLUGIN_HTML."/form_body_template.plug");

		$v = "width";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Width (px)")); 
		$settings[] = array("type" => "input@range", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "350", "class" => "widefat", "style" => "")); 


		$v = "height";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Height (px)")); 
		$settings[] = array("type" => "input@range", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "350", "class" => "widefat", "style" => "")); 

		$v = "latitude";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Latitude")); 
		$settings[] = array("type" => "input@range", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "class" => "widefat", "style" => "")); 

		$v = "longitude";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Longitude")); 
		$settings[] = array("type" => "input@range", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "class" => "widefat", "style" => "")); 

		$v = "zoom";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Zoom")); 
		$settings[] = array("type" => "input@range", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => 12, "class" => "widefat", "style" => "")); 

		$v = "maptype";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Map type")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "options" => $types)); 


		$v = "showmarker";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Marker")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "options" => $bools)); 

		
		$v = "animation";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Animation")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "options" => $animations)); 


		$v = "m_aptypecontrol";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "MapType")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "options" => $bools)); 

		$v = "pancontrol";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Pan")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "options" => $bools)); 


		$v = "z_oomcontrol";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Zoom")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "options" => $bools)); 

		
		$v = "scalecontrol";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Scale")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "options" => $bools)); 

		$v = "streetviewcontrol";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "StreetView")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "options" => $bools)); 


		$v = "infobubblecontent";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Content Text")); 
		$settings[] = array("type" => "input", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "class" => "widefat", "style" => "width: 100% !important;"));


		$v = "addresscontent";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Address Text")); 
		$settings[] = array("type" => "input", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "class" => "widefat", "style" => "width: 100% !important;"));


		$v = "showbike";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Bike Paths")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "false", "options" => $bools)); 

		$v = "showtraffic";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Traffic Info")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "false", "options" => $bools)); 

		$v = "bubbleautopan";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Bubble Auto-Pan")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "false", "options" => $bools3)); 


		$v = "kml";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "KML/GeoRSS URL")); 
		$settings[] = array("type" => "input", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "class" => "widefat", "style" => "width: 100% !important;"));

		$v = "showpanoramio";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Panoramio")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "false", "options" => $bools)); 

			$m = "addmarker";
		$settings[] = array("type" => "button", "token" => $m, "attr"=> array("id" => $m, "name" => $m, "value" => "Add Marker", "class" => "button-primary add-additonal-location", "style" => ""));


		$v = $m."input";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Location")); 
		$settings[] = array("type" => "input", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => '', "class" => "widefat widefat marker-location-text default-marker-icon", "style" => "width: 100% !important;"));

		$v = $m."icons";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "")); 
		$settings[] = array("type" => "custom", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "class" => "custom-icons-placeholder", "style" => ""));

		
		$v = $m."list";
		$settings[] = array("type" => "list", "token" => $v, "attr"=> array("id" => $v, "name" => $v, "class" => "token-input-list", "style" => ""));

		$v = $v."hidden";
		$settings[] = array("type" => "hidden", "token" => $v, "attr"=> array("id" => $v, "name" => $v, "class" => "shortcodeitem", "value" => "", "style" => ""));


		$v = "mapalign";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "Alignment")); 
		$settings[] = array("type" => "select", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "options" => $aligns)); 

		$v = "panoramiouid";
		$settings[] = array("type" => "label", "token" => $v, "attr" => array("for" => $v, "value" => "User ID (Opt.)")); 
		$settings[] = array("type" => "input", "token" => $v, "attr"=> array("role" => $v, "id" => $v, "name" => $v, "value" => "", "class" => "widefat", "style" => ""));

	
		$template_values = cgmp_build_template_values($settings);

		global $global_fieldset_names;
		$template = cgmp_replace_template_tokens($global_fieldset_names, $template);
		$template = cgmp_replace_template_tokens($template_values, $template);

  		$res = "<div id='google-map-container-metabox'>
				{$template}
		</div>
		<input type='button' onclick='return sendShortcodeToEditor(\"google-map-container-metabox\");' 
		class='button button-highlighted' tabindex='4' value='Send to Editor' id='send-to-editor' name='send-to-editor' />";
		echo $res;
}
endif;

?>

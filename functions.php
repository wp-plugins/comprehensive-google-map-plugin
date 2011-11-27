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

if ( !function_exists('cgmp_draw_map_placeholder') ):
	function cgmp_draw_map_placeholder($id, $width, $height, $directions, $align) {
	$result = '<div align="'.$align.'"><div class="google-map-placeholder" id="' .$id . '" style="width:' . 
			$width . 'px;height:' . $height . 'px; border:1px solid #333333;"></div></div>';

	if (isset($directions) && $directions == "true") {
		$result .=  '<div class="google-map-directions-panel" id="directions-placeholder-' .$id . '" style="margin-top: 8px !important; text-align: center; padding: 10px 12px !important; overflow: auto;"></div>';
	}

        return $result;
 	}
endif;


if ( !function_exists('cgmp_begin_map_init') ):
	function cgmp_begin_map_init($id, $lat, $long, $zoom, $type, $bubbleAutoPan, $controlOpts, $markerdirections) {
		$result =  '<script type="text/javascript">'.PHP_EOL;
		$result .= '    var map_'.$id.' = new google.maps.Map(document.getElementById("'.$id.'"));'.PHP_EOL;
		$result .= '    var orc = new jQuery.GoogleMapOrchestrator(map_'.$id.', {markerdirections: "'.$markerdirections.'", bubbleAutoPan: "'.$bubbleAutoPan.'", initLocation: "'.$lat.','.$long.'", zoom : '.$zoom.', mapType: google.maps.MapTypeId.'.$type.'});'.PHP_EOL;
		$result	.= '    orcHolder.push({mapId: "'.$id.'", orchestrator: orc});'.PHP_EOL;
		$result .= '    orc.switchMapControl('.$controlOpts['m_aptypecontrol'].', jQuery.GoogleMapOrchestrator.ControlType.MAPTYPE);'.PHP_EOL;
        $result .= '    orc.switchMapControl('.$controlOpts['pancontrol'].', jQuery.GoogleMapOrchestrator.ControlType.PAN);'.PHP_EOL;
        $result .= '    orc.switchMapControl('.$controlOpts['z_oomcontrol'].', jQuery.GoogleMapOrchestrator.ControlType.ZOOM);'.PHP_EOL;
        $result .= '    orc.switchMapControl('.$controlOpts['scalecontrol'].', jQuery.GoogleMapOrchestrator.ControlType.SCALE);'.PHP_EOL;
        $result .= '    orc.switchMapControl('.$controlOpts['streetviewcontrol'].', jQuery.GoogleMapOrchestrator.ControlType.STREETVIEW);'.PHP_EOL;

		return $result;
	}
endif;


if ( !function_exists('cgmp_draw_map_marker') ):
	function cgmp_draw_map_marker($id, $showmarker, $animation, $address, $extramarkers, $kml) {
		
		$result = "";

		if (isset($address) && $address != '') {
			$result .= '    orc.updateInitLocationMarker("'.$address.'", jQuery.GoogleMapOrchestrator.AnimationType.'.$animation.');'.PHP_EOL;
		} else if ($animation == "BOUNCE") {
			$result .= '    orc.updateInitLocationMarker(orc.getOption("initLocation"), jQuery.GoogleMapOrchestrator.AnimationType.'.$animation.');'.PHP_EOL;
		}

		if ((!isset($kml) || $kml == "") && isset($showmarker) && strtolower(trim($showmarker)) == 'true') {
			$result .= '    orc.buildInitLocationMarker();'.PHP_EOL;
		}

		if (isset($extramarkers) && $extramarkers != '') {
			$result .= '    orc.buildAddressMarkers("'.$extramarkers.'");'.PHP_EOL;
		}

		return $result;
	}
endif;


if ( !function_exists('cgmp_draw_marker_infobubble') ):
	function cgmp_draw_marker_infobubble($id, $infobubblecontent) {
		$result = ''.PHP_EOL.PHP_EOL;
		$result .= 'var infowindow_' . $id . ' = null;'.PHP_EOL;
		$result .= 'var content = "' . $infobubblecontent . '";'.PHP_EOL;
		$result .= 'infowindow_' . $id . ' = new google.maps.InfoWindow({'.PHP_EOL;
		$result .= 'content: content'.PHP_EOL;
		$result .= '});'.PHP_EOL.PHP_EOL;
		$result .= 'if (marker_' . $id . ') {'.PHP_EOL;
		$result .= ' google.maps.event.addListener(marker_' . $id . ', "click", function() { '.PHP_EOL;
		$result .= ' infowindow_' . $id . '.open(map_' . $id . ', marker_' . $id . '); '.PHP_EOL;
		$result .= '});'.PHP_EOL;
		$result .= '}'.PHP_EOL;	
		return $result;
	}
endif;


if ( !function_exists('cgmp_draw_map_address') ):
function cgmp_draw_map_address($id, $address) {
	$result = '';
	if (isset($address) && $address != '') {
		$result .= 'var initloc = new google.maps.LatLng(40.69847032728747, -73.9514422416687);'.PHP_EOL.PHP_EOL;
		$result .= 'var geocoder_' . $id . ' = new google.maps.Geocoder();'.PHP_EOL;
		$result .= 'var address = "' . $address . '";'.PHP_EOL;
		$result .= 'geocoder_' . $id . '.geocode( { "address": address}, function(results, status) {'.PHP_EOL.PHP_EOL;
		$result .= 'if (status == google.maps.GeocoderStatus.OK) {'.PHP_EOL;
		$result .= 'map_' . $id . '.setCenter(results[0].geometry.location);'.PHP_EOL.PHP_EOL;
		$result .= 'if (marker_' . $id . ') {'.PHP_EOL;
		$result .= '    marker_' . $id . '.setPosition(map_' . $id . '.getCenter());'.PHP_EOL;
		$result .= '    if (infowindow_' . $id . ') {'.PHP_EOL;
		$result .= '        infowindow_' . $id . '.open(map_' . $id . ', marker_' . $id . '); '.PHP_EOL;
		$result .= '    }'.PHP_EOL;
		$result .= '}'.PHP_EOL.PHP_EOL;	
		$result .= '} else {'.PHP_EOL;
		$result .= '    map_' . $id . '.setCenter(initloc);'.PHP_EOL;
		$result .= '    if (!infowindow_' . $id . ') {'.PHP_EOL;
		$result .= '        infowindow_' . $id . ' = new google.maps.InfoWindow();'.PHP_EOL;
		$result .= '    }'.PHP_EOL;
		$result .= '    if (!marker_' . $id . ') {'.PHP_EOL;
		$result .= '        marker_' . $id . ' = new google.maps.Marker();'.PHP_EOL;
		$result .= '    }'.PHP_EOL;
		$result .= '    infowindow_' . $id . '.setContent("Could not load address: " + address);'.PHP_EOL;
		$result .= '    infowindow_' . $id . '.setPosition(initloc);'.PHP_EOL;
		$result .= '    marker_' . $id . '.setVisible(true);'.PHP_EOL;
		$result .= '    marker_' . $id . '.setPosition(initloc);'.PHP_EOL;
		$result .= '    infowindow_' . $id . '.open(map_' . $id . ', marker_' . $id . ');'.PHP_EOL;
		$result .= '}'.PHP_EOL;
		$result .= '});'.PHP_EOL;
	}
	return $result;
}
endif;


if ( !function_exists('cgmp_draw_map_bikepath') ):
	function cgmp_draw_map_bikepath($id, $showbikepath) {
		$result = '';
		if (isset($showbikepath) && strtolower(trim($showbikepath)) == 'true') {
			$result = 'orc.buildLayer(jQuery.GoogleMapOrchestrator.LayerType.BIKE);'.PHP_EOL;
		}
		return $result;
	}
endif;

if ( !function_exists('cgmp_draw_map_traffic') ):
	function cgmp_draw_map_traffic($id, $showtraffic) {
		$result = '';
		if (isset($showtraffic) && strtolower(trim($showtraffic)) == 'true') {
			$result = 'orc.buildLayer(jQuery.GoogleMapOrchestrator.LayerType.TRAFFIC);'.PHP_EOL;
		}
		return $result;
	}
endif;


if ( !function_exists('cgmp_draw_kml') ):
	function cgmp_draw_kml($id, $kml) {
		$result = '';
		if (isset($kml) && $kml != "" && strtolower(trim(strpos($kml, "http"))) !== false) {
			$kml = str_replace("&#038;", "&", $kml);
			$result = 'orc.buildLayer(jQuery.GoogleMapOrchestrator.LayerType.KML, "'.$kml.'");'.PHP_EOL;
		}
		return $result;
	}
endif;


if ( !function_exists('cgmp_draw_panoramio') ):
	function cgmp_draw_panoramio($id, $showpanoramio, $userId) {
		$result = '';
		if (isset($showpanoramio) && strtolower(trim($showpanoramio)) == 'true') {
			$result = 'orc.buildLayer(jQuery.GoogleMapOrchestrator.LayerType.PANORAMIO, null, "'.$userId.'");'.PHP_EOL;
		}
		return $result;
	}
endif;



if ( !function_exists('cgmp_end_map_init') ):
	function cgmp_end_map_init() {
		$result =  '</script>';
		return 	$result;
	}
endif;


if ( !function_exists('cgmp_create_html_select') ):
	function cgmp_create_html_select($attr) {
		$role = $attr['role'];
		$id = $attr['id'];
		$name = $attr['name'];
		$value = $attr['value'];
		$options = $attr['options'];
				
		return "<select role='".$role."' id='".$id."' style='' class='shortcodeitem' name='".$name."'>".
				cgmp_create_html_select_options($options, $value)."</select>";
	}
endif;


if ( !function_exists('cgmp_create_html_select_options') ):
	function cgmp_create_html_select_options( $options, $so ){
		$r = '';
		foreach ($options as $label => $value){
			$r .= '<option value="'.$value.'"';
			if($value == $so){
				$r .= ' selected="selected"';
			}
			$r .= '>&nbsp;'.$label.'&nbsp;</option>';
		}
		return $r;
	}
endif;


if ( !function_exists('cgmp_create_html_input') ):
	function cgmp_create_html_input($attr) {
		$role = $attr['role'];
		$id = $attr['id'];
		$name = $attr['name'];
		$value = $attr['value'];
		$class = $attr['class'];
		$style = $attr['style'];
		$elem_type = 'text';

		if (isset($attr['elem_type'])) {
			$elem_type = $attr['elem_type'];
		}
		$steps = "";
		
		if ($role == "longitude") {
			//$steps = "min='-180' max='180' step='1'";
		} else if ($role == "latitude") {
			//$steps = "min='0' max='90' step='1'";
		} else if ($role == "width") {
			//$steps = "min='0' max='995' step='5'";
		} else if ($role == "height") {
			//$steps = "min='0' max='995' step='5'";
		}
		$slider = "";
		if ($elem_type == "range") {
				$slider = "<div id='".$role."' class='slider'></div>";
				$class .= " slider-output";
		}
		return $slider."<input role='".$role."' {$steps} class='".$class." shortcodeitem' id='".$id."' name='".$name."' value='".$value."' style='".$style."' />";
	}
endif;

if ( !function_exists('cgmp_create_html_hidden') ):
		function cgmp_create_html_hidden($attr) {
				$id = $attr['id'];
				$name = $attr['name'];
				$value = $attr['value'];
				$class = $attr['class'];
				$style = $attr['style'];
			return "<input class='".$class."' id='".$id."' name='".$name."' value='".$value."' style='".$style."' type='hidden' />";
	}
endif;


if ( !function_exists('cgmp_create_html_button') ):
		function cgmp_create_html_button($attr) {
				$id = $attr['id'];
				$name = $attr['name'];
				$value = $attr['value'];
				$class = $attr['class'];
				$style = $attr['style'];
			return "<input class='".$class."' id='".$id."' name='".$name."' value='".$value."' style='".$style."' type='button' />";
	}
endif;

if ( !function_exists('cgmp_create_html_list') ):
		function cgmp_create_html_list($attr) {
				$id = $attr['id'];
				$name = $attr['name'];
				$class = $attr['class'];
				$style = $attr['style'];
			return "<ul class='".$class."' id='".$id."' name='".$name."' style='".$style."'></ul>";
	}
endif;



if ( !function_exists('cgmp_create_html_label') ):
		function cgmp_create_html_label($attr) {
			$for = $attr['for'];
			$value = $attr['value'];
		 	return "<label for=".$for.">".$value."</label>";
	}
endif;


if ( !function_exists('cgmp_replace_template_tokens') ):
	function cgmp_replace_template_tokens($token_values, $template)  {
		foreach ($token_values as $key => $value) {
			$template = str_replace($key, $value, $template);
		}
		return $template;
	}
endif;


if ( !function_exists('cgmp_build_template_values') ):
	function cgmp_build_template_values($settings) {
		$template_values = array();

		foreach($settings as $setting) {
			$func_type = $setting['type'];
			$token = $setting['token'];
			$attr = $setting['attr'];

			$pos = strrpos($func_type, "@");

			if ($pos != 0) {
				$pieces = explode("@", $func_type);
				$func_type = $pieces[0];
				$attr['elem_type'] = $pieces[1];
			}


			$func =  "cgmp_create_html_".$func_type;
			$template_values[strtoupper($func_type)."_".strtoupper($token)] = $func($attr);
		}
		return $template_values;
	}
endif;

?>

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
	function cgmp_draw_map_placeholder($id, $width, $height) {
	$result = '<div class="google-map-placeholder" id="' .$id . '" style="width:' . 
                $width . 'px;height:' . $height . 'px; border:1px solid #333333;"></div><div class="fix"></div>';
        return $result;
 	}
endif;


if ( !function_exists('cgmp_begin_map_init') ):
	function cgmp_begin_map_init($id, $lat, $long, $zoom, $type, $controlOpts) {
		$result =  '<script type="text/javascript">'.PHP_EOL;
		$result .= 'var initloc = new google.maps.LatLng('.$lat.', '.$long.');'.PHP_EOL;
		$result .= 'var myOptions = {'.PHP_EOL;
		$result .= 'zoom: '.$zoom.','.PHP_EOL;
		$result .= 'mapTypeId: google.maps.MapTypeId.'.strtoupper(trim($type)).','.PHP_EOL;
		$result .= 'mapTypeControl: '.$controlOpts['m_aptypecontrol'].','.PHP_EOL; //The selectable map types, eg: terrain, satellite
    	$result .= 'mapTypeControlOptions: {'.PHP_EOL;
        $result .= 'style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,'.PHP_EOL;
    	$result .= '},'.PHP_EOL;
    	$result .= 'panControl: '.$controlOpts['pancontrol'].','.PHP_EOL; //The round steering wheel with little hand in the middle`
    	$result .= 'zoomControl: '.$controlOpts['z_oomcontrol'].','.PHP_EOL;
    	$result .= 'scaleControl: '.$controlOpts['scalecontrol'].','.PHP_EOL;
    	$result .= 'streetViewControl: '.$controlOpts['streetviewcontrol'].','.PHP_EOL; //The little yellow/orange dude that you can drag
		$result .= 'center: initloc'.PHP_EOL;
		$result .= '};'.PHP_EOL.PHP_EOL;
		$result .= 'var map_'.$id.' = new google.maps.Map(';
		$result .= 'document.getElementById("'.$id.'"), myOptions);'.PHP_EOL;
		return $result;
	}
endif;


if ( !function_exists('cgmp_draw_map_marker') ):
	function cgmp_draw_map_marker($id, $showmarker, $animation) {
		$result = ''.PHP_EOL.PHP_EOL;
		$result .= 'var marker_' . $id . ' = null;'.PHP_EOL;
		$result .= 'marker_' . $id . ' = new google.maps.Marker({'.PHP_EOL;
		$result .= 'map: map_' . $id . ','.PHP_EOL;
		$result .= 'visible: ' . $showmarker. ','.PHP_EOL;
		$result .= 'position: map_' . $id . '.getCenter()'.','.PHP_EOL;
		$result .= 'animation: google.maps.Animation.'.strtoupper(trim($animation)).''.PHP_EOL;
		$result .= '});'.PHP_EOL;
		
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
			$result = 'var bikeLayer = new google.maps.BicyclingLayer();'.PHP_EOL;
			$result .= 'bikeLayer.setMap(map_' . $id . ');'.PHP_EOL;
		}
		return $result;
	}
endif;

if ( !function_exists('cgmp_draw_map_traffic') ):
	function cgmp_draw_map_traffic($id, $showtraffic) {
		$result = '';
		if (isset($showtraffic) && strtolower(trim($showtraffic)) == 'true') {
			$result = 'var trafficLayer = new google.maps.TrafficLayer();'.PHP_EOL;
			$result .= 'trafficLayer.setMap(map_' . $id . ');'.PHP_EOL;
		}
		return $result;
	}
endif;


if ( !function_exists('cgmp_draw_kml') ):
	function cgmp_draw_kml($id, $kml) {
		$result = '';
		if (isset($kml) && strtolower(trim(strpos($kml, "http"))) !== false) {
			$kml = str_replace("&#038;", "&", $kml);
			$result = 'var kmlLayer = new google.maps.KmlLayer("'.$kml.'");'.PHP_EOL;
			$result .= 'kmlLayer.setMap(map_' . $id . ');'.PHP_EOL;
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
		}
		return $slider."<input role='".$role."' {$steps} class='".$class." shortcodeitem' id='".$id."' name='".$name."' type='".$elem_type."' value='".$value."' style='".$style."' />";
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

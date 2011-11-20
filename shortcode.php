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


if ( !function_exists('cgmp_shortcode_googlemap_handler') ):
function cgmp_shortcode_googlemap_handler($attr, $content = null, $code = null) {
	
	extract(shortcode_atts(array(
		'width' => 250,
		'height' => 250,
		'zoom' => 5,
		'latitude' => 40.69847032728747,
		'longitude' => -73.9514422416687,
		'zoom' => 5,
		'width' => 400,
		'height' => 400,
		'maptype' => 'ROADMAP',
		'showmarker' => 'true',
		'infobubblecontent' => '',
		'animation' => 'DROP',
		'm_aptypecontrol' => 'true',
		'maptypecontrol' => 'true',
		'pancontrol' => 'true',
		'z_oomcontrol' => 'true',
		'zoomcontrol' => 'true',
		'scalecontrol' => 'true',
		'streetviewcontrol' => 'true',
		'addresscontent' => '',
		'showbike' => 'false',
		'bubbleautopan' => 'false',
		'showtraffic' => 'false',
		'showpanoramio' => 'false',
		'addmarkerlist' => '',
		'kml' => '',
		'markerdirections' => 'true'
	), $attr));
	
	$id = md5(time().' '.rand()); 


	$controlOpts = array();

	if ($m_aptypecontrol == "true" && $maptypecontrol == "false") {
			$controlOpts['m_aptypecontrol'] = "false";

	} else 	if ($m_aptypecontrol == "false" && $maptypecontrol == "true") {
			$controlOpts['m_aptypecontrol'] = "false";

	} else {
			$controlOpts['m_aptypecontrol'] = "true";
	} 

	$controlOpts['pancontrol'] = $pancontrol;
	
	if ($z_oomcontrol == "true" && $zoomcontrol == "false") {
			$controlOpts['z_oomcontrol'] = "false";

	} else 	if ($z_oomcontrol == "false" && $zoomcontrol == "true") {
			$controlOpts['z_oomcontrol'] = "false";

	} else {
			$controlOpts['z_oomcontrol'] = "true";
	} 

	
	$controlOpts['scalecontrol'] = $scalecontrol;
	$controlOpts['streetviewcontrol'] = $streetviewcontrol;

	$result = '';
	$result .= cgmp_draw_map_placeholder($id, $width, $height, $markerdirections);
	$result .= cgmp_begin_map_init($id, $latitude, $longitude, $zoom, $maptype, $bubbleautopan, $controlOpts, $markerdirections);
	$result .= cgmp_draw_map_marker($id, $showmarker, $animation, $addresscontent, $addmarkerlist, $kml);
	$result .= cgmp_draw_map_bikepath($id, $showbike);
	$result .= cgmp_draw_map_traffic($id, $showtraffic);
	$result .= cgmp_draw_panoramio($id, $showpanoramio);
	$result .= cgmp_draw_kml($id, $kml);
	$result .= cgmp_end_map_init();


	return $result;
}
endif;

?>

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
		'latitude' => 0,
		'longitude' => 0,
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
		'scrollwheelcontrol' => 'false',
		'addresscontent' => '',
		'showbike' => 'false',
		'bubbleautopan' => 'nada',
		'showtraffic' => 'false',
		'showpanoramio' => 'false',
		'addmarkerlist' => '',
		'kml' => '',
		'markerdirections' => 'true',
		'mapalign' => 'center',
		'panoramiouid' => '',
		'addmarkermashup' => 'false',
		'addmarkermashupbubble' => 'false'
	), $attr));
	
	$id = md5(time().' '.rand()); 

	if ($bubbleautopan == 'nada') {
		$bubbleautopan = 'false';
	} 

	
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
	$controlOpts['scrollwheelcontrol'] = $scrollwheelcontrol;


	if ($addmarkermashup == 'true') {
		$addmarkerlist = make_marker_geo_mashup();
	} else if ($addmarkermashup == 'false') {
		$addmarkerlist = update_markerlist_from_legacy_locations($latitude, $longitude, $addresscontent, $addmarkerlist);
	}

	$map_settings = array();
	$map_settings['id'] = $id;
	$map_settings['zoom'] = $zoom;
	$map_settings['maptype'] = $maptype;
	$map_settings['bubbleautopan'] = $bubbleautopan;
	$map_settings['maptypecontrol'] = $controlOpts['m_aptypecontrol'];
	$map_settings['pancontrol'] = $controlOpts['pancontrol'];
	$map_settings['zoomcontrol'] = $controlOpts['z_oomcontrol'];
	$map_settings['scalecontrol'] = $controlOpts['scalecontrol'];
	$map_settings['streetviewcontrol'] = $controlOpts['streetviewcontrol'];
	$map_settings['scrollwheelcontrol'] = $controlOpts['scrollwheelcontrol'];
	$map_settings['markerlist'] = $addmarkerlist;
	$map_settings['addmarkermashup'] = $addmarkermashup;
	$map_settings['geomashupbubble'] = $addmarkermashupbubble;
	$map_settings['kml'] = cgmp_clean_kml($kml);
	$map_settings['showbike'] = $showbike;
	$map_settings['showtraffic'] = $showtraffic;
	$map_settings['showpanoramio'] = $showpanoramio;
	$map_settings['panoramiouid'] = cgmp_clean_panoramiouid($panoramiouid);
	$map_json = json_encode($map_settings);
	cgmp_map_data_injector($map_json);

	
	$result = '';
	$result .= cgmp_draw_map_placeholder($id, $width, $height, $mapalign);
	/*$result .= cgmp_begin_map_init_v2($id, $zoom, $maptype, $bubbleautopan, $controlOpts);
	$result .= cgmp_draw_map_marker_v2($id, $addmarkerlist, $addmarkermashup, $addmarkermashupbubble, $kml);
	$result .= cgmp_draw_map_bikepath($id, $showbike);
	$result .= cgmp_draw_map_traffic($id, $showtraffic);
	$result .= cgmp_draw_panoramio($id, $showpanoramio, $panoramiouid);
	$result .= cgmp_draw_kml($id, $kml);
	$result .= cgmp_end_map_init();
	 */
	return $result;
}
endif;

?>

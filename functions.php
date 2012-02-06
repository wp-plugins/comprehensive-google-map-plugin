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
		function cgmp_draw_map_placeholder($id, $width, $height, $align) {

			$toploading = ceil($height / 2) - 50;

	$result = '<div align="'.$align.'"><div class="google-map-placeholder" id="' .$id . '" style="width:' . 
			$width . 'px;height:' . $height . 'px; border:1px solid #333333;"><div class="loading" style="top: '.$toploading.'px !important;"></div></div>';

			$result .= '<div class="direction-controls-placeholder" id="direction-controls-placeholder-' .$id . '" style="width: '.$width.'px; margin-top: 5px; border: 1px solid #EBEBEB; display: none; padding: 18px 0 9px 0;">
			<div class="d_close-wrapper">
				<a id="d_close" href="javascript:void(0)"> 
					<img src="'.CGMP_PLUGIN_IMAGES.'/transparent.png" class="close"> 
				</a>
			</div>

			<div style="" id="travel_modes_div" class="dir-tm kd-buttonbar">
				<a tabindex="3" class="kd-button kd-button-left selected" href="javascript:void(0)" id="dir_d_btn" title="By car"> 
					<img class="dir-tm-d" src="'.CGMP_PLUGIN_IMAGES.'/transparent.png" /> 
				</a>
				<a tabindex="3" class="kd-button kd-button-right" href="javascript:void(0)" id="dir_w_btn" title="Walking"> 
					<img class="dir-tm-w" src="'.CGMP_PLUGIN_IMAGES.'/transparent.png"> 
				</a>
			</div>
			<div class="dir-clear"></div>
			<div id="dir_wps">
				<div id="dir_wp_0" class="dir-wp">
					<div class="dir-wp-hl">
						<div id="dir_m_0" class="dir-m" style="cursor: -moz-grab;">
							<div style="width: 24px; height: 24px; overflow: hidden; position: relative;">
								<img style="position: absolute; left: 0px; top: -141px; -moz-user-select: none; border: 0px none; padding: 0px; margin: 0px;" src="'.CGMP_PLUGIN_IMAGES.'/directions.png">
							</div>
						</div>
						<div class="dir-input">
							<div class="kd-input-text-wrp">
								<input type="text" maxlength="2048" tabindex="4" value="" name="a_address" id="a_address" title="Start address" class="wp kd-input-text" autocomplete="off" autocorrect="off">
							</div>
						</div>
					</div>
				</div>
				<div class="dir-rev-wrapper">
					<div id="dir_rev" title="Get reverse directions">
						<a id="reverse-btn" href="javascript:void(0)" class="kd-button"> 
							<img class="dir-reverse" src="'.CGMP_PLUGIN_IMAGES.'/transparent.png"> 
						</a>
					</div>
				</div>
				<div id="dir_wp_1" class="dir-wp">
					<div class="dir-wp-hl">
						<div id="dir_m_1" class="dir-m" style="cursor: -moz-grab;">
							<div style="width: 24px; height: 24px; overflow: hidden; position: relative;">
								<img style="position: absolute; left: 0px; top: -72px; -moz-user-select: none; border: 0px none; padding: 0px; margin: 0px;" src="'.CGMP_PLUGIN_IMAGES.'/directions.png">
							</div>
						</div>
						<div class="dir-input">
							<div class="kd-input-text-wrp">
								<input type="text" maxlength="2048" tabindex="4" value="" name="b_address" id="b_address" title="End address" class="wp kd-input-text" autocomplete="off" autocorrect="off">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="dir_controls">
				<div class="d_links">
					<span id="d_options_toggle">
						<a id="d_options_show" class="no-wrap" href="javascript:void(0)" style="display: none !important;">Show options</a> 
						<a id="d_options_hide" class="no-wrap" href="javascript:void(0)" style="display: none !important;">Hide options</a>
					   	<b><span style="color: blue">Additional options</span></b>
					</span>
				</div>
				<div id="d_options" style="background-color: #ddd; margin-bottom: 3px; text-align: left; padding: 3px;">
					<input type="checkbox" tabindex="5" name="avoid_hway" id="avoid_hway" />
					<label for="avoid_hway">Avoid highways</label>
					<input type="checkbox" tabindex="5" name="avoid_tolls" id="avoid_tolls" />
					<label for="avoid_tolls">Avoid tolls</label>
					<input type="radio" name="travel_mode" id="radio_km" />
					<label for="radio_km">KM</label>
					<input type="radio" name="travel_mode" id="radio_miles" checked="checked" />
					<label for="radio_miles">Miles</label>
				</div>
				<div class="dir-sub-cntn">
					<button tabindex="6" name="btnG" type="submit" id="d_sub" class="kd-button kd-button-submit">Get Directions</button>
					<button tabindex="6" name="btnG" type="button" style="display: none;" id="print_sub" class="kd-button kd-button-submit">Print Directions</button>
				</div>
			</div>
		</div>
		<div id="rendered-directions-placeholder-' .$id . '" style="display: none; border: 1px solid #ddd; width: '.($width - 10).'px; margin-top: 10px; direction: ltr; overflow: auto; height: 180px; padding: 5px;" class="rendered-directions-placeholder"></div>
	</div>';

        return $result;
 	}
endif;


if ( !function_exists('is_map_shortcode_present') ):
	function is_map_shortcode_present($posts)
	{
		if ( empty($posts) ) {
			return $posts;
		}

    	$found = false;

    	foreach ($posts as $post) {
        	if ( stripos($post->post_content, '[google-map-v3') !== false) {
            	$found = true;
				break;
			}
        }

		if ($found) {
			cgmp_google_map_init_scripts();
		}

		return $posts;
	}
endif;



if ( !function_exists('trim_marker_value') ):
	function trim_marker_value(&$value)
	{
    	$value = trim($value);
	}
endif;


if ( !function_exists('update_markerlist_from_legacy_locations') ):
	function update_markerlist_from_legacy_locations($latitude, $longitude, $addresscontent, $hiddenmarkers)  {

		$legacyLoc = isset($addresscontent) ? $addresscontent : "";

		if (isset($latitude) && isset($longitude)) {
			if ($latitude != "0" && $longitude != "0" && $latitude != 0 && $longitude != 0) {
				$legacyLoc = $latitude.",".$longitude;
			}
		}

		if (isset($hiddenmarkers) && $hiddenmarkers != "") {

			$hiddenmarkers_arr = explode("|", $hiddenmarkers);
			$filtered = array();
			foreach($hiddenmarkers_arr as $marker) {
				if (strpos(trim($marker), CGMP_SEP) === false) {
					$filtered[] = trim($marker.CGMP_SEP."1-default.png");
				} else {
					$filtered[] = trim($marker);
				}
			}

			$hiddenmarkers = implode("|", $filtered);
		}

		if (trim($legacyLoc) != "")  {
			$hiddenmarkers = $legacyLoc.CGMP_SEP."1-default.png".(isset($hiddenmarkers) && $hiddenmarkers != "" ? "|".$hiddenmarkers : "");
		}

		$hiddenmarkers_arr = explode("|", $hiddenmarkers );
		array_walk($hiddenmarkers_arr, 'trim_marker_value');
		$hiddenmarkers_arr = array_unique($hiddenmarkers_arr);
		return implode("|", $hiddenmarkers_arr);
	}
endif;

if ( !function_exists('cgmp_begin_map_init_v2') ):
	function cgmp_begin_map_init_v2($id, $zoom, $type, $bubbleAutoPan, $controlOpts) {
		$result =  '<script type="text/javascript">'.PHP_EOL;
		$result .= '    jQuery(document).ready(function() {'.PHP_EOL;
		$result .= '    var map_'.$id.' = new google.maps.Map(document.getElementById("'.$id.'"));'.PHP_EOL;
		$result .= '    var orc = new jQuery.GoogleMapOrchestrator(map_'.$id.', {bubbleAutoPan: "'.$bubbleAutoPan.'", zoom : '.$zoom.', mapType: google.maps.MapTypeId.'.$type.'});'.PHP_EOL;
		$result	.= '    orcHolder.push({mapId: "'.$id.'", orchestrator: orc});'.PHP_EOL;
		$result .= '    orc.switchMapControl('.$controlOpts['m_aptypecontrol'].', jQuery.GoogleMapOrchestrator.ControlType.MAPTYPE);'.PHP_EOL;
        $result .= '    orc.switchMapControl('.$controlOpts['pancontrol'].', jQuery.GoogleMapOrchestrator.ControlType.PAN);'.PHP_EOL;
        $result .= '    orc.switchMapControl('.$controlOpts['z_oomcontrol'].', jQuery.GoogleMapOrchestrator.ControlType.ZOOM);'.PHP_EOL;
        $result .= '    orc.switchMapControl('.$controlOpts['scalecontrol'].', jQuery.GoogleMapOrchestrator.ControlType.SCALE);'.PHP_EOL;
        $result .= '    orc.switchMapControl('.$controlOpts['streetviewcontrol'].', jQuery.GoogleMapOrchestrator.ControlType.STREETVIEW);'.PHP_EOL;

		return $result;
	}
endif;


if ( !function_exists('cgmp_draw_map_marker_v2') ):
	function cgmp_draw_map_marker_v2($id, $extramarkers, $kml) {

		$result = "";

		if ((!isset($kml) || $kml == "")) {

			if (isset($extramarkers) && $extramarkers != '') {
				$result .= '    orc.buildAddressMarkers("'.$extramarkers.'");'.PHP_EOL;
			}
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
		$result =  '});</script>';
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
		$slider = "";
		if ($elem_type == "range") {
				$slider = "<div id='".$role."' class='slider'></div>";
				$class .= " slider-output";
		}

		if (strpos($class, "notshortcodeitem") === false) {
			$class = $class." shortcodeitem";
		}
		return $slider."<input role='".$role."' {$steps} class='".$class."' id='".$id."' name='".$name."' value='".$value."' style='".$style."' />";
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


if ( !function_exists('cgmp_create_html_geo') ):
		function cgmp_create_html_geo($attr) {
				$id = $attr['id'];
				$name = $attr['name'];
				$class = $attr['class'];
				$style = $attr['style'];

				return  "<input type='checkbox' ".$checked." class='".$class."' id='".$id."' name='".$name."' style='".$style."' />";
		}
endif;



if ( !function_exists('cgmp_create_html_geohidden') ):
		function cgmp_create_html_geohidden($attr) {
				$id = $attr['id'];
				$name = $attr['name'];
				$class = $attr['class'];
				$style = $attr['style'];
				$value = $attr['value'];

				return "<script>jQuery(document).ready(function() { return hideShowCustomMarker('".$id."'); });</script><input type='hidden' class='' id='".$id."' name='".$name."' value='".$value ."' />";
		}
endif;


if ( !function_exists('cgmp_create_html_custom') ):
		function cgmp_create_html_custom($attr) {
				$id = $attr['id'];
				$name = $attr['name'];
				$class = $attr['class'];
				$style = $attr['style'];
				$start =  "<ul class='".$class."' id='".$id."' name='".$name."' style='".$style."'>";

				$markerDir = CGMP_PLUGIN_IMAGES_DIR . "/markers/";

				$items = "<div id='".$id."' class='".$class."' style='margin-bottom: 15px; padding-bottom: 10px; padding-top: 10px; padding-left: 30px; height: 200px; overflow: auto; border-radius: 4px 4px 4px 4px; border: 1px solid #C9C9C9;'>";
				if (is_readable($markerDir)) {

					if ($dir = opendir($markerDir)) {

						$files = array();
						while ($files[] = readdir($dir));
						sort($files);
						closedir($dir);

						foreach ($files as $file) {
							//echo "filename: $file : filetype: " . filetype($dir . $file) . "\n";
							$pos = strrpos($file, ".png");

							if ($pos !== false && $file != "shadow.png") {
									$class = "";
									$style = "";
									$sel = "";
									$iconId = "";
									$radioId = "";
									$src = CGMP_PLUGIN_IMAGES."/markers/".$file;
									if ($file == "1-default.png") {
											$class = "selected-marker-image nomarker";
											$style = "cursor: default; ";
											$sel = "checked='checked'";
											$iconId = "default-marker-icon";
											$radioId = $iconId."-radio";
									} else if ($file == "2-default.png" || $file == "3-default.png") {
											$class = "nomarker";
									}

									//$items .= "<li><a href='javascript:void(0);'><img id='".$iconId."' style='".$style."' class='".$class."' src='".$src."' border='0' /></a><br /><input ".$sel." type='radio' id='".$radioId."' value='".$src."' style='margin-right: 15px' name='custom-icons-radio' /></li>";
									$items .= "<div style='float: left; text-align: center; margin-right: 8px;'><a href='javascript:void(0);'><img id='".$iconId."' style='".$style."' class='".$class."' src='".$src."' border='0' /></a><br /><input ".$sel." type='radio' id='".$radioId."' value='".$file."' style='' name='custom-icons-radio' /></div>";

							}
        				}
					}
				}


			return $items."</div>";
			//return $start.$items."</ul>";
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



if ( !function_exists('cgmp_google_map_deregister_scripts') ):
function cgmp_google_map_deregister_scripts() {
	$handle = '';
	global $wp_scripts;

	if (isset($wp_scripts->registered) && is_array($wp_scripts->registered)) {
		foreach ( $wp_scripts->registered as $script) {

			if (strpos($script->src, 'http://maps.googleapis.com/maps/api/js') !== false && $script->handle != 'cgmp-google-map-api') {

				if (!isset($script->handle) || $script->handle == '') {
					$script->handle = 'remove-google-map-duplicate';
				}

				unset($script->src);
				$handle = $script->handle;

				if ($handle != '') {
					$wp_scripts->remove( $handle );
					$handle = '';
					break;
				}
			}
		}
	}
}
endif;




if ( !function_exists('cgmp_invalidate_published_post_marker') ):
		function cgmp_invalidate_published_post_marker($postID)  {

			$db_markers = get_option(CGMP_DB_PUBLISHED_POST_MARKERS);

			if (!isset($db_markers) || $db_markers == '') {
				$db_markers = array();
			} else if ($db_markers != '') {
				$db_markers = unserialize(base64_decode($db_markers));
			}

			if (is_array($db_markers) && count($db_markers) > 0) {
				if (isset($db_markers[$postID])) {
					update_option(CGMP_DB_POST_COUNT, -1);
				}
			}
		}
endif;






if ( !function_exists('cgmp_cleanup_markers_from_published_posts') ):

		function cgmp_cleanup_markers_from_published_posts()  {
			update_option(CGMP_DB_PUBLISHED_POST_MARKERS, '');
			update_option(CGMP_DB_POST_COUNT, '');
		}
endif;





if ( !function_exists('cgmp_extract_markers_from_published_posts') ):

		function cgmp_extract_markers_from_published_posts()  {

			$serial = get_option(CGMP_DB_PUBLISHED_POST_MARKERS);
			$db_markers = '';
			if ($serial != '') {
				$db_markers = unserialize(base64_decode($serial));
			}
			$first_time_run = false;
			$invalidation_needed = false;

			if (!isset($db_markers) || $db_markers == '') {
				$first_time_run = true;
				//echo "Running marker location extraction for the first time<br />";
			} else if (is_array($db_markers) && count($db_markers) > 0) {
				$total_post_count = get_option(CGMP_DB_POST_COUNT);

				if (isset($total_post_count) && $total_post_count != '') {
					$count_posts = wp_count_posts();
					$published_posts = $count_posts->publish;

					if ($total_post_count != $published_posts) {
						$invalidation_needed = true;
						//echo "Current total of saved posts is not equal to the actual number of published posts<br />";
					}
				} else {
					$invalidation_needed = true;
					//echo "Dont have current total of saved posts<br />";
				}

			} else if (is_array($db_markers) && count($db_markers) == 0) {
				$invalidation_needed = true;
				//echo "Array of saved marker locations is empty<br />";
			} else {
				//$invalidation_needed = true;
			}

				if ($invalidation_needed || $first_time_run) {

					$db_markers = extract_locations_from_all_posts();

					if (sizeof($db_markers) > 0) {
						$serial = base64_encode(serialize($db_markers)); 
						update_option(CGMP_DB_PUBLISHED_POST_MARKERS, $serial);
						update_option(CGMP_DB_POST_COUNT, count($posts));
					}
				} else {
					//echo "Not extracting for the first time and no invalidation needed, simply outputing existing array<br />";
				}

				//echo "Marker list: " .print_r($db_markers, true);
			//exit;

				return $db_markers;
        	}
endif;


if ( !function_exists('extract_locations_from_all_posts') ):
		function extract_locations_from_all_posts()  {
			$args = array(
					'numberposts'     => 100,
	    		    'orderby'         => 'post_date',
	    			'order'           => 'DESC',
	   	 		    'post_type'       => 'post',
					'post_status'     => 'publish' );

				$posts = get_posts( $args );

				$db_markers = array();
				foreach($posts as $post) { 
					$post_content = $post->post_content;
					$extracted = extract_locations_from_post_content($post_content);
					//echo "Extracted list: " .print_r($extracted, true)."<br /><br />";
					if (count($extracted) > 0) {
						$db_markers[$post->ID] = $extracted;
					}
				}

				return $db_markers;

	}
endif;


if ( !function_exists('extract_locations_from_post_content') ):
	function extract_locations_from_post_content($post_content)  {

		$arr = array();

		if (isset($post_content) && $post_content != '') {
				
			if (strpos($post_content, "addresscontent") !== false) {
				$pattern = "/addresscontent=\"(.*?)\"/";
				$found = find_for_regex($pattern, $post_content); 

				if (count($found) > 0) {
					$arr = array_merge($arr, $found);
				}
			}

			if (strpos($post_content, "addmarkerlist") !== false) {
				$pattern = "/addmarkerlist=\"(.*?)\"/";
				$found = find_for_regex($pattern, $post_content); 

				if (count($found) > 0) {
					$arr = array_merge($arr, $found);
				}
			}

			if (strpos($post_content, "latitude") !== false) {

				$pattern = "/latitude=\"(.*?)\"(\s{0,})longitude=\"(.*?)\"/";

				preg_match_all($pattern, $post_content, $matches);

				if (is_array($matches)) {

					if (isset($matches[1]) && is_array($matches[1]) &&
						isset($matches[3]) && is_array($matches[3])) {

						for ($idx = 0; $idx < sizeof($matches[1]); $idx++) {
							
							if (isset($matches[1][$idx]) && isset($matches[3][$idx])) {
								$lat = $matches[1][$idx];
								$lng = $matches[3][$idx];

								if (trim($lat) != "0" && trim($lng) != "0") {
									$arr[] = trim($lat).",".trim($lng);
								}
							}
						}
					}
				}
			}

			$arr = array_unique($arr);
		}
		return $arr;
	}

endif;


if ( !function_exists('find_for_regex') ):

	function find_for_regex($pattern, $post_content)  {
			$arr = array();
			preg_match_all($pattern, $post_content, $matches);

			if (is_array($matches)) {
				if (isset($matches[1]) && is_array($matches[1])) {

					foreach($matches[1] as $key => $value) {
						if (isset($value) && trim($value) != "") {

							if (strpos($value, "|") !== false) {
								$value_arr = explode("|", $value);
								foreach ($value_arr as $value) {
									$arr[$value] = $value;
								}
							} else {
								$arr[$value] = $value;
							}
						}
					}
				}
			}

		return $arr;
	}
endif;



if ( !function_exists('make_marker_geo_mashup') ):

function make_marker_geo_mashup()   {

	$db_markers = cgmp_extract_markers_from_published_posts();

	if (is_array($db_markers) && count($db_markers) > 0) {

		$filtered = array();
		foreach($db_markers as $postID => $locations) {

			foreach($locations as $full_loc) {

				$tobe_filtered_loc = $full_loc;
				if (strpos($full_loc, CGMP_SEP) !== false) {
					$loc_arr = explode(CGMP_SEP, $full_loc);
					$tobe_filtered_loc = $loc_arr[0];
				}

				if (!isset($filtered[$tobe_filtered_loc])) {
					$filtered[$tobe_filtered_loc] = $full_loc;
				}
			}
		}

		$addmarkerlist = implode("|", $filtered);
		$addmarkerlist = update_markerlist_from_legacy_locations(0, 0, "", $addmarkerlist);
		return $addmarkerlist;
	}
}
endif;

?>

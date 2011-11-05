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

function generateWidgetShortcode(container_id) {
	var id = '#' + container_id;
	var code = buildShortcode(id);
	jQuery(id + " #shortcode-placeholder").html(code);
	jQuery(id + " #shortcode-placeholder").show();
	jQuery(id + " #shortcode-placeholder").textSelect('select');
}

function sendShortcodeToEditor(container_id) {
	var id = '#' + container_id;
	var code = buildShortcode(id);
	send_to_editor(code + '<br />');
}

function buildShortcode(id) {
	var code = "[google-map-v3 ";
	jQuery(id + ' .shortcodeitem').each(function() {
			    //alert(jQuery(this).attr('role') + ': ' + jQuery(this).val());
				var role = jQuery(this).attr('role');
				var val =  jQuery(this).attr('value');
				
				if (typeof role == "undefined" || role == "undefined") {
					role = jQuery(this).attr('id');
				}

				if (role != null && role != "" && val != null && val != "") {
					code += role + "=" + "\"" + val + "\" ";
				}
	});
	code = code.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	code += "]";
	return code;
}

function configureSlider(min, max, step, elem) {

	jQuery("div#" + elem).slider("destroy");
	jQuery("div#" + elem).slider({min: min, max: max, step: step, animate: true,
		create: function(event, ui) {
			var sibling = jQuery(this).siblings("input[role=" + elem + "]");
			var siblingId = jQuery(sibling).attr("id");
			var siblingVal = jQuery("input#" + siblingId).attr("value");

			if (siblingVal == null || siblingVal == "") {
				siblingVal = 0;
			}

			jQuery(this).slider("value", siblingVal);
			jQuery(sibling).change(function() {
  				var siblingSlider =  jQuery(this).siblings("div#" + elem);
				siblingSlider.slider("value", jQuery(this).attr("value"));
			});
		},

		change: function(event, ui) {
			var sibling = jQuery(this).siblings("input[role=" + elem + "]");
			var siblingId = jQuery(sibling).attr("id");
			jQuery("input#" + siblingId).attr("value", ui.value);
		},

	 	slide: function(event, ui) {
			var sibling = jQuery(this).siblings("input[role=" + elem + "]");
			var siblingId = jQuery(sibling).attr("id");
			jQuery("input#" + siblingId).attr("value", ui.value);
	}});
}

function initSliders() {
	configureSlider(0, 20, 1, "zoom");
   	configureSlider(0, 90, 1, "latitude");
	configureSlider(-180, 180, 1, "longitude");
	configureSlider(60, 990, 5, "width");
	configureSlider(60, 990, 5, "height");
}

jQuery(document).ready(function() {

	
	initSliders(); 

	jQuery("div#widgets-right .widget-google-map-container a[title]").tooltip({effect : "fade", opacity: 0.8});
	jQuery("#google-map-container-metabox a[title]").tooltip({effect : "fade", opacity: 0.8});

	jQuery("ul.tools-tabs-nav").tabs("div.tools-tab-body", {
        tabs: 'li',
        effect: 'default'
    });
});

jQuery(document).ajaxSuccess(
	function (e, x, o) {
    	jQuery(document).ready(
    		function ($) {
				var indexOf = o.data.indexOf('id_base=comprehensivegooglemap');

				if (indexOf > 0) {
					initSliders();
					
					//console.log(jQuery("div#widgets-right .widget-google-map-container"));
					jQuery("div#widgets-right .widget-google-map-container a[title]").tooltip({effect : "fade", opacity: 0.8});
					jQuery("#google-map-container-metabox a[title]").tooltip({effect : "fade", opacity: 0.8});
				}
			}
		);
	}
);




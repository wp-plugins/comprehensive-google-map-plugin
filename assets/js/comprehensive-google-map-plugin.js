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

					if (role.indexOf("_") > 0) {
						role = role.replace(/_/g,"");
					} if (role.indexOf("hidden") > 0) {
						role = role.replace(/hidden/g,"");
					}		
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
			var value =  ui.value;
			if (!isNumber(step)) {
				value =  ui.value.toFixed(2);
			}
			jQuery("input#" + siblingId).attr("value", value);
		},

	 	slide: function(event, ui) {
			var sibling = jQuery(this).siblings("input[role=" + elem + "]");
			var siblingId = jQuery(sibling).attr("id");
			var value =  ui.value;
			if (!isNumber(step)) {
				value =  ui.value.toFixed(2);
			}
			jQuery("input#" + siblingId).attr("value", value);
	}});
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function initSliders() {
	configureSlider(0, 20, 1, "zoom");
   	configureSlider(-90, 90, 0.01, "latitude");
	configureSlider(-180, 180, 0.01, "longitude");
	configureSlider(60, 990, 5, "width");
	configureSlider(60, 990, 5, "height");
}

function addMarker(id) {
	alert(id);
}

jQuery.TokenListHolder = function (classPath) {
    jQuery.extend(this, jQuery.TokenListHolder.defaultOptions);

	var lists = [];
	jQuery.map(jQuery(classPath), function(element) {
		var id = jQuery(element).attr("id");
		lists.push({id : id, obj: jQuery(element).tokenInput({holderId: id})});
	});

	this.printLists = function() {
		console.log(lists);
	}

	this.getLists = function() {
		return lists;
	}


	this.getListIds = function() {
		var found = [];
		jQuery.map(jQuery(lists), function(element) {
			found.push(element.id);
		});
		return found;
	}


	this.getList = function(listId) {
		var found = {};
		jQuery.map(jQuery(lists), function(element) {
			if (element.id == listId) {
				found = element.obj;
			}
		});
		return found;
	}
}

function initTokenHoldersAndEvent()  {
	var holder = new jQuery.TokenListHolder("div#widgets-right  ul.token-input-list, div#google-map-container-metabox ul.token-input-list");
	var initLists = holder.getLists();

	console.log(initLists);

	jQuery.map(jQuery(initLists), function(element) {
			var hiddenInput = "#" + element.id + "hidden";
			var csv = jQuery(hiddenInput).val();

			if (csv != null && csv != "") {
				var holderList = element.obj;
				var locations = csv.split("|");
				jQuery.map(locations, function (element) {
        			holderList.add(element);
				});
			}
	});

	jQuery("input.add-additonal-location").click(function () {
				
				var listId = jQuery(this).attr("id") + "list";
				var tokenList = holder.getList(listId);
				var targetInput = "#" + jQuery(this).attr("id") + "input";
			
				if (jQuery(targetInput).val() != null && jQuery(targetInput).val() != "") {
					var target = jQuery(targetInput).val().replace(/^\s+|\s+$/g, '');
//http://stackoverflow.com/questions/1997616/regex-for-password-that-requires-one-numeric-or-one-non-alphanumeric-character
					var chars = /^(?=.*(\d|[a-zA-Z])).{5,}$/;
					var hasValidChars = chars.test(target);
					if (hasValidChars) {
						tokenList.add(target);
					} else {
						jQuery(targetInput).fadeIn("slow", function() {
								jQuery(this).addClass("errorToken");
						});
					}
				}
            	
            	jQuery(targetInput).val("");
            	jQuery(targetInput).focus().fadeOut(function() {
						jQuery(this).removeClass("errorToken");
						jQuery(this).fadeIn("slow");
				});
                return false;
    });
}

jQuery(document).ready(function() {

	initTokenHoldersAndEvent();
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
					initTokenHoldersAndEvent();
					initSliders();
					//console.log(jQuery("div#widgets-right .widget-google-map-container"));
					jQuery("div#widgets-right .widget-google-map-container a[title]").tooltip({effect : "fade", opacity: 0.8});
					jQuery("#google-map-container-metabox a[title]").tooltip({effect : "fade", opacity: 0.8});
				}
			}
		);
	}
);




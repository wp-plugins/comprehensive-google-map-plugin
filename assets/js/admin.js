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

var jQueryCgmp = jQuery.noConflict();

function generateWidgetShortcode(container_id) {
	var id = '#' + container_id;
	var code = buildShortcode(id);
	jQueryCgmp(id + " #shortcode-placeholder").html(code);
	jQueryCgmp(id + " #shortcode-placeholder").show();
	jQueryCgmp(id + " #shortcode-placeholder").textSelect('select');
}

function sendShortcodeToEditor(container_id) {
	var id = '#' + container_id;
	var code = buildShortcode(id);
	send_to_editor(code + '<br />');
}

function buildShortcode(id) {
	var code = "[google-map-v3 ";
	jQueryCgmp(id + ' .shortcodeitem').each(function() {
			    //alert(jQueryCgmp(this).attr('role') + ': ' + jQueryCgmp(this).val());
				var role = jQueryCgmp(this).attr('role');
				var val =  jQueryCgmp(this).attr('value');

				if (jQueryCgmp(this).attr('type') == "checkbox") {
					val = jQueryCgmp(this).is(":checked");
				}

				if (jQueryCgmp(this).attr('type') == "radio") {
					var name = jQueryCgmp(this).attr('name');
					val = jQueryCgmp('input[name=' + name + ']:checked').val();
					role = name;
				}
				
				if (typeof role == "undefined" || role == "undefined") {
					role = jQueryCgmp(this).attr('id');
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

	jQueryCgmp("div#" + elem).slider("destroy");
	jQueryCgmp("div#" + elem).slider({min: min, max: max, step: step, animate: true,
		create: function(event, ui) {
			var sibling = jQueryCgmp(this).siblings("input[role=" + elem + "]");
			var siblingId = jQueryCgmp(sibling).attr("id");
			var siblingVal = jQueryCgmp("input#" + siblingId).attr("value");

			if (siblingVal == null || siblingVal == "") {
				siblingVal = 0;
			}

			jQueryCgmp(this).slider("value", siblingVal);
			jQueryCgmp(sibling).change(function() {
  				var siblingSlider =  jQueryCgmp(this).siblings("div#" + elem);
				siblingSlider.slider("value", jQueryCgmp(this).attr("value"));
			});
		},

		change: function(event, ui) {
			var sibling = jQueryCgmp(this).siblings("input[role=" + elem + "]");
			var siblingId = jQueryCgmp(sibling).attr("id");
			var value =  ui.value;
			if (!isNumber(step)) {
				value =  ui.value.toFixed(5);
			}
			jQueryCgmp("input#" + siblingId).attr("value", value);
		},

	 	slide: function(event, ui) {
			var sibling = jQueryCgmp(this).siblings("input[role=" + elem + "]");
			var siblingId = jQueryCgmp(sibling).attr("id");
			var value =  ui.value;
			if (!isNumber(step)) {
				value =  ui.value.toFixed(5);
			}
			jQueryCgmp("input#" + siblingId).attr("value", value);
	}});
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function initSliders() {
	configureSlider(0, 20, 1, "zoom");
   	configureSlider(-90, 90, 0.00001, "latitude");
	configureSlider(-180, 180, 0.00001, "longitude");
	configureSlider(60, 990, 5, "width");
	configureSlider(60, 990, 5, "height");
}

function initTooltips()  {

	jQueryCgmp('a.google-map-tooltip-marker').hover(function() {

		var tooltip_marker_id = jQueryCgmp(this).attr('id');

		jQueryCgmp("a#" + tooltip_marker_id + "[title]").tooltip({
			effect: 'slide',
			opacity: 0.8,
			tipClass : "google-map-tooltip",
			offset: [-5, 0],
			events: {
  				def: "click, mouseleave"
			}
		});

		jQueryCgmp("a#" + tooltip_marker_id).mouseout(function(event) {
			if (jQueryCgmp(this).data('tooltip')) {
  				jQueryCgmp(this).data('tooltip').hide();
			}
		});
	});
}


jQueryCgmp.TokenListHolder = function (classPath) {
    jQueryCgmp.extend(this, jQueryCgmp.TokenListHolder.defaultOptions);

	var lists = [];
	jQueryCgmp.map(jQueryCgmp(classPath), function(element) {
		var id = jQueryCgmp(element).attr("id");

		if (id != null) {
			lists.push({id : id, obj: jQueryCgmp(element).tokenInput({holderId: id})});
		}
	});

	this.printLists = function() {
		//console.log(lists);
	}

	this.getLists = function() {
		return lists;
	}


	this.getListIds = function() {
		var found = [];
		jQueryCgmp.map(jQueryCgmp(lists), function(element) {
			found.push(element.id);
		});
		return found;
	}


	this.getList = function(listId) {
		var found = {};
		jQueryCgmp.map(jQueryCgmp(lists), function(element) {
			if (element.id == listId) {
				found = element.obj;
			}
		});
		return found;
	}
}

function fadeInOutOnError(targetInput)  {

		jQueryCgmp(targetInput).fadeIn("slow", function() {
			jQueryCgmp(this).addClass("errorToken");
		});

     	jQueryCgmp(targetInput).focus().fadeOut(function() {
			jQueryCgmp(this).removeClass("errorToken");
			jQueryCgmp(this).fadeIn("slow");
		});

}

function hideShowCustomMarker(hiddenElemId) {

		if (hiddenElemId.indexOf('_i_') == -1) {
			var val = jQueryCgmp('#' + hiddenElemId).val();
			var checkboxId = hiddenElemId.replace("hidden", "");
			var customIconsId = checkboxId.replace("mashup", "icons");
			var kmlId = checkboxId.replace("addmarkermashup", "kml");


			if (val == 'true') {
				jQueryCgmp("#" + kmlId).closest("fieldset").hide();
				jQueryCgmp("#" + customIconsId).closest("fieldset").hide();
				jQueryCgmp("#" + checkboxId).attr("checked", "checked");
			} else {
				jQueryCgmp("#" + kmlId).closest("fieldset").show();
				jQueryCgmp("#" + customIconsId).closest("fieldset").show();
				jQueryCgmp("#" + checkboxId).removeAttr("checked");
			}
		}
}

function initGeoMashupEvent() {

		jQueryCgmp("input.marker-geo-mashup").change(function (source) {
			var checkboxId = jQueryCgmp(this).attr("id");
			var customIconsId = checkboxId.replace("mashup", "icons");
			var kmlId = checkboxId.replace("addmarkermashup", "kml");

			if (jQueryCgmp(this).is(":checked")) {
				jQueryCgmp("#" + kmlId).closest("fieldset").fadeOut();
				jQueryCgmp("#" + customIconsId).closest("fieldset").fadeOut();
				jQueryCgmp("#" + checkboxId + "hidden").val("true");
			} else {
				jQueryCgmp("#" + kmlId).closest("fieldset").fadeIn();
				jQueryCgmp("#" + customIconsId).closest("fieldset").fadeIn();
				jQueryCgmp("#" + checkboxId + "hidden").val("false");
			}
		});
}

function initTokenHoldersAndEvent()  {
	var holder = new jQueryCgmp.TokenListHolder("div#widgets-right  ul.token-input-list, div#google-map-container-metabox ul.token-input-list");
	var initLists = holder.getLists();

	//console.log(initLists);

		jQueryCgmp.map(jQueryCgmp(initLists), function(element) {
			var hiddenInput = "#" + element.id + "hidden";
			var csv = jQueryCgmp(hiddenInput).val();

			if (csv != null && csv != "") {
				var holderList = element.obj;
				var locations = csv.split("|");
				jQueryCgmp.map(locations, function (element) {
        			holderList.add(element);
				});
			}
		});

	jQueryCgmp("input.add-additonal-location").click(function (source) {

				var listId = jQueryCgmp(this).attr("id") + "list";
				var tokenList = holder.getList(listId);
				var targetInput = "#" + jQueryCgmp(this).attr("id") + "input";

				var customIconListId = "#" + jQueryCgmp(this).attr("id") + "icons";
				var selectedIcon = jQueryCgmp(customIconListId + " input[name='custom-icons-radio']:checked").val();

				if (jQueryCgmp(targetInput).val() != null && jQueryCgmp(targetInput).val() != "") {
					var target = jQueryCgmp(targetInput).val().replace(/^\s+|\s+$/g, '');
//http://stackoverflow.com/questions/1997616/regex-for-password-that-requires-one-numeric-or-one-non-alphanumeric-character
					var chars = /^(?=.*(\d|[a-zA-Z])).{5,}$/;
					var hasValidChars = chars.test(target);
					if (hasValidChars) {

						//console.log(target + CGMPGlobal.sep + selectedIcon);
						tokenList.add(target + CGMPGlobal.sep + selectedIcon);

						resetPreviousIconSelection(jQueryCgmp(customIconListId));

						jQueryCgmp(customIconListId + " img#default-marker-icon").attr("style", "cursor: default; ");
						jQueryCgmp(customIconListId + " img#default-marker-icon").addClass('selected-marker-image');
						jQueryCgmp(customIconListId + " input#default-marker-icon-radio").attr('checked', 'checked');

						jQueryCgmp(targetInput).attr("style", "");
						jQueryCgmp(targetInput).addClass("default-marker-icon");
						jQueryCgmp(targetInput).val("");
						jQueryCgmp(targetInput).focus();


					} else {
						fadeInOutOnError(targetInput);
					}
				} else {
					fadeInOutOnError(targetInput);
				}

            	return false;
    });
}

function resetPreviousIconSelection(parentDiv)  {
	
		jQueryCgmp.each(parentDiv.children(), function() {
   			var liImg = jQueryCgmp(this).find("img");

			if (liImg != null) {
				jQueryCgmp(liImg).attr("style", "");
				jQueryCgmp(liImg).removeClass('selected-marker-image');
			}
		});
}

function doMarkerIconUpdateOnSelection(parentDiv, img)  {

	jQueryCgmp(img).attr("style", "cursor: default; ");
	jQueryCgmp(img).addClass('selected-marker-image');

	var currentSrc = jQueryCgmp(img).attr('src');
	var inputId = jQueryCgmp(parentDiv).attr("id").replace("icons", "input");
	jQueryCgmp("#" + inputId).attr("style", "background: url('" + currentSrc + "') no-repeat scroll 0px 0px #F9F9F9 !important");
	jQueryCgmp("#" + inputId).removeClass("default-marker-icon");
	jQueryCgmp("#" + inputId).focus();

}

function initMarkerIconEvents() {
	//jQueryCgmp('img.nomarker').attr("style", "cursor: default; background-color: green; border-radius: 3px 3px 3px 3px;");

	jQueryCgmp("div.custom-icons-placeholder a img").click(function () {
		
			var currentSrc = jQueryCgmp(this).attr('src');
			if (currentSrc != null) {

					var parentDiv = jQueryCgmp(this).closest("div.custom-icons-placeholder");
					resetPreviousIconSelection(parentDiv);

					jQueryCgmp(this).parent("a").siblings('input[name="custom-icons-radio"]').attr("checked", "checked");
					doMarkerIconUpdateOnSelection(parentDiv, jQueryCgmp(this));
			}
	});


	jQueryCgmp("input[name='custom-icons-radio']").click(function () {

			var img = jQueryCgmp(this).siblings("a").children('img');
			var currentSrc = jQueryCgmp(img).attr('src');
			if (currentSrc != null) {

					var parentDiv = jQueryCgmp(this).closest("div.custom-icons-placeholder");
					resetPreviousIconSelection(parentDiv);

					doMarkerIconUpdateOnSelection(parentDiv, img);
			}
	});

}

jQueryCgmp(document).ready(function() {

	initTokenHoldersAndEvent();
	initSliders(); 
	initTooltips();
	initMarkerIconEvents();
	initGeoMashupEvent() ;

	//jQueryCgmp("fieldset.collapsible").collapse( { closed : true } );

	jQueryCgmp("ul.tools-tabs-nav").tabs("div.tools-tab-body", {
        tabs: 'li',
        effect: 'default'
    });
});

jQueryCgmp(document).ajaxSuccess(
	function (e, x, o) {
    	jQueryCgmp(document).ready(
    		function ($) {
				
				if (o.data != null)	{
				
					var indexOf = o.data.indexOf('id_base=comprehensivegooglemap');

					if (indexOf > 0) {
						initTokenHoldersAndEvent();
						initSliders();
						initTooltips();
						initMarkerIconEvents();
						initGeoMashupEvent() ;

						//jQueryCgmp("fieldset.collapsible").collapse( { closed : true } );

					}
				}
			}
		);
	}
);


/**
 * CHANGES
 * v.2.1.3 - Made it $.noConflict() compatible
 * v.2.1.2 - Fixed bug in which nested fieldsets do not work correctly.
 * v.2.1.1 - Forgot to put the new filter from v.2.1 into the if (settings.closed)
 * v.2.1 - Changed jQuery(this).parent().children().filter( ELEMENTS HERE) to jQuery(this).parent().children().not('label').  Prevents you from having to guess what elements will be in the fieldset.
 * v.2.0 - Added settings to allow a fieldset to be initiated as closed.
 *
 * This script may be used by anyone, but please link back to me.
 *
 * Copyright 2009-2010.  Michael Irwin (http://michael.theirwinfamily.net)
 */
       
jQueryCgmp.fn.collapse = function(options) {
	var defaults = {
		closed : false
	}
	settings = jQueryCgmp.extend({}, defaults, options);

	return this.each(function() {
		var obj = jQueryCgmp(this);
		obj.find("legend:first").addClass('collapsible').click(function() {

			if (obj.hasClass('collapsed')) {
				obj.removeClass('collapsed').addClass('collapsible');
			}
	
			jQueryCgmp(this).removeClass('collapsed');
			var legendHtml = obj.find("legend").html(); 
			legendHtml = legendHtml.replace("+", "-");
			obj.find("legend").html(legendHtml);

	
			obj.children().not('legend').toggle("fast", function() {

				 if (jQueryCgmp(this).is(":visible")) {
						obj.find("legend:first").addClass('collapsible');
					}
				 else {
						obj.addClass('collapsed').find("legend").addClass('collapsed');
						var legendHtml = obj.find("legend").html(); 
						legendHtml = legendHtml.replace("-", "+");
						obj.find("legend").html(legendHtml);

					}
			 });
		});
		if (settings.closed) {
			obj.addClass('collapsed').find("legend:first").addClass('collapsed');

			var legendHtml = obj.find("legend").html(); 
			obj.find("legend").html(legendHtml + " [<b><font size='3px'>+</font></b>]");

			obj.children().not("legend:first").css('display', 'none');
		}
	});
};

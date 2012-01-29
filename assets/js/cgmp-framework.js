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

jQuery.GoogleMapOrchestrator = function (map, options) {
	
	if (typeof google == "undefined" || !google) {
    	Logger.fatal("We do not have reference to Google API. Aborting..");
    	return false;
	}
	 
    jQuery.extend(this, jQuery.GoogleMapOrchestrator.defaultOptions);
    jQuery.GoogleMapOrchestrator.AnimationType = {DROP : 0, BOUNCE : 1};
	jQuery.GoogleMapOrchestrator.LayerType = {TRAFFIC : 0, BIKE : 1, KML : 2, PANORAMIO: 3};
    jQuery.GoogleMapOrchestrator.ControlType = {PAN: 0, ZOOM: 1, SCALE: 2, STREETVIEW: 3, MAPTYPE: 4};
    
    var options = options || {};
    var placeHolder = options.placeHolder || "map";
    var zoom = options.zoom || 16;
    var mapType = options.mapType || google.maps.MapTypeId.ROADMAP;
	var bubbleAutoPan = options.bubbleAutoPan || "true";

    var googleMap = map;
    googleMap.setOptions({
	   		zoom: zoom,
	      	mapTypeId: mapType,
	      	mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
    });

    
    var layerBuilder = new jQuery.LayerBuilder(googleMap);
    var builder = new jQuery.MarkerBuilder(googleMap, bubbleAutoPan);
   
   	google.maps.event.addListener(googleMap, 'click', function () {
		builder.shiftMapToOriginalZoomAndLocation();
	});

    function sanityCheck() {
    	if (typeof googleMap == "undefined" || !googleMap || googleMap == null ) {
        	Logger.fatal("We do not have instance of the Google API object. Aborting..");
        	return false;
        }
    	return true;
    }
	
        
    this.buildAddressMarkers = function (additionalMarkerLocations) {
    	if (!sanityCheck()) {
    		return false;
    	}
    	builder.buildAddressMarkers(additionalMarkerLocations);
    }
    
    this.buildLayer = function (type, kml, panoramiouid) {
    	if (!sanityCheck()) {
    		return false;
    	}
    	switch (type) {
    		case jQuery.GoogleMapOrchestrator.LayerType.TRAFFIC:
    			layerBuilder.buildTrafficLayer();
    		break;
    		
    		case jQuery.GoogleMapOrchestrator.LayerType.BIKE:
    			layerBuilder.buildBikeLayer();
    		break;
    		
    		case jQuery.GoogleMapOrchestrator.LayerType.PANORAMIO:
				if (panoramiouid != null && panoramiouid != "") {
    	        	Logger.info("Going to filter Panoramio images by " + panoramiouid);
					layerBuilder.buildPanoramioLayer(panoramiouid);
    	        } else {
    				layerBuilder.buildPanoramioLayer();
				}
    		break;
    		
    		case jQuery.GoogleMapOrchestrator.LayerType.KML:
    			if (kml == null || kml == "") {
    	        	Logger.error("KML URL must be passed for the KML Layer. Aborting..");
    	        	return false;
    	        }
    			layerBuilder.buildKmlLayer(kml);
    		break;
    		
    		default:
    			Logger.warn("Unknown layer type: " + type);
    	}
    }
    
    this.switchMapControl = function(isOn, mapControlType) {
    	
    	if (!sanityCheck()) {
    		return false;
    	}
    	
    	switch (mapControlType) {
	    	case jQuery.GoogleMapOrchestrator.ControlType.MAPTYPE:
				googleMap.setOptions({mapTypeControl: isOn});
			break;
		
		    case jQuery.GoogleMapOrchestrator.ControlType.PAN:
				googleMap.setOptions({panControl: isOn});
			break;
			
		    case jQuery.GoogleMapOrchestrator.ControlType.ZOOM:
				googleMap.setOptions({zoomControl: isOn});
			break;
			
		    case jQuery.GoogleMapOrchestrator.ControlType.SCALE:
				googleMap.setOptions({scaleControl: isOn});
			break;
			
		    case jQuery.GoogleMapOrchestrator.ControlType.STREETVIEW:
				googleMap.setOptions({streetViewControl: isOn});
			break;
			
		    default:
    			Logger.warn("Unknown map control type: " + mapControlType);
    	}
    }
}

jQuery.Utils = function () {
    jQuery.extend(this, jQuery.Utils.defaultOptions);

    var addressRegex = /^([a-zA-Z0-9?(/\-.,\s{1,})]+)$/;
    var numericRegex = /^([0-9?(\-.,\s{1,})]+)$/;

    this.isNumeric = function (subject) {
        return numericRegex.test(subject);
    }

    this.isAlphaNumeric = function (subject) {
        return addressRegex.test(subject);
    }
}

jQuery.LayerBuilder = function (map) {
    jQuery.extend(this, jQuery.LayerBuilder.defaultOptions);

    var googleMap = map;
    
    this.buildTrafficLayer = function () {
    	var trafficLayer = new google.maps.TrafficLayer();
		trafficLayer.setMap(googleMap);
    }

    this.buildBikeLayer = function () {
    	var bikeLayer = new google.maps.BicyclingLayer();
    	bikeLayer.setMap(googleMap);
    }
    
    this.buildPanoramioLayer = function (userId) {
    	if (typeof google.maps.panoramio == "undefined" || !google.maps.panoramio || google.maps.panoramio == null ) {
        	Logger.error("We cannot access Panoramio library. Aborting..");
        	return false;
        }
    	var panoramioLayer = new google.maps.panoramio.PanoramioLayer();
		if (panoramioLayer) {
			if (userId != null && userId != "") {
				panoramioLayer.setUserId(userId);
			}
    		panoramioLayer.setMap(googleMap);
		} else {
			Logger.error("Could not instantiate Panoramio object. Aborting..");
		}
    }
    
    this.buildKmlLayer = function (url) {
    	if (url.toLowerCase().indexOf("http") < 0) {
        	Logger.error("KML URL must start with HTTP(S). Aborting..");
        	return false;
        }
    	var kmlLayer = new google.maps.KmlLayer(url);
    	kmlLayer.setMap(googleMap);
    }
}

jQuery.MarkerBuilder = function (map, bubbleAutoPan) {
    jQuery.extend(this, jQuery.MarkerBuilder.defaultOptions);

    var markers = [];
    var storedAddresses = [];
    var timeout = null;
    var directionControlsBinded = false;
    var googleMap = map;
    var csvString = null;
	var bubbleAutoPan = bubbleAutoPan;
	var originalExtendedBounds = null;
	var originalMapCenter = null;
	var updatedZoom = 5;
	var mapDivId = googleMap.getDiv().id;
    var utils = new jQuery.Utils();
    var geocoder = new google.maps.Geocoder();
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();
	var streetViewService = new google.maps.StreetViewService();

	var rendererOptions = {
    	draggable: true
  	};
	var directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
	directionsRenderer.setPanel(document.getElementById('rendered-directions-placeholder-' + mapDivId));
	var directionsService = new google.maps.DirectionsService();

	function resetMap()  {
		if (originalExtendedBounds != null) {
			if (googleMap.setCenter() != originalExtendedBounds.getCenter()) {
				Logger.info("Panning map back to its original bounds center: " + originalExtendedBounds.getCenter() + " and updated zoom: " + updatedZoom);
    			googleMap.setCenter(originalExtendedBounds.getCenter());
				googleMap.setZoom(updatedZoom);
			}
		} else 	if (originalMapCenter != null) {
			Logger.info("Panning map back to its original center: " + originalMapCenter  + " and updated zoom: " + updatedZoom);
    		googleMap.setCenter(originalMapCenter);
			googleMap.setZoom(updatedZoom);
		}
	}

	function resetDirectionAddressFields(dirDivId)  {
		jQuery(dirDivId + ' input#a_address').val('');
		jQuery(dirDivId + ' input#b_address').val('');
		jQuery(dirDivId + ' input#a_address').removeClass('d_error');
		jQuery(dirDivId + ' input#b_address').removeClass('d_error');
	}

    function attachEventlistener(marker) {

		var localBubbleData = buildBubble(marker.content);
		var dirDivId = 'div#direction-controls-placeholder-' + mapDivId;
		var targetDiv = jQuery("div#rendered-directions-placeholder-" + mapDivId);

		google.maps.event.addListener(marker, 'click', function () {

		  	resetDirectionAddressFields(dirDivId);

			jQuery(dirDivId).fadeOut();
			directionsRenderer.setMap(null);
			targetDiv.html("");
			targetDiv.hide();
			jQuery(dirDivId + ' button#print_sub').hide();

			infowindow.setContent(localBubbleData.bubbleContent);
			infowindow.setOptions({disableAutoPan: bubbleAutoPan == "true" ? false : true });
            infowindow.open(map, this);
        });

		validateMarkerStreetViewExists(marker, localBubbleData, dirDivId);
		attachEventstoDirectionControls(marker, localBubbleData, dirDivId, targetDiv);
    }

	function attachEventstoDirectionControls(marker, localBubbleData, dirDivId, targetDiv)  {

		var parentInfoBubble = 'div#bubble-' + localBubbleData.bubbleHolderId;
		var splittedAddr = marker.content.split("<br />Lat/Long: ");

		splittedAddr[0] = splittedAddr[0].replace("Lat/Long: ", "");

		jQuery(parentInfoBubble + ' a.dirToHereTrigger').live("click", function() {
  			var thisId = this.id;
			if (thisId == 'toHere-' + localBubbleData.bubbleHolderId) {
				jQuery(dirDivId).fadeIn();
				jQuery(dirDivId + ' input#a_address').val('');
				jQuery(dirDivId + ' input#b_address').val(splittedAddr[0]);
				jQuery(dirDivId + ' input#radio_miles').attr("checked", "checked");
			}
		});

		jQuery(parentInfoBubble + ' a.dirFromHereTrigger').live("click", function() {
  			var thisId = this.id;
			if (thisId == 'fromHere-' + localBubbleData.bubbleHolderId) {
				jQuery(dirDivId).fadeIn();
				jQuery(dirDivId + ' input#a_address').val(splittedAddr[0]);
				jQuery(dirDivId + ' input#b_address').val('');
				jQuery(dirDivId + ' input#radio_miles').attr("checked", "checked");
			}
		});

		jQuery(dirDivId + ' div.d_close-wrapper').live("click", function(event) {

				resetDirectionAddressFields(dirDivId);

  				jQuery(this).parent().fadeOut();
				directionsRenderer.setMap(null);
				targetDiv.html("");
				targetDiv.hide();
				jQuery(dirDivId + ' button#print_sub').hide();
				resetMap();

				return false;
		});
	}

	function validateMarkerStreetViewExists(marker, localBubbleData, dirDivId)  {

		streetViewService.getPanoramaByLocation(marker.position, 50, function (streetViewPanoramaData, status) {
    		if (status === google.maps.StreetViewStatus.OK) {
        		// ok
					jQuery('a#trigger-' + localBubbleData.bubbleHolderId).live("click", function() {

						var panoramaOptions = {
								navigationControl: true,
								enableCloseButton: true,
								addressControl: false,
								linksControl: true,
								scrollwheel: false,
								addressControlOptions: {
    								position: google.maps.ControlPosition.BOTTOM
  								},
								position: marker.position,
								pov: {
									heading: 165,
									pitch:0,
									zoom:1
								}
						};	

						var pano = new google.maps.StreetViewPanorama(document.getElementById("bubble-" + localBubbleData.bubbleHolderId), panoramaOptions);
						pano.setVisible(true);

						google.maps.event.addListener(infowindow, 'closeclick', function() {

							resetDirectionAddressFields(dirDivId);
  							jQuery(dirDivId).fadeOut();

							if (pano != null) {
								pano.unbind("position");
								pano.setVisible(false);
							}

							pano = null;
						});

						google.maps.event.addListener(pano, 'closeclick', function() {
							if (pano != null) {
								pano.unbind("position");
								pano.setVisible(false);
								jQuery('div#bubble-' + localBubbleData.bubbleHolderId).css("background", "none");
							}

							pano = null;
						});

					//}
				});
    		} else {
        		// no street view available in this range, or some error occurred
				Logger.warn("There is not street view available for this marker location: " + marker.position + " status: " + status);
				jQuery('a#trigger-' + localBubbleData.bubbleHolderId).live("click", function(e) {
					e.preventDefault();
				});
				jQuery('a#trigger-' + localBubbleData.bubbleHolderId).attr("style", "text-decoration: none !important; color: #ddd !important");

				google.maps.event.addListener(infowindow, 'domready', function () {
					jQuery('a#trigger-' + localBubbleData.bubbleHolderId).removeAttr("href");
					jQuery('a#trigger-' + localBubbleData.bubbleHolderId).attr("style", "text-decoration: none !important; color: #ddd !important");
				});
    		}
		});
	}


	function bindDirectionControlsToEvents()  {

		var dirDivId = 'div#direction-controls-placeholder-' + mapDivId;
		var targetDiv = jQuery("div#rendered-directions-placeholder-" + mapDivId);

		jQuery(dirDivId + ' a#reverse-btn').live("click", function(e) {

				var old_a_addr = jQuery(dirDivId + ' input#a_address').val();
				var old_b_addr = jQuery(dirDivId + ' input#b_address').val();

				jQuery(dirDivId + ' input#a_address').val(old_b_addr);
				jQuery(dirDivId + ' input#b_address').val(old_a_addr);
				return false;
		});

		jQuery(dirDivId + ' a#d_options_show').live("click", function() {
				jQuery(dirDivId + ' a#d_options_hide').show();
				jQuery(dirDivId + ' a#d_options_show').hide();
				jQuery(dirDivId + ' div#d_options').show();
				return false;
		});

		jQuery(dirDivId + ' a#d_options_hide').live("click", function() {
				jQuery(dirDivId + ' a#d_options_hide').hide();
				jQuery(dirDivId + ' a#d_options_show').show();
				jQuery(dirDivId + ' div#d_options').hide();
				jQuery(dirDivId + ' input#avoid_hway').removeAttr("checked");
				jQuery(dirDivId + ' input#avoid_tolls').removeAttr("checked");
				jQuery(dirDivId + ' input#radio_km').removeAttr("checked");
				jQuery(dirDivId + ' input#radio_miles').attr("checked", "checked");
				return false;
		});
//
		jQuery(dirDivId + ' button#d_sub').live("click", function() {
				var old_a_addr = jQuery(dirDivId + ' input#a_address').val();
				var old_b_addr = jQuery(dirDivId + ' input#b_address').val();
				var halt = false;
				if (old_a_addr == null || old_a_addr == '') {
					jQuery(dirDivId + ' input#a_address').addClass('d_error');
					halt = true;
				}
	
				if (old_b_addr == null || old_b_addr == '') {
					jQuery(dirDivId + ' input#b_address').addClass('d_error');
					halt = true;
				}

				if (!halt) {

					jQuery(dirDivId + ' button#d_sub').attr('disabled', 'disabled').html("Please wait..");
					// Query direction service
					var travelMode = google.maps.DirectionsTravelMode.DRIVING;
					if (jQuery(dirDivId + ' a#dir_w_btn').hasClass('selected')) {
						travelMode = google.maps.DirectionsTravelMode.WALKING;
					}

					var is_avoid_hway = jQuery(dirDivId + ' input#avoid_hway').is(":checked");
					var is_avoid_tolls = jQuery(dirDivId + ' input#avoid_tolls').is(":checked");
					var is_miles = jQuery(dirDivId + ' input#radio_miles').is(":checked");
					var unitSystem = google.maps.DirectionsUnitSystem.METRIC;

					var request = {
  						origin: old_a_addr,
  						destination: old_b_addr,
  						travelMode: travelMode,
  						provideRouteAlternatives: true
					};

					if (is_avoid_hway) {
						request.avoidHighways = true;
					} 

					if (is_avoid_tolls) {
						request.avoidTolls = true;
					}

					if (is_miles) {
						request.unitSystem = google.maps.DirectionsUnitSystem.IMPERIAL;
					} else {
						request.unitSystem = google.maps.DirectionsUnitSystem.METRIC;
					}

					directionsService.route(request, function(response, status) {

						if (status == google.maps.DirectionsStatus.OK) {
							targetDiv.html("");
							targetDiv.show();
							directionsRenderer.setMap(googleMap);
							directionsRenderer.setDirections(response);
							jQuery(dirDivId + ' button#d_sub').removeAttr('disabled').html("Get directions");
							jQuery(dirDivId + ' button#print_sub').fadeIn();
							infowindow.close();

						} else {
		    				Logger.error('Could not route directions from "' + old_a_addr + '" to "' + old_b_addr + '", got result from Google: ' + status);
							targetDiv.html("<span style='font-size: 12px; font-weight: bold; color: red'>Could not route directions from<br />'" + old_a_addr + "' to<br />'" + old_b_addr + "'<br />Got result from Google: [" + status + "]</span>");

							jQuery(dirDivId + ' button#print_sub').hide();
							jQuery(dirDivId + ' button#d_sub').removeAttr('disabled').html("Get directions");
  						}
					});
				}
		});

		jQuery(dirDivId + ' button#print_sub').live("click", function() {
			var old_a_addr = jQuery(dirDivId + ' input#a_address').val();
			var old_b_addr = jQuery(dirDivId + ' input#b_address').val();

			var dirflag = "d";
			if (jQuery(dirDivId + ' a#dir_w_btn').hasClass('selected')) {
				dirflag = "w";
			}

			var url = "http://maps.google.com/?saddr=" + old_a_addr + "&daddr=" + old_b_addr + "&dirflg=" + dirflag + "&pw=2";
			var is_miles = jQuery(dirDivId + ' input#radio_miles').is(":checked");
			if (is_miles) {
				url += "&doflg=ptm";
			}

			window.open( url );
        	return false;
		});

		jQuery(dirDivId + ' input#a_address').live("change", function() {
			jQuery(dirDivId + ' input#a_address').removeClass('d_error');
			return false;
		});

		jQuery(dirDivId + ' input#b_address').live("change", function() {
			jQuery(dirDivId + ' input#b_address').removeClass('d_error');
			return false;
		});

		jQuery(dirDivId + ' input#a_address').live("focus", function() {
			jQuery(dirDivId + ' input#a_address').removeClass('d_error');
			return false;
		});

		jQuery(dirDivId + ' input#b_address').live("focus", function() {
			jQuery(dirDivId + ' input#b_address').removeClass('d_error');
			return false;
		});

		jQuery(dirDivId + ' .kd-button').live("click", function() {
			var thisId = this.id;

			if (thisId == 'dir_d_btn') {
				if (jQuery(dirDivId + ' a#dir_d_btn').hasClass('selected')) {
					Logger.warn("Driving travel mode is already selected");
				} else {
					jQuery(dirDivId + ' a#dir_d_btn').addClass('selected');
					jQuery(dirDivId + ' a#dir_w_btn').removeClass('selected');
				}
			} else 	if (thisId == 'dir_w_btn') {
				if (jQuery(dirDivId + ' a#dir_w_btn').hasClass('selected')) {
					Logger.warn("Walking travel mode is already selected");
				} else {
					jQuery(dirDivId + ' a#dir_w_btn').addClass('selected');
					jQuery(dirDivId + ' a#dir_d_btn').removeClass('selected');
				}
			}

			return false;
		});

	}

	function buildBubble(contentFromMarker) {

		var localBubbleData = [];
		var randomNumber = Math.floor(Math.random() * 111111);

		randomNumber = randomNumber + "-" + mapDivId;

		var	bubble = "<div id='bubble-" + randomNumber + "' style='height: 130px !important; width: 300px !important;' class='bubble-content'>";
		bubble += "<h4>Address:</h4>";
		bubble += "<p style='text-align: left'>" + contentFromMarker + "</p>";
		bubble += "<hr />";
		bubble += "<p style='text-align: left'>Directions: <a id='toHere-" + randomNumber + "' class='dirToHereTrigger' href='javascript:void(0);'>To here</a> - <a id='fromHere-" + randomNumber + "' class='dirFromHereTrigger' href='javascript:void(0);'>From here</a> | <a id='trigger-" + randomNumber + "' class='streetViewTrigger' href='javascript:void(0);'>Street View</a></p>";
		bubble += "</div>";

		return {bubbleHolderId : randomNumber, bubbleContent: bubble};
	}

    function parseCsv() {
        csvString = csvString.replace(new RegExp("'", "g"), "");

		Logger.info("Current CSV with locations: " + csvString);

        var locations = csvString.split("|");

		Logger.info("Exploded CSV into locations: " + locations);

        for (var i = 0; i < locations.length; i++) {
            var target = locations[i];
            if (target != null && target != "") {
				target = target.replace(/^\s+|\s+$/g, '');
				if (target == "") {
					Logger.warn("Given extra marker address is empty");
					continue;
				}
            	pushGeoDestination(target, (i + 1));
            }
        }
    }
    
    function pushGeoDestination(target, index) {

		 var targetArr = target.split(CGMPGlobal.sep);

    	 if (utils.isNumeric(targetArr[0])) {
    		 addGeoPoint(targetArr[0], index, targetArr[1]);
         } else if (utils.isAlphaNumeric(targetArr[0])) {
             storeAddress(targetArr[0], index, targetArr[1]);
         } else {
			 storeAddress(targetArr[0], index, targetArr[1]);
             Logger.warn("Unknown type of geo destination in regexp: " + targetArr[0] + ", fallingback to store it as an address");
         }
    }

    function storeAddress(address, zIndex, markerIcon) {
			
			Logger.info("Storing address: " + address + " for marker-to-be");
			storedAddresses.push({
            	address: address,
				animation: google.maps.Animation.DROP,
            	zIndex: zIndex,
				markerIcon: markerIcon
        	});
		}
    
    function addGeoPoint(point, zIndex, markerIcon) {
    	if (point == null || !point) {
			Logger.warn("Given GEO point containing Lat/Long is NULL");
    		return false;
    	}
        
		var latLng = point;
        if (!(latLng instanceof google.maps.LatLng)) {
        	if (point.indexOf(",") != -1) {
        		var latlngStr = point.split(",",4);

				if (latlngStr == null || latlngStr.length != 2) {
					Logger.warn("Exploded lat/long array is NULL or does not have length of two");
					return false;
				}

				if (latlngStr[0] == null || latlngStr[1] == null) {
					Logger.warn("Lat or Long are NULL");
					return false;
				}

				latlngStr[0] = latlngStr[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				latlngStr[1] = latlngStr[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');

				if (latlngStr[0] == '' || latlngStr[1] == '') {
					Logger.warn("Lat or Long are empty string");
					return false;
				}

        	    var lat = parseFloat(latlngStr[0]);
        	    var lng = parseFloat(latlngStr[1]);
	            latLng = new google.maps.LatLng(lat, lng);
        	}
        }
        storeAddress(latLng, zIndex, markerIcon);
    }
    
    this.buildAddressMarkers = function (additionalMarkerLocations) {
    	csvString = additionalMarkerLocations;
        parseCsv();
        queryGeocoderService();
    }

	this.shiftMapToOriginalZoomAndLocation = function() {
		resetMap();
	}

    function queryGeocoderService() {
      	timeout = null;
        if (storedAddresses.length > 0) {
            var element = storedAddresses.shift();

            if (element.address instanceof google.maps.LatLng) {
            	buildLocationFromCoords(element);
			} else {
				var geocoderRequest = {"address": element.address};
				geocoder.geocode(geocoderRequest, function (results, status) {
                	geocoderCallback(results, status, element);
            	});
			}
        } else {
            setBounds();
        }
    }

    function setBounds() {

        if (markers.length > 1) {
            jQuery.each(markers, function (index, marker) {
            	if (!bounds.contains(marker.position)) {
            		bounds.extend(marker.position);
            	}
            });
            originalExtendedBounds = bounds;
            googleMap.fitBounds(bounds);
			updatedZoom = googleMap.getZoom();
        } else if (markers.length == 1) {
            googleMap.setCenter(markers[0].position);
			updatedZoom = googleMap.getZoom();
        }
    }

	function buildLocationFromCoords(element)  {
		var addressPoint = element.address;

		element.address = buildBubbleContent(element, addressPoint);
		instrumentMarker(addressPoint, element);
       	timeout = setTimeout(function() { queryGeocoderService(); }, 330);
	}

	function buildBubbleContent(element, addressPoint)  {
		if (element.zIndex == 1) {
           	originalMapCenter = addressPoint;
			Logger.info("Storing original map center [" + originalMapCenter + "]");
		}

		var lat = addressPoint.lat();
		lat = parseFloat(lat);
		lat = lat.toFixed(5);

		var lng = addressPoint.lng();
		lng = parseFloat(lng);
		lng = lng.toFixed(5);

		return "Lat/Long: " + lat + ", " + lng;
	}

    function geocoderCallback(results, status, element) {
        if (status == google.maps.GeocoderStatus.OK) {

            var addressPoint = results[0].geometry.location;
			
			element.address = results[0].formatted_address + "<br />" + buildBubbleContent(element, addressPoint);
            instrumentMarker(addressPoint, element);
            timeout = setTimeout(function() { queryGeocoderService(); }, 330);
        } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        	//log("OVER_QUERY_LIMIT for " + element.address + " while having: " + markers.length + " markers");
        	setBounds();
        	storedAddresses.push(element);   	
        	timeout = setTimeout(function() { queryGeocoderService(); }, 3000);
        } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
        	Logger.warn("Got ZERO results for " + element.address + " while having " + markers.length + " markers");
       		//alert("Got ZERO results for " + element.address);
	   	}

    }
    
    function instrumentMarker(point, element) {
        var marker = new google.maps.Marker({
            position: point,
			title: element.address.replace("<br />", " :: "),
            content: element.address,
            zIndex: (element.zIndex + 1000),
			/*animation: google.maps.Animation.BOUNCE,*/
            map: googleMap
        });
        if (marker) {

			if (element.markerIcon) {
				var markerIcon = element.markerIcon;
				marker.setIcon(CGMPGlobal.customMarkersUri + markerIcon);
				
				var shadow = null;
				var defaultMarkers = ['1-default.png', '2-default.png'];
				var defaultPins = ['4-default.png', '5-default.png', '6-default.png', '7-default.png'];

				if (jQuery.inArray(markerIcon, defaultMarkers) != -1) {
					shadow = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/msmarker.shadow.png",
      				new google.maps.Size(59, 32),
      				new google.maps.Point(0,0),
      				new google.maps.Point(16, 33));
				} else 	if (jQuery.inArray(markerIcon, defaultPins) != -1) {
					shadow = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/msmarker.shadow.png",
      				new google.maps.Size(59, 32),
      				new google.maps.Point(0,0),
      				new google.maps.Point(21, 34));
				} else if (markerIcon.indexOf('3-default') != -1) {
					shadow = new google.maps.MarkerImage("http://code.google.com/apis/maps/documentation/javascript/examples/images/beachflag_shadow.png",
      				new google.maps.Size(37, 32),
      				new google.maps.Point(0,0),
      				new google.maps.Point(10, 33));
				} else {
					shadow = new google.maps.MarkerImage(CGMPGlobal.customMarkersUri + "shadow.png",
      				new google.maps.Size(68, 37),
      				new google.maps.Point(0,0),
      				new google.maps.Point(32, 38));
				}

				var urlParts = shadow.url.split("/");
				Logger.info("Setting shadow file [" + urlParts[urlParts.length-1] + "] for icon [" + markerIcon + "]");

				marker.setShadow(shadow);
			}

			if (element.zIndex == 0 && element.animation == google.maps.Animation.BOUNCE) {
				marker.setAnimation(google.maps.Animation.BOUNCE);
			}
			attachEventlistener(marker);
			if (!directionControlsBinded) {
				bindDirectionControlsToEvents();
				directionControlsBinded = true;
			}

            markers.push(marker);
        }
    }
}

jQuery.OrchestratorHub = function () {
    jQuery.extend(this, jQuery.OrchestratorHub.defaultOptions);

	var orcs = [];
	
	this.getOrcs = function() {
		return orcs;
	}

	this.push = function(orcData) {
		orcs.push(orcData);
	}

	this.getOrc = function(mapId) {
		var found = {};
		jQuery.map(jQuery(orcs), function(element) {
			if (element.mapId == mapId) {
				found = element.orchestrator;
			}
		});
		return found;
	}
}


var Logger = {

	info: function(message) {
        var msg = "Info :: " + message;
		this.print(msg);
	},

	warn: function(message) {
       	var msg = "Warning :: " + message;
		this.print(msg);
	},

	error: function(message) {
        var msg = "Error :: " + message;
		this.print(msg);
	},

	fatal: function(message) {
        var msg = "Fatal :: " + message;
		this.print(msg);
	},

	print: function(message) {
    	if ( jQuery.browser.msie ) {
    	    //Die... die... die.... why dont you just, die???
    	 } else {
    		if (jQuery.browser.mozilla && jQuery.browser.version >= "3.0" ) {
    			console.log(message);
    		}
    	 }
    }
}

//Used on the client site during map instantiation
var orcHolder = new jQuery.OrchestratorHub();

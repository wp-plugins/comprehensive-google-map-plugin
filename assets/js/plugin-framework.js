

jQuery.GoogleMapOrchestrator = function (map, options) {
	
	if (typeof google == "undefined" || !google) {
    	log("We do not have reference to Google API. Aborting..");
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
    var initLocation = options.initLocation || new google.maps.LatLng(-33.92, 151.25); 
	var bubbleAutoPan = options.bubbleAutoPan || "false";
	var markerdirections = options.markerdirections || "true";

    var googleMap = map;
    googleMap.setOptions({
	   		zoom: zoom,
	   		/*center: initLocation,*/
	      	mapTypeId: mapType,
	      	mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
    });

    
    var layerBuilder = new jQuery.LayerBuilder(googleMap);
    var builder = new jQuery.MarkerBuilder(googleMap, initLocation, bubbleAutoPan, markerdirections);
   
   	google.maps.event.addListener(googleMap, 'click', function () {
		if (builder.getOriginalExtendedBounds() != null) {
			log("GoogleMapOrchestrator :: Panning map back to its original bounds center: " + builder.getOriginalExtendedBounds().getCenter() + " and updated zoom: " + builder.getUpdatedZoom());
    		googleMap.setCenter(builder.getOriginalExtendedBounds().getCenter());
			googleMap.setZoom(builder.getUpdatedZoom());
		} else 	if (builder.getOriginalMapCenter() != null) {
			log("GoogleMapOrchestrator :: Panning map back to its original center: " + builder.getOriginalMapCenter()  + " and updated zoom: " + builder.getUpdatedZoom());
    		googleMap.setCenter(builder.getOriginalMapCenter());
			googleMap.setZoom(builder.getUpdatedZoom());
		} 
	});


    function sanityCheck() {
    	if (typeof googleMap == "undefined" || !googleMap || googleMap == null ) {
        	log("We do not have instance of the Google API object. Aborting..");
        	return false;
        }
    	return true;
    }
   
	this.getOption = function (option) {
    	return options[option];
	}

	this.routeDirections = function(lat, lng, userOrigin) {
		if (!sanityCheck()) {
    		return false;
    		log("No Google API");
    	}
		builder.routeDirections(lat, lng, userOrigin);
	}

	this.removeDirections = function() {
		builder.removeDirections();
	}


    this.buildInitLocationMarker = function (showPrimaryMarker) {
    	log("GoogleMapOrchestrator::buildInitLocationMarker");
    	if (!sanityCheck()) {
    		return false;
    		log("No Google API");
    	}
    	builder.buildInitLocationMarker(showPrimaryMarker);
    }
    
    this.updateInitLocationMarker = function(newInitLocation, animation) {
    	log("GoogleMapOrchestrator::updateInitLocationMarker");
    	if (!sanityCheck()) {
    		return false;
    		log("No Google API");
    	}
		var animationType = google.maps.Animation.DROP;
		if (animation != null) {
		
			switch (animation) {
    			case jQuery.GoogleMapOrchestrator.AnimationType.BOUNCE:
    				animationType = google.maps.Animation.BOUNCE;
    			break;
			}
    	}
		log(animationType);
    	builder.updateInitLocationMarker(newInitLocation, animationType);
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
    	        	log("Going to filter Panoramio images by " + panoramiouid);
					layerBuilder.buildPanoramioLayer(panoramiouid);
    	        } else {
    				layerBuilder.buildPanoramioLayer();
				}
    		break;
    		
    		case jQuery.GoogleMapOrchestrator.LayerType.KML:
    			if (kml == null || kml == "") {
    	        	log("KML URL must be passed for the KML Layer. Aborting..");
    	        	return false;
    	        }
    			layerBuilder.buildKmlLayer(kml);
    		break;
    		
    		default:
    			log("Unknown layer type: " + type);
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
    			log("Unknown map control type: " + mapControlType);
    	}
    }
    
    function log(message) {
    	if ( jQuery.browser.msie ) {
    	    //Die... die... die.... why dont you just, die???
    	 } else {
    		  if (jQuery.browser.mozilla && jQuery.browser.version >= "3.0" ) {
    		    console.log(message);
    		  }
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
        	log("We cannot access Panoramio library. Aborting..");
        	return false;
        }
    	var panoramioLayer = new google.maps.panoramio.PanoramioLayer();
		if (panoramioLayer) {
			if (userId != null && userId != "") {
				panoramioLayer.setUserId(userId);
			}
    		panoramioLayer.setMap(googleMap);
		} else {
			log("Could not instantiate Panoramio object. Aborting..");
		}
    }
    
    this.buildKmlLayer = function (url) {
    	if (url.toLowerCase().indexOf("http") < 0) {
        	log("KML URL must start with HTTP(S). Aborting..");
        	return false;
        }
    	var kmlLayer = new google.maps.KmlLayer(url);
    	kmlLayer.setMap(googleMap);
    }
    
    function log(message) {
    	if ( jQuery.browser.msie ) {
    	    //Die... die... die.... why dont you just, die???
    	 } else {
    		  if (jQuery.browser.mozilla && jQuery.browser.version >= "3.0" ) {
    		    console.log(message);
    		  }
    	 }
    }
}

jQuery.MarkerBuilder = function (map, initLocation, bubbleAutoPan, markerdirections) {
    jQuery.extend(this, jQuery.MarkerBuilder.defaultOptions);

    var markers = [];
    var storedAddresses = [];
	var bubbleData = [];
    var timeout = null;
    var directionControlsBinded = false;
    var googleMap = map;
    var csvString = null;
    var initLocation = initLocation;
	var bubbleAutoPan = bubbleAutoPan;
	var markerdirections = markerdirections;
	var primaryAnimation = google.maps.Animation.DROP;
	var originalExtendedBounds = null;
	var originalMapCenter = null;
	var updatedZoom = 5;

    var utils = new jQuery.Utils();
    var geocoder = new google.maps.Geocoder();
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();
	var streetViewService = new google.maps.StreetViewService();

	var rendererOptions = {
    	draggable: true
  	};
	var directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
	directionsRenderer.setPanel(document.getElementById('rendered-directions-placeholder-' + googleMap.getDiv().id));
	var directionsService = new google.maps.DirectionsService();

	log("Directions placeholder ID: " + "directions-placeholder-" + googleMap.getDiv().id);

	function resetMap()  {
			if (originalExtendedBounds != null) {
			log("MarkerBuilder :: Panning map back to its original bounds center: " + originalExtendedBounds.getCenter() + " and updated zoom: " + updatedZoom);
    			googleMap.setCenter(originalExtendedBounds.getCenter());
				googleMap.setZoom(updatedZoom);
		} else 	if (originalMapCenter != null) {
			log("MarkerBuilder :: Panning map back to its original center: " + originalMapCenter  + " and updated zoom: " + updatedZoom);
    			googleMap.setCenter(originalMapCenter);
				googleMap.setZoom(updatedZoom);
		}
	}

    function attachEventlistener(marker) {

		var localBubbleData = buildBubble(marker.content);

		var parentInfoBubble = 'div#bubble-' + localBubbleData.bubbleHolderId;
		var dirDivId = 'div#direction-controls-placeholder-' + googleMap.getDiv().id;
		var targetDiv = jQuery("div#rendered-directions-placeholder-" + googleMap.getDiv().id);

		google.maps.event.addListener(marker, 'click', function () {

			jQuery(dirDivId + ' input#a_address').val('');
			jQuery(dirDivId + ' input#b_address').val('');
			jQuery(dirDivId + ' input#a_address').removeClass('d_error');
			jQuery(dirDivId + ' input#b_address').removeClass('d_error');
  			jQuery(dirDivId).fadeOut();
			directionsRenderer.setMap(null);
			jQuery("div#rendered-directions-placeholder-" + googleMap.getDiv().id).html("");
			targetDiv.hide();
			jQuery(dirDivId + ' button#print_sub').hide();

			infowindow.setContent(localBubbleData.bubbleContent);
			infowindow.setOptions({disableAutoPan: bubbleAutoPan == "true" ? true : false });
            infowindow.open(map, this);
        });

		streetViewService.getPanoramaByLocation(marker.position, 10, function (streetViewPanoramaData, status) {
    		if (status === google.maps.StreetViewStatus.OK) {
        		// ok
					jQuery('a#trigger-' + localBubbleData.bubbleHolderId).live("click", function() {
  						//var thisId = this.id;
						//if (thisId == 'trigger-' + localBubbleData.bubbleHolderId) {

						//log(marker);

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

						//pano.bindTo("position", marker);
						pano.setVisible(true);

						google.maps.event.addListener(infowindow, 'closeclick', function() {

							jQuery(dirDivId + ' input#a_address').val('');
							jQuery(dirDivId + ' input#b_address').val('');
							jQuery(dirDivId + ' input#a_address').removeClass('d_error');
							jQuery(dirDivId + ' input#b_address').removeClass('d_error');
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
				log("Warning :: There is not street view available for this marker location: " + marker.position);
				jQuery('a#trigger-' + localBubbleData.bubbleHolderId).live("click", function(e) {
					e.preventDefault();
				});

				google.maps.event.addListener(infowindow, 'domready', function () {
					jQuery('a#trigger-' + localBubbleData.bubbleHolderId).removeAttr("href");
					jQuery('a#trigger-' + localBubbleData.bubbleHolderId).css("text-decoration", "none");
					jQuery('a#trigger-' + localBubbleData.bubbleHolderId).css("color", "#ddd");
				});
    		}
		});
		
		var splittedAddr = marker.content.split("<br />Lat/Long: ");

		jQuery('a.dirToHereTrigger').live("click", function() {
  			var thisId = this.id;
			if (thisId == 'toHere-' + localBubbleData.bubbleHolderId) {
				log("Displaying directions panel 'to here'");

				jQuery(dirDivId).fadeIn();
				jQuery(dirDivId + ' input#a_address').val('');
				jQuery(dirDivId + ' input#b_address').val(splittedAddr[0]);

			}
		});

		jQuery('a.dirFromHereTrigger').live("click", function() {
  			var thisId = this.id;
			if (thisId == 'fromHere-' + localBubbleData.bubbleHolderId) {
				log("Displaying directions panel 'from here'");

				jQuery(dirDivId).fadeIn();
				jQuery(dirDivId + ' input#a_address').val(splittedAddr[0]);
				jQuery(dirDivId + ' input#b_address').val('');

			}
		});

		jQuery('div.d_close-wrapper').live("click", function() {
				jQuery(dirDivId + ' input#a_address').val('');
				jQuery(dirDivId + ' input#b_address').val('');
				jQuery(dirDivId + ' input#a_address').removeClass('d_error');
				jQuery(dirDivId + ' input#b_address').removeClass('d_error');
  				jQuery(this).parent().fadeOut();
				directionsRenderer.setMap(null);
				jQuery("div#rendered-directions-placeholder-" + googleMap.getDiv().id).html("");
				targetDiv.hide();
				jQuery(dirDivId + ' button#print_sub').hide();
				resetMap();
		});

    }


	function bindDirectionControlsToEvents()  {

		var dirDivId = 'div#direction-controls-placeholder-' + googleMap.getDiv().id;
		var targetDiv = jQuery("div#rendered-directions-placeholder-" + googleMap.getDiv().id);

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
				jQuery(dirDivId + ' input#radio_miles').removeAttr("checked");
				jQuery(dirDivId + ' input#radio_km').attr("checked", "checked");
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

		  				} else {
		    				log('Error :: Could not route directions from "' + old_a_addr + '" to "' + old_b_addr + '", got result from Google: ' + status);
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
					log("Driving travel mode is already selected");
				} else {
					jQuery(dirDivId + ' a#dir_d_btn').addClass('selected');
					jQuery(dirDivId + ' a#dir_w_btn').removeClass('selected');
				}
			} else 	if (thisId == 'dir_w_btn') {
				if (jQuery(dirDivId + ' a#dir_w_btn').hasClass('selected')) {
					log("Walking travel mode is already selected");
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
		var mapId = googleMap.getDiv().id;
		var randomNumber = Math.floor(Math.random() * 111111);

		randomNumber = randomNumber + "-" + mapId;

		var	bubble = "<div id='bubble-" + randomNumber + "' style='height: 130px !important; width: 300px !important;' class='bubble-content'>";
		bubble += "<h4>Address:</h4>";
		bubble += "<p style='text-align: left'>" + contentFromMarker + "</p>";
		bubble += "<hr />";
		bubble += "<p style='text-align: left'>Directions: <a id='toHere-" + randomNumber + "' class='dirToHereTrigger' href='javascript:void(0);'><b>To here</b></a> - <a id='fromHere-" + randomNumber + "' class='dirFromHereTrigger' href='javascript:void(0);'><b>From here</b></a> | <a id='trigger-" + randomNumber + "' class='streetViewTrigger' href='javascript:void(0);'><b>Street View</b></a></p>";
		bubble += "</div>";

		return {bubbleHolderId : randomNumber, bubbleContent: bubble};
	}

    function parseCsv() {
        csvString = csvString.replace(new RegExp("'", "g"), "");
        var locations = csvString.split("|");

        for (var i = 0; i < locations.length; i++) {
            var target = locations[i];
            if (target != null && target != "") {
				target = target.replace(/^\s+|\s+$/g, '');
				if (target == "") {
					log("Warning :: Given extra marker address is empty");
					continue;
				}
            	pushGeoDestination(target, (i + 1), true);
            }
        }
    }
    
    function pushGeoDestination(target, index, isExtraMarker) {
    	 if (utils.isNumeric(target)) {
    		 addGeoPoint(target, index, isExtraMarker);
         } else if (utils.isAlphaNumeric(target)) {
             storeAddress(target, index, isExtraMarker);
         } else {
             log("Unknown type of geo destination: " + target);
         }
    }

    function storeAddress(address, zIndex, isExtraMarker) {
			
			if (zIndex > 0 && initLocation == address) {
				log("Warning :: Primary and given extra marker have the same address: " + address);
			} else {
				log("Info :: Storing marker address: " + address);
				storedAddresses.push({
            		address: address,
					animation: primaryAnimation,
            		zIndex: zIndex,
					extra: isExtraMarker
        		});
			}
		}
    
    function addGeoPoint(point, zIndex, isExtraMarker) {
    	if (point == null || !point) {
			log("Warning :: Given point containing Lat/Long is NULL");
    		return false;
    	}
		log("Point given to the addGeoPoint():");
		log(point);
        var latLng = point;
        if (!(latLng instanceof google.maps.LatLng)) {
        	if (point.indexOf(",") != -1) {
        		var latlngStr = point.split(",",4);

				if (latlngStr == null || latlngStr.length != 2) {
					log("Warning :: Exploded lat/long array is NULL or does not have length of two");
					return false;
				}

				if (latlngStr[0] == null || latlngStr[1] == null) {
					log("Warning :: Lat or Long are NULL");
					return false;
				}

				latlngStr[0] = latlngStr[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				latlngStr[1] = latlngStr[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');

				if (latlngStr[0] == '' || latlngStr[1] == '') {
					log("Warning :: Lat or Long are empty string");
					return false;
				}

        	    var lat = parseFloat(latlngStr[0]);
        	    var lng = parseFloat(latlngStr[1]);
	            latLng = new google.maps.LatLng(lat, lng);
        	}
        }
        storeAddress(latLng, zIndex, isExtraMarker);
    }
    
	this.getOriginalExtendedBounds = function()  {
		return originalExtendedBounds;
	}

	this.getUpdatedZoom = function()  {
		return updatedZoom;
	}

	 
	this.getOriginalMapCenter = function()  {
		return originalMapCenter;
	}


    this.updateInitLocationMarker = function(newInitLocation, primAnimation) {
    	log("MarkerBuilder::updateInitLocationMarker");
    	initLocation = newInitLocation;
		primaryAnimation = primAnimation;
    }

    this.buildInitLocationMarker = function (showPrimaryMarker) {
    	log("MarkerBuilder::buildInitLocationMarker");

		if (showPrimaryMarker)  {
    		pushGeoDestination(initLocation, 0);
		} else {
			log("Will not display the primary marker ..");
			pushGeoDestination(initLocation, -1);
		}

		queryGeocoderService();
    }
    
    this.buildAddressMarkers = function (additionalMarkerLocations) {
    	csvString = additionalMarkerLocations;
        parseCsv();
        queryGeocoderService();
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
		if (element.zIndex < 1) {
           	originalMapCenter = addressPoint;
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
        	log("Warning :: Got ZERO results for " + element.address + " while having " + markers.length + " extra markers");
       		//alert("Got ZERO results for " + element.address);
	   	}

    }
    
    function log(message) {
    	if ( jQuery.browser.msie ) {
    	    //Die... die... die.... why dont you just, die???
    	 } else {
    		  if (jQuery.browser.mozilla && jQuery.browser.version >= "3.0" ) {
    		    console.log(message);
    		  }
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

			if (element.zIndex == -1) {
				marker.setVisible(false);
				log("Primary marker with address [" + element.address + "] was denied from being visible..");
			}

			if (element.extra) {
				marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
				var shadow = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/msmarker.shadow.png",
      				new google.maps.Size(59, 32),
      				new google.maps.Point(0,0),
      				new google.maps.Point(16, 32));
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
		log("Info :: Pushed into OrchestratorHub: ");
		log(orcData);
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

	 function log(message) {
    	if ( jQuery.browser.msie ) {
    	    //Die... die... die.... why dont you just, die???
    	 } else {
    		  if (jQuery.browser.mozilla && jQuery.browser.version >= "3.0" ) {
    		    console.log(message);
    		  }
    	 }
    }

}

var orcHolder = new jQuery.OrchestratorHub();

	function routeDirections(lat, lng, userOrigin, mapId)  {
		var orc = orcHolder.getOrc(mapId);
		if (orc == null || !orc) {
			jQuery("div#directions-placeholder-" + mapId).html("<span style='font-size: 13px; font-weight: bold; color: red'>Cannot route directions</span>");
			return false;
		}

		jQuery("div#directions-placeholder-" + mapId).html("<span style='font-size: 13px; font-weight: bold;'>Please wait, routing..</span>");
		orc.routeDirections(lat, lng, userOrigin);

	}


	function removeDirections(mapId)  {
		var orc = orcHolder.getOrc(mapId);
		if (orc == null || !orc) {
			return false;
		}
		orc.removeDirections();
	}


 	function log(message) {
    	if ( jQuery.browser.msie ) {
    	    //Die... die... die.... why dont you just, die???
    	 } else {
    		  if (jQuery.browser.mozilla && jQuery.browser.version >= "3.0" ) {
    		    console.log(message);
    		  }
    	 }
	}




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


    this.buildInitLocationMarker = function () {
    	log("GoogleMapOrchestrator::buildInitLocationMarker");
    	if (!sanityCheck()) {
    		return false;
    		log("No Google API");
    	}
    	builder.buildInitLocationMarker();
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
    
    this.buildLayer = function (type, kml) {
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
    			layerBuilder.buildPanoramioLayer();
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
    
    this.buildPanoramioLayer = function () {
    	if (typeof google.maps.panoramio == "undefined" || !google.maps.panoramio || google.maps.panoramio == null ) {
        	log("We cannot access Panoramio library. Aborting..");
        	return false;
        }
    	var panoramioLayer = new google.maps.panoramio.PanoramioLayer();
    	panoramioLayer.setMap(googleMap);
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
    var timeout = null;
    
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

	//var directionMarker = null;

	var rendererOptions = {
    	draggable: true
  	};
	var directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
	directionsRenderer.setPanel(document.getElementById('directions-placeholder-' + googleMap.getDiv().id));
	var directionsService = new google.maps.DirectionsService();

	log("Directions placeholder ID: " + "directions-placeholder-" + googleMap.getDiv().id);

	this.removeDirections = function() {
		directionsRenderer.setMap(null);
		//directionMarker.setMap(null);
		var elem = jQuery("div#directions-placeholder-" + googleMap.getDiv().id);
		elem.html("");
		elem.css("border", "");
		elem.css("width", 0);
		elem.css("height", 0);

		jQuery("a#remove-" + googleMap.getDiv().id).remove();

	}

	this.routeDirections = function(lat, lng, userOrigin) {
		var request = {
  			origin: userOrigin, 
  			destination: new google.maps.LatLng(lat, lng),
  			travelMode: google.maps.DirectionsTravelMode.DRIVING,
  			unitSystem: google.maps.DirectionsUnitSystem.METRIC,
  			provideRouteAlternatives: true
		};
		directionsService.route(request, function(response, status) {
  		var elem = jQuery("div#directions-placeholder-" + googleMap.getDiv().id);

		if (status == google.maps.DirectionsStatus.OK) {
			var mapDiv = googleMap.getDiv();
			mapDiv = jQuery(mapDiv);
			elem.html("");
			elem.css("border", "1px solid #333333");
			elem.css("width", mapDiv.width() - 25);
			elem.css("height", 100);
			elem.before("<div align='center' style='margin-top: 5px; margin-bottom: 5px'><a href='javascript:void(0)' id='remove-" + googleMap.getDiv().id + "' onclick='return removeDirections(\"" +  googleMap.getDiv().id + "\");'>Remove Directions</a></div>");
    		directionsRenderer.setMap(googleMap);
			directionsRenderer.setDirections(response);
			/*var leg = response.routes[ 0 ].legs[ 0 ];
			var endMarker = new google.maps.Marker(
					{
					position: leg.start_location,
  					map: googleMap,
  					title: leg.start_address
 				});
			if (endMarker) {

				endMarker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
				var shadow = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/msmarker.shadow.png",
      				new google.maps.Size(59, 32),
      				new google.maps.Point(0,0),
      				new google.maps.Point(16, 32));
					endMarker.setShadow(shadow);
					google.maps.event.addListener(endMarker, 'click', function () {
            			var infow = new google.maps.InfoWindow();
						infow.setContent(leg.start_address);
						infow.setOptions({disableAutoPan: false });
            			infow.open(googleMap, this);
        		});

				directionMarker = endMarker;
			}*/
  		} else {
			elem.html("<span style='font-size: 13px; font-weight: bold; color: red'>Could not route directions from '" + userOrigin + "', got result from Google: " + status + "</span>");
    		log('Error :: Could not route directions from : ' + userOrigin + ', got status: ' + status);
  			}
		});
	}

    function attachEventlistener(marker) {
		/*
        google.maps.event.addListener(marker, 'mouseover', function () {
            infowindow.setContent(this.content);
            infowindow.open(map, this);
        });
		*/

		var bubbleContent = "";

		if (markerdirections == "true") {

			var mapId = googleMap.getDiv().id;

			bubbleContent += "<div id='bubble-content' style='min-height: 120px !important; height: 120px !important'>";
			bubbleContent += "<div style='margin-bottom: 10px;'>" + marker.content + "<br /><input style='margin-top: 5px;' class='directions-btn' type='button'";
			bubbleContent += " onclick='jQuery(\"div#directions-input-wrapper-" + mapId + "\").fadeIn(); jQuery(\"input#user-origin-" + mapId + "\").focus(); jQuery(\"a#directions-wrapper-cancel-" + mapId + "\").fadeIn();' value='Get Directions Here' />&nbsp;<a id='directions-wrapper-cancel-" + mapId + "' href='javascript:void(0);' onclick='jQuery(\"div#directions-input-wrapper-" + mapId + "\").hide(); jQuery(this).hide();' style='display: none' class='directions-cancel'>Cancel</a></div>";
			bubbleContent += "<div id='directions-input-wrapper-" + mapId + "' style='display: none'>";
			bubbleContent += "<input type='text' id='user-origin-" + mapId + "' class='directions' />&nbsp;<a href='javascript:void(0)'";
			bubbleContent += "	onclick='return routeDirections(" + marker.position.lat() + 
												", " + marker.position.lng() + ", jQuery(\"input#user-origin-" + 
												mapId + "\").val(), \"" + mapId + "\");'><input type='image' class='directions-trigger' value='' /></a>";
			bubbleContent += "</div>";
			bubbleContent += "</div>";

		} else if (markerdirections == "false") {
			bubbleContent += marker.content;
		}

		google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(bubbleContent);
			infowindow.setOptions({disableAutoPan: bubbleAutoPan == "true" ? true : false });
            infowindow.open(map, this);
        }); 
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
			
			if (zIndex != 0 && initLocation == address) {
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
    		return false;
    	}
        var latLng = point;
        if (!(latLng instanceof google.maps.LatLng)) {
        	if (point.indexOf(",") != -1) {
        		var latlngStr = point.split(",",4);
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

    this.buildInitLocationMarker = function () {
    	log("MarkerBuilder::buildInitLocationMarker");
    	pushGeoDestination(initLocation, 0);
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
            var geocoderRequest = {"address": element.address};
            
            if (element.address instanceof google.maps.LatLng) {
            	geocoderRequest = {"location": element.address};
            }
     
            geocoder.geocode(geocoderRequest, function (results, status) {
                geocoderCallback(results, status, element);
            });
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

    function geocoderCallback(results, status, element) {
        if (status == google.maps.GeocoderStatus.OK) {
			
            var addressPoint = results[0].geometry.location;

			if (element.zIndex == 0) {
            	originalMapCenter = addressPoint;
			}

			var lat = addressPoint.lat();
			lat = parseFloat(lat);
			lat = lat.toFixed(5);

			var lng = addressPoint.lng();
			lng = parseFloat(lng);
			lng = lng.toFixed(5);

			element.address = results[0].formatted_address + "<br />Lat/Long: " + lat + ", " + lng + "";
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


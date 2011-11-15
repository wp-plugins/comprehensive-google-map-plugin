

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

    var googleMap = map;
    googleMap.setOptions({
	   		zoom: zoom,
	   		/*center: initLocation,*/
	      	mapTypeId: mapType,
	      	mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
    });

    
    var layerBuilder = new jQuery.LayerBuilder(googleMap);
    var builder = new jQuery.MarkerBuilder(googleMap, initLocation);
   
   	google.maps.event.addListener(googleMap, 'click', function () {
		if (builder.getOriginalExtendedBounds() != null) {
			log("GoogleMapOrchestrator :: Panning map back to its original bounds center: " + builder.getOriginalExtendedBounds().getCenter());
    		googleMap.setCenter(builder.getOriginalExtendedBounds().getCenter());
		} else 	if (builder.getOriginalMapCenter() != null) {
			log("GoogleMapOrchestrator :: Panning map back to its original center: " + builder.getOriginalMapCenter());
    		googleMap.setCenter(builder.getOriginalMapCenter());
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

jQuery.MarkerBuilder = function (map, initLocation) {
    jQuery.extend(this, jQuery.MarkerBuilder.defaultOptions);

    var markers = [];
    var storedAddresses = [];
    var timeout = null;
    
    var googleMap = map;
    var csvString = null;
    var initLocation = initLocation;
	var primaryAnimation = google.maps.Animation.DROP;
	var originalExtendedBounds = null;
	var originalMapCenter = null;

    var utils = new jQuery.Utils();
    var geocoder = new google.maps.Geocoder();
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();

    function attachEventlistener(marker) {
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(this.content);
            infowindow.open(map, this);
        });

		google.maps.event.addListener(marker, 'mouseover', function () {
            infowindow.setContent(this.content);
			infowindow.setOptions({disableAutoPan: true});
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
            	pushGeoDestination(target, (i + 1));
            }
        }
    }
    
    function pushGeoDestination(target, index) {
    	 if (utils.isNumeric(target)) {
    		 addGeoPoint(target, index);
         } else if (utils.isAlphaNumeric(target)) {
             storeAddress(target, index);
         } else {
             log("Unknown type of geo destination: " + target);
         }
    }

    function storeAddress(address, zIndex) {
			
			if (zIndex != 0 && initLocation == address) {
				log("Warning :: Primary and given extra marker have the same address: " + address);
			} else {
				log("Info :: Storing marker address: " + address);
				storedAddresses.push({
            		address: address,
					animation: primaryAnimation,
            		zIndex: zIndex
        		});
			}
		}
    
    function addGeoPoint(point, zIndex) {
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
        storeAddress(latLng, zIndex);
    }
    
	this.getOriginalExtendedBounds = function()  {
		return originalExtendedBounds;
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
        } else if (markers.length == 1) {
            googleMap.setCenter(markers[0].position);
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
			lat = lat.toFixed(3);

			var lng = addressPoint.lng();
			lng = parseFloat(lng);
			lng = lng.toFixed(3);

			element.address = results[0].formatted_address + " (" + lat + ", " + lng + ")";
            instrumentMarker(addressPoint, element);
            timeout = setTimeout(function() { queryGeocoderService(); }, 330);
        } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        	//log("OVER_QUERY_LIMIT for " + element.address + " while having: " + markers.length + " markers");
        	setBounds();
        	storedAddresses.push(element);   	
        	timeout = setTimeout(function() { queryGeocoderService(); }, 3000);
        } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
        	log("Warning :: Got ZERO results for " + element.address + " while having " + markers.length + " extra markers");
       		alert("Got ZERO results for " + element.address);
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
            content: element.address,
            zIndex: element.zIndex,
			/*animation: google.maps.Animation.BOUNCE,*/
            map: googleMap
        });
        if (marker) {
			if (element.zIndex == 0 && element.animation == google.maps.Animation.BOUNCE) {
				marker.setAnimation(google.maps.Animation.BOUNCE);
			}
			attachEventlistener(marker);
            markers.push(marker);
        }
    }
}

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
CGMPGlobal.maps = [];
var jQueryCgmp = jQuery.noConflict();
jQueryCgmp.getScript("http://maps.googleapis.com/maps/api/js?libraries=panoramio&sensor=false&async=2&callback=kickIn", function () {});

function kickIn() {

	(function ($) {


		GoogleMapOrchestrator = function (map, options) {
			
			$.extend(this, GoogleMapOrchestrator.defaultOptions);
			GoogleMapOrchestrator.AnimationType = {DROP : 0, BOUNCE : 1};
			GoogleMapOrchestrator.LayerType = {TRAFFIC : 0, BIKE : 1, KML : 2, PANORAMIO: 3};
			GoogleMapOrchestrator.ControlType = {PAN: 0, ZOOM: 1, SCALE: 2, STREETVIEW: 3, MAPTYPE: 4, SCROLLWHEEL: 5};
			
			var options = options || {};
			var placeHolder = options.placeHolder || "map";
			var zoom = options.zoom || 16;
			var mapType = options.mapType || google.maps.MapTypeId.ROADMAP;
			var bubbleAutoPan = options.bubbleAutoPan || "true";

			if (mapType == "ROADMAP") {
				mapType = google.maps.MapTypeId.ROADMAP;
			} else if (mapType == "SATELLITE") {
				mapType = google.maps.MapTypeId.SATELLITE;
			} else if (mapType == "HYBRID") {
				mapType = google.maps.MapTypeId.HYBRID;
			} else if (mapType == "TERRAIN") {
				mapType = google.maps.MapTypeId.TERRAIN;
			}

			var googleMap = map;
			googleMap.setOptions({
					zoom: zoom,
					mapTypeId: mapType,
					mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
			});

			var layerBuilder = new LayerBuilder(googleMap);
			var builder = new MarkerBuilder(googleMap, bubbleAutoPan);

			this.isBuildAddressMarkersCalled = function() {
				return builder.isBuildAddressMarkersCalled();
			}
		   
			google.maps.event.addListener(googleMap, 'click', function () {
				builder.shiftMapToOriginalZoomAndLocation();
			});

			this.buildAddressMarkers = function (additionalMarkerLocations, isGeoMashap, isBubbleContainsPostLink) {
				builder.buildAddressMarkers(additionalMarkerLocations, isGeoMashap, isBubbleContainsPostLink);
			}
			
			this.buildLayer = function (type, kml, panoramiouid) {
				switch (type) {
					case GoogleMapOrchestrator.LayerType.TRAFFIC:
						layerBuilder.buildTrafficLayer();
					break;
					
					case GoogleMapOrchestrator.LayerType.BIKE:
						layerBuilder.buildBikeLayer();
					break;
					
					case GoogleMapOrchestrator.LayerType.PANORAMIO:
						if (panoramiouid != null && panoramiouid != "") {
							Logger.info("Going to filter Panoramio images by " + panoramiouid);
							layerBuilder.buildPanoramioLayer(panoramiouid);
						} else {
							layerBuilder.buildPanoramioLayer();
						}
					break;
					
					case GoogleMapOrchestrator.LayerType.KML:
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

							
				switch (mapControlType) {

					case GoogleMapOrchestrator.ControlType.SCROLLWHEEL:
						googleMap.setOptions({scrollwheel: (isOn == "false" ? false : true) });
					break;

					case GoogleMapOrchestrator.ControlType.MAPTYPE:
						googleMap.setOptions({mapTypeControl: (isOn == "false" ? false : true) });
					break;
				
					case GoogleMapOrchestrator.ControlType.PAN:
						googleMap.setOptions({panControl: (isOn == "false" ? false : true) });
					break;
					
					case GoogleMapOrchestrator.ControlType.ZOOM:
						googleMap.setOptions({zoomControl: (isOn == "false" ? false : true) });
					break;
					
					case GoogleMapOrchestrator.ControlType.SCALE:
						googleMap.setOptions({scaleControl: (isOn == "false" ? false : true) });
					break;
					
					case GoogleMapOrchestrator.ControlType.STREETVIEW:
						googleMap.setOptions({streetViewControl: (isOn == "false" ? false : true) });
					break;
					
					default:
						Logger.warn("Unknown map control type: " + mapControlType);
				}
			}
		}

		Utils = {
			isNumeric: function isNumeric(subject) {
				var numericRegex = /^([0-9?(\-.,\s{1,})]+)$/;
				return numericRegex.test(subject);
			},
			isAlphaNumeric: function isAlphaNumeric(subject) {
			    var addressRegex = /^([a-zA-Z0-9?(/\-.,\s{1,})]+)$/;
				return addressRegex.test(subject);
			}
		}

		LayerBuilder = function (map) {
			$.extend(this, LayerBuilder.defaultOptions);

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

				google.maps.event.addListener(kmlLayer, "status_changed", function() {
					kmlLayerStatusEventCallback(kmlLayer);
				});
				kmlLayer.setMap(googleMap);
			}

			function kmlLayerStatusEventCallback(kmlLayer)  {
				
					var kmlStatus = kmlLayer.getStatus();

					if (kmlStatus == google.maps.KmlLayerStatus.OK) {
						//Hmmm...
					} else {

						var msg = '';

						switch(kmlStatus) {
					
								case google.maps.KmlLayerStatus.DOCUMENT_NOT_FOUND:
									msg = 'The KML file could not be found. Most likely it is an invalid URL, or the document is not publicly available.';
								break;

								case google.maps.KmlLayerStatus.DOCUMENT_TOO_LARGE:
									msg = 'The KML file exceeds the file size limits of KmlLayer.';
								break;

								case google.maps.KmlLayerStatus.FETCH_ERROR:
									msg = 'The KML file could not be fetched.';
								break;

								case google.maps.KmlLayerStatus.INVALID_DOCUMENT:
									msg = 'The KML file is not a valid KML, KMZ or GeoRSS document.';
								break;

								case google.maps.KmlLayerStatus.INVALID_REQUEST:
									msg = 'The KmlLayer is invalid.';
								break;

								case google.maps.KmlLayerStatus.LIMITS_EXCEEDED:
									msg = 'The KML file exceeds the feature limits of KmlLayer.';
								break;

								case google.maps.KmlLayerStatus.TIMED_OUT:
									msg = 'The KML file could not be loaded within a reasonable amount of time.';
								break;

								case google.maps.KmlLayerStatus.UNKNOWN:
									msg = 'The KML file failed to load for an unknown reason.';
								break;

							}

					if (msg != '') {
						alert("ATTENTION! (by Comprehensive Google Map Plugin)" +
							"\n\nDear blog/website owner,\nGoogle returned the following error when trying to load KML file:" +
							"\n\n" + msg + " (" + kmlStatus + ")");

						Logger.error("Google returned KML error: " + msg + " (" + kmlStatus + ")");
						Logger.error("KML file: " + kmlLayer.getUrl());
					}
				}
			}

		}

		MarkerBuilder = function (map, bubbleAutoPan) {
			$.extend(this, MarkerBuilder.defaultOptions);

			var markers = [];
			var storedAddresses = [];
			var badAddresses = [];
			var wasBuildAddressMarkersCalled = false;
			var timeout = null;
			var directionControlsBinded = false;
			var googleMap = map;
			var csvString = null;
			var bubbleAutoPan = bubbleAutoPan;
			var originalExtendedBounds = null;
			var originalMapCenter = null;
			var updatedZoom = 5;
			var mapDivId = googleMap.getDiv().id;
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
				$(dirDivId + ' input#a_address').val('');
				$(dirDivId + ' input#b_address').val('');
				$(dirDivId + ' input#a_address').removeClass('d_error');
				$(dirDivId + ' input#b_address').removeClass('d_error');
			}

			function attachEventlistener(marker, markersElement) {

				var localBubbleData = buildBubble(marker.content, markersElement);
				var dirDivId = 'div#direction-controls-placeholder-' + mapDivId;
				var targetDiv = $("div#rendered-directions-placeholder-" + mapDivId);

				google.maps.event.addListener(marker, 'click', function () {

					resetDirectionAddressFields(dirDivId);

					$(dirDivId).fadeOut();
					directionsRenderer.setMap(null);
					targetDiv.html("");
					targetDiv.hide();
					$(dirDivId + ' button#print_sub').hide();

					infowindow.setContent(localBubbleData.bubbleContent);
					infowindow.setOptions({disableAutoPan: bubbleAutoPan == "true" ? false : true });
					infowindow.open(map, this);
				});

				validateMarkerStreetViewExists(marker, localBubbleData, dirDivId);
				attachEventstoDirectionControls(marker, localBubbleData, dirDivId, targetDiv);
			}

			function attachEventstoDirectionControls(marker, localBubbleData, dirDivId, targetDiv)  {

				var parentInfoBubble = 'div#bubble-' + localBubbleData.bubbleHolderId;
				var addy = marker.content;

				/*
					var splittedAddr = marker.content.split("<br />Lat/Long: ");
				*/
				addy = addy.replace("Lat/Long: ", "");

				$(parentInfoBubble + ' a.dirToHereTrigger').live("click", function() {
					var thisId = this.id;
					if (thisId == 'toHere-' + localBubbleData.bubbleHolderId) {
						$(dirDivId).fadeIn();
						$(dirDivId + ' input#a_address').val('');
						$(dirDivId + ' input#b_address').val(addy);
						$(dirDivId + ' input#radio_miles').attr("checked", "checked");
					}
				});

				$(parentInfoBubble + ' a.dirFromHereTrigger').live("click", function() {
					var thisId = this.id;
					if (thisId == 'fromHere-' + localBubbleData.bubbleHolderId) {
						$(dirDivId).fadeIn();
						$(dirDivId + ' input#a_address').val(addy);
						$(dirDivId + ' input#b_address').val('');
						$(dirDivId + ' input#radio_miles').attr("checked", "checked");
					}
				});

				$(dirDivId + ' div.d_close-wrapper').live("click", function(event) {

						resetDirectionAddressFields(dirDivId);

						$(this).parent().fadeOut();
						directionsRenderer.setMap(null);
						targetDiv.html("");
						targetDiv.hide();
						$(dirDivId + ' button#print_sub').hide();
						resetMap();

						return false;
				});
			}

			function validateMarkerStreetViewExists(marker, localBubbleData, dirDivId)  {

				streetViewService.getPanoramaByLocation(marker.position, 50, function (streetViewPanoramaData, status) {
					if (status === google.maps.StreetViewStatus.OK) {
						// ok
							$('a#trigger-' + localBubbleData.bubbleHolderId).live("click", function() {

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
									$(dirDivId).fadeOut();

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
										$('div#bubble-' + localBubbleData.bubbleHolderId).css("background", "none");
									}

									pano = null;
								});

							//}
						});
					} else {
						// no street view available in this range, or some error occurred
						Logger.warn("There is not street view available for this marker location: " + marker.position + " status: " + status);
						$('a#trigger-' + localBubbleData.bubbleHolderId).live("click", function(e) {
							e.preventDefault();
						});
						$('a#trigger-' + localBubbleData.bubbleHolderId).attr("style", "text-decoration: none !important; color: #ddd !important");

						google.maps.event.addListener(infowindow, 'domready', function () {
							$('a#trigger-' + localBubbleData.bubbleHolderId).removeAttr("href");
							$('a#trigger-' + localBubbleData.bubbleHolderId).attr("style", "text-decoration: none !important; color: #ddd !important");
						});
					}
				});
			}


			function bindDirectionControlsToEvents()  {

				var dirDivId = 'div#direction-controls-placeholder-' + mapDivId;
				var targetDiv = $("div#rendered-directions-placeholder-" + mapDivId);

				$(dirDivId + ' a#reverse-btn').live("click", function(e) {

						var old_a_addr = $(dirDivId + ' input#a_address').val();
						var old_b_addr = $(dirDivId + ' input#b_address').val();

						$(dirDivId + ' input#a_address').val(old_b_addr);
						$(dirDivId + ' input#b_address').val(old_a_addr);
						return false;
				});

				$(dirDivId + ' a#d_options_show').live("click", function() {
						$(dirDivId + ' a#d_options_hide').show();
						$(dirDivId + ' a#d_options_show').hide();
						$(dirDivId + ' div#d_options').show();
						return false;
				});

				$(dirDivId + ' a#d_options_hide').live("click", function() {
						$(dirDivId + ' a#d_options_hide').hide();
						$(dirDivId + ' a#d_options_show').show();
						$(dirDivId + ' div#d_options').hide();
						$(dirDivId + ' input#avoid_hway').removeAttr("checked");
						$(dirDivId + ' input#avoid_tolls').removeAttr("checked");
						$(dirDivId + ' input#radio_km').removeAttr("checked");
						$(dirDivId + ' input#radio_miles').attr("checked", "checked");
						return false;
				});
		//
				$(dirDivId + ' button#d_sub').live("click", function() {
						var old_a_addr = $(dirDivId + ' input#a_address').val();
						var old_b_addr = $(dirDivId + ' input#b_address').val();
						var halt = false;
						if (old_a_addr == null || old_a_addr == '') {
							$(dirDivId + ' input#a_address').addClass('d_error');
							halt = true;
						}
			
						if (old_b_addr == null || old_b_addr == '') {
							$(dirDivId + ' input#b_address').addClass('d_error');
							halt = true;
						}

						if (!halt) {

							$(dirDivId + ' button#d_sub').attr('disabled', 'disabled').html("Please wait..");
							// Query direction service
							var travelMode = google.maps.DirectionsTravelMode.DRIVING;
							if ($(dirDivId + ' a#dir_w_btn').hasClass('selected')) {
								travelMode = google.maps.DirectionsTravelMode.WALKING;
							}

							var is_avoid_hway = $(dirDivId + ' input#avoid_hway').is(":checked");
							var is_avoid_tolls = $(dirDivId + ' input#avoid_tolls').is(":checked");
							var is_miles = $(dirDivId + ' input#radio_miles').is(":checked");
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
									$(dirDivId + ' button#d_sub').removeAttr('disabled').html("Get directions");
									$(dirDivId + ' button#print_sub').fadeIn();
									infowindow.close();

								} else {
									Logger.error('Could not route directions from "' + old_a_addr + '" to "' + old_b_addr + '", got result from Google: ' + status);
									targetDiv.html("<span style='font-size: 12px; font-weight: bold; color: red'>Could not route directions from<br />'" + old_a_addr + "' to<br />'" + old_b_addr + "'<br />Got result from Google: [" + status + "]</span>");

									$(dirDivId + ' button#print_sub').hide();
									$(dirDivId + ' button#d_sub').removeAttr('disabled').html("Get directions");
								}
							});
						}
				});

				$(dirDivId + ' button#print_sub').live("click", function() {
					var old_a_addr = $(dirDivId + ' input#a_address').val();
					var old_b_addr = $(dirDivId + ' input#b_address').val();

					var dirflag = "d";
					if ($(dirDivId + ' a#dir_w_btn').hasClass('selected')) {
						dirflag = "w";
					}

					var url = "http://maps.google.com/?saddr=" + old_a_addr + "&daddr=" + old_b_addr + "&dirflg=" + dirflag + "&pw=2";
					var is_miles = $(dirDivId + ' input#radio_miles').is(":checked");
					if (is_miles) {
						url += "&doflg=ptm";
					}

					window.open( url );
					return false;
				});

				$(dirDivId + ' input#a_address').live("change", function() {
					$(dirDivId + ' input#a_address').removeClass('d_error');
					return false;
				});

				$(dirDivId + ' input#b_address').live("change", function() {
					$(dirDivId + ' input#b_address').removeClass('d_error');
					return false;
				});

				$(dirDivId + ' input#a_address').live("focus", function() {
					$(dirDivId + ' input#a_address').removeClass('d_error');
					return false;
				});

				$(dirDivId + ' input#b_address').live("focus", function() {
					$(dirDivId + ' input#b_address').removeClass('d_error');
					return false;
				});

				$(dirDivId + ' .kd-button').live("click", function() {
					var thisId = this.id;

					if (thisId == 'dir_d_btn') {
						if ($(dirDivId + ' a#dir_d_btn').hasClass('selected')) {
							Logger.warn("Driving travel mode is already selected");
						} else {
							$(dirDivId + ' a#dir_d_btn').addClass('selected');
							$(dirDivId + ' a#dir_w_btn').removeClass('selected');
						}
					} else 	if (thisId == 'dir_w_btn') {
						if ($(dirDivId + ' a#dir_w_btn').hasClass('selected')) {
							Logger.warn("Walking travel mode is already selected");
						} else {
							$(dirDivId + ' a#dir_w_btn').addClass('selected');
							$(dirDivId + ' a#dir_d_btn').removeClass('selected');
						}
					}

					return false;
				});

			}

			function buildBubble(contentFromMarker, markersElement) {

				var localBubbleData = [];
				var randomNumber = Math.floor(Math.random() * 111111);

				randomNumber = randomNumber + "-" + mapDivId;

				var	bubble = "<div id='bubble-" + randomNumber + "' style='height: 130px !important; width: 300px !important;' class='bubble-content'>";

				if (!markersElement.geoMashup) {
					bubble += "<h4>Address:</h4>";
					bubble += "<p style='text-align: left'>" + contentFromMarker + "</p>";
				} else {
					var substr = markersElement.postTitle.substring(0, 30);
					bubble += "";
					bubble += "<p style='text-align: left'><a style='font-size: 15px !important; font-weight: bold !important;' title='Original post: " + markersElement.postTitle + "' href='" + markersElement.postLink  + "'>" + substr + "..</a></p>";
					bubble += "<p style='font-size: 12px !important; padding-left: 12px !important; padding-right: 6px !important; text-align: left; line-height: 130% !important'>" + markersElement.postExcerpt  + "</p>";
				}

				bubble += "<hr />";
				bubble += "<p style='text-align: left'>Directions: <a id='toHere-" + randomNumber + "' class='dirToHereTrigger' href='javascript:void(0);'>To here</a> - <a id='fromHere-" + randomNumber + "' class='dirFromHereTrigger' href='javascript:void(0);'>From here</a> | <a id='trigger-" + randomNumber + "' class='streetViewTrigger' href='javascript:void(0);'>Street View</a></p>";
				bubble += "</div>";

				return {bubbleHolderId : randomNumber, bubbleContent: bubble};
			}

			function parseCsv() {
				csvString = csvString.replace(new RegExp("'", "g"), "");
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

			function parseJsonStructure(json, infoBubbleContainPostLink)  {

				var index = 1;
				$.each(json, function() {
					Logger.info("Looping over JSON object:\n\tTitle: " + this.title + "\n\tAddy: " + this.addy + "\n\tLink: " + this.permalink + "\n\tExcerpt: " + this.excerpt);

					var targetArr = this.addy.split(CGMPGlobal.sep);

					if (Utils.isNumeric(targetArr[0])) {
						addGeoPoint(targetArr[0], index, targetArr[1], this.title, this.permalink, this.excerpt, infoBubbleContainPostLink);
					} else if (Utils.isAlphaNumeric(targetArr[0])) {
						storeAddress(targetArr[0], index, targetArr[1], this.title, this.permalink, this.excerpt, infoBubbleContainPostLink);
					} else {
						storeAddress(targetArr[0], index, targetArr[1], this.title, this.permalink, this.excerpt, infoBubbleContainPostLink);
						Logger.warn("Unknown type of geo destination in regexp: " + targetArr[0] + ", fallingback to store it as an address");
					}
					index ++;
				});
			}
			
			function pushGeoDestination(target, index) {

				 var targetArr = target.split(CGMPGlobal.sep);

				 if (Utils.isNumeric(targetArr[0])) {
					 addGeoPoint(targetArr[0], index, targetArr[1], '', '', '', false);
				 } else if (Utils.isAlphaNumeric(targetArr[0])) {
					 storeAddress(targetArr[0], index, targetArr[1], '', '', '', false);
				 } else {
					 storeAddress(targetArr[0], index, targetArr[1], '', '', '', false);
					 Logger.warn("Unknown type of geo destination in regexp: " + targetArr[0] + ", fallingback to store it as an address");
				 }
			}

			function storeAddress(address, zIndex, markerIcon, postTitle, postLink, postExcerpt, geoMashup) {
					
					Logger.info("Storing address: " + address + " for marker-to-be for the map ID: " + mapDivId);
					storedAddresses.push({
						address: address,
						animation: google.maps.Animation.DROP,
						zIndex: zIndex,
						markerIcon: markerIcon,
						postTitle: postTitle,
						postLink: postLink,
						postExcerpt: postExcerpt,
						geoMashup: geoMashup
					});
				}
			
			function addGeoPoint(point, zIndex, markerIcon, postTitle, postLink, postExcerpt, geoMashup) {
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
				storeAddress(latLng, zIndex, markerIcon, postTitle, postLink, postExcerpt, geoMashup);
			}
			
			this.buildAddressMarkers = function (additionalMarkerLocations, isGeoMashap, isBubbleContainsPostLink) {

				wasBuildAddressMarkersCalled = true;

				if (isGeoMashap == "true") {
					//Logger.info("Got Geo mashup JSON: ");
					additionalMarkerLocations = additionalMarkerLocations.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
					var json = $.parseJSON(additionalMarkerLocations);
					//Logger.raw(json);

					if (isBubbleContainsPostLink == "true") {
						parseJsonStructure(json, true);
					} else if (isBubbleContainsPostLink == "false") {
						parseJsonStructure(json, false);
					}
					queryGeocoderService();

				} else if (isGeoMashap == "false") {
					csvString = additionalMarkerLocations;
					parseCsv();
					queryGeocoderService();
				}
			}

			this.shiftMapToOriginalZoomAndLocation = function() {
				resetMap();
			}

			function queryGeocoderService() {
				timeout = null;
				if (storedAddresses.length > 0) {
					var element = storedAddresses.shift();
					Logger.info("Passing [" + element.address + "] to Geo service. Have left " + storedAddresses.length + " items to process!");

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

					if (badAddresses.length > 0) {
						var msg = "";
						$.each(badAddresses, function (index, addy) {
							msg += "\t" + (1 + index) + ". " + addy + "\n";
						});

						alert("ATTENTION! (by Comprehensive Google Map Plugin)\n\nGoogle found the following address(es) as NON-geographic and could not find them:\n\n" + msg + "\nConsider revising the address(es). Did you make a mistake when creating marker locations or did not provide a full geo-address? Alternatively use Google web to validate the address(es) ");
					}
					badAddresses = [];
				}
			}

			function setBounds() {

				if (markers.length > 1) {
					$.each(markers, function (index, marker) {
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

				element.address = buildLatLongBubbleInfo(element, addressPoint);
				instrumentMarker(addressPoint, element);
				//timeout = setTimeout(function() { queryGeocoderService(); }, 330);
				queryGeocoderService();
			}

			function buildLatLongBubbleInfo(element, addressPoint)  {
				if (element.zIndex == 1) {
					originalMapCenter = addressPoint;
					//Logger.info("Storing original map center [" + originalMapCenter + "]");
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
					
					//element.address = results[0].formatted_address; /* + "<br />" + buildLatLongBubbleInfo(element, addressPoint); */
					instrumentMarker(addressPoint, element);
					timeout = setTimeout(function() { queryGeocoderService(); }, 330);
				} else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
					//log("OVER_QUERY_LIMIT for " + element.address + " while having: " + markers.length + " markers");
					setBounds();
					storedAddresses.push(element);   	
					timeout = setTimeout(function() { queryGeocoderService(); }, 3000);
				} else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
					Logger.warn("Got ZERO results for [" + element.address + "]. Have left " + markers.length + " items to process");
					badAddresses.push(element.address);
					timeout = setTimeout(function() { queryGeocoderService(); }, 400);
				}

			}

			this.isBuildAddressMarkersCalled = function() {
				return wasBuildAddressMarkersCalled;
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

						if ($.inArray(markerIcon, defaultMarkers) != -1) {
							shadow = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/msmarker.shadow.png",
							new google.maps.Size(59, 32),
							new google.maps.Point(0,0),
							new google.maps.Point(16, 33));
						} else 	if ($.inArray(markerIcon, defaultPins) != -1) {
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
						//Logger.info("Setting shadow file [" + urlParts[urlParts.length-1] + "] for icon [" + markerIcon + "]");

						marker.setShadow(shadow);
					}

					if (element.zIndex == 0 && element.animation == google.maps.Animation.BOUNCE) {
						marker.setAnimation(google.maps.Animation.BOUNCE);
					}
					attachEventlistener(marker, element);
					if (!directionControlsBinded) {
						bindDirectionControlsToEvents();
						directionControlsBinded = true;
					}

					markers.push(marker);
				}
			}
		}

		OrchestratorHub = function () {
			$.extend(this, OrchestratorHub.defaultOptions);

			var orcs = [];
			
			this.getOrcs = function() {
				return orcs;
			}

			this.push = function(orcData) {
				orcs.push(orcData);
			}

			this.getOrc = function(mapId) {
				var found = {};
				$.map($(orcs), function(element) {
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

			raw: function(msg) {
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
				if ( $.browser.msie ) {
					//Die... die... die.... why dont you just, die???
				 } else {
					if ($.browser.mozilla && parseInt($.browser.version) >= 3 ) {
						console.log(message);
					} else {
						console.log("Logger could not print because browser is Mozilla [" + $.browser.mozilla + "] and its version is [" + parseInt($.browser.version) + "]");
					}
				 }
			}
		}


		$(document).ready(function() {

			var orcHolder = new OrchestratorHub();

			$.each(CGMPGlobal.maps, function(index, json) {

				if (typeof google == "undefined" || !google) {
					alert("ATTENTION! (by Comprehensive Google Map Plugin)" +
							"\n\nDear blog/website owner,\nIt looks like Google map API could not be reached. " + 
							"Map generation was aborted!" + 
							"\n\nPlease check that Google API script was loaded in the HTML source of your web page");

					Logger.fatal("We do not have reference to Google API. Aborting map generation ..");
					return false;
				} else if (typeof GMap2 != "undefined" && GMap2) {
					alert("ATTENTION! (by Comprehensive Google Map Plugin)" +
							"\n\nDear blog/website owner,\nIt looks like your webpage has reference to the older Google API v2, in addition to the API v3 used by Comprehensive Google Map! " + 
							"An example of plugin using the older API v2, can be 'jquery.gmap plugin'. " + 
							"\n\nPlease disable conflicting plugin(s). In the meanwhile, map generation is aborted!");

					Logger.fatal("It looks like the webpage has reference to GMap2 object from Google API v2. Aborting map generation ..");
					return false;
				}

				if ($('div#' + json.id).length > 0) {

						var googleMap = new google.maps.Map(document.getElementById(json.id));
						var orc = new GoogleMapOrchestrator(googleMap, {bubbleAutoPan: json.bubbleautopan, zoom : parseInt(json.zoom), mapType: json.maptype});

						orcHolder.push({mapId: json.id, orchestrator: orc});

						orc.switchMapControl(json.maptypecontrol, GoogleMapOrchestrator.ControlType.MAPTYPE);
						orc.switchMapControl(json.pancontrol, GoogleMapOrchestrator.ControlType.PAN);
						orc.switchMapControl(json.zoomcontrol, GoogleMapOrchestrator.ControlType.ZOOM);
						orc.switchMapControl(json.scalecontrol, GoogleMapOrchestrator.ControlType.SCALE);
						orc.switchMapControl(json.scrollwheelcontrol, GoogleMapOrchestrator.ControlType.SCROLLWHEEL);
						orc.switchMapControl(json.streetviewcontrol, GoogleMapOrchestrator.ControlType.STREETVIEW);


						if (json.showpanoramio == "true") {
							orc.buildLayer(GoogleMapOrchestrator.LayerType.PANORAMIO, null, json.panoramiouid);
						}

						if (json.showbike == "true") {
							orc.buildLayer(GoogleMapOrchestrator.LayerType.BIKE);
						}
						if (json.showtraffic == "true") {
							orc.buildLayer(GoogleMapOrchestrator.LayerType.TRAFFIC);
						}

						if (json.kml != null && json.kml != '') {
							orc.buildLayer(GoogleMapOrchestrator.LayerType.KML, json.kml);
						} else {

							if (json.markerlist != null && json.markerlist != '') {
								orc.buildAddressMarkers(json.markerlist, json.addmarkermashup, json.geomashupbubble);
							}

							var isBuildAddressMarkersCalled = orc.isBuildAddressMarkersCalled();
							if (!isBuildAddressMarkersCalled) {
								alert("ATTENTION! (by Comprehensive Google Map Plugin)" +
									"\n\nDear blog/website owner,\nIt looks like you did not specify any marker locations for the Google map!" +
									"\n\nPlease check the following when adding marker locations: " +
									"\n[a] \tIn the shortcode builder, did you click the \"Add Marker\" button before clicking \"Send to Editor\"?" +
									"\n[b] \tIn the widget, did you click the \"Add Marker\" button before clicking \"Save\"?" +
									"\n\nPlease revisit and reconfigure your widget or shortcode configuration." +
									"\n\nThe map requires at least one marker location to be added..");
							}
						}
				} else {
					Logger.fatal("It looks like the map DIV placeholder ID [" + json.id + "] does not exist in the page!");
				}
			});
		});
	}(jQueryCgmp));
}

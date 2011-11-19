=== Comprehensive Google Map Plugin ===
Contributors: alexanderzagniotov
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CWNZ5P4Z8RTQ8
Tags: google map, google map widget, google map short code, google map short code, map widget, map short code, fusion tables, google fusion tables, google fusion queries, fully documented, marker, controls, size, KML files, location by latitude/longitude, location by address, info window, traffic/bike lanes, cross browser, google maps v3, google, multiple markers, panoramio photos
Requires at least: 3.0.1
Tested up to: 3.2.1
Stable tag: 2.0.7

A simple and intuitive, yet elegant and fully documented Google map plugin that installs as a widget and a short code.

== Description ==

A simple and intuitive, yet elegant and fully documented Google map plugin that installs as a widget and a short code. No limited plugin editions or limited functionality! This is the full version of this free and premium plugin, which comes packed with useful features: 

* Intuitive and user friendly interface, which makes it very easy to configure Google map. No complex configuration options. Facebook style interactive interface for managing multiple map markers
* Help tooltips enabled, which makes your configuration hassle free
* Plugin is fully documented. If help tooltips are not enough, you can always refer to the full documentation about each of the settings
* Short-code builder available, which integrated with post/page editor. In other words, you do not need
manually to type the short-code in the editor (But you can if you want to).
* The plugin auto generates unique ID for each map. In other words - unlimited maps! You do not need to specify and maintain unique map
IDs explicitly when dealing with multiple maps on the same post/page.
* The plugin offers extensive configuration options for Google map marker, controls, size, KML files, location by latitude/longitude, location by address, info windows, traffic/bike lanes and more!
* Support for custom overlays: Panoramio photos on the map (http://www.panoramio.com/), bicycle lanes and traffic info.
* Widget enabled.
* Cross browser compatible
* Loads geographic markup from a KML, KMZ or GeoRSS file hosted remotely.

Support for Google Fusion tables and fusion table queries, distance matrix are to be added in the next version, stay tuned!


Please note: 
Although I try my best to release a bug-free code, one or two may slip through. It would be so cool and I would really appreciate it if you would report any bugs to me first at http://initbinder.com/comprehensive-google-map-plugin, before reporting the plugin to be broken. I am quick to respond. 
Thanks!

== Installation ==

Install this plugin by downloading and unzipping the ZIP archive into your plugins directory (/wp-content/plugins). Alternatively, you can upload the ZIP archive using Wordpress upload function. Activate the plugin in order to start using it.

To use the widget, simply drag the 'AZ :: Google Map' widget into a sidebar. Please note, your theme has to be widget-enabled. To change the styles of the contact form, open style.css file in the plugin editor in Wordpress. The short code builder can be found under the post/page editor. To access documentation please find "Google Map" link, under the "Settings" in your Wordpress admin panel.

Do you have a question or a feature request? Sure, drop me a line here: http://initbinder.com/comprehensive-google-map-plugin

== Frequently Asked Questions ==

1. Where can I find send to editor button?

Send to editor button is located at the bottom of the short code builder

2. Where can I find the short code builder?

You know the place in Wordpress where you write new post/page? Under the post/page editor look for the short code builder.

3. I activated the plugin and generated the map using widget/shortcode. Instead the map on my blog, I see only black frame with no map, why?

Most probably there are some Javascript errors that broke my plugin's Javascript. This can happen due to bug(s) in other plugin(s) that were loaded before the Google map plugin or bug(s) in my plugin. Usually bug in some Javascript file, breaks subsequent Javascript files. 

4. When I activate the plugin, some other plugin's admin menu or plugin itself does not load/work , why?

Most probably there are some Javascript errors that broke my plugin's Javascript. This can happen due to bug(s) in other plugin(s) that were loaded before the Google map plugin or bug(s) in my plugin. Usually bug in some Javascript file, breaks subsequent Javascript files. 

5. How do I fix the one of the problems above?

I need to have a look at your site and the page where the intended map is or/and log into your WP admin (I understand that the latter is not something that most of the people can be comfortable with, but I already helped two people this way).

6. When I activate the plugin and build the map, there is only gray box on the page. Why?

One of the reasons is that a bad address or wrong lat/long were given. Try to check it using Google map on the web first.

7. How fast can you have a look at my bug?

Well, I always check emails on the go, so my response times are amazingly short and fast. I always try to reply. Having said that, not always I can dive into the code. It can take me up to a few hours when I reach my laptop and Internet connection :)


== Screenshots ==

1. Widget editing interface.
2. Help tooltip in action
3. Documentation page
4. Google map short code builder
5. Send shortcode to editor button
6. Generated short code in the editor
7. Sliders
8. Facebook style interactive interface for managing multiple map markers

== Changelog ==

= 2.0.7 =
* Enhancement: As a short term solution, additional marker pins now have blue colour. This helps to discriminate between additional and primary markers. Moving forward, as a long term solution, custom marker icons will be added.

= 2.0.6 =
* Enhancement: Added info-bubble auto pan configuration option
* Added information notice above documentation tabs
* Updated documentation

= 2.0.5 =
* Enhancement: Some code clean up
* Spike: An attempt to identify and remove duplicate Google map API from $wp_scripts, which can be loaded by another plugin and/or theme (Socialite)

= 2.0.4 =
* Enhancement: Allowing 5 decimal points for latitude and longitude
* Enhancement: Info bubble content is more descriptive now

= 2.0.3 =
* Bug: Added check for Firefox when using console logging

= 2.0.2 =
* Bug: Added check for null in Ajax onSuccess handler

= 2.0.1 =
* Enhancement: latitude/longitude now have 3 values after decimal point
* Enhancement: Now printing both address and lat/long in the info bubble

= 2.0 =
* Bug: Latitude range was starting from zero instead of from -90
* Enhancement: latitude/longitude now accept decimal values
* Enhancement: Added management section for multiple map markers (Facebook style tokens)
* Enhancement: Added support for Panoramio images (http://www.panoramio.com/)
* Enhancement: User interface flow revisited
* Enhancement: Documentation updated
* Enhancement: When clicking on the map once, the map view is centered back to the original location. Useful when user dragged the map view away   
* Change: Disabled auto-panning when marker is clicked 

= 1.0 =
* Initial release

== Upgrade Notice ==

N/A

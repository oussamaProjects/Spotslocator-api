// JavaScript Document
var autocomplete_adr;
var map;
var map_place;
var spot_json;
var trainingcenters;
var trainingcenters_list = document.getElementById('training_center_list');
var centerNumber = jQuery('#training_center_list .center_number').html();
var searchBox = new google.maps.places.SearchBox(document.getElementById('google_loc'));
var markers = [];
var markersFiltered = [];
var nbMarkerInView = 0;

(function ($) {

    jQuery.ajax({
        'async': false,
        'global': false,
        'url': URLs.jsonUrl,
        'dataType': "json",
        'success': function (data) {
            trainingcenters = data;
        }
    });
    CreateMultiSelect();
    SetMap();
    SetCityAutocompletion();

    // trigger search event if we came from others pages
    if (jQuery('#map_place').val() !== "") {

        map_place = JSON.parse(decodeURIComponent(jQuery('#map_place').val()));
        jQuery('#google_loc').val(map_place['name']);
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': map_place['name'] }, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                map.setZoom(13);
            }
        });

    }
    // we need to open and close the dialog in ready because we have dynamic ui-title for each training center
    OpenDialog('dialog_training_center_detail', { width: 800 });
    jQuery('#dialog_training_center_detail').dialog('close');
    jQuery('.ui-widget-overlay').hide();
    jQuery('body').removeClass('no-scroll');
})(jQuery)

function SetCityAutocompletion() {
    var markers = [];
    if (map)
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];


        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();

        places.forEach(function (place) {
            if (!place.geometry) {
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);

        if (map.getZoom() == 12) {
            map.setZoom(map.getZoom() - 1);
        }

    });

}

function SetMap() {
    var center = new google.maps.LatLng(45.77722, 3.08703);

    // Set MAP 
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'greedy',
        mapTypeControl: false
    });


    //center and zoom map if we have user location
    if (navigator.geolocation) {
        var geoOptions = {
            maximumAge: 5 * 60 * 1000,
            timeout: 10 * 1000
        }
        var geoSuccess = function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            map.setZoom(5);
        };
        var geoError = function (error) {
            if (error.code == 1) {
                console.log('Error occurred. Error code: permission denied');
            }
            if (error.code == 3) {
                console.log('Error occurred. Error code: timed out');
            }
            // error.code can be:
            //   0: unknown error
            //   1: permission denied
            //   2: position unavailable (error response from location provider)
            //   3: timed out
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    }

    var result;
    // Set Training Centers Markers ON MAP
    jQuery.each(trainingcenters, function (index, value) {

        // console.log(value);
        // var mykey = '';
        // for (key in value.spot_json) {
        //     mykey = key;
        //     break;
        // }

        // spot_json = value.spot_json[mykey];
        spot_json = value;
        if (spot_json.position.latitude != 0 && spot_json.position.longitude != 0) {

            var loc = new google.maps.LatLng(spot_json.position.latitude, spot_json.position.longitude);

            var marker = new google.maps.Marker({
                position: loc,
                title: spot_json.center.nom_center,
                labelAnchor: new google.maps.Point(loc),
                // category: spot_json.category
            });
            var infowindow = new google.maps.InfoWindow({
                content: '<p style="text-transform: capitalize;">' + spot_json.center.nom_center + '</p>',
                disableAutoPan: true
            });

            // SET Training Centers Markers ON LIST
            var item = document.createElement('div');
            var title = document.createElement('a');
            item.id = 'trainingcenter-' + index;
            title.className = 'trainingcenter_title';
            title.innerHTML = marker.title;

            item.appendChild(title);
            trainingcenters_list.appendChild(item);

            //add events on list
            title.addEventListener('mouseover', function () {
                infowindow.open(map, marker);
            });

            title.addEventListener('mouseout', function () {
                infowindow.close(map, marker);
            });
            title.addEventListener('click', function () {
                DisplayTrainingCenterDetail(index);
                map.setCenter(loc);
                map.setZoom(14);
            });

            //add events on map markers
            marker.id = index;
            markers.push(marker);
            marker.addListener('click', function () {
                DisplayTrainingCenterDetail(marker.id)
            });

            marker.addListener('mouseover', function () {
                infowindow.open(map, marker);
            });
            marker.addListener('mouseout', function () {
                infowindow.close(map, marker);
            });


        } else {
            console.log('No position: ' + index);
        }
    });

    jQuery('#training_center_list').children().hide();

    //change results when map is moved
    google.maps.event.addListener(map, 'idle', function () {
        var bounds = map.getBounds();
        nbMarkerInView = 0;
        jQuery('#training_center_list').children().hide();



        if (markersFiltered.length > 0) {
            for (var i = 0; i < markers.length; i++) {
                var infowindow = new google.maps.InfoWindow({
                    content: '<p style="text-transform: capitalize;">' + markersFiltered[i] + '</p>'
                });

                if (bounds.contains(markers[i].getPosition()) === true) {
                    if (markersFiltered.includes(markers[i])) {
                        nbMarkerInView++;
                        jQuery('#trainingcenter-' + markers[i].id).show();
                    }
                }
            }
            jQuery('#training_center_list .center_number').html("<strong>" + markersFiltered.length + "</strong> " + centerNumber);

        } else {
            for (var i = 0; i < markers.length; i++) {
                var infowindow = new google.maps.InfoWindow({
                    content: '<p style="text-transform: capitalize;">' + markers[i] + '</p>'
                });

                if (bounds.contains(markers[i].getPosition()) === true) {
                    nbMarkerInView++;
                    jQuery('#trainingcenter-' + markers[i].id).show();
                }
            }

            jQuery('#training_center_list .center_number').html("<strong>" + nbMarkerInView + "</strong> " + centerNumber);
        }

        if (map.getZoom() <= 3) {
            map.setZoom(3);
        }

        jQuery('#training_center_list .center_number').show();
        if (nbMarkerInView > 20) {
            jQuery('#training_center_list').children().hide();
            jQuery('#training_center_list .center_number').show();
            jQuery('#training_center_list .oversized_results').show();
        }

    });

    var options = {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        maxZoom: 12,
        minimumClusterSize: 3
    };
    var markerCluster = new MarkerClusterer(map, markers, options);

    //custom marker style
    // ClusterIcon.prototype.createCss = function (pos) {
    //     var size = 15;
    //     if (this.cluster_.getMarkers().length < 10) {
    //         size = 15;
    //     }
    //     if (this.cluster_.getMarkers().length > 10 && this.cluster_.getMarkers().length < 100) {
    //         size = 20;
    //     }
    //     if (this.cluster_.getMarkers().length > 100 && this.cluster_.getMarkers().length < 1000) {
    //         size = 25;
    //     }
    //     if (this.cluster_.getMarkers().length > 1000) {
    //         size = 28;
    //     }

    //     style = ['border-radius : 50%',
    //         'cursor        : pointer',
    //         'position      : absolute',
    //         'top           : ' + pos.y + 'px',
    //         'left          : ' + pos.x + 'px',
    //         'width         : ' + size * 2 + 'px',
    //         'height        : ' + size * 2 + 'px',
    //         'line-height   : ' + (size * 2 + 1) + 'px',
    //         'text-align    : center',
    //         'background-color: #d9696c',
    //         'color: #ffffff',
    //         'font-size:14px'
    //     ];
    //     return style.join(";") + ';';
    // };

    // filter function for training center 
    filterMarkers = function (category) {
        markersFiltered = [];
        var nbMarker = 0;
        var oldNbmarker = nbMarkerInView;
        markerCluster.clearMarkers();
        if (category.value) {
            for (i = 0; i < markers.length; i++) {
                marker = markers[i];
                // If is same category or category not picked
                if ((typeof marker.category == 'object' && marker.category.indexOf((category.value)) >= 0) || category.value.length == 0) {
                    markersFiltered.push(marker);
                    nbMarker++;
                }
            }
            markerCluster.clearMarkers();
            markerCluster.addMarkers(markersFiltered);
            jQuery('#training_center_list .center_number').html("<strong>" + nbMarker + "</strong> " + centerNumber);
        } else {
            markerCluster.addMarkers(markers);
            jQuery('#training_center_list .center_number').html("<strong>" + oldNbmarker + "</strong> " + centerNumber);
        }
    }
}

function DisplayTrainingCenterDetail(id) {

     
    var $dialog = jQuery('#dialog_training_center_detail');

    if (id) {
 
        trainingcenter = trainingcenters[id];

        if (trainingcenter) {
            $dialog.parent().find('.ui-dialog-title').html("<span class='center_title'>" + trainingcenter.center.nom_center + "</span>");
            $dialog.find('.id_center').text(id);
            $dialog.find('.logo').attr('src', trainingcenter.logo);

            $dialog.find('.nom_ref').text(trainingcenter.ref.nom_ref);
            $dialog.find('.email_ref').text(trainingcenter.ref.email_ref);
            $dialog.find('.tel_ref').text(trainingcenter.ref.tel_ref);

            $dialog.find('.street').text(trainingcenter.address.adr);
            $dialog.find('.zip').text(trainingcenter.address.zip);
            $dialog.find('.cit').text(trainingcenter.address.cit);

            $dialog.find('.nom_center').text(trainingcenter.center.nom_center);
            $dialog.find('.tel_center').text(trainingcenter.center.tel_center);
            $dialog.find('.email_center').text(trainingcenter.center.email_center);
            $dialog.find('.website_center a').attr('href', trainingcenter.center.website_center).text(trainingcenter.center.website_center);
            $dialog.find('.contact_center a').attr('href', 'mailto:' + trainingcenter.center.email_center);

            $dialog.find('.text').html(trainingcenter.text);

            // jQuery('.info-slider').slick('destroy');
            $dialog.find('.info-slider').hide();
            $dialog.find('.info-slider').slick('slickRemove', null, null, true);
            if (trainingcenter.gallery_data.length) {
                $dialog.find('.info-slider').show();
                jQuery.each(trainingcenter.gallery_data, function (index, value) {
                    console.log(value);
                    $dialog.find('.info-slider').slick('slickAdd', '<div style="height: 120px; width: 200px;"><img src="' + value + '"></div>');
                });
            }

            jQuery('.btn_map_g, .see_map_g').click(function () {
                var zoom_pos = new google.maps.LatLng(trainingcenter.position.latitude, trainingcenter.position.longitude);
                map.setCenter(zoom_pos);
                map.setZoom(17);
                jQuery('#dialog_training_center_detail').dialog('close');
                jQuery('.ui-widget-overlay').hide();
            })
        }

        OpenDialog('dialog_training_center_detail', { width: 800 });

    }

}

function CreateMultiSelect() {
    jQuery('select').each(function (index, element) {
        //do not reaffect sumoselect a second time (done by second condition) 
        if (jQuery(element).prop("multiple") && jQuery(element).parents(".SumoSelect").length === 0) {
            var dataarray = new String(jQuery(element).data("multi-value"));
            var string_select, string_placeholder;
            jQuery(element).val(dataarray.split("%,%"));
            if (jQuery('body').data('lan_id') == 1) {
                if (jQuery(element).data("label_gender") == 1) {
                    string_select = "sélectionnés";
                } else {
                    string_select = "sélectionnées";
                }
                string_placeholder = "Sélectionner...";
            } else {
                string_select = "selected";
                string_placeholder = "Select here...";
            }
            jQuery(element).SumoSelect({ captionFormat: '{0} ' + string_select, placeholder: string_placeholder, csvDispCount: jQuery(element).data("csvdispcount") });
        }
    });
}

function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function (key) {
        result.push(json[key]);
    });
    return result;
}
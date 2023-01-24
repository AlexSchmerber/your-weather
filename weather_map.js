"use strict";

mapboxgl.accessToken = MAPBOX_API_KEY;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-98.4916, 29.4252],
    zoom: 9
});

function geocode(search, token) {
    const baseUrl = 'https://api.mapbox.com';
    const endPoint = '/geocoding/v5/mapbox.places/';
    return fetch(baseUrl + endPoint + encodeURIComponent(search) + '.json' + "?" + 'access_token=' + token)
        .then(function(res) {
            return res.json();
            // to get all the data from the request, comment out the following three lines...
        }).then(function(data) {

            return data.features[0].center;
        });
}

function reverseGeocode(coordinates, token) {
    const baseUrl = 'https://api.mapbox.com';
    const endPoint = '/geocoding/v5/mapbox.places/';
    return fetch(baseUrl + endPoint + coordinates.lng + "," + coordinates.lat + '.json' + "?" + 'access_token=' + token)
        .then(function(res) {
            return res.json();
        })
        // to get all the data from the request, comment out the following three lines...
        .then(function(data) {
            return data.features[0].place_name;
        });
}

const coordinatesGeocoder = function (query) {

    const matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );

    if (!matches) {
        return null;
    }

    function coordinateFeature(lng, lat) {
        return {
            center: [lng, lat],
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            place_name: 'Lat: ' + lat + ' Lng: ' + lng,
            place_type: ['coordinate'],
            properties: {},
            type: 'Feature'
        };
    }

    const coord1 = Number(matches[1]);
    const coord2 = Number(matches[2]);
    const geocodes = [];

    if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
        geocodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (geocodes.length === 0) {
        // else could be either lng, lat or lat, lng
        geocodes.push(coordinateFeature(coord1, coord2));
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    return geocodes;

};

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 4,
        placeholder: 'Search',
        mapboxgl: mapboxgl,
        reverseGeocode: true
    })
);

let lattitude = '';
let longitude = '';





geocode('San Antonio', MAPBOX_API_KEY).then(function (result){
    $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${result[1]}&lon=${result[0]}&appid=${OPENWEATHER_API_KEY}`, {
        units: "imperial"
    }).done(function(data) {
        $('#forecast_banner').html(`<h1>${data.city.name}</h1>`)
        for (let i = 0; i <= 40; i ++) {
            if(i % 8 === 0 || i === 0){
                $('#forecast_banner').append(`<div class="bg-dark text-white pt-3 mx-2" style="display: inline-block; height: 100px; width: 250px;">${data.list[i].dt_txt.substring(6,10)}<br>${data.list[i].main.temp} F<br> ${data.list[i].weather[0].description}</div></div>`);
            }

        }

    });
});


// $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${26.22}&lon=${12.234}&appid=${OPENWEATHER_API_KEY}`, {
//     units: "imperial"
// }).done(function(data) {
//     $('#forecast_banner').setHTML(`<h1>${data.city.name}</h1><div>${data.list[0].dt_txt}</div><div>${data.list[0].main.temp} ${data.list[0].weather[0].description}</div>`);
// });

function pinThatAddress(address) {
    geocode(address, MAPBOX_API_KEY)
        .then(function (result) {
            const marker = new mapboxgl
                .Marker();
            lattitude = result[1];
            longitude = result[0];

            marker.setLngLat(result);
            marker.addTo(map);
            let popup = new mapboxgl.Popup();
            $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`, {
                units: "imperial"
            }).done(function(data) {
                popup.setHTML(`<h1>${address}</h1><div>${data.list[0].dt_txt}</div><div>${data.list[0].main.temp} ${data.list[0].weather[0].description}</div>`);
            });
           ;
            marker.setPopup(popup);
            // map.setCenter(result);
            // map.setZoom(20);
        }).catch(function (error) {
        console.log("Boom");
    });
}

pinThatAddress('Codeup')
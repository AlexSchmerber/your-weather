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

$.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${28.3223}&lon=${75.199}&appid=${OPENWEATHER_API_KEY}`, {
    units: "imperial"
}).done(function(data) {
    console.log(`${data.list[0].dt_txt}  weather`, data);
});

let sanAntonioCoords = geocode('San Antonio', MAPBOX_API_KEY).then(function (result){
    console.log(result);
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
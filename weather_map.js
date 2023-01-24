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


let rainy = "img/rainy_clouds.jpeg"
let sunny = "img/mostly_sunny.jpeg"
let cloudy = "img/partly_cloudy.jpeg"
function searchLocation() {
    let searchInput = $('#search_bar')
    let input = searchInput.focus().val()
    console.log(input)
    geocode(input, MAPBOX_API_KEY).then(function (result){
        $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${result[1]}&lon=${result[0]}&appid=${OPENWEATHER_API_KEY}`, {
            units: "imperial"
        }).done(function(data) {
            if(isNaN(input) === true){
                // if(data.list[0].weather[0].main === 'Rain'){
                //     $('#container').css('background-image', 'url("img/rainy_clouds.jpeg")')
                // }
                if(data.list[0].weather[0].main === 'Rain'){
                    $('body').css('background-image', `url('${rainy}')`)
                }
                if(data.list[0].weather[0].main === 'Clear'){
                    $('body').css('background-image', `url('${sunny}')`)
                }
                if(data.list[0].weather[0].main === 'Clouds'){
                    $('body').css('background-image', `url('${cloudy}')`)
                }
                map.setCenter(result)
                const marker = new mapboxgl
                    .Marker();
                marker.setLngLat(result);
                marker.addTo(map);
                console.log(data.list);
                $('#forecast_banner').html(`<div style="color: white;" ><h3>${data.city.name}</h3><h5>Current ${data.list[0].main.temp}</h5></div>>`)
                for (let i = 0; i <= 32; i ++) {
                    if(i % 8 === 0 || i === 0){
                        let date = new Date(data.list[i].dt_txt);
                        $('#forecast_banner').append(`<div class="bg-black text-white pt-3 mx-2" style="font-size: 12px; display: inline-block; height: 80px; width: 160px;">${data.list[i].dt_txt.substring(6,10)}<br>${data.list[i].main.temp} F<br> ${data.list[i].weather[0].description}</div>`);
                    }
                }
            } else {
                console.log('invalid input');
            }
        });
    });
};

$('#search_bar').keypress(function (e) {
    if (e.key === 'Enter'){
        searchLocation();
    }
});


geocode('san antonio', MAPBOX_API_KEY).then(function (result){
    $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${result[1]}&lon=${result[0]}&appid=${OPENWEATHER_API_KEY}`, {
        units: "imperial"
    }).done(function(data) {
        console.log(data);
        $('#forecast_banner').html(`<div style="color: white;" ><h3>${data.city.name}</h3><h5>Current ${data.list[0].main.temp}</h5></div>>`)
        for (let i = 0; i < 40; i++) {
            if(i % 8 === 0 || i === 0){
                $('#forecast_banner').append(`<div class="bg-black text-white pt-3 mx-2" style="font-size: 12px; display: inline-block; height: 80px; width: 160px;">${data.list[i].dt_txt.substring(6,10)}<br>${data.list[i].main.temp} F<br> ${data.list[i].weather[0].description}</div>`);
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
            let lattitude = result[1];
            let longitude = result[0];

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
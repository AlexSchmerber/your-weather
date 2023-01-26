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

let rainy = "img/rainy_clouds.jpeg"
let sunny = "img/mostly_sunny.jpeg"
let cloudy = "img/partly_cloudy.jpeg"
let clearNight = "img/clear_night.jpeg"
let cloudyNight = "img/cloudy_night.jpeg"

function upperCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


let marker = new mapboxgl.Marker()
    .setLngLat([-73.9866, 40.7306])
    .addTo(map);

function searchLocation() {
    let searchInput = $('#search_bar')
    let input = searchInput.focus().val()
    if (/^[\.a-zA-Z0-9,!? ]*$/.test(input)) {
        geocode(input, MAPBOX_API_KEY).then(function (result) {
            $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${result[1]}&lon=${result[0]}&appid=${OPENWEATHER_API_KEY}`, {
                units: "imperial"
            }).done(function (data) {
                console.log(data.list[0]);
                if (data.list[0].weather[0].main === 'Rain') {
                    $('body').css('background-image', `url('${rainy}')`)
                }
                if (data.list[0].weather[0].main === 'Clear' && data.list[0].weather[0].icon.includes('d')) {
                    $('body').css('background-image', `url('${sunny}')`)
                }
                if (data.list[0].weather[0].main === 'Clear' && data.list[0].weather[0].icon.includes('n')) {
                    $('body').css('background-image', `url('${clearNight}')`)
                }
                if (data.list[0].weather[0].main === 'Clouds' && data.list[0].weather[0].icon.includes('d')) {
                    $('body').css('background-image', `url('${cloudy}')`)
                }
                if (data.list[0].weather[0].main === 'Clouds' && data.list[0].weather[0].icon.includes('n')) {
                    $('body').css('background-image', `url('${cloudyNight}')`)
                }
                if (data.list[0].weather[0].main === 'Snow') {
                    $('body').css('background-image', `url('${rainy}')`)
                }
                map.setCenter(result)
                marker.setLngLat(result);

                $('#forecast_banner').html(`<div style="color: white;" ><h2>${data.city.name}</h2><h6>Current ${data.list[0].main.temp} &#8457;</h6><h6>${upperCase(data.list[0].weather[0].description)}</h6></div>`)
                for (let i = 0; i <= 32; i++) {
                    if (i % 8 === 0 || i === 0) {
                        let date = new Date(data.list[i].dt_txt);
                        $('#forecast_banner').append(`<div class="text-white pt-3 mx-3 border border-white border-2 boxes" style="background-color: rgba(0, 0, 0, 0.4); font-size: 16px; display: inline-block; height: 220px; width: 180px;">${date.toDateString().substring(0, 3)}, ${date.toDateString().substring(4, 10)}<hr style="width: 90%;" class="p-0 m-0 mx-auto"> ${upperCase(data.list[i].weather[0].description)}<hr style="width: 90%;" class="p-0 m-0 mx-auto"><img class="p-0 m-0" src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather image"><br>${data.list[i].main.temp} &#8457;</div>`);
                    }
                }
            });
        });
    }
};

$('#search_bar').keypress(function (e) {
    if (e.key === 'Enter'){
        searchLocation();
    }
});

geocode('New York', MAPBOX_API_KEY).then(function (result){
    map.setCenter([result[0], result[1]])
    marker.setLngLat([result[0], result[1]]);
    $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${result[1]}&lon=${result[0]}&appid=${OPENWEATHER_API_KEY}`, {
        units: "imperial"
    }).done(function(data) {
        if (data.list[0].weather[0].main === 'Rain') {
            $('body').css('background-image', `url('${rainy}')`)
        }
        if (data.list[0].weather[0].main === 'Clear' && data.list[0].weather[0].icon.includes('d')) {
            $('body').css('background-image', `url('${sunny}')`)
        }
        if (data.list[0].weather[0].main === 'Clear' && data.list[0].weather[0].icon.includes('n')) {
            $('body').css('background-image', `url('${clearNight}')`)
        }
        if (data.list[0].weather[0].main === 'Clouds' && data.list[0].weather[0].icon.includes('d')) {
            $('body').css('background-image', `url('${cloudy}')`)
        }
        if (data.list[0].weather[0].main === 'Clouds' && data.list[0].weather[0].icon.includes('n')) {
            $('body').css('background-image', `url('${cloudyNight}')`)
        }
        if (data.list[0].weather[0].main === 'Snow') {
            $('body').css('background-image', `url('${rainy}')`)
        }

        $('#forecast_banner').html(`<div style="color: white;" ><h2>${data.city.name}</h2><h6>Current ${data.list[0].main.temp} &#8457;</h6><h6>${upperCase(data.list[0].weather[0].description)}</h6></div>`)
        for (let i = 0; i < 40; i++) {
            if(i % 8 === 0 || i === 0){
                let date = new Date(data.list[i].dt_txt);
                $('#forecast_banner').append(`<div class="text-white pt-3 mx-3 border border-white border-2 boxes" style="background-color: rgba(0, 0, 0, 0.4); font-size: 16px; display: inline-block; height: 220px; width: 180px;">${date.toDateString().substring(0,3)}, ${date.toDateString().substring(4,10)}<hr style="width: 90%;" class="p-0 m-0 mx-auto"> ${upperCase(data.list[i].weather[0].description)}<hr style="width: 90%;" class="p-0 m-0 mx-auto"><img class="p-0 m-0" src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather image"><br>${data.list[i].main.temp} &#8457;</div>`);
            }
        }
    });
});

const successCallback = (position) => {
    map.setCenter([position.coords.longitude, position.coords.latitude])
    marker.setLngLat([position.coords.longitude, position.coords.latitude]);

    let lat = position.coords.latitude
    let long = position.coords.longitude
    $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${OPENWEATHER_API_KEY}`, {
        units: "imperial"
    }).done(function(data) {
        if (data.list[0].weather[0].main === 'Rain') {
            $('body').css('background-image', `url('${rainy}')`)
        }
        if (data.list[0].weather[0].main === 'Clear' && data.list[0].weather[0].icon.includes('d')) {
            $('body').css('background-image', `url('${sunny}')`)
        }
        if (data.list[0].weather[0].main === 'Clear' && data.list[0].weather[0].icon.includes('n')) {
            $('body').css('background-image', `url('${clearNight}')`)
        }
        if (data.list[0].weather[0].main === 'Clouds' && data.list[0].weather[0].icon.includes('d')) {
            $('body').css('background-image', `url('${cloudy}')`)
        }
        if (data.list[0].weather[0].main === 'Clouds' && data.list[0].weather[0].icon.includes('n')) {
            $('body').css('background-image', `url('${cloudyNight}')`)
        }
        if (data.list[0].weather[0].main === 'Snow') {
            $('body').css('background-image', `url('${rainy}')`)
        }
        $('#forecast_banner').html(`<div style="color: white;" ><h2>${data.city.name}</h2><h6>Current ${data.list[0].main.temp} &#8457;</h6><h6>${upperCase(data.list[0].weather[0].description)}</h6></div>`)
        for (let i = 0; i < 40; i++) {
            if(i % 8 === 0 || i === 0){
                let date = new Date(data.list[i].dt_txt);
                $('#forecast_banner').append(`<div class="text-white pt-3 mx-3 border border-white border-2 boxes" style="background-color: rgba(0, 0, 0, 0.4); font-size: 16px; display: inline-block; height: 220px; width: 180px;">${date.toDateString().substring(0,3)}, ${date.toDateString().substring(4,10)}<hr style="width: 90%;" class="p-0 m-0 mx-auto"> ${upperCase(data.list[i].weather[0].description)}<hr style="width: 90%;" class="p-0 m-0 mx-auto"><img class="p-0 m-0" src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather image"><br>${data.list[i].main.temp} &#8457;</div>`);
            }
        }
    });
};

let userMapLocation = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
});

map.addControl(userMapLocation);
userMapLocation.on('geolocate', function(e) {
    let lon = e.coords.longitude;
    let lat = e.coords.latitude
    let position = [lon, lat];
    console.log(position);
    $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`, {
        units: "imperial"
    }).done(function(data) {
        if (data.list[0].weather[0].main === 'Rain') {
            $('body').css('background-image', `url('${rainy}')`)
        }
        if (data.list[0].weather[0].main === 'Clear' && data.list[0].weather[0].icon.includes('d')) {
            $('body').css('background-image', `url('${sunny}')`)
        }
        if (data.list[0].weather[0].main === 'Clear' && data.list[0].weather[0].icon.includes('n')) {
            $('body').css('background-image', `url('${clearNight}')`)
        }
        if (data.list[0].weather[0].main === 'Clouds' && data.list[0].weather[0].icon.includes('d')) {
            $('body').css('background-image', `url('${cloudy}')`)
        }
        if (data.list[0].weather[0].main === 'Clouds' && data.list[0].weather[0].icon.includes('n')) {
            $('body').css('background-image', `url('${cloudyNight}')`)
        }
        if (data.list[0].weather[0].main === 'Snow') {
            $('body').css('background-image', `url('${rainy}')`)
        }
        $('#forecast_banner').html(`<div style="color: white;" ><h2>${data.city.name}</h2><h6>Current ${data.list[0].main.temp} &#8457;</h6><h6>${upperCase(data.list[0].weather[0].description)}</h6></div>`)
        for (let i = 0; i < 40; i++) {
            if(i % 8 === 0 || i === 0){
                let date = new Date(data.list[i].dt_txt);
                $('#forecast_banner').append(`<div class="text-white pt-3 mx-3 border border-white border-2 boxes" style="background-color: rgba(0, 0, 0, 0.4); font-size: 16px; display: inline-block; height: 220px; width: 180px;">${date.toDateString().substring(0,3)}, ${date.toDateString().substring(4,10)}<hr style="width: 90%;" class="p-0 m-0 mx-auto"> ${upperCase(data.list[i].weather[0].description)}<hr style="width: 90%;" class="p-0 m-0 mx-auto"><img class="p-0 m-0" src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather image"><br>${data.list[i].main.temp} &#8457;</div>`);
            }
        }
    });
});

const errorCallback = (error) => {
    console.log(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

map.addControl(new mapboxgl.NavigationControl());

// function pinThatAddress(address) {
//     geocode(address, MAPBOX_API_KEY)
//         .then(function (result) {
//             const marker = new mapboxgl
//                 .Marker();
//             marker.setLngLat(result);
//             marker.addTo(map);
//             $('#remove_pins').click(function () {
//                 marker.remove()
//             });
//             $('#return_pins').click(function () {
//                 marker.addTo(map);
//             });
//         }).catch(function (error) {
//         console.log("Boom");
//     });
// }

// let lattitude = result[1];
// let longitude = result[0];
// let popup = new mapboxgl.Popup();
// $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`, {
//     units: "imperial"
// }).done(function(data) {
//     popup.setHTML(`<container class="text-black"><h1>${address}</h1></container>`);
// });
// marker.setPopup(popup);
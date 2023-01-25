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

function upperCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


let marker = new mapboxgl.Marker()
    .setLngLat([-98.495141, 29.4246])
    .addTo(map);

function searchLocation() {
    let searchInput = $('#search_bar')
    let input = searchInput.focus().val()
    geocode(input, MAPBOX_API_KEY).then(function (result){
        $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${result[1]}&lon=${result[0]}&appid=${OPENWEATHER_API_KEY}`, {
            units: "imperial"
        }).done(function(data) {
            console.log(data);
            if(isNaN(input) === true){
                if(data.list[0].weather[0].main === 'Rain'){
                    $('body').css('background-image', `url('${rainy}')`)
                }
                if(data.list[0].weather[0].main === 'Clear'){
                    $('body').css('background-image', `url('${sunny}')`)
                }
                if(data.list[0].weather[0].main === 'Clouds'){
                    $('body').css('background-image', `url('${cloudy}')`)
                }
                if(data.list[0].weather[0].main === 'Snow'){
                    $('body').css('background-image', `url('${rainy}')`)
                }
                map.setCenter(result)
                marker.setLngLat(result);

                $('#remove_pins').click(function () {
                    marker.remove()
                });
                $('#return_pins').click(function () {
                    marker.addTo(map);
                });
                $('#forecast_banner').html(`<div style="color: white;" ><h2>${data.city.name}</h2><h6>Current ${data.list[0].main.temp} &#8457;</h6><h6>${upperCase(data.list[0].weather[0].description)}</h6></div>`)
                for (let i = 0; i <= 32; i ++) {
                    if(i % 8 === 0 || i === 0){
                        let date = new Date(data.list[i].dt_txt);
                        $('#forecast_banner').append(`<div class="text-white pt-3 mx-3 border border-white border-2 boxes" style="background-color: rgba(0, 0, 0, 0.4); font-size: 16px; display: inline-block; height: 220px; width: 180px;">${date.toDateString().substring(0,3)}, ${date.toDateString().substring(4,10)}<hr style="width: 90%;" class="p-0 m-0 mx-auto"> ${upperCase(data.list[i].weather[0].description)}<hr style="width: 90%;" class="p-0 m-0 mx-auto"><img class="p-0 m-0" src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather image"><br>${data.list[i].main.temp} &#8457;</div>`);
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
        if(data.list[0].weather[0].main === 'Rain'){
            $('body').css('background-image', `url('${rainy}')`)
        }
        if(data.list[0].weather[0].main === 'Clear'){
            $('body').css('background-image', `url('${sunny}')`)
        }
        if(data.list[0].weather[0].main === 'Clouds'){
            $('body').css('background-image', `url('${cloudy}')`)
        }
        if(data.list[0].weather[0].description === 'Snow'){
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

// geocode('San Antonio', MAPBOX_API_KEY)
//     .then(function (result) {
//         let marker = new mapboxgl
//             .Marker();
//         marker.setLngLat(result);
//         marker.addTo(map);
//         $('#remove_pins').click(function () {
//             marker.remove()
//         });
//         $('#return_pins').click(function () {
//             marker.addTo(map);
//         });
//     });
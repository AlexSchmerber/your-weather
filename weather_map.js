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

$('#zoom-select').change(function (event) {
    map.setZoom(this.value)
});

let rainy = "img/rainy_clouds.jpeg"
let sunny = "img/mostly_sunny.jpeg"
let cloudy = "img/partly_cloudy.jpeg"

function upperCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function searchLocation() {
    let searchInput = $('#search_bar')
    let input = searchInput.focus().val()
    geocode(input, MAPBOX_API_KEY).then(function (result){
        $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${result[1]}&lon=${result[0]}&appid=${OPENWEATHER_API_KEY}`, {
            units: "imperial"
        }).done(function(data) {
            if(isNaN(input) === true){
                if(data.list[0].weather[0].main === 'Rain'){
                    $('#container').css('background-image', 'url("img/rainy_clouds.jpeg")')
                }
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
                $('#remove_pins').click(function () {
                    marker.remove()
                });
                $('#return_pins').click(function () {
                    marker.addTo(map);
                });
                $('#forecast_banner').html(`<div style="color: white;" ><h3>${data.city.name}</h3><h6>Current ${data.list[0].main.temp} &#8457;</h6><h6>${upperCase(data.list[0].weather[0].description)}</h6></div>`)
                for (let i = 0; i <= 32; i ++) {
                    if(i % 8 === 0 || i === 0){
                        let date = new Date(data.list[i].dt_txt);
                        $('#forecast_banner').append(`<div class="text-white pt-3 mx-2 border border-white border-2" style="background-color: rgba(0, 0, 0, 0.4); font-size: 16px; display: inline-block; height: 200px; width: 160px;">${date.toDateString().substring(0,3)}, ${date.toDateString().substring(4,10)}<br> ${upperCase(data.list[i].weather[0].description)} <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather image"><br>${data.list[i].main.temp} &#8457;</div>`);
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
        $('#forecast_banner').html(`<div style="color: white;" ><h3>${data.city.name}</h3><h6>Current ${data.list[0].main.temp} &#8457;</h6><h6>${upperCase(data.list[0].weather[0].description)}</h6></div>`)
        for (let i = 0; i < 40; i++) {
            if(i % 8 === 0 || i === 0){
                let date = new Date(data.list[i].dt_txt);
                $('#forecast_banner').append(`<div class="text-white pt-2 mx-2 border border-white border-2" style="background-color: rgba(0, 0, 0, 0.4); font-size: 16px; display: inline-block; height: 200px; width: 160px;">${date.toDateString().substring(0,3)}, ${date.toDateString().substring(4,10)}<br> ${upperCase(data.list[i].weather[0].description)} <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather image"><br>${data.list[i].main.temp} &#8457;</div>`);
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
            $('#remove_pins').click(function () {
                marker.remove()
            });
            $('#return_pins').click(function () {
                marker.addTo(map);
            });
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
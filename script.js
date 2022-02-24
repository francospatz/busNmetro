//1. Utiliza Leaflet para posicionarte en un mapa

/* 
const map = L.map('map');

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/navigation-night-v1',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZnJhbmNvc3BhdHoiLCJhIjoiY2wwMHI2NnIwMDY4dTNjb2ZyZW1uYzZvciJ9.PeiMuLvs29dqtJsJTVaopQ'
}).addTo(map);

map.locate({setView: true, watch: true, maxZoom: 17});

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    let crd = pos.coords;
    let marker = new L.marker([crd.latitude, crd.longitude],{
        draggable: false,
        autoPan: true
    }).addTo(map);

    console.log('Your current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('More or less ' + crd.accuracy + ' meters.');
};

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
};

navigator.geolocation.getCurrentPosition(success, error, options);  
*/


//2. Posicionar el transporte público (trenes y autobuses) de Los Angeles en el mapa. 🎉 🚌 🚊

const initialCoordinates = [34.05138630494726, -118.24509259842665];
const map = L.map('map').setView(initialCoordinates, 13);
const metroIcon = L.icon({
    iconUrl: "../img/metro.png",
    iconSize: [15, 15]
    
});
const busIcon = L.icon({
    iconUrl: "../img/bus.png",
    iconSize: [15, 15]

});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 17,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxleGRlbGFvYyIsImEiOiJjbDAwcGE5ZHowNW5hM2RvZmF1MXpmbGMzIn0.WcDRudM1b5FwfQ4iyfJV0w'

}).addTo(map);

let marker;
let markersLayer = new L.LayerGroup();
markersLayer.addTo(map);

async function getRealTimeLocationBus() {
        let response = await fetch("https://api.metro.net/agencies/lametro/vehicles/");
        let data = await response.json();
        console.log(data);
        
        for (let i = 0; i < data.items.length; i++) {
            let coord = [data.items[i].latitude, data.items[i].longitude];
            let marker = L.marker((coord), {icon: busIcon}).bindPopup(data.items[i].id);
            markersLayer.addLayer(marker);
        }
}

async function getRealTimeLocationMetro(){
    let response2 = await fetch("https://api.metro.net/agencies/lametro-rail/vehicles/");
    let data2 = await response2.json();
    console.log(data2);
    
        for (let i = 0; i < data2.items.length; i++) {
            let coord2 = [data2.items[i].latitude, data2.items[i].longitude];
            let marker2 = L.marker((coord2), {icon: metroIcon}).bindPopup(data2.items[i].id);
            markersLayer.addLayer(marker2);
        }
}


document.addEventListener('DOMContentLoaded', function(){
    getRealTimeLocationMetro();
    getRealTimeLocationBus();

    setInterval(function(){
        markersLayer.clearLayers();
        getRealTimeLocationMetro();
        getRealTimeLocationBus();

    }, 3000);
})

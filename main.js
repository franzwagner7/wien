/* OGD Wien Beispiel */

let stephansdom = {
    lat: 48.20845089806038,
    lng: 16.373484275555537,
    title: "Stephansdom"
};

let startLayer = L.tileLayer.provider("BasemapAT.grau")

let map = L.map("map", {
    center: [stephansdom.lat, stephansdom.lng],
    zoom: 16,
    layers: [
        startLayer
    ]
})

let layerControl = L.control.layers({
    "BasemapAT Grau": startLayer,
    "Basemap Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "DOM": L.tileLayer.provider("BasemapAT.surface"),
    "DGM": L.tileLayer.provider("BasemapAT.terrain"),
    //"Beschriftungen": L.tileLayer.provider("BasemapAT.overlay"),
    "Basemap mit Orthofoto und Beschriftung": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"), L.tileLayer.provider("BasemapAT.overlay")
    ])
}).addTo(map);

layerControl.expand();

//let sightLayer = L.featureGroup().addTo(map);

//layerControl.addOverlay(sightLayer, "Sehenswürdigkeiten");

//let mrk = L.marker([stephansdom.lat, stephansdom.lng]).addTo(sightLayer);

L.control.scale({
    imperial: false
}).addTo(map)

L.control.fullscreen().addTo(map)

let miniMap = new L.Control.MiniMap(L.tileLayer.provider("BasemapAT"), {
    toggleDisplay: true
}).addTo(map);

// Load Layer Sehenswürdigkeiten from Wien OGD as geoJSON
async function loadSites(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson)

    // Add to overlay
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Sehenswürdigkeiten");
    overlay.addTo(map);

    L.geoJSON(geojson, {
        pointToLayer: function (geoJsonPoint, latlng) {
            //console.log(geoJsonPoint.properties.WEITERE_INF);
            let popup = `
                <img src="${geoJsonPoint.properties.THUMBNAIL}"
                alt=""><br>
                <strong>${geoJsonPoint.properties.NAME}</strong>
                <hr>
                Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
                <a href="${geoJsonPoint.properties.WEITERE_INF}">Weblink</a>
            `;
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/photo.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            }).bindPopup(popup);
        }
    }).addTo(overlay)
}
loadSites("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");

// Load Layer Haltestellen Vienna Sightseeing from Wien OGD as geoJSON
async function loadStops(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson)

    // Add to overlay
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Vienna Sightseeing Haltestellen");
    overlay.addTo(map);

    L.geoJSON(geojson, {
        pointToLayer: function (geoJsonPoint, latlng) {
            //console.log(geoJsonPoint.properties);
            let popup = `
                <img src="${geoJsonPoint.properties.THUMBNAIL}"
                alt=""><br>
                <strong>${geoJsonPoint.properties.LINE_NAME}</strong>
                <hr>
                Station: ${geoJsonPoint.properties.STAT_NAME}<br>
            `;
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/bus_${geoJsonPoint.properties.LINE_ID}.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            }).bindPopup(popup);
        }
    }).addTo(overlay)
}
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

// Load Layer Linien Vienna Sightseeing from Wien OGD as geoJSON
async function loadLines(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson)

    // Add to overlay
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Vienna Sightseeing Linien");
    overlay.addTo(map);

    L.geoJSON(geojson, {
        style: function (feature) {
            // Farben von clrs.cc
            let colors = {
                "Red Line": "#FF4136",
                "Yellow Line": "#FFDC00",
                "Blue Line": "#0074D9",
                "Green Line": "#2ECC40",
                "Grey Line": "#AAAAAA",
                "Orange Line": "#FF851B"
            };

            return {
                color: `${colors[feature.properties.LINE_NAME]}`,
                weight: 5,
                //dashArray: [10, 8, 2, 8]
            }
        }
    }).bindPopup(function (layer) {
        return `
            <h4>${layer.feature.properties.LINE_NAME}</h4>
            von: ${layer.feature.properties.FROM_NAME}
            <br>
            nach: ${layer.feature.properties.TO_NAME}
        `;
        //return layer.feature.properties.LINE_NAME;
    }).addTo(overlay)
}
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

// Load Layer Fußgängerzonen Wien from Wien OGD as geoJSON
async function loadZones(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson)

    // Add to overlay
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Fußgängerzonen");
    overlay.addTo(map);

    L.geoJSON(geojson, {
        style: function (feature) {
            return {
                color: "#111111",
                fillColor: "#F012BE",
                weight: 1,
                fillOpacity: 0.2
            }
        }
    }).bindPopup(
        function (layer) {
            return `
            <h4>Fußgängerzone ${layer.feature.properties.ADRESSE}</h4>
            <h5>${layer.feature.properties.ZEITRAUM || ""}</h5>
            ${layer.feature.properties.AUSN_TEXT || ""}
            `;
        }).addTo(overlay)
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");

// Hotels und Unterkünfte
async function loadHotels(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    console.log(geojson.features);

    // Hotels nach Name sortieren
    geojson.features.sort(function(a, b){
        return a.properties.BETRIEB.toLowerCase() > b.properties.BETRIEB.toLowerCase()
    })

    let overlay = L.markerClusterGroup({
        disableClusteringAtZoom: 17
    });
    layerControl.addOverlay(overlay, "Hotels");
    overlay.addTo(map)
    let hotelsLayer = L.geoJSON(geojson, {
        pointToLayer: function (geoJsonPoint, latlng) {
            let searchList = document.querySelector(`#searchList`);
            searchList.innerHTML += `<option value="${geoJsonPoint.properties.BETRIEB}"><\option>`;

            let popup = `
                
                <strong>${geoJsonPoint.properties.BETRIEB}</strong>
                <hr>
                Betriebsart: ${geoJsonPoint.properties.BETRIEBSART_TXT}<br>
                Kategorie: ${geoJsonPoint.properties.KATEGORIE_TXT}<br>
                Tel.-Nr. ${geoJsonPoint.properties.KONTAKT_TEL}<br>
                Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
                <a href="${geoJsonPoint.properties.WEBLINK1}
                ">Weblink</a><br>
                <a href="mailto:${geoJsonPoint.properties.KONTAKT_EMAIL}
                ">E-Mail</a>
            `;
            if (geoJsonPoint.properties.BETRIEBSART == "H") {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/hotel_0star.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);
            } else if (geoJsonPoint.properties.BETRIEBSART == "P") {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/lodging_0star.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);
            } else {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/apartment-2.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);
            }

        }

    }).addTo(overlay);

    let form = document.querySelector("#searchForm");

    form.suchen.onclick = function () {
        console.log(form.hotel.value);
        hotelsLayer.eachLayer(function (marker) {

            if (form.hotel.value == marker.feature.properties.BETRIEB) {
                map.setView(marker.getLatLng(), 17);
                marker.openPopup()
            }
        })
    }

}
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");
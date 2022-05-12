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

    L.geoJSON(geojson).bindPopup(function (layer) {
        return`
            <h4>${layer.feature.properties.LINE_NAME}</h4>
            von: ${layer.feature.properties.FROM_NAME}
            <br>
            nach: ${layer.feature.properties.TO_NAME}
        `;
        //return layer.feature.properties.LINE_NAME;
    }).addTo(overlay)
}
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

// Load Layer Fußgängerzonen WIen from Wien OGD as geoJSON
async function loadZones(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson)

    // Add to overlay
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Fußgängerzonen");
    overlay.addTo(map);

    L.geoJSON(geojson).addTo(overlay)
}
//loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");

// Load Layer Hotels from Wien OGD as geoJSON
async function loadHotels(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson)

    // Add to overlay
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Hotels und Unterkünfte");
    overlay.addTo(map);

    L.geoJSON(geojson).addTo(overlay)
}
//loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");
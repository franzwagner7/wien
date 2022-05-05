/* OGD Wien Beispiel */

let stephansdom = {
    lat: 48.20845089806038,
    lng: 16.373484275555537,
    title: "Stephansdom"
};

let startLayer = L.tileLayer.provider("BasemapAT.grau")

let map = L.map("map", {
    center: [stephansdom.lat, stephansdom.lng],
    zoom: 12,
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
    console.log(geojson)

    L.geoJSON(geojson).addTo(map)
}
loadSites("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");
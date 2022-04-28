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
    "DGM": L.tileLayer.provider("BasemapAT.terrain")
}).addTo(map);
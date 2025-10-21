document.addEventListener('DOMContentLoaded', function() {
    const coords = window.listingData.coordinates;
    const title = window.listingData.title;
    const location = window.listingData.location;

    // Initialize map
    var map = L.map('map').setView(coords, 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Marker
    var marker = L.marker(coords).addTo(map);
    marker.bindPopup(`<b>${title}</b><br>${location}`).openPopup();

    // Circle example
    var circle = L.circle([coords[0] + 0.003, coords[1] - 0.003], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);
    circle.bindPopup("I am a circle.");

    // Polygon example
    var polygon = L.polygon([
        [coords[0] + 0.002, coords[1] + 0.002],
        [coords[0] - 0.002, coords[1] - 0.002],
        [coords[0] + 0.003, coords[1] - 0.001]
    ]).addTo(map);
    polygon.bindPopup("I am a polygon.");

    // Standalone popup
    var popup = L.popup()
        .setLatLng([coords[0] + 0.004, coords[1] + 0.004])
        .setContent("I am a standalone popup.")
        .openOn(map);

    // Map click event
    var clickPopup = L.popup();
    function onMapClick(e) {
        clickPopup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }
    map.on('click', onMapClick);
});

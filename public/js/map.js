document.addEventListener("DOMContentLoaded", function() {

    const [lng, lat] = listingData.geometry.coordinates;
    var map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup(listingData.location)
        .openPopup();
});

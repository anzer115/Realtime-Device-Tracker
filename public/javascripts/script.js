const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Open-Street-Map",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  let circle = L.circle([latitude, longitude], {
    radius: 1000, // Radius in meters
    color: "white",
    fillColor: "#00FFFF",
    fillOpacity: 0.2,
  }).addTo(map);

   map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
 
  if (circles[id]) {
    circles[id].setLatLng([latitude, longitude]);
  } else {
    circles[id] = circle; // Store the circle reference for future updates
  }
   
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    // delete the marker
    map.removeLayer(markers[id]);
    // remove the key
    delete markers[id];
  }
});

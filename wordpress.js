const mapElement = document.createElement("div");
const hideMap = () => {
mapElement.style.display = "none";
mapElement.style.opacity = "0";
};
const showMap = () => {
mapElement.style.display = "block";
mapElement.style.opacity = "1";
};
mapElement.id = "map";
mapElement.style.width = "100vw";
mapElement.style.height = "50vh";
mapElement.style.position = "fixed";
mapElement.style.top = "0";
mapElement.style.left = "0";
mapElement.style.zIndex = "1000";
// hideMap();
mapElement.style.animation = "fade-in-out 0.5s";

document.body.appendChild(mapElement)

const markerClick = async (e) => {
    console.log(`Marker ${e.target.options.name} clicked`, e);

    document
      .querySelector(`#${e.target.options.htmlID}`)
      ?.scrollIntoView({ behavior: "smooth" });
};

const map = leaflet.map("map").setView({ lat: 40.72438, lng: -74.305332 }, 18);
console.log(map)
console.log(document.querySelector("#map"))
leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  maxZoom: 19,
}).addTo(map);

map.addEventListener("click", (e) => {
  console.log(e.latlng);
});

document.querySelectorAll("[data-map-count]").forEach((element) => {
  const lat = parseFloat(element.getAttribute("data-map-lat"));
  const lng = parseFloat(element.getAttribute("data-map-lng"));
  const count = parseInt(element.getAttribute("data-map-count"));
  const name = element.getAttribute("data-map-name");
  const elementName = element.id;

  const icon = leaflet.divIcon({
    className: "markerIcon",
    html: `<div id="${elementName}MarkerIcon" class="markerIconInner">${count}</div>`,
  });

  const marker = leaflet.marker({ lat, lng }, {
    icon,
    name,
    htmlID: elementName,
    count
  }).addTo(map);
  marker.addEventListener("click", markerClick);
});

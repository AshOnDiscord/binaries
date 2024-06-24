const mapElement = document.createElement("div");
mapElement.id = "map";
mapElement.style.width = "100vw";
mapElement.style.height = "50vh";
mapElement.style.position = "fixed";
mapElement.style.top = "0";
mapElement.style.left = "0";
mapElement.style.zIndex = "1000";
document.body.appendChild(mapElement);
const map = leaflet.map("map").setView({ lat: 40.72438, lng: -74.305332 }, 18);
const hideMap = () => {
  // mapElement.style.display = "none";
  mapElement.style.opacity = "0";
  mapElement.style.pointerEvents = "none";
  mapElement.tabIndex = "-1"
  map.invalidateSize()
};
const showMap = () => {
  // mapElement.style.display = "block";
  mapElement.style.opacity = "1";
  mapElement.style.pointerEvents = "";
  mapElement.tabIndex = ""
  map.invalidateSize()
};
const updateMapVisibility = () => {
  const preBottom = document.getElementById("preSpots").getBoundingClientRect().bottom;
  if (preBottom < 0) {
    showMap()
  } else {
    hideMap()
  }
}
updateMapVisibility();
mapElement.style.transition = "opacity 0.5s ease-in-out";
mapElement.style.willChange = "opacity"

const markerClick = async (e) => {
  console.log(`Marker ${e.target.options.name} clicked`, e);

  document
    .querySelector(`#${e.target.options.htmlID}`)
    ?.scrollIntoView({ behavior: "smooth" });
};
console.log(map);
console.log(document.querySelector("#map"));
leaflet
  .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    maxZoom: 19,
  })
  .addTo(map);

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

  const marker = leaflet
    .marker(
      { lat, lng },
      {
        icon,
        name,
        htmlID: elementName,
        count,
      },
    )
    .addTo(map);
  marker.addEventListener("click", markerClick);
});

let currentMarker = "";
document.body.addEventListener("scroll", (e) => {
  updateMapVisibility();
  
  const mapHeight = document.querySelector("#map").clientHeight;

  const percentages = [...document.querySelectorAll("[data-map-count]")].map(
    (element) => {
      // get how much the element is visible in the viewport, remember the map covers the top 50vh
      const rect = element.getBoundingClientRect();

      // console.log(rect.top - mapHeight, rect.bottom - mapHeight, window.innerHeight, window.innerHeight - mapHeight, element.id);

      if (rect.top > window.innerHeight || rect.bottom < mapHeight) {
        // below and above the viewport
        return {
          id: element.id,
          percentage: -1, // below the viewport
        };
      }

      const topPos = Math.min(
        rect.bottom - mapHeight,
        window.innerHeight - mapHeight,
      );
      const bottomPos = Math.max(
        0,
        rect.top - (window.innerHeight - mapHeight),
      );

      return {
        id: element.id,
        percentage:
          ((topPos - bottomPos) / (window.innerHeight - mapHeight)) * 100,
      };
    },
  );

  // console.log(percentages.map(JSON.stringify).join("\n"));

  let largestElement = null;
  for (const element of percentages) {
    if (element.percentage === -1) {
      continue;
    }

    if (
      largestElement === null ||
      element.percentage > largestElement.percentage
    ) {
      largestElement = element;
      // console.log("New largest element", element);
    }
  }

  if (largestElement !== null) {
    // console.log(`Largest element is ${largestElement.id} with ${largestElement.percentage}`, currentMarker);
    if (largestElement.id !== currentMarker) {
      console.log("Scrolling to", largestElement.id);
      const marker = document.querySelector(`#${largestElement.id}`);

      const htmlElement = document.getElementById(largestElement.id);
      const lat = +htmlElement.getAttribute("data-map-lat");
      const lng = +htmlElement.getAttribute("data-map-lng");

      try {
      map.flyTo({ lat, lng }, 19, {
        animate: true,
        duration: 0.25,
        easeLinearity: 0.5,
      });
      } catch (e) {
        console.error(e)
        console.error(lat, lng, htmlElement.getAttribute("data-map-lat"), htmlElement.getAttribute("data-map-lng"))
      }
      document
        .getElementById(`${currentMarker}MarkerIcon`)
        ?.classList.remove("markerIconActive");
      currentMarker = largestElement.id;
      document
        .getElementById(`${currentMarker}MarkerIcon`)
        ?.classList.add("markerIconActive");
    }
  }
});

const updateScrollMargin = () => {
  const height = window.innerHeight / 2 - document.querySelector(".NAVBAR").clientHeight;
  document.querySelectorAll("[data-map-count]").forEach(e => {
     e.style.scrollMarginTop = `${height}px`;
  })
}

window.addEventListener("resize", () => {
  updateScrollMargin();
});
updateScrollMargin()

import stationData from "../assets/stations.json";

const SVG_NS = "http://www.w3.org/2000/svg";

// save reference to the board to add markers
const svg = document.getElementById("board");

function removeClassFromAllObjects(className) {
  document.querySelectorAll(`.${className}`).forEach(match => {
    match.classList.remove(`${className}`);
  });
}

function selectNearbyStations(currentLocation) {
  removeClassFromAllObjects("available");
  removeClassFromAllObjects("taxi");
  removeClassFromAllObjects("bus");
  removeClassFromAllObjects("river");
  removeClassFromAllObjects("underground");

  for (let type in stationData[currentLocation]) {
    let stops = stationData[currentLocation][type];
    stops.forEach(stop => {
      document
        .querySelector(`[data-point="${stop}"]`)
        .classList.add("available", type);
    });
  }
}

function placeNewCircle(target) {
  // delete current location first
  const currentLocation = document.querySelector(".selected");
  if (currentLocation) {
    svg.removeChild(currentLocation);
  }
  const circle = document.createElementNS(SVG_NS, "circle");
  const cx = target.getAttributeNS(null, "cx");
  const cy = target.getAttributeNS(null, "cy");
  circle.setAttributeNS(null, "cx", cx);
  circle.setAttributeNS(null, "cy", cy);
  circle.setAttributeNS(null, "r", 15);
  circle.setAttribute("class", "selected");
  circle.setAttribute("data-point", target.dataset.point);
  svg.appendChild(circle);
}

function handleClick(target) {
  const currentLocation = target.dataset.point;
  placeNewCircle(target);
  selectNearbyStations(currentLocation);
}

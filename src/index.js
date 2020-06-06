import * as firebase from "firebase/app";
import "firebase/firestore";

import stationData from "../assets/stations.json";

// setup firebase
const firebaseConfig = {
  apiKey: "AIzaSyBhxGWUq61BPjBLX9OORxH8PlZqir5lsO4",
  authDomain: "scotland-yard-495ce.firebaseapp.com",
  databaseURL: "https://scotland-yard-495ce.firebaseio.com",
  projectId: "scotland-yard-495ce",
  storageBucket: "scotland-yard-495ce.appspot.com",
  messagingSenderId: "1000051458561",
  appId: "1:1000051458561:web:61dc3f10fe539e88c6f600",
  measurementId: "G-03ZWL7YNYQ",
  authDomain: "scotland-yard-495ce.firebaseapp.com",
  databaseURL: "https://scotland-yard-495ce.firebaseio.com",
  projectId: "scotland-yard-495ce",
  storageBucket: "scotland-yard-495ce.appspot.com",
  messagingSenderId: "1000051458561",
  appId: "1:1000051458561:web:61dc3f10fe539e88c6f600",
  measurementId: "G-03ZWL7YNYQ",
};

firebase.initializeApp(firebaseConfig);

const SVG_NS = "http://www.w3.org/2000/svg";

// save reference to the board to add markers
const svg = document.getElementById("board");

// find all stations
const stations = document.querySelectorAll(".station");

stations.forEach((station) => {
  // attach click target
  station.addEventListener("click", (event) => {
    handleClick(event.target);
  });
});

function removeClassFromAllObjects(className) {
  document.querySelectorAll(`.${className}`).forEach((match) => {
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
    stops.forEach((stop) => {
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

function plotDetectivePosition(location, detective) {
  const point = document.querySelector(`[data-point="${location.toString()}"]`);
  const circle = document.createElementNS(SVG_NS, "circle");
  const cx = point.getAttributeNS(null, "cx");
  const cy = point.getAttributeNS(null, "cy");
  circle.setAttributeNS(null, "cx", cx);
  circle.setAttributeNS(null, "cy", cy);
  circle.setAttributeNS(null, "r", 15);
  circle.setAttribute("class", `detective ${detective}`);
  svg.appendChild(circle);

  // update location
  const locationContainer = document.querySelector(
    `.${detective} > .info > .location`
  );
  locationContainer.innerHTML = location.toString();
}

const db = firebase.firestore();

const currentGameRef = db.collection("games").doc("tcZwNAgeeZuJBzNl48l1");
const detectivesRef = currentGameRef.collection("detectives");

// currentGameRef.get().then((doc) => {
detectivesRef.get().then((querySnaphot) => {
  querySnaphot.forEach((doc) => {
    let { currentLocation } = doc.data();
    plotDetectivePosition(currentLocation, `detective-${doc.id}`);
  });
});

function saveDetectiveLocation(detective, location) {
  const detectiveNumber = detective.split("-").pop();
  detectivesRef
    .doc(detectiveNumber)
    .set(
      {
        currentLocation: parseInt(location, 10),
      },
      { merge: true }
    )
    .then(() => {
      const currentLocation = document.querySelector(".selected");
      if (currentLocation) {
        svg.removeChild(currentLocation);
      }
      // remove current detective position
      const detectiveLocation = document.querySelector(`circle.${detective}`);
      if (detectiveLocation) {
        svg.removeChild(detectiveLocation);
      }
      plotDetectivePosition(location, detective);
      removeClassFromAllObjects("available");
      removeClassFromAllObjects("taxi");
      removeClassFromAllObjects("bus");
      removeClassFromAllObjects("river");
      removeClassFromAllObjects("underground");
    });
}

document.querySelectorAll(".set-location").forEach((button) => {
  button.addEventListener("click", (event) => {
    // get detective reference from class list
    const detective = Array.from(
      event.target.parentElement.parentElement.classList
    ).pop();

    const selectedElement = document.querySelector(".selected");
    if (selectedElement) {
      const location = selectedElement.dataset.point;
      saveDetectiveLocation(detective, location);
    }
  });
});

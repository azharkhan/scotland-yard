<template>
  <div class="game-board">
    <svg
      id="board"
      viewBox="0 -3 900 669"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <circle
        v-for="station in stationCoords"
        :class="[{ selected: station.selected, available: station.available }, station.available ? station.type : '']"
        class="station"
        :key="station.number"
        :ref="station.number"
        :data-point="station.number"
        :cx="station.cx"
        :cy="station.cy"
        :r="station.selected ? 10 : 7.125"
        fill="#F9F9F9"
        fill-opacity="0.1"
        stroke="#3F3F3F"
        stroke-width="0.75"
        @click="selectStation(station.number)"
      />
    </svg>
  </div>
</template>

<script>
import stationCoords from "../assets/station-coordinates.json";
import stations from "../assets/stations.json";

export default {
  name: "Map",
  data() {
    return {
      stationCoords,
      stations,
      svgNS: "http://www.w3.org/2000/svg",
    };
  },
  props: {
    detectives: Array,
    currentPlayer: Object || null,
  },
  methods: {
    clearDetectiveMarkers: function() {
      const svg = document.getElementById("board");
      document.querySelectorAll("circle.detective").forEach(node => {
        svg.removeChild(node);
      });
    },

    clearSelected: function() {
      // remove any existing selected stations
      this.stationCoords
        .filter(station => station.selected)
        .forEach(station => (station.selected = false));
    },

    clearAvailableRoutes: function() {
      // clean up currently available routes
      this.stationCoords
        .filter(station => station.available)
        .forEach(station => {
          station.available = false;
          station.type = false;
        });
    },

    addCircleToBoard: function({
      cx,
      cy,
      r = 15,
      className = "selected",
      point = null,
    }) {
      const circle = document.createElementNS(this.svgNS, "circle");
      circle.setAttributeNS(null, "cx", cx);
      circle.setAttributeNS(null, "cy", cy);
      circle.setAttributeNS(null, "r", r);
      circle.setAttribute("class", className);
      if (point) {
        circle.setAttribute("data-point", point);
      }

      const svg = document.getElementById("board");
      svg.appendChild(circle);
    },

    selectStation: function(stationNumber) {
      // remove any existing selected stations
      this.clearSelected();
      // find the matching station and set to selected
      const matchingStation = this.stationCoords.find(
        station => station.number === stationNumber
      );
      matchingStation.selected = true;

      this.showNearbyStations(matchingStation);
    },

    showNearbyStations: function(selectedStation) {
      const stationNumber = selectedStation.number;
      // clean up currently available routes
      this.clearAvailableRoutes();
      // get routes for given station
      const routes = this.stations[stationNumber];
      for (let routeType in routes) {
        let stops = routes[routeType];
        stops.forEach(stop => {
          const matchingStation = this.stationCoords.find(
            station => station.number === stop
          );
          matchingStation.available = true;
          matchingStation.type = routeType;
        });
      }
    },
  },
  watch: {
    // initially the value is unavailable, we need to watch for changes to plot
    detectives: {
      deep: true,
      handler() {
        // clear all existing markers such that we can place new ones
        // this is needed when detectives move
        this.clearDetectiveMarkers();
        this.clearSelected();
        this.clearAvailableRoutes();

        this.detectives.map(detective => {
          const point = document.querySelector(
            `[data-point="${detective.currentLocation.toString()}"]`
          );
          const attributes = {
            cx: point.getAttributeNS(null, "cx"),
            cy: point.getAttributeNS(null, "cy"),
            className: `detective ${detective.role}`,
          };
          this.addCircleToBoard(attributes);
        });
      },
    },
    currentPlayer: {
      handler() {
        this.selectStation(this.currentPlayer.currentLocation.toString());
      },
    },
  },
};
</script>
<style>
.game-board {
  background-image: url("../assets/map-min.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
}
</style>

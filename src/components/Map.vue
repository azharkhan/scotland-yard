<template>
  <svg
    id="board"
    viewBox="0 -3 900 669"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <circle
      v-for="station in stationCoords"
      class="station"
      :key="station.number"
      :ref="station.number"
      :data-point="station.number"
      :cx="station.cx"
      :cy="station.cy"
      r="7.125"
      fill="#F9F9F9"
      fill-opacity="0.1"
      stroke="#3F3F3F"
      stroke-width="0.75"
      @click="selectStation"
    />
  </svg>
</template>

<script>
import stationCoords from "../../assets/station-coordinates.json";
import stations from "../../assets/stations.json";

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
  },
  methods: {
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
    selectStation: function(event) {
      const stationNumber = event.target.dataset.point;
      const stationElement = this.$refs[stationNumber][0];
      const attributes = {
        cx: stationElement.cx.baseVal.value,
        cy: stationElement.cy.baseVal.value,
        point: stationNumber,
      };

      this.addCircleToBoard(attributes);
    },
  },
  mounted: function() {
    const svg = document.getElementById("board");
    const SVG_NS = "http://www.w3.org/2000/svg";

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
};
</script>

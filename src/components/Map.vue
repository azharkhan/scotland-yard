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
        :class="[
          { selected: station.selected, available: station.available },
          station.available ? station.type : '',
        ]"
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
        stroke-width=".75"
        @click="station.available ? setCurrentPlayerLocation(station) : null"
      />
    </svg>
  </div>
</template>

<script>
import stationCoords from "../assets/station-coordinates.json";
import stations from "../assets/stations.json";
import { gsap } from "gsap";

import { store } from "@/store";

export default {
  name: "Map",
  data() {
    return {
      stationCoords,
      stations,
      svgNS: "http://www.w3.org/2000/svg",
      state: store.state,
    };
  },
  props: {
    detectives: Array,
    currentPlayer: Object || null,
    isMrXVisible: Boolean,
    mrXLocation: Number || Boolean,
  },
  methods: {
    clearDetectiveMarkers: function () {
      const svg = document.getElementById("board");
      document.querySelectorAll("circle.detective").forEach((node) => {
        svg.removeChild(node);
      });
    },

    clearSelected: function () {
      // remove any existing selected stations
      this.stationCoords
        .filter((station) => station.selected)
        .forEach((station) => {
          // clear animations
          const stationRef = this.$refs[station.number][0];
          gsap.killTweensOf(stationRef);
          station.selected = false;
          // override any element styling that was added
          stationRef.removeAttribute("style");
        });
    },

    clearAvailableRoutes: function () {
      // clean up currently available routes
      this.stationCoords
        .filter((station) => station.available)
        .forEach((station) => {
          station.available = false;
          station.type = false;
        });
    },

    addCircleToBoard: function ({
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

    chooseTicketsAndValidate: async function (station) {
      // find all possible modes of transport
      const currentLocation = this.currentPlayer.currentLocation;
      const nearbyStations = this.stations[currentLocation];
      const allTransportTypes = Object.keys(nearbyStations);

      // go through all available transport types
      // give players a choice if multiple ticket choices are available
      const accessibleTransports = allTransportTypes.reduce(
        (accessible, type) => {
          const found = stations[currentLocation][type].find(
            (stop) => stop === station.number.toString()
          );
          if (found && this.currentPlayer.tickets[type] > 0) {
            accessible.push(type);
          }
          return accessible;
        },
        []
      );

      return new Promise((resolve, reject) => {
        if (accessibleTransports.length > 1) {
          this.$buefy.dialog.prompt({
            message: `Please choose between the following tickets: ${accessibleTransports.join(
              ", "
            )}`,
            inputAttrs: {
              type: "text",
              placeholder: `Either of: ${accessibleTransports.join(" or ")}`,
              value: `${accessibleTransports[0]}`,
            },
            confirmText: "Spend",
            trapFocus: true,
            closeOnConfirm: false,
            onConfirm: (value, { close }) => {
              if (accessibleTransports.includes(value)) {
                close();
                return resolve(value);
              } else {
                this.$buefy.toast.open(`That's not a valid ticket :(`);
              }
            },
          });
        } else if (accessibleTransports.length === 1) {
          return resolve(accessibleTransports[0]);
        } else {
          return reject();
        }
      });
    },

    setCurrentPlayerLocation: async function (station) {
      let ticketType;

      if (
        this.currentPlayer.role === "mr-x" &&
        this.currentPlayer.tickets.black > 0
      ) {
        try {
          ticketType = await new Promise((resolve, reject) => {
            this.$buefy.dialog.confirm({
              message: `Would you like to use a black ticket?`,
              onCancel: () => reject(),
              onConfirm: () => resolve("black"),
            });
          });
        } catch {
          ticketType = null;
        }
      }

      if (!ticketType) {
        try {
          ticketType = await this.chooseTicketsAndValidate(station);
          this.$emit("setLocation", {
            stationNumber: station.number,
            ticketType,
          });
        } catch (err) {
          alert("You do not have enough tickets for this move.");
          return;
        }
      } else {
        this.$emit("setLocation", {
          stationNumber: station.number,
          ticketType,
        });
      }
    },

    selectStation: function (stationNumber) {
      // remove any existing selected stations
      this.clearSelected();
      // find the matching station and set to selected
      const matchingStation = this.stationCoords.find(
        (station) => station.number === stationNumber
      );

      matchingStation.selected = true;

      const timeline = gsap.timeline({ repeat: -1, yoyo: true });
      const station = this.$refs[stationNumber][0];
      timeline.to(station, {
        duration: 1,
        strokeWidth: 1,
        attr: {
          r: 25,
        },
        ease: "power2.inOut",
      });

      this.showNearbyStations(matchingStation);
    },

    showNearbyStations: function (selectedStation) {
      const stationNumber = selectedStation.number;
      // clean up currently available routes
      this.clearAvailableRoutes();
      // get routes for given station
      const routes = this.stations[stationNumber];

      const detectiveLocations = this.detectives.map((detective) =>
        // convert toString since stationCoords are stored as strings
        detective.currentLocation.toString()
      );

      for (let routeType in routes) {
        if (this.currentPlayer.tickets[routeType] > 0) {
          let stops = routes[routeType];
          stops.forEach((stop) => {
            const matchingStation = this.stationCoords.find(
              (station) => station.number === stop
            );

            // two detectives cannot occupy the same space
            // ref: https://github.com/azharkhan/scotland-yard/pull/13
            if (!detectiveLocations.includes(matchingStation.number)) {
              matchingStation.available = true;
              matchingStation.type = routeType;
            }
          });
        }
      }
    },
    setCurrentPlayer() {
      const isMrXTurn = this.currentPlayer.role === "mr-x";
      const loggedInUserIsMrX =
        this.currentPlayer.user &&
        this.state.user &&
        this.state.user.uid &&
        this.state.user.uid === this.currentPlayer.user;

      if (isMrXTurn && !loggedInUserIsMrX) {
        // we don't want to show other players Mr. X location
        return;
      }
      this.selectStation(this.currentPlayer.currentLocation.toString());
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

        this.detectives.map((detective) => {
          const point = this.$refs[detective.currentLocation][0];
          const attributes = {
            cx: point.getAttributeNS(null, "cx"),
            cy: point.getAttributeNS(null, "cy"),
            className: `detective ${detective.role}`,
          };
          this.addCircleToBoard(attributes);
        });
      },
    },
    isMrXVisible: {
      handler() {
        const svg = document.getElementById("board");
        if (this.isMrXVisible) {
          // check if user has access to Mr X
          const isMrXTurn =
            this.currentPlayer && this.currentPlayer.role === "mr-x";

          if (!isMrXTurn && this.isMrXVisible && this.mrXLocation) {
            const mrXLocationStation = this.$refs[this.mrXLocation][0];
            const attributes = {
              cx: mrXLocationStation.getAttributeNS(null, "cx"),
              cy: mrXLocationStation.getAttributeNS(null, "cy"),
              className: `mr-x-location`,
            };
            this.addCircleToBoard(attributes);
          }
        } else {
          document.querySelectorAll("circle.mr-x-location").forEach((node) => {
            svg.removeChild(node);
          });
        }
      },
    },
    state: {
      deep: true,
      handler() {
        this.setCurrentPlayer();
      },
    },
    currentPlayer: {
      handler() {
        this.setCurrentPlayer();
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

.detective {
  stroke: magenta;
  fill: none;
  stroke-width: 3;
}

.station {
  stroke: black;
  fill: transparent;
}

.selected {
  stroke: darkslategray;
  stroke-width: 3;
}

.location {
  color: #333;
}

.transportation {
  color: #333;
}

.available {
  stroke-width: 3;
}

.available:hover {
  cursor: pointer;
  stroke: red;
}

.taxi {
  stroke: yellow;
}

.underground {
  stroke: crimson;
}

.bus {
  stroke: turquoise;
}

.river {
  stroke: black;
}
.detective-1 {
  stroke: hotpink;
}

.detective-2 {
  stroke: coral;
}

.detective-3 {
  stroke: aquamarine;
}

.detective-4 {
  stroke: royalblue;
}

.detective-5 {
  stroke: gold;
}
.mr-x-location {
  stroke: darkslategray;
  stroke-width: 3;
  fill: none;
}
</style>

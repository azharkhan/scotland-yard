<template>
  <div class="game">
    <Map :detectives="detectives" :currentPlayer="currentPlayer" />
    <div class="players">
      <Detective
        v-for="(detective, index) in detectives"
        :key="detective.currentLocation || index"
        :data="detective"
        :currentPlayer="currentPlayer"
        @setTurn="handleSetTurn"
      />
    </div>
  </div>
</template>

<script>
import Map from "./components/Map.vue";

import Detective from "./components/Detective.vue";
import { db } from "./db";

export default {
  name: "App",
  components: { Map, Detective },
  data() {
    return {
      name: "Mr. X",
      detectives: [],
      currentPlayer: null,
    };
  },
  firestore: {
    detectives: db
      .collection("games")
      .doc("tcZwNAgeeZuJBzNl48l1")
      .collection("detectives"),
  },
  methods: {
    handleSetTurn: function(data) {
      this.currentPlayer = data;
    },
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.game {
  padding: 10px;
  display: grid;
  height: 100vh;
}

.players {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.player {
  border: 1px #ececec solid;
}

.detective {
  stroke: magenta;
  fill: none;
  stroke-width: 3;
}

.selected {
  stroke: magenta;
  fill: none;
  stroke-width: 3;
}

.location {
  color: #333;
}

.transportation {
  color: #333;
}

.detective-1 {
  stroke: hotpink;
  color: hotpink;
}

.detective-2 {
  stroke: coral;
  color: coral;
}

.detective-3 {
  stroke: aquamarine;
  color: aquamarine;
}

.detective-4 {
  stroke: royalblue;
  color: royalblue;
}

.detective-5 {
  stroke: gold;
  color: gold;
}

.mr-x {
  stroke: slategray;
}

.station {
  stroke: black;
  fill: transparent;
}

.station:hover {
  cursor: pointer;
  stroke: red;
  stroke-width: 2;
}

.available {
  stroke-width: 3;
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
</style>

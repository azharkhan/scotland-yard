<template>
  <div class="game">
    <div class="game-board">
      <Map :detectives="detectives" />
    </div>
    <div class="players">
      <div class="player mr-x">
        <div class="info">
          <h1>{{ name }}</h1>
        </div>
      </div>
      <Detective
        v-for="(detective, index) in detectives"
        :key="detective.currentLocation || index"
        :data="detective"
      />
    </div>
  </div>
</template>

<script>
import Map from "./Map.vue";
import Detective from "./Detective.vue";
import { db } from "../db";

export default {
  name: "App",
  components: { Map, Detective },
  data() {
    return {
      name: "Mr. X",
      detectives: [],
    };
  },
  firestore: {
    detectives: db
      .collection("games")
      .doc("tcZwNAgeeZuJBzNl48l1")
      .collection("detectives"),
  },
};
</script>

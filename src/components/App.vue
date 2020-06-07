<template>
  <div class="game">
    <div class="game-board">
      <Map />
    </div>
    <div class="players">
      <div class="player mr-x">
        <div class="info">
          <h1>{{ name }}</h1>
        </div>
      </div>
      <Detective
        v-for="detective in detectives"
        :key="detective"
        :num="detective"
      />
    </div>
  </div>
</template>

<script>
import Map from "./Map.vue";
import Detective from "./Detective.vue";

export default {
  name: "App",
  components: { Map, Detective },
  data() {
    return {
      name: "Mr. X",
      detectives: [1, 2, 3, 4, 5],
    };
  },
};
</script>

<style></style>

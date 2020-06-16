<template>
  <div class="player">
    <div class="info">
      <h1 @click="setPlayerTurn" :class="isCurrentPlayer ? this.data.role : ''">Detective</h1>
      <h2 class="location">{{ data.currentLocation }}</h2>
      <ul class="transportation">
        <li>Taxi: {{ data.taxi }}</li>
        <li>Bus: {{ data.bus }}</li>
        <li>Underground: {{ data.underground }}</li>
      </ul>
      <button v-if="isCurrentPlayer" @click="saveLocation">Set Location</button>
    </div>
  </div>
</template>

<script>
import { db } from "../db";

export default {
  name: "Detective",
  props: {
    data: Object,
    currentPlayer: Object,
  },
  computed: {
    isCurrentPlayer: function() {
      return this.currentPlayer && this.currentPlayer.role === this.data.role;
    },
    detectiveNumber: function() {
      return this.data.role.split("-").pop();
    },
  },
  methods: {
    removeSelected: function() {
      const svg = document.getElementById("board");
      const selectedElement = document.querySelector(".selected");
      svg.removeChild(selectedElement);
    },
    saveLocation: function() {
      const selectedElement = document.querySelector(".selected");

      if (!selectedElement) {
        return;
      }
      const location = selectedElement.dataset.point;

      const currentGameRef = db.collection("games").doc("tcZwNAgeeZuJBzNl48l1");
      const detectivesRef = currentGameRef.collection("detectives");
      detectivesRef
        .doc(this.detectiveNumber)
        .set(
          {
            currentLocation: parseInt(location, 10),
          },
          { merge: true }
        )
        .then(() => {
          this.removeSelected();
        });
    },
    // temporarily use this to mimic setting turns
    setPlayerTurn: function() {
      this.$emit("setTurn", this.data);
    },
  },
};
</script>

<style scoped>
h1:hover {
  cursor: pointer;
}
</style>

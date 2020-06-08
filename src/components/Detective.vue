<template>
  <div class="player" :class="data.role">
    <div class="info">
      <h1>Detective</h1>
      <h2 class="location">{{ data.currentLocation }}</h2>
      <ul class="transportation">
        <li>Taxi: {{ data.taxi }}</li>
        <li>Bus: {{ data.bus }}</li>
        <li>Underground: {{ data.underground }}</li>
      </ul>
      <button @click="saveLocation">Set Location</button>
    </div>
  </div>
</template>

<script>
import { db } from "../db";

export default {
  name: "Detective",
  props: {
    data: Object,
  },
  computed: {
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
          // removeClassFromAllObjects("available");
          // removeClassFromAllObjects("taxi");
          // removeClassFromAllObjects("bus");
          // removeClassFromAllObjects("river");
          // removeClassFromAllObjects("underground");
        });
    },
  },
};
</script>

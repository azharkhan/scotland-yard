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
    </div>
  </div>
</template>

<script>
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

.detective-1 {
  color: hotpink;
}

.detective-2 {
  color: coral;
}

.detective-3 {
  color: aquamarine;
}

.detective-4 {
  color: royalblue;
}

.detective-5 {
  color: gold;
}
</style>

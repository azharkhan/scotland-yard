<template>
  <div class="player">
    <div class="info">
      <div class="name-and-icon" @click="setPlayerTurn">
        <BadgeIcon :role="this.data.role" />
        <div class="name" :class="isCurrentPlayer ? this.data.role : ''">Detective</div>
      </div>
      <h2 class="location">{{ data.currentLocation }}</h2>
      <ul class="transportation">
        <li>Taxi: {{ data.tickets.taxi }}</li>
        <li>Bus: {{ data.tickets.bus }}</li>
        <li>Underground: {{ data.tickets.underground }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import BadgeIcon from "./BadgeIcon";
export default {
  name: "Detective",
  components: { BadgeIcon },
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
.name-and-icon:hover {
  cursor: pointer;
}

.name-and-icon {
  display: flex;
  align-items: center;
}

.name {
  font-size: 1.15em;
  margin-left: 1em;
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

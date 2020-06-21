<template>
  <div class="player">
    <div class="info">
      <div class="name-and-icon" @click="setPlayerTurn">
        <BadgeIcon :role="this.data.role" />
        <div class="name" :class="isCurrentPlayer ? this.data.role : ''">Detective</div>
        <div class="location">{{ data.currentLocation }}</div>
      </div>
      <div class="tickets">
        <div
          v-for="transportType in transportTypes"
          :key="transportType"
          class="transportation"
          :class="`${transportType}-icon`"
        >
          <TransportIcon :type="transportType" />
          <div class="ticket-balance">{{ data.tickets[transportType]}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BadgeIcon from "./BadgeIcon";
import TransportIcon from "./TransportIcon";

export default {
  name: "Detective",
  components: { BadgeIcon, TransportIcon },
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
    transportTypes: function() {
      return Object.keys(this.data.tickets).sort();
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
      this.$emit("setTurn", this.data.role);
    },
  },
};
</script>

<style scoped>
.player {
  padding: 0.5em;
}

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

.location {
  border: 1px solid #ebebeb;
  border-radius: 50%;
  padding: 0.5em;
  font-size: 1.5em;
  font-weight: bold;
  margin-left: auto;
  width: 2.5em;
  height: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tickets {
  display: flex;
  justify-content: space-evenly;
  margin-top: 0.5em;
}

.transportation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.25em;
}
.ticket-balance {
  margin-top: 0.25em;
}
</style>

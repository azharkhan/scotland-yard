<template>
  <div class="player" :class="{ 'current-player': isCurrentPlayer }">
    <div class="info">
      <div class="name-and-icon" @click="setPlayerTurn">
        <MrXIcon />
        <div class="name" :class="isCurrentPlayer ? this.data.role : ''">Mr. X</div>
        <div class="location" v-if="hasAccess">{{ data.currentLocation }}</div>
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
import TransportIcon from "./TransportIcon";
import MrXIcon from "./MrXIcon";

export default {
  name: "MrX",
  components: { TransportIcon, MrXIcon },
  props: {
    data: Object,
    isCurrentPlayer: Boolean,
    hasAccess: Boolean,
  },
  computed: {
    transportTypes: function() {
      return Object.keys(this.data.tickets).sort();
    },
  },
  methods: {
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
  border: 1px #ececec solid;
}

.current-player {
  border: 2px solid #333;
}

.name-and-icon:hover {
  cursor: pointer;
}

.name-and-icon {
  display: flex;
  align-items: center;
}

.name-and-icon > svg {
  height: 3rem;
  width: 3rem;
}

.name {
  font-size: 1.15em;
  margin-left: 1em;
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

.black-icon {
  width: 2rem;
}

.ticket-balance {
  margin-top: 0.25em;
}
</style>

<template>
  <div class="player">
    <div class="icon-and-location" @click="setPlayerTurn">
      <figure class="image is-32x32">
        <BadgeIcon :role="data.role" v-if="data.role !== 'mr-x'" />
        <MrXIcon class="mr-x-icon" v-if="data.role === 'mr-x'" />
      </figure>
      <div class="location">
        <span
          v-if="data.role === 'mr-x' && hasAccess || data.role !== 'mr-x'"
        >{{ data.currentLocation }}</span>
      </div>
    </div>
    <!-- used to show Mr. X's moves -->
    <slot></slot>
    <div class="tickets">
      <div class="transportation" v-for="transportType in transportTypes" :key="transportType">
        <p class="ticket-balance">{{ data.tickets[transportType] }}</p>
        <TransportIcon :type="transportType" class="transport-icon" />
      </div>
    </div>
  </div>
</template>

<script>
import BadgeIcon from "./BadgeIcon";
import TransportIcon from "./TransportIcon";
import MrXIcon from "./MrXIcon";

export default {
  name: "Player",
  components: { BadgeIcon, TransportIcon, MrXIcon },
  props: {
    data: Object,
    isCurrentPlayer: Boolean,
    hasAccess: Boolean,
  },
  computed: {
    detectiveNumber: function() {
      return this.data && this.data.role && this.data.role.split("-").pop();
    },
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
  display: flex;
  flex-direction: column;
}

.current-player {
  border: 2px solid #333;
}

.icon-and-location:hover {
  cursor: pointer;
}

.icon-and-location {
  display: flex;
}

.transport-icon {
  width: 1rem;
  height: 1rem;
}

.ticket-balance:after {
  content: "\2715";
  font-size: 0.75rem;
  padding: 0.25rem;
}

.identity {
  margin: auto 0;
}

figure > svg {
  max-height: 100%;
  max-width: 100%;
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
  font-weight: bold;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  margin-right: 0;
  font-size: 1.5rem;
}

.tickets {
  display: flex;
  align-items: center;
  font-size: 1.25em;
  justify-content: space-between;
}

.transportation {
  display: flex;
  align-items: center;
}

.mr-x .tickets {
  margin-top: 1rem;
}
</style>

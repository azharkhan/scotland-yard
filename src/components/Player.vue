<template>
  <div class="box">
    <div class="media">
      <div class="media-left">
        <div
          class="title location"
          v-if="data.role === 'mr-x' && hasAccess || data.role !== 'mr-x'"
        >{{ data.currentLocation }}</div>
      </div>
      <div class="media-content">
        <div class="content" @click="setPlayerTurn">
          <div
            class="heading"
            v-if="data.role !== 'mr-x'"
            :class="isCurrentPlayer ? data.role : ''"
          >Detective</div>
          <div
            class="heading"
            v-if="data.role === 'mr-x'"
            :class="isCurrentPlayer ? data.role : ''"
          >Mr. X</div>
        </div>
        <div class="level">
          <div
            class="level-item has-text-centered"
            v-for="transportType in transportTypes"
            :key="transportType"
          >
            <div class="content">
              <TransportIcon :type="transportType" class="transport-icon" />
              <p class="tickets">{{ data.tickets[transportType] }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="media-right">
        <figure class="image is-64x64 has-text-right">
          <BadgeIcon :role="data.role" v-if="data.role !== 'mr-x'" />
          <MrXIcon class="mr-x-icon" v-if="data.role === 'mr-x'" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import BadgeIcon from "./BadgeIcon";
import MrXIcon from "./MrXIcon";
import TransportIcon from "./TransportIcon";

export default {
  name: "Detective",
  components: { BadgeIcon, TransportIcon, MrXIcon },
  props: {
    data: Object,
    isCurrentPlayer: Boolean,
    hasAccess: Boolean,
  },
  computed: {
    detectiveNumber: function() {
      return this.data.role.split("-").pop();
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

.transport-icon {
  width: 2rem;
  height: 2rem;
}

.mr-x-icon {
  width: 3rem;
  height: 3rem;
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
  width: 2.5em;
  height: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tickets {
  font-size: 1.25em;
}

.transportation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.25em;
}
</style>

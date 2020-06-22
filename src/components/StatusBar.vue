<template>
  <div
    class="status"
    :class="[result ? 'game-end' : '', !result && currentPlayer ? currentPlayer.role : '']"
  >
    <div class="result" v-if="result">{{ result }}</div>
    <div v-if="!result" class="round-info">
      <div class="round-number">{{ roundNumber }}</div>
      <div class="info">
        <div v-if="!currentPlayer">Please click on a Detective's name to start</div>
        <div v-if="currentPlayer">It's {{ detectiveName }}'s turn</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatusBar",
  props: {
    currentPlayer: Object,
    round: Number,
    result: String,
  },
  computed: {
    detectiveName() {
      if (!this.currentPlayer) return null;
      return this.currentPlayer.role.split("-").join(" ");
    },
    roundNumber() {
      if (!this.round) return null;
      return `Round: ${this.round}`;
    },
  },
};
</script>

<style scoped>
.status {
  background: paleturquoise;
  padding: 5px;
  height: 30px;
  width: 100%;
}

.round-info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.game-end {
  background: palegreen;
  height: 100%;
  text-align: center;
  font-weight: bold;
}

.round-number {
  font-size: 1.5em;
  font-weight: bold;
}

.info {
  text-transform: capitalize;
  font-size: 1.25em;
  margin-left: 1em;
}

.result {
  text-transform: uppercase;
  font-size: 1.5rem;
  margin-left: 2rem;
}

.detective-1 {
  background: hotpink;
}

.detective-2 {
  background: coral;
}

.detective-3 {
  background: aquamarine;
}

.detective-4 {
  background: royalblue;
}

.detective-5 {
  background: gold;
}
</style>
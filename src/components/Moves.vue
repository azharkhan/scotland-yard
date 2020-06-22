<template>
  <div class="move-list">
    <div class="move" v-for="moveNumber in totalMoves" :key="moveNumber">
      <div class="number">{{ moveNumber }}</div>
      <div class="type" v-if="moves[moveNumber]">
        <TransportIcon :type="moves[moveNumber].ticket" />
      </div>
    </div>
  </div>
</template>

<script>
import TransportIcon from "./TransportIcon";
export default {
  name: "Moves",
  components: { TransportIcon },
  props: {
    moves: Array,
  },
  computed: {
    totalMoves() {
      return Array(24)
        .fill(0)
        .map((item, index) => index + 1);
    },
  },
};
</script>
<style scoped>
.move-list {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(6, 1fr);
}

.move {
  display: flex;
  align-items: center;
}

.number {
  font-size: 1.5em;
}

.type {
  margin-left: 1em;
}

.type > svg {
  width: 2em;
}
</style>
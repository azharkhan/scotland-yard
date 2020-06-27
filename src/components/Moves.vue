<template>
  <div class="move-list">
    <div class="move" v-for="moveNumber in totalMoves" :key="moveNumber">
      <div
        class="move-number"
        :class="{ reveal: revealMoves.includes(moveNumber), location: revealMoves.includes(moveNumber) && moves[moveNumber] } "
      >
        <span
          v-if="revealMoves.includes(moveNumber) && moves[moveNumber]"
        >{{ moves[moveNumber].position }}</span>
        <span v-else>{{ moveNumber }}</span>
      </div>
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
  data() {
    return {
      revealMoves: [3, 8, 13, 18, 24],
    };
  },
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

.revealed-location {
  font-weight: bold;
}

.reveal {
  border: 1px solid #333;
  border-radius: 50%;
}

.location {
  background: rgba(0, 0, 0, 0.7);
  color: #eaeaea;
  font-weight: bold;
}

.move {
  display: flex;
  align-items: center;
}

.move-number {
  display: flex;
  font-size: 1.5em;
  width: 2em;
  height: 2em;
  justify-content: center;
  align-items: center;
}

.type {
  margin-left: 1em;
}

.type > svg {
  width: 2em;
}
</style>
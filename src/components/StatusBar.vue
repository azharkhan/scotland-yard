<template>
  <div class="status" :class="currentPlayer ? currentPlayer.role : ''">
    <div v-if="!currentPlayer" class="info">Please click on a Detective's name to start</div>
    <div v-if="currentPlayer" class="info">It's {{ detectiveName }}'s turn</div>
  </div>
</template>

<script>
export default {
  name: "StatusBar",
  props: {
    currentPlayer: Object,
  },
  computed: {
    detectiveName() {
      if (!this.currentPlayer) return null;
      return this.currentPlayer.role.split("-").join(" ");
    },
  },
};
</script>

<style scoped>
.status {
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  background: paleturquoise;
}

.info {
  text-transform: capitalize;
  font-size: 1.25em;
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
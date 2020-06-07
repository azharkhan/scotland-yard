<template>
  <div class="player" :class="`detective-${num}`">
    <div class="info">
      <h1>Detective {{ num }}</h1>
      <h2 class="location"></h2>
      <ul class="transportation">
        <li>Taxi:</li>
        <li>Bus:</li>
        <li>Underground:</li>
      </ul>
      <button class="set-location">Set Location</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detective",
  props: {
    num: Number,
  },
};
</script>

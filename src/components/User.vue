<template>
  <div class="user">
    <div class="image">
      <img :src="user.image" alt="" />
    </div>
    <div class="name">{{ user.name }}</div>
  </div>
</template>

<script>
export default {
  name: "User",
  props: {
    user: Object,
  },
};
</script>

<style scoped>
.image {
  height: 30px;
  width: 30px;
}

.image img {
  max-height: 100%;
  max-width: 100%;
}
</style>

<template>
  <component :is="component" :type="type" v-if="component" />
</template>

<script>
export default {
  name: "TransportIcon",
  data() {
    return {
      component: null,
    };
  },
  props: {
    type: String,
  },
  computed: {
    loader() {
      if (!this.type) {
        return null;
      }
      return () => import(`./transport-icons/${this.type}`);
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader();
      })
      .catch(() => {
        this.component = () => import("./transport-icons/black.vue");
      });
  },
};
</script>

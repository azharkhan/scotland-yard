<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Choose Roles</p>
    </header>
    <section class="modal-card-body">
      <h3 class="is-size-5" v-if="!this.user">Please Login to select a Role</h3>
      <div class="field">
        <b-radio v-model="userRole" native-value="mr-x" :disabled="!this.user || mrXPlayer">Mr. X</b-radio>
      </div>
      <div class="field">
        <b-radio v-model="userRole" native-value="detective" :disabled="!this.user">Detectives</b-radio>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="setRoles">Done</button>
    </footer>
  </div>
</template>
<script>
export default {
  name: "ChooseRole",
  props: {
    isMrX: Boolean,
    mrXPlayer: String,
    user: Object,
  },
  data() {
    return {
      userRole: null,
    };
  },
  methods: {
    setRoles: function() {
      if (!this.isMrX && this.userRole === "mr-x") {
        this.$emit("setRoles", this.userRole);
      }
      this.$emit("close");
    },
  },
  mounted() {
    if (this.isMrX) {
      this.userRole = "mr-x";
    }
  },
  watch: {
    user: {
      deep: true,
      handler() {
        if (this.isMrX) {
          this.userRole = "mr-x";
        }
      },
    },
  },
};
</script>
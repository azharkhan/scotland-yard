<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link :to="{ name: 'Game', params: { id: 'tcZwNAgeeZuJBzNl48l1' } }">Current Game</router-link>
      <User :user="state.user" v-if="state.user" />
    </div>
    <router-view />
  </div>
</template>

<script>
import User from "@/components/User.vue";
import { store } from "@/store.js";

export default {
  name: "App",
  components: { User },
  data() {
    return {
      state: store.state,
    };
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  --font-family-main: Halant, Avenir, Helvetica, sans-serif;
  --font-family-secondary: Nunito Sans, Avenir, Helvetica, sans-serif;
  font-family: var(--font-family-main);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  height: 100vh;
  width: 100vw;
}

#nav {
  padding: 10px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

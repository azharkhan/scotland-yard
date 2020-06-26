<template>
  <div id="app">
    <b-navbar>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">Home</b-navbar-item>
        <b-navbar-item
          tag="router-link"
          :to="{ name: 'Game', params: { id: 'tcZwNAgeeZuJBzNl48l1' } }"
        >Current Game</b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="div" v-if="!state.user">
          <div class="buttons">
            <div class="button is-light" @click="loginWithGoogle">Login</div>
          </div>
        </b-navbar-item>
        <b-navbar-item tag="div" v-if="state.user">
          <figure class="image is-32x32">
            <img
              class="is-rounded"
              :src="state.user.image"
              :alt="`${state.user.name} profile image`"
            />
          </figure>
          <b-navbar-dropdown :label="state.user.name">
            <b-navbar-item>Logout</b-navbar-item>
          </b-navbar-dropdown>
        </b-navbar-item>
      </template>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

import { store } from "@/store.js";

export default {
  name: "App",
  data() {
    return {
      state: store.state,
    };
  },
  methods: {
    loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          const user = {
            name: result.user.displayName,
            email: result.user.email,
            image: result.user.photoURL,
          };
          store.setUser(user);
        })
        .catch(err => {
          alert("sign-in was not successful");
          console.log("google did a sad", err);
        });
    },
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

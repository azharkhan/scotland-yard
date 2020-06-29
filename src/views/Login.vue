<template>
  <div class="login-container">
    <div class="login-form">
      <div class="form-field">
        <label for="email">Email:</label>
        <input type="text" id="email" placeholder="Email address" />
      </div>
      <div class="form-field">
        <label for="password">Password:</label>
        <input type="password" id="password" />
      </div>
    </div>
    <div class="login-google">
      <button @click="loginWithGoogle">Login with Google</button>
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

import { store } from "@/store.js";

export default {
  name: "Login",
  metaInfo: {
    title: "Login | Muscateers",
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
            uid: result.user.uid,
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

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>

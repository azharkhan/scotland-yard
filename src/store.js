// meant to be a simple state store
// we don't need a state management library (yet)

export const store = {
  debug: true,
  state: {
    user: null,
  },

  // store methods
  setUser(user) {
    if (this.debug) console.log("setting user: ", user);
    this.state.user = user;
  },

  clearUser(user) {
    if (this.debug) console.log("clearing user", user);
    this.state.user = null;
  },
};

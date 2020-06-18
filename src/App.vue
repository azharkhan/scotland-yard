<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link :to="{ name: 'Game', params: { id: 'tcZwNAgeeZuJBzNl48l1'}}">Current Game</router-link>
    </div>
    <router-view />
  </div>
  <!-- <StatusBar :currentPlayer="currentPlayer" :round="roundNumber" />
    <Map
      :detectives="detectives"
      :currentPlayer="currentPlayer"
      @setLocation="handleSetLocation"
    />
    <div class="players">
      <Detective
        v-for="(detective, index) in detectives"
        :key="detective.currentLocation || index"
        :data="detective"
        :currentPlayer="currentPlayer"
        @setTurn="handleSetTurn"
      />
    </div>
  </div>-->
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

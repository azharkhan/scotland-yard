<template>
  <div class="game">
    <StatusBar :currentPlayer="currentPlayer" />
    <Map :detectives="detectives" :currentPlayer="currentPlayer" @setLocation="handleSetLocation" />
    <div class="players">
      <Detective
        v-for="(detective, index) in detectives"
        :key="detective.currentLocation || index"
        :data="detective"
        :currentPlayer="currentPlayer"
        @setTurn="handleSetTurn"
      />
    </div>
  </div>
</template>

<script>
import Map from "./components/Map.vue";
import Detective from "./components/Detective.vue";
import StatusBar from "./components/StatusBar.vue";

import { db } from "./db";

export default {
  name: "App",
  components: { Map, Detective, StatusBar },
  data() {
    return {
      name: "Mr. X",
      detectives: [],
      currentPlayer: null,
    };
  },
  firestore: {
    detectives: db
      .collection("games")
      .doc("tcZwNAgeeZuJBzNl48l1")
      .collection("detectives"),
  },
  methods: {
    handleSetTurn: function(data) {
      this.currentPlayer = data;
    },

    selectNextPlayer: function(currentPlayerNumber) {
      // TODO: change this to proper selection
      let nextPlayerNumber = parseInt(currentPlayerNumber, 10) + 1;
      if (nextPlayerNumber > 5) {
        nextPlayerNumber = 1;
      }
      this.currentPlayer = this.detectives
        .filter(
          detective =>
            detective.role === `detective-${nextPlayerNumber.toString()}`
        )
        .pop();
    },

    handleSetLocation: function(stationNumber) {
      if (!stationNumber) {
        return;
      }
      const currentGameRef = db.collection("games").doc("tcZwNAgeeZuJBzNl48l1");
      const detectivesCollection = currentGameRef.collection("detectives");
      const currentPlayerNumber = this.currentPlayer.role.split("-").pop();

      detectivesCollection
        .doc(currentPlayerNumber)
        .set(
          {
            currentLocation: parseInt(stationNumber, 10),
          },
          { merge: true }
        )
        .then(() => {
          this.selectNextPlayer(currentPlayerNumber);
        });
    },
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.game {
  padding: 10px;
  display: grid;
  height: 100vh;
}

.players {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.player {
  border: 1px #ececec solid;
}

.mr-x {
  stroke: slategray;
}
</style>

<template>
  <div class="game">
    <StatusBar :currentPlayer="currentPlayer" :round="roundNumber" />
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
import Map from "../components/Map.vue";
import Detective from "../components/Detective.vue";
import StatusBar from "../components/StatusBar.vue";

import { db } from "../db";
// eslint-disable-next-line
const savedGameId = "tcZwNAgeeZuJBzNl48l1";

export default {
  name: "Game",
  components: { Map, Detective, StatusBar },
  data() {
    return {
      name: "Mr. X",
      detectives: [],
      gameInfo: null,
      gameId: this.$route.params.id,
    };
  },
  firestore() {
    return {
      detectives: db
        .collection("games")
        .doc(this.gameId)
        .collection("detectives"),
      gameInfo: db.collection("games").doc(this.gameId),
    };
  },
  computed: {
    roundNumber: function() {
      return this.gameInfo && this.gameInfo.round;
    },
    mrX: function() {
      return this.gameInfo && this.gameInfo["mr-x"];
    },
    playerOnTurn: function() {
      return this.gameInfo && this.gameInfo.playerOnTurn;
    },
    isMisterXTurn: function() {
      return this.playerOnTurn && this.playerOnTurn === "mr-x";
    },
    currentPlayer: function() {
      if (!this.playerOnTurn) {
        return null;
      }
      if (this.playerOnTurn !== "mr-x") {
        return (
          this.detectives.length &&
          this.detectives.find(
            detective => detective.role === this.playerOnTurn
          )
        );
      }
      return this.mrX;
    },
  },
  methods: {
    handleSetTurn: function(role) {
      const currentGameRef = db.collection("games").doc(this.gameId);
      currentGameRef.set(
        {
          playerOnTurn: role,
        },
        { merge: true }
      );
    },

    startNewRound: function() {
      const currentGameRef = db.collection("games").doc(this.gameId);
      currentGameRef.set(
        {
          round: this.roundNumber + 1,
          playerOnTurn: "mr-x",
        },
        { merge: true }
      );
    },

    selectNextPlayer: function(currentPlayerNumber) {
      // TODO: change this to proper selection
      const nextPlayerNumber = parseInt(currentPlayerNumber, 10) + 1;
      if (nextPlayerNumber > 5) {
        this.startNewRound();
        return;
      } else {
        // select next detective
        const nextPlayerRole = `detective-${nextPlayerNumber.toString()}`;
        this.handleSetTurn(nextPlayerRole);
      }
    },

    handleSetLocation: function({ stationNumber, ticketType }) {
      if (!stationNumber) {
        return;
      }
      const currentGameRef = db.collection("games").doc(this.gameId);
      const detectivesCollection = currentGameRef.collection("detectives");
      const currentPlayerNumber = this.currentPlayer.role.split("-").pop();
      this.currentPlayer.tickets[ticketType] -= 1;

      detectivesCollection
        .doc(currentPlayerNumber)
        .set(
          {
            currentLocation: parseInt(stationNumber, 10),
            tickets: this.currentPlayer.tickets,
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

<style scoped>
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

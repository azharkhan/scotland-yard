<template>
  <div class="game">
    <StatusBar :currentPlayer="currentPlayer" :round="roundNumber" />
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
      game: null,
      gameId: this.$route.params.id,
    };
  },
  firestore() {
    return {
      detectives: db
        .collection("games")
        .doc(this.gameId)
        .collection("detectives"),
      game: db.collection("games").doc(this.gameId),
    };
  },
  computed: {
    roundNumber: function() {
      return this.game && this.game.round;
    },
    mrX: function() {
      return this.game && this.game["mr-x"];
    },
    playerOnTurn: function() {
      return this.game && this.game.playerOnTurn;
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
      this.$firestoreRefs.game.update({ playerOnTurn: role });
    },

    startNewRound: function() {
      this.$firestoreRefs.game.update({
        round: this.roundNumber + 1,
        playerOnTurn: "mr-x",
      });
    },

    selectNextPlayer: function() {
      // TODO: change this to proper selection
      const currentPlayerNumber = this.currentPlayer.role.split("-").pop();
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
      this.currentPlayer.tickets[ticketType] -= 1;

      this.$firestoreRefs.detectives
        .doc(this.currentPlayer.id)
        .update({
          currentLocation: parseInt(stationNumber, 10),
          tickets: this.currentPlayer.tickets,
        })
        .then(() => {
          this.selectNextPlayer();
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

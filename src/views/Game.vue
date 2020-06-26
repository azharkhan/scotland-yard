<template>
  <div class="game">
    {{ user }}
    <StatusBar :currentPlayer="currentPlayer" :round="roundNumber" :result="result" />
    <Moves :moves="moves" />
    <Map :detectives="detectives" :currentPlayer="currentPlayer" @setLocation="handleSetLocation" />
    <div class="players">
      <Player
        :data="mrX"
        :isCurrentPlayer="isMisterXTurn"
        @setTurn="handleSetTurn"
        :hasAccess="isMrX"
      />
      <Player
        v-for="(detective, index) in detectives"
        :key="detective.currentLocation || index"
        :data="detective"
        :isCurrentPlayer="
          currentPlayer && currentPlayer.role === detective.role
        "
        @setTurn="handleSetTurn"
      />
    </div>
  </div>
</template>

<script>
import Map from "../components/Map.vue";
import Player from "../components/Player.vue";
import StatusBar from "../components/StatusBar.vue";
import Moves from "../components/Moves.vue";

import { db } from "../db";
import { store } from "@/store";

export default {
  name: "Game",
  metaInfo: {
    title: "Scotland Yard | Game",
  },
  components: { Map, Player, StatusBar, Moves },
  props: {
    user: Object,
  },
  data() {
    return {
      name: "Mr. X",
      detectives: [],
      game: null,
      gameId: this.$route.params.id,
      state: store.state,
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
    isMrX: function() {
      const loggedInUserEmail = this.state.user && this.state.user.email;
      return (
        this.game &&
        this.game["mr-x"] &&
        this.game["mr-x"].user === loggedInUserEmail
      );
    },
    roundNumber: function() {
      return this.game && this.game.round;
    },
    mrX: function() {
      return this.game && this.game["mr-x"];
    },
    moves: function() {
      if (this.mrX) {
        return this.mrX.moves;
      }
      return [];
    },
    playerOnTurn: function() {
      return this.game && this.game.playerOnTurn;
    },
    isMisterXTurn: function() {
      return this.playerOnTurn && this.playerOnTurn === "mr-x";
    },
    result: function() {
      return this.game && this.game.result;
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
      if (this.roundNumber === 22) {
        this.endGame("Mr. X Wins!");
        return;
      }

      this.$firestoreRefs.game.update({
        round: this.roundNumber + 1,
        playerOnTurn: "mr-x",
      });
    },

    selectNextPlayer: function() {
      // TODO: change this to proper selection
      let currentPlayerNumber;

      if (this.isMisterXTurn) {
        currentPlayerNumber = 0;
      } else {
        currentPlayerNumber = this.currentPlayer.role.split("-").pop();
      }

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

    endGame: function(result) {
      this.result = result;

      this.$firestoreRefs.game.update({
        isInProgress: false,
        result,
      });
    },

    checkForGameEnd: function() {
      const mrXLocation = this.mrX.currentLocation;
      const isDetectiveOnSameLocation = this.detectives.find(
        detective => detective.currentLocation === mrXLocation
      );

      if (isDetectiveOnSameLocation) {
        return {
          isGameOver: true,
          result: "Detectives Win!",
        };
      }

      return {
        isGameOver: false,
        result: null,
      };
    },

    handleSetLocation: function({ stationNumber, ticketType }) {
      if (!stationNumber) {
        return;
      }
      this.currentPlayer.tickets[ticketType] -= 1;
      const currentLocation = parseInt(stationNumber, 10);

      if (this.isMisterXTurn) {
        // update Mr-X object
        this.currentPlayer.moves.push({
          position: currentLocation,
          ticket: ticketType,
        });
        this.currentPlayer.currentLocation = currentLocation;

        this.$firestoreRefs.game
          .update({
            "mr-x": Object.assign({}, { ...this.currentPlayer }),
          })
          .then(() => {
            this.selectNextPlayer();
          });
      } else {
        this.$firestoreRefs.detectives
          .doc(this.currentPlayer.id)
          .update({
            currentLocation: parseInt(stationNumber, 10),
            tickets: this.currentPlayer.tickets,
          })
          .then(() => {
            // update Mr.X 's tickets
            const mrX = Object.assign({}, { ...this.mrX });
            mrX.tickets[ticketType] += 1;

            this.$firestoreRefs.game.update({
              "mr-x": Object.assign({}, { ...this.mrX }, { mrX }),
            });
          })
          .then(() => {
            const { isGameOver, result } = this.checkForGameEnd();
            if (!isGameOver) {
              this.selectNextPlayer();
            } else {
              this.endGame(result);
            }
          });
      }
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

.mr-x {
  stroke: slategray;
}
</style>

<template>
  <div class="game container">
    <StatusBar :currentPlayer="currentPlayer" :round="roundNumber" :result="result" />
    <b-button @click="chooseRoles">Choose Roles</b-button>
    <Moves :moves="moves" />
    <Map :detectives="detectives" :currentPlayer="currentPlayer" @setLocation="handleSetLocation" />
    <Player
      :data="mrX"
      :isCurrentPlayer="currentPlayer && currentPlayer.role === 'mr-x'"
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
</template>

<script>
import Map from "../components/Map.vue";
import Player from "../components/Player.vue";
import StatusBar from "../components/StatusBar.vue";
import Moves from "../components/Moves.vue";
import ChooseRole from "../components/ChooseRole.vue";

import { db } from "../db";
import { store } from "@/store";

export default {
  name: "Game",
  metaInfo: {
    title: "Scotland Yard | Game",
  },
  components: { Map, Player, StatusBar, Moves },
  data() {
    return {
      name: "Mr. X",
      players: [],
      game: null,
      gameId: this.$route.params.id,
      state: store.state,
      chooseRole: ChooseRole,
      isChoosingRole: false,
    };
  },
  firestore() {
    return {
      players: db
        .collection("games")
        .doc(this.gameId)
        .collection("players"),
      game: db.collection("games").doc(this.gameId),
    };
  },
  computed: {
    isMrX: function() {
      const userId = this.state.user && this.state.user.uid;
      return userId && this.mrX && this.mrX.user === userId;
    },
    detectives: function() {
      return this.players.filter(player => player.role !== "mr-x");
    },
    roundNumber: function() {
      return this.game && this.game.round;
    },
    mrX: function() {
      return this.players.find(player => player.role === "mr-x");
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
      return (
        this.players.length &&
        this.players.find(player => player.role === this.playerOnTurn)
      );
    },
  },
  methods: {
    handleSetTurn: function(role) {
      this.$firestoreRefs.game.update({ playerOnTurn: role });
    },

    chooseRoles: function() {
      this.$buefy.modal.open({
        parent: this,
        component: this.chooseRole,
        hasModalCard: true,
        props: {
          user: this.state.user,
          isMrX: this.isMrX,
          mrXPlayer: this.mrXPlayer,
        },
        events: {
          setRoles: value => {
            if (value === "mr-x" && this.state.user) {
              this.$firestoreRefs.players
                .doc(this.currentPlayer.id)
                .update({
                  user: this.state.user.uid,
                })
                .then(() => {
                  this.$buefy.toast.open({
                    message: `${this.state.user.name} is Mr. X!`,
                    type: "is-success",
                  });
                });
            }
          },
        },
      });
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
        const isSecondMove = this.currentPlayer.secondMove;
        this.currentPlayer.secondMove = false;

        this.$firestoreRefs.players
          .doc(this.currentPlayer.id)
          .set({
            ...this.currentPlayer,
          })
          .then(() => {
            if (this.currentPlayer.tickets["2x"] > 0 && !isSecondMove) {
              this.$buefy.dialog.confirm({
                message:
                  'Would you like to spend a "2x" and make another move?',
                onConfirm: () => {
                  this.currentPlayer.tickets["2x"] -= 1;
                  this.currentPlayer.secondMove = true;
                  this.$firestoreRefs.players
                    .doc(this.currentPlayer.id)
                    .set({
                      ...this.currentPlayer,
                    })
                    .then(() => {
                      this.$firestoreRefs.game.update({ playerOnTurn: "mr-x" });
                    });
                },
                onCancel: () => this.selectNextPlayer(),
              });
            } else {
              this.selectNextPlayer();
            }
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

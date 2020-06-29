<template>
  <section class="hero is-fullheight-with-navbar">
    <div class="hero-body banner">
      <div class="container">
        <h1 class="title">Play Scotland Yard</h1>
        <h2 class="subtitle">Made with love, by the Muscateers</h2>
        <b-button type="is-primary" :loading="loading" @click="createNewGame">New Game</b-button>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from "@/db.js";

const allLocations = Array(200)
  .fill(1)
  .map((i, index) => index + 1);

export default {
  name: "Home",
  metaInfo: {
    title: "Scotland Yard | Muscateers",
  },
  data() {
    return {
      loading: false,
      gameProps: {
        round: 1,
        playerOnTurn: "mr-x",
        isInProgress: true,
        result: "",
      },
      allLocations,
      totalTickets: {
        taxi: 57,
        bus: 45,
        underground: 23,
        black: 5,
        "2x": 2,
      },
    };
  },
  computed: {
    newGameId() {
      // generate random string: https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a
      return Math.random()
        .toString(20)
        .substr(2, 6);
    },
    shuffledPositions() {
      const allLocationsCopy = this.allLocations.slice();

      // shuffle an array
      // ref: https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
      for (let i = allLocationsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = allLocationsCopy[i];
        allLocationsCopy[i] = allLocationsCopy[j];
        allLocationsCopy[j] = temp;
      }
      return allLocationsCopy;
    },
  },
  methods: {
    getRandomPosition: function() {
      this.allLocations = this.shuffledPositions;
      return this.allLocations.pop();
    },
    getDetectiveTickets: function() {
      const tickets = {
        taxi: 11,
        bus: 8,
        underground: 4,
      };

      for (let type in tickets) {
        // adjust total available tickets
        this.totalTickets[type] = this.totalTickets[type] - tickets[type];
      }

      return tickets;
    },
    createNewGame: async function() {
      this.loading = true;

      // create game document
      await this.createGameDoc();
      // create players
      await this.createPlayersCollection();
      await this.addMrX();

      this.loading = false;
      // navigate to game
      this.$router.push({ name: "Game", params: { id: this.newGameId } });
    },

    createGameDoc: async function() {
      return await db
        .collection("games")
        .doc(this.newGameId)
        .set({ ...this.gameProps });
    },

    addMrX: async function() {
      const randomPosition = this.getRandomPosition();

      const mrX = {
        role: "mr-x",
        tickets: this.totalTickets,
        currentLocation: randomPosition,
        moves: [{ position: randomPosition }],
        secondMove: false,
        user: null,
      };

      return await db
        .collection("games")
        .doc(this.newGameId)
        .collection("players")
        .doc()
        .set({ ...mrX });
    },

    createPlayersCollection: async function() {
      const detectivePromises = Array(5)
        .fill(1)
        .map((num, index) => {
          let position = this.getRandomPosition();
          let tickets = this.getDetectiveTickets();

          return db
            .collection("games")
            .doc(this.newGameId)
            .collection("players")
            .doc()
            .set({
              role: `detective-${index + 1}`,
              currentLocation: position,
              tickets,
              user: null,
            });
        });

      return await Promise.all(detectivePromises);
    },
  },
};
</script>

<style scoped>
.banner {
  background-image: url("../assets/background-play.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center center;
  background-size: cover;
}

@media only screen and (max-width: 767px) {
  /* mobile */
  .banner {
    background-image: url("../assets/background-play.jpg");
    background-size: cover;
    background-position: center left;
  }
}
</style>

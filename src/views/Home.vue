<template>
  <div class="home">
    <div class="banner">
      <div class="hero">
        <h1>Play Scotland Yard!</h1>
        <p>Made with love, by the Muscateers</p>
      </div>
      <div class="options">
        <div class="button" @click="createNewGame">New Game</div>
        <div class="button">Join Game</div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/db.js";
import randomWords from "random-words";

const allLocations = Array(200)
  .fill(1)
  .map((i, index) => index + 1);

export default {
  name: "Home",
  data() {
    return {
      gameProps: {
        round: 1,
        playerOnTurn: "mr-x",
        isInProgress: true,
        result: "",
        "mr-x": {
          role: "mr-x",
        },
      },
      allLocations,
      totalTickets: {
        taxi: 57,
        bus: 45,
        underground: 23,
        black: 5,
      },
    };
  },
  computed: {
    newGameId() {
      return randomWords(3).join("-");
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
      await db
        .collection("games")
        .doc(this.newGameId)
        .set({ ...this.gameProps });
      await this.createDetectiveCollection();
      await this.addMrX();
      this.$router.push({ name: "Game", params: { id: this.newGameId } });
    },
    addMrX: async function() {
      const randomPosition = this.getRandomPosition();

      const mrX = {
        role: "mr-x",
        tickets: this.totalTickets,
        currentLocation: randomPosition,
        moves: [{ position: randomPosition }],
      };

      return await db
        .collection("games")
        .doc(this.newGameId)
        .update({ "mr-x": mrX });
    },
    createDetectiveCollection: async function() {
      const detectivePromises = Array(5)
        .fill(1)
        .map((num, index) => {
          let position = this.getRandomPosition();
          let tickets = this.getDetectiveTickets();

          return db
            .collection("games")
            .doc(this.newGameId)
            .collection("detectives")
            .doc()
            .set({
              role: `detective-${index + 1}`,
              currentLocation: position,
              tickets,
            });
        });

      return await Promise.all(detectivePromises);
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 10%);
}
.banner {
  background-image: url("../assets/background-play.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center center;
  background-size: contain;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.hero {
  background: rgba(255, 255, 255, 0.3);
  padding: 2rem;
  color: #364751;
}

.hero h1 {
  font-size: 4.5rem;
  font-family: var(--font-family-main);
  font-weight: bold;
}

.hero p {
  font-size: 1.25rem;
  font-family: var(--font-family-secondary);
}

.options {
  display: flex;
  justify-content: space-around;
  width: 50%;
  margin-top: 30px;
}

.button {
  background: #2fa5dc;
  font-family: var(--font-family-main);
  font-size: 1.25rem;
  color: #f4f7f9;
  font-weight: bold;
  padding: 1rem;
  width: 10rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button:hover {
  cursor: pointer;
}

@media only screen and (max-width: 767px) {
  /* mobile */
  .banner {
    background-image: url("../assets/background-play.jpg");
  }

  .hero {
    font-size: 2rem;
  }

  .button {
    font-size: 1rem;
    margin-top: 1rem;
  }

  .options {
    flex-direction: column;
  }
}
</style>

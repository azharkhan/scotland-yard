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

export default {
  name: "Home",
  data() {
    return {
      gameProps: {
        round: 1,
        playerOnTurn: "mr-x",
        isInProgress: true,
      },
      detectiveProps: {
        role: "detective-1",
        tickets: {
          taxi: 11,
          bus: 8,
          underground: 4,
        },
      },
    };
  },
  computed: {
    newGameUrl() {
      return randomWords(3).join("-");
    },
  },
  methods: {
    createNewGame: function() {
      db.collection("games")
        .doc(this.newGameUrl)
        .set({ ...this.gameProps })
        .then(() => {
          db.collection("games")
            .doc(this.newGameUrl)
            .collection("detectives")
            .doc("detective-1")
            .set({ ...this.detectiveProps });
        })
        .then(() => {
          this.$router.push({ name: "Game", params: { id: this.newGameUrl } });
        });
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

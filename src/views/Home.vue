<template>
  <div class="home">
    <div class="banner">
      <div class="hero">The Muscateers!</div>
      <div class="options">
        <div class="button">Start Game</div>
        <div class="button">Join Game</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.banner {
  background: url("../assets/muscat-fort.jpg");
  background-size: cover;
  height: 100vh;
  width: calc(100vw - 30px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.hero {
  color: #f4f7f9;
  font-size: 4rem;
}

.options {
  display: flex;
  justify-content: space-around;
  width: 50%;
  margin-top: 30px;
}

.button {
  background: #2fa5dc;
  font-size: 1.25rem;
  color: #f4f7f9;
  font-weight: bold;
  padding: 10px;
  min-width: 150px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<template>
  <div id="app">
    <img class="logo" src="../src/assets/logo/logo.png" alt="Logo" />
    <router-view/>
  </div>
</template>

<script>

export default {
  name: "App",
};
</script>

<style>
.logo {
  width: 200px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  margin: 10px 10px 0 10px;
}
</style>

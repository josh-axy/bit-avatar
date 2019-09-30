<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Avatar</router-link> |
      <router-link to="/home">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
  html{
    min-height: 100vh;
  }
  body {
    background-size: cover;
    background-position: center;
    background-color: rgb(250, 249, 247);
    background-image: url("./assets/background.jpg");
  }
  .text-gray-1{
    color: #303133;
  }
  .info {
    color: #909399;
  }
  .danger{
    color: #F56C6C;
  }
  .sys-warning{
    width: 96vw;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: azure;
    margin-top: calc(50vh - 100px);
  }
  #nav {
    display: none;
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>

<template>
  <div id="app">
    <div id="nav">
      <!--router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link-->
      <router-link :to="{ name: 'home', params: { address: null } }">
        <img
          alt="Aergo logo"
          src="./assets/logo-aergo.png"
          style="margin: 10px"
        />
      </router-link>
      <div style="display: block">
        <div style="display: inline-block">
          <router-link
            v-if="this.$store.getters.hasCert"
            :to="{
              name: 'home',
              params: {
                address: this.$store.getters.getCert.address
              }
            }"
          >
            contracts
          </router-link>
        </div>
        <div style="display: inline-block;width: 10%" />
        <div style="display: inline-block">
          <router-link
            v-if="this.$store.getters.hasCert"
            :to="{ name: 'profile', params: {} }"
          >
            profile
          </router-link>
        </div>
        <div style="display: inline-block;width: 10%" />
        <div style="display: inline-block">
          <router-link
            v-if="this.$store.getters.hasCert"
            :to="{ name: 'logout', params: {} }"
          >
            logout
          </router-link>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 10px;
}

#nav a {
  font-weight: bold;
  color: #ff0097;
}

#nav a.router-link-exact-active {
  color: #ff0097;
}
</style>

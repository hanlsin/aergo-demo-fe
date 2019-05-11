<template>
  <div class="logout">
    <h3>Logout</h3>
  </div>
</template>

<script>
import store from "../store.js";

export default {
  store,
  name: "logout",
  mounted: function() {
    this.$store.dispatch("logout").then(() => {
      this.$router.push({
        name: "home",
        params: { redirect: this.$route.query.redirect }
      });
    });
  }
};
</script>

<style>
@import "../assets/app.css";
</style>

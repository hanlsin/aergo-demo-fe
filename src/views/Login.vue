<template>
  <div class="login">
    <h3>Login</h3>
    <div v-show="!isLoading">
      <form ref="form">
        <input
          placeholder="Enter your encrypted key"
          v-model="encKey"
          class="input-box"
        />
        <input
          placeholder="Enter your password"
          v-model="password"
          type="password"
          class="input-box"
        />
        <router-link
          :to="{ name: 'signup', params: {} }"
          v-show="!isLoading"
          class="btn btn-outline-primary rounded-pill"
        >
          Sign up
        </router-link>
        <a
          href="#"
          v-on:click="submit"
          v-show="!isLoading"
          class="btn btn-primary rounded-pill"
        >
          Login
        </a>
      </form>
    </div>
    <div v-show="isLoading">
      <br />
      <RotateSquare2 style="display: inline-block" />
      <br />
      Please wait. Now we are issuing/checking your certificate.
    </div>
  </div>
</template>

<script>
import store from "../store.js";
import RotateSquare2 from "../components/RotateSquare2.vue";

export default {
  store,
  name: "login",
  components: {
    RotateSquare2
  },
  data: function() {
    return {
      encKey: this.$store.getters.getEncKey,
      password: null,
      isLoading: false
    };
  },
  mounted: function() {
    this.$store.watch(
      (getCert, getters) => getters.getCert,
      (newValue, oldValue) => {
        console.log(`Updating from ${oldValue} to ${JSON.stringify(newValue)}`);
      }
    );
  },
  methods: {
    submit: function() {
      this.isLoading = true;
      const self = this;

      this.$store
        .dispatch("login", { encKey: this.encKey, password: this.password })
        .then(() => {
          this.$router.push({
            name: "profile",
            params: { redirect: this.$route.query.redirect }
          });
        })
        .catch(function(error) {
          console.log(error);
          alert(`Fail to login: ${error}`);
        })
        .finally(() => {
          self.isLoading = false;
        });
    }
  }
};
</script>

<style>
@import "../assets/app.css";
</style>

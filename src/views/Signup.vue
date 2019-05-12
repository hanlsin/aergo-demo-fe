<template>
  <div class="signup">
    <h3>Sign up</h3>
    <form ref="form">
      <input
        placeholder="Enter your name"
        v-model="username"
        class="input-box"
      />
      <input
        placeholder="Enter your email (optional)"
        v-model="userEmail"
        class="input-box"
      />
      <input
        placeholder="Enter new password"
        v-model="password"
        type="password"
        class="input-box"
      />
      <!--div class="file-upload-form">
        Upload a key image file:
        <input type="file" @change="previewImage" accept="image/*" />
      </div>
      <div class="image-preview" v-if="imageData.length > 0">
        <img class="preview" :src="imageData" />
        <br />
        This image will be used to recover your account.
        <br />
        <span style="color: red">
          Please store this image safe!!
        </span>
      </div-->
      <div v-if="encKey != null" style="background-color: #E9E8E9">
        Encrypted Key:
        <input type="text" id="enc-key" v-model="encKey" v-show="true" />
        <a href="#" v-on:click="copyEncKeyToClipboard">
          <img
            src="../assets/copy.png"
            alt="copy to clipboard"
            style="width: 50px;vertical-align: middle;margin-left: 5px"
          />
        </a>
      </div>
      <div v-show="!isLoading">
        <a href="#"
          v-if="encKey == null"
          v-on:click="submit"
          class="btn btn-primary rounded-pill"
        >
          Sign up
        </a>
        <router-link
          :to="{ name: 'login', params: {} }"
          class="btn btn-outline-primary rounded-pill"
        >
          Login
        </router-link>
      </div>
      <div v-show="isLoading">
        <br />
        <RotateSquare2 style="display: inline-block" />
        <br />
      </div>
    </form>
  </div>
</template>

<script>
import store from "../store.js";
import sha256 from "js-sha256";
import RotateSquare2 from "../components/RotateSquare2.vue";

export default {
  store,
  name: "login",
  components: {
    RotateSquare2
  },
  data: function() {
    return {
      isLoading: false,
      username: null,
      userEmail: null,
      password: null,
      imageData: "",
      imageDataHash: null,
      encKey: null
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
      if (this.imageData.length > 0) {
        var hash = sha256.create();
        hash.update(this.imageData);
        this.imageDataHash = hash.hex();
      } else {
        this.imageDataHash = null;
      }

      const self = this;
      this.$store
        .dispatch("signup", {
          username: this.username,
          userEmail: this.userEmail,
          password: this.password,
          imageDataHash: this.imageDataHash
        })
        .then(() => {
          /*
          this.$router.push({ name: "home",
            params: { redirect: this.$route.query.redirect } });
          */
          self.encKey = self.$store.getters.getEncKey;
          console.log(self.encKey);
        })
        .catch(function(error) {
          console.log(error);
          alert(`Fail to signup: ${error}`);
        })
        .finally(() => {
          self.isLoading = false;
        });
    },
    previewImage: function(event) {
      // Reference to the DOM input element
      var input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = e => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.imageData = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    },
    copyEncKeyToClipboard: function() {
      let encKey = document.querySelector("#enc-key");
      encKey.setAttribute("type", "text");
      encKey.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        alert("Encrypted key is copied " + msg);
      } catch (err) {
        alert("Oops, unable to copy");
      }

      /* unselect the range */
      //encKey.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges();
    }
  }
};
</script>

<style>
@import "../assets/app.css";
</style>

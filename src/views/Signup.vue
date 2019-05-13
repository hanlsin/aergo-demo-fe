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
      <div v-show="!isLoading">
        <a
          href="#"
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
      <div style="background-color: #E9E8E9">
        <div
          v-if="encKey != null"
          style="display: inline-block; width: 330px; text-align: left; padding: 10px"
        >
          <li>
            Address:
            <input v-model="address" readonly style="width: 200px" />
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style="margin: 0"
              v-bind:href="
                $store.getters.getSqlTestNet + '/transaction/' + sTxHash
              "
            >
              Check TX on Sidechain
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style="margin: 0"
              v-bind:href="
                $store.getters.getMainNet + '/transaction/' + mTxHash
              "
            >
              Check TX on MainNet
            </a>
          </li>
          <li>
            Encrypted Key:
            <input type="text" id="enc-key" v-model="encKey" readonly />
            <a href="#" v-on:click="copyEncKeyToClipboard">
              <img
                src="../assets/copy.png"
                alt="copy to clipboard"
                style="width: 30px;vertical-align: middle;margin-left: 5px"
              />
            </a>
          </li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            style="margin: 10px 0 0 0"
            v-bind:href="$store.getters.getSqlTestNetAcc + '/?tab=interactive'"
            class="btn btn-primary rounded-pill"
          >
            Check Account on Sidechain
          </a>
          <br />
          <div style="display: inline-block; width: 100%">
            <p
              style="width: center;text-align: left;background-color: #ffffff; font-color: #ff0097;margin: 0"
            >
              To check the user account,
              <br />
              &nbsp;&nbsp;1. click the above button
              <br />
              &nbsp;&nbsp;2. put the address for "getUserInfo"
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;("INTERACTIVE" tab)
              <br />
              &nbsp;&nbsp;3. click "QUERY"
            </p>
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            style="margin: 10px 0 0 0"
            v-bind:href="$store.getters.getMainNetAcc + '/?tab=interactive'"
            class="btn btn-primary rounded-pill"
          >
            Check Account on MainNet
          </a>
          <br />
          <div style="display: inline-block; width: 100%">
            <p
              style="width: center;text-align: left;background-color: #ffffff; font-color: #ff0097;margin: 0"
            >
              To check the user account proof,
              <br />
              &nbsp;&nbsp;1. click the above button
              <br />
              &nbsp;&nbsp;2. put the address for "getUserInfo"
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;("INTERACTIVE" tab)
              <br />
              &nbsp;&nbsp;3. click "QUERY"
            </p>
          </div>
        </div>
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
      encKey: null,
      address: null,
      sTxHash: null,
      mTxHash: null
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
        .then(data => {
          console.log(data.data);
          if (data.data.error_msg) {
            self.$store.commit("SET_ERROR", { errMsg: data.data.error_msg });
            self.encKey = null;
            alert(data.data.error_msg);
          } else {
            self.$store.commit("SET_ENC_KEY", {
              encKey: data.data.encrypted_key
            });
            self.address = data.data.address;
            self.sTxHash = data.data.s_tx_hash;
            self.mTxHash = data.data.m_tx_hash;
            self.encKey = self.$store.getters.getEncKey;
          }
        })
        .catch(function(error) {
          console.log(error);
          alert(`Exception: ${error}`);
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

      var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
      if (isiOSDevice) {
        var editable = encKey.contentEditable;
        var readOnly = encKey.readOnly;

        encKey.contentEditable = true;
        encKey.readOnly = false;

        var range = document.createRange();
        range.selectNodeContents(encKey);

        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        encKey.setSelectionRange(0, 999999);
        encKey.contentEditable = editable;
        encKey.readOnly = readOnly;
      } else {
        encKey.setAttribute("type", "text");
        encKey.select();
      }

      try {
        var successful = document.execCommand("copy");
        if (successful) {
          alert("Encrypted key is copied successfully!");
        } else {
          alert(
            "Fail to copy the encrypted key. Please copy the key manually."
          );
        }
      } catch (err) {
        alert("Oops, unable to copy");
      }

      /* unselect the range */
      window.getSelection().removeAllRanges();
    }
  }
};
</script>

<style>
@import "../assets/app.css";
</style>

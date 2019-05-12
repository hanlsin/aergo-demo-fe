<template>
  <div class="profile">
    <h3>Profile</h3>
    <div>
      <div
        v-show="!isLoading"
        style="margin-left: 50px;margin-right: 50px;display: block"
      >
        <div v-for="(value, key) in metadata" :key="key">
          <li style="text-align: left">
            {{ key }}
          </li>
          <input
            type="text"
            v-model="metadata[key]"
            readonly
            class="input-box"
          />
        </div>
      </div>
      <div v-show="isLoading">
        <br />
        <RotateSquare2 style="display: inline-block" />
        <br />
      </div>
    </div>
    <h5>Certificate</h5>
    <div style="margin-left: 50px;margin-right: 50px;;display: block">
      <div v-for="(value, key) in cert" :key="key">
        <li style="text-align: left">
          {{ key }}
        </li>
        <input type="text" v-model="cert[key]" readonly class="input-box" />
      </div>
    </div>
    <div v-show="!isLoading" style="margin-bottom: 30px;margin-top: 30px">
      <a
        target="_blank"
        rel="noopener noreferrer"
        style="margin: 0"
        href="https://mainnet.aergoscan.io/account/AmgmyriYhaFzzeYerxhxUzhFc5PypKrt5c848cRb947RFwcnmGr6/?tab=interactive"
        class="btn btn-primary rounded-pill"
      >
        Check Fingerprint (MainNet)
      </a>
      <br />
      <div style="display: inline-block">
        <p
          style="width: center;text-align: left;background-color: #E9E8E9; font-color: #ff0097;margin: 0"
        >
          To check the user fingerprint,
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
    <div v-show="!isLoading" style="margin-bottom: 30px;margin-top: 30px">
      <a
        target="_blank"
        rel="noopener noreferrer"
        style="margin: 0"
        href="https://sqltestnet.aergoscan.io/account/AmhghEmLFq8kd7m3ttUppe1pYmaN45VVF3BbbJRxJD48efbm4JvP/?tab=interactive"
        class="btn btn-primary rounded-pill"
      >
        Check Fingerprint (SQL TestNet)
      </a>
      <br />
      <div style="display: inline-block">
        <p
          style="width: center;text-align: left;background-color: #E9E8E9; font-color: #ff0097;margin: 0"
        >
          To check the user fingerprint,
          <br />
          &nbsp;&nbsp;1. click the above button
          <br />
          &nbsp;&nbsp;2. put the address for "getUserInfo"
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;("INTERACTIVE" tab)
          <br />
          &nbsp;&nbsp;3. click "QUERY"
          <br />
          &nbsp;&nbsp;4. put the address for "getUserCert2"
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;("INTERACTIVE" tab)
          <br />
          &nbsp;&nbsp;5. click "QUERY"
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store.js";
import RotateSquare2 from "../components/RotateSquare2.vue";

export default {
  store,
  name: "profile",
  components: {
    RotateSquare2
  },
  data: function() {
    return {
      metadata: null,
      cert: this.$store.getters.getCert,
      isLoading: true
    };
  },
  mounted: function() {
    const self = this;
    this.$store
      .dispatch("getProfile", { useraddr: this.cert.address })
      .then(data => {
        self.metadata = data.data.metadata;
      })
      .catch(function(error) {
        console.log(error);
        alert(`Fail to get user profile: ${error}`);
      })
      .finally(() => {
        self.isLoading = false;
      });
  }
};
</script>

<template>
  <div class="profile">
    <h3>Profile</h3>
    <div>
      <div
        v-show="!isLoading"
        style="margin-left: 50px;margin-right: 50px;display: block"
      >
        <li
          style="text-align: left"
          v-for="(value, key) in metadata"
          :key="key"
        >
          {{ key }}: {{ value }}
        </li>
      </div>
      <div v-show="isLoading">
        <br />
        <RotateSquare2 style="display: inline-block" />
        <br />
      </div>
    </div>
    <h5>Certificate</h5>
    <div style="margin-left: 50px;margin-right: 50px;;display: block">
      <li style="text-align: left" v-for="(value, key) in cert" :key="key">
        {{ key }}: {{ value }}
      </li>
    </div>
    <div v-show="!isLoading" style="margin-bottom: 30px;margin-top: 30px">
      <a
        target="_blank"
        rel="noopener noreferrer"
        style="margin: 0"
        href="https://mainnet.aergoscan.io/account/AmhNZyo2DaJxUn2489iWxtAzgTLdCxd2tubJxuxumZWkJTEKUm1Y/?tab=interactive"
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
        href="https://sqltestnet.aergoscan.io/account/AmheejAkGiF5Uq7TrH1gMXVT4ssco8sRkqQJSXJe2BqQhRnhw9es/?tab=interactive"
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

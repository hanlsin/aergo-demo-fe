<template>
  <div class="home">
    <div>
      <div
        v-show="!isLoading2"
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
        <div>
          <li style="text-align: left">address:</li>
          <input type="text" v-model="address" readonly class="input-box" />
        </div>
      </div>
      <div v-show="isLoading2">
        <br />
        <RotateSquare2 style="display: inline-block" />
        <br />
      </div>
    </div>
    <h3>Contracts</h3>
    <div v-show="!isLoading" style="width: 100%; text-align: center">
      <router-link
        :to="{ name: 'newcontract', params: {} }"
        class="btn btn-primary rounded-pill"
        style="margin: 0"
      >
        New Contract
      </router-link>
    </div>
    <div v-show="!isLoading" style="margin: 20px 0">
      <table style="width: 100%">
        <tr>
          <th>Block</th>
          <th>Contract ID</th>
          <th>Issuer</th>
          <th>Receiver</th>
          <th>Status</th>
        </tr>
        <tr v-for="contract in contracts" :key="contract.block_height">
          <td>{{ contract.block_no }}</td>
          <td>
            <a
              href="#"
              v-on:click="goContract(contract.contract_id)"
              class="btn btn-primary rounded-pill"
              style="font-size: 3vw;text-transform: none;margin: 0;padding-left: 5px;padding-right: 5px;margin-left: 5px;margin-right: 5px"
            >
              {{ contract.contract_id.substr(0, 5) }}
              ...
            </a>
          </td>
          <!--td>{{ contract.contract_id.substr(0, 5) }}...</td-->
          <td v-if="address == contract.issuer">
            <span style="color: #ff0097">USER</span>
          </td>
          <td v-if="address != contract.issuer">
            <a
              href="#"
              v-on:click="goProfile(contract.issuer)"
              class="btn btn-outline-primary rounded-pill"
              style="font-size: 3vw;text-transform: none;margin: 0;padding-left: 5px;padding-right: 5px;margin-left: 5px;margin-right: 5px"
            >
              {{ contract.issuer.substr(0, 5) }}
              ..
              {{ contract.issuer.substr(-5) }}
            </a>
          </td>
          <!--td><router-link :to="{ name: 'contracts', params: { address: contract.issuer }}">
            {{ contract.issuer.substr(0, 5) }}...
          </router-link></td-->
          <td v-if="address == contract.receiver">
            <span style="color: #ff0097">USER</span>
          </td>
          <td v-if="address != contract.receiver">
            <a
              href="#"
              v-on:click="goProfile(contract.receiver)"
              class="btn btn-outline-primary rounded-pill"
              style="font-size: 3vw;text-transform: none;margin: 0;padding-left: 5px;padding-right: 5px;margin-left: 5px;margin-right: 5px"
            >
              {{ contract.receiver.substr(0, 5) }}
              ..
              {{ contract.receiver.substr(-5) }}
            </a>
          </td>
          <!--td><router-link :to="{ name: 'contracts', params: { address: contract.receiver }}">
            {{ contract.receiver.substr(0, 5) }}...
          </router-link></td-->
          <td>{{ contract.status }}</td>
        </tr>
      </table>
    </div>
    <div v-show="isLoading">
      <br />
      <RotateSquare2 style="display: inline-block" />
      <br />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";
import store from "../store.js";
import RotateSquare2 from "../components/RotateSquare2.vue";

export default {
  store,
  name: "home",
  components: {
    RotateSquare2
  },
  data: function() {
    return {
      metadata: {
        username: ""
      },
      isLoading: true,
      isLoading2: true,
      address: null,
      contracts: []
    };
  },
  mounted: function() {
    this.address = this.$route.params.address;
    if (this.address == null || this.address == "default") {
      this.address = this.$store.getters.getCert.address;
    }
    console.log(this.address);

    const self = this;

    this.$store
      .dispatch("getProfile", { useraddr: this.address })
      .then(data => {
        self.metadata = data.data.metadata;
      })
      .catch(function(error) {
        console.log(error);
        alert(`Fail to get user profile: ${error}`);
      })
      .finally(() => {
        self.isLoading2 = false;
      });

    this.$store
      .dispatch("reqContractList", { address: this.address })
      .then(data => {
        self.contracts = data.data;
      })
      .catch(function(error) {
        console.log(error);
        alert(`Fail to get contracts: ${error}`);
      })
      .finally(() => {
        self.isLoading = false;
      });
  },
  methods: {
    goProfile: function(address) {
      this.$router.push(`/contracts/${address}`);
    },
    goContract: function(contractId) {
      this.$router.push(`/isscontract/${contractId}`);
    }
  }
};
</script>

<style>
@import "../assets/app.css";
</style>

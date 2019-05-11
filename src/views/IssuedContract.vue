<template>
  <div class="isscontract">
    <h3>Contract</h3>
    <div style="text-align: left;background-color: #E9E8E9">
        <li>Contract ID: <span style="color: #ff0097">{{ contractId }}</span></li>
        <li>Issuer's sign: <br><input class="input-box" readonly v-model="issuer.sign"></li>
        <li v-if="contractor.sign != null">Receiver's sign: <br><input class="input-box" readonly v-model="contractor.sign"></li>
        <li v-if="contractor.sign == null">Receiver's sign: <br><input class="input-box" readonly value="WAITING ..."></li>
    </div>
    <div style="margin: 20px">
      <p>
        This is the <span style="color: #ff0097">{{ contractStatus }}</span> contract between
      </p>
      <div>
        issuer <span v-if="userAddr == issuer.address" style="color: #ff0097"> (YOU) </span>
        <input class="input-box" readonly v-model="issuer.disp">
      </div>
      <p>
        and
      </p>
      <div>
        receiver <span v-if="userAddr == contractor.address" style="color: #ff0097"> (YOU) </span>
        <input class="input-box" readonly v-model="contractor.disp">
      </div>
      <div style="margin-top: 20px;text-align: left">
        Contract Detail:<br>
        <textarea rows="10" v-model="contents" style="width: 100%;margin-top: 10px"
          :placeholder="contentsDesc" readonly>
        </textarea>
      </div>
    </div>
    <div v-if="userAddr == contractor.address && contractor.sign == null"
        v-show="!isLoading">
      <a href="#" v-on:click="agreeContract"
        class="btn btn-primary rounded-pill">Agree</a>
      <a href="#" v-on:click="disagreeContract"
        class="btn btn-outline-primary rounded-pill">Disagree</a>
    </div>
    <div v-show="isLoading">
      <br>
      <RotateSquare2 style="display: inline-block"/>
      <br>
    </div>
  </div>
</template>

<script>
import store from "../store.js";
import RotateSquare2 from "../components/RotateSquare2.vue";

export default {
  store,
  name: "isscontract",
  components: {
    RotateSquare2
  },
  data: function() {
    return {
      userAddr: this.$store.getters.getCert.address,
      isLoading: false,
      contractId: null,
      contractStatus: null,
      issuer: {
        metadata: null,
        address: null,
        disp: null,
        sign: null,
      },
      contractor: {
        metadata: null,
        address: null,
        disp: null,
        sign: null,
      },
      contents: null,
      contentsDesc: `Contract Workflow:
    1. This new contract is issued by you
    2. Put your signature on this contract
    3. Store this contract in the sidechain
    4. The receiver checks this contract after logging in
    5. Put the receiver's signature on this contract
    6. Store the final contract in the sidechain
    7. Store the contract's fingerprint in MainNet (Data Anchoring)
`
    }
  },
  mounted: function() {
    this.contractId = this.$route.params.contractId;
    const self = this;

    this.$store.dispatch('getContract', { contractId:this.contractId }).then(data => {
      self.issuer.address = data.data.issuer;
      self.contractor.address = data.data.receiver;
      self.contents = data.data.contents;
      self.issuer.sign = data.data.issuer_sign;
      self.contractor.sign = data.data.receiver_sign;
      self.contractStatus = data.data.status;

      if (self.userAddr != self.issuer.address
          && self.userAddr != self.contractor.address) {
        alert("You don't have a right to see this contract");
        return;
      }

      // get issuer's info
      this.$store.dispatch('getProfile', { useraddr:self.issuer.address }).then(data => {
        self.issuer.metadata = data.data.metadata;
        self.issuer.disp = self.issuer.metadata.username + " (" + self.issuer.address + ")"
      }).catch(function(error){
        console.log(error);
        alert(`Fail to get user info: ${error}`);
      }).finally(() => {
      });
      // get contractor's info
      this.$store.dispatch('getProfile', { useraddr:self.contractor.address }).then(data => {
        self.contractor.metadata = data.data.metadata;
        self.contractor.disp = self.contractor.metadata.username + " (" + self.contractor.address + ")"
      }).catch(function(error){
        console.log(error);
        alert(`Fail to get user info: ${error}`);
      }).finally(() => {
      });
    }).catch(function(error){
      console.log(error);
      alert(`Fail to get contract info: ${error}`);
    }).finally(() => {
      self.isLoading = false;
    });
  },
  methods: {
    agreeContract: function() {
      this.isLoading = true;
      const self = this;
      this.$store
        .dispatch('agreeContract',
          {
            contractId: this.contractId
          })
        .then(data => {
          self.$router.push(`/isscontract/${self.contractId}`);
        }).catch(function(error){
          console.log(error);
          alert(`Fail to agree the contract: ${error}`);
        }).finally(() => {
          self.isLoading = false;
        });
    },
    disagreeContract: function() {
      this.isLoading = true;
      const self = this;
      this.$store
        .dispatch('disagreeContract',
          {
            contractId: this.contractId
          })
        .then(data => {
          self.$router.push(`/isscontract/${self.contractId}`);
        }).catch(function(error){
          console.log(error);
          alert(`Fail to disagree the contract: ${error}`);
        }).finally(() => {
          self.isLoading = false;
        });
    }
  }
};
</script>

<style>
@import "../assets/app.css";
</style>

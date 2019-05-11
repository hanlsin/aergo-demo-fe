<template>
  <div class="netcontract">
    <h3>New Contract</h3>
    <div style="margin: 20px">
      <p>
        This is a new contract between
      </p>
      <div>
        <input class="input-box" readonly
          v-model="issuer.disp">
      </div>
      <p>
        and
      </p>
      <div @click="findContractor">
        <input class="input-box" readonly
          v-model="contractor.disp" placeholder="Click and find a receiver">
      </div>
      <div style="margin-top: 20px;text-align: left">
        Contract Detail:<br>
        <textarea rows="10" v-model="contents" style="width: 100%;margin-top: 10px"
          :placeholder="contentsDesc">
        </textarea>
      </div>
      <!--p>

        If you agree this contract, please upload the contract key image file:
        <input type="file" @change="previewImage" accept="image/*">
      </p>
      <div class="image-preview" v-if="imageData.length > 0">
        <img class="preview" :src="imageData">
        <p>
          This image will be used to protect your contract.
          <span style="color: red">Please store this image safe!!</span>
        </p>
      </div-->
    </div>
    <a href="#" v-on:click="issueContract" v-show="!isLoading"
      class="btn btn-primary rounded-pill">Issue Contract</a>
    <div v-show="isLoading">
      <br>
      <RotateSquare2 style="display: inline-block"/>
      <br>
    </div>
    <div v-show="contractId != null" style="text-align: left;background-color: #E9E8E9">
        <li>Contract ID: <span style="color: #ff0097">{{ contractId }}</span></li>
        <li>Issuer's sign: <span style="color: #ff0097">{{ issuerSign }}</span></li>
    </div>
    <!-- use the modal component, pass in the prop -->
    <FindUser v-if="showModal" v-bind:user="contractor"
      @close="updateContractor"/>
  </div>
</template>

<script>
import store from "../store.js";
// @ is an alias to /src
import FindUser from "@/components/FindUser.vue";
import RotateSquare2 from "../components/RotateSquare2.vue";

export default {
  store,
  name: "newcontract",
  components: {
    FindUser,
    RotateSquare2
  },
  data: function() {
    return {
      isLoading: false,
      issuerSign: null,
      contractId: null,
      showModal: false,
      issuer: {
        metadata: null,
        address: this.$store.getters.getCert.address,
        disp: null,
      },
      contractor: {
        metadata: {
          username: ""
        },
        address: null,
        disp: null,
      },
      imageData: "",
      imageDataHash: null,
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
    const self = this;
    this.$store.dispatch('getProfile', { useraddr:this.issuer.address }).then(data => {
      self.issuer.metadata = data.data.metadata;
      self.issuer.disp = self.issuer.metadata.username + " (" + self.issuer.address + ")"
    }).catch(function(error){
      console.log(error);
      alert(`Fail to get user info: ${error}`);
    }).finally(() => {
    });
  },
  methods: {
    findContractor: function() {
      if (this.isLoading) {
        return;
      }
      this.showModal = true;
    },
    issueContract: function() {
      if (this.imageData.length > 0) {
        var hash = sha256.create();
        hash.update(this.imageData);
        this.imageDataHash = hash.hex();
      } else {
        this.imageDataHash = null;
      }

      console.log(this.contents);

      const self = this;
      this.$store
        .dispatch('saveContract',
          {
            issuer: this.issuer.address,
            receiver: this.contractor.address,
            contents: this.contents
            //issuerKeyImgHash: this.imageDataHash
          })
        .then(data => {
          self.contractId = data.data.contract_id;
          self.issuerSign = data.data.issuer_sign;
        }).catch(function(error){
          console.log(error);
          alert(`Fail to issue new contract: ${error}`);
        }).finally(() => {
          self.isLoading = false;
        });
    },
    updateContractor: function(userInfo) {
      if (userInfo.address != null) {
        this.contractor.metadata = userInfo.metadata;
        this.contractor.address = userInfo.address;
        this.contractor.disp = userInfo.username + " (" + userInfo.address + ")";
      }
      this.showModal = false;
    },
    previewImage: function(event) {
      // Reference to the DOM input element
      var input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.imageData = e.target.result;
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    }
  }
};
</script>

<style>
@import "../assets/app.css";
</style>

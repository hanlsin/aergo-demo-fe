<template>
  <div class="profile">
    <div>
      <h3>Profile</h3>
      <div v-show="!isLoading" style="margin: 0 10px">
        <li style="text-align: left">username: {{ profile.username }}</li>
        <li style="text-align: left">e-mail: {{ profile.metadata.email }}</li>
        <li style="text-align: left">
          created account Block no:
          <a
            target="_blank"
            rel="noopener noreferrer"
            style="margin: 0"
            v-bind:href="
              $store.getters.getSqlTestNet + '/block/' + profile.block_no
            "
          >
            {{ profile.block_no }}
          </a>
        </li>
        <li style="text-align: left">
          The certificate will be expired after {{ cert.expire_after }} seconds.
        </li>
        <li style="text-align: left">
          <a
            target="_blank"
            rel="noopener noreferrer"
            style="margin: 0"
            v-bind:href="
              $store.getters.getMainNet + '/transaction/' + certProof.txHash
            "
          >
            certificate hash
          </a>
          <input
            type="text"
            v-model="certProof.certHash"
            class="input-box"
          />
        </li>
      </div>

      <div v-show="!isLoading" style="margin: 0;display: flex">
        <div
          style="flex: 50%;margin: 0 2px;padding: 0 10px;background-color: #E9E8E9"
        >
          <h5>SideChain</h5>
          <li style="text-align: left">
            <a
              target="_blank"
              rel="noopener noreferrer"
              style="margin: 0"
              v-bind:href="
                $store.getters.getSqlTestNet + '/account/' + profile.address
              "
            >
              address
            </a>
            <input
              type="text"
              v-model="profile.address"
              class="input-box"
            />
          </li>
        </div>
        <div
          style="flex: 50%;margin: 0 2px;padding: 0 10px;background-color: #E9E8E9"
        >
          <h5>MainNet</h5>
          <li style="text-align: left">
            <a
              target="_blank"
              rel="noopener noreferrer"
              style="margin: 0"
              v-bind:href="
                $store.getters.getMainNet + '/transaction/' + proof.txHash
              "
            >
              address
            </a>
            <input
              type="text"
              v-model="proof.sqlTestChain.addr"
              class="input-box"
            />
          </li>
        </div>
      </div>
      <div>
        <span
          v-if="profile.address != proof.sqlTestChain.addr"
          v-show="!isLoading"
          style="color: red; text-align: left"
        >
          User address should be same!!
        </span>
      </div>

      <div v-show="!isLoading" style="margin: 0;display: flex">
        <div
          style="flex: 50%;margin: 0 2px;padding: 0 10px;background-color: #E9E8E9"
        >
          <li style="text-align: left">
            <a
              target="_blank"
              rel="noopener noreferrer"
              style="margin: 0"
              v-bind:href="
                $store.getters.getSqlTestNet + '/transaction/' + profile.tx_hash
              "
            >
              account Tx
            </a>
            <input
              type="text"
              v-model="profile.tx_hash"
              class="input-box"
            />
          </li>
        </div>
        <div
          style="flex: 50%;margin: 0 2px;padding: 0 10px;background-color: #E9E8E9"
        >
          <li style="text-align: left">
            <a
              target="_blank"
              rel="noopener noreferrer"
              style="margin: 0"
              v-bind:href="
                $store.getters.getMainNet + '/transaction/' + proof.txHash
              "
            >
              account Tx
            </a>
            <input
              type="text"
              v-model="proof.sqlTestChain.initTx"
              class="input-box"
            />
          </li>
        </div>
      </div>
      <div>
        <span
          v-if="profile.tx_hash != proof.sqlTestChain.initTx"
          v-show="!isLoading"
          style="color: red"
        >
          Account Tx Hash should be same!!
        </span>
      </div>

      <div v-show="!isLoading" style="margin: 0;display: flex">
        <div
          style="flex: 50%;margin: 0 2px;padding: 0 10px;background-color: #E9E8E9"
        >
          <li style="text-align: left">
            <a
              target="_blank"
              rel="noopener noreferrer"
              style="margin: 0"
              v-bind:href="
                $store.getters.getSqlTestNet + '/transaction/' + cert.tx_hash
              "
            >
              certificate ID
            </a>
            <input
              type="text"
              v-model="cert.tx_hash"
              class="input-box"
            />
          </li>
        </div>
        <div
          style="flex: 50%;margin: 0 2px;padding: 0 10px;background-color: #E9E8E9"
        >
          <li style="text-align: left">
            <a
              target="_blank"
              rel="noopener noreferrer"
              style="margin: 0"
              v-bind:href="
                $store.getters.getMainNet + '/transaction/' + certProof.txHash
              "
            >
              certificate ID
            </a>
            <input
              type="text"
              v-model="certProof.certId"
              class="input-box"
            />
          </li>
        </div>
      </div>
      <div>
        <span
          v-if="cert.tx_hash != certProof.certId"
          v-show="!isLoading"
          style="color: red; text-align: left"
        >
          Certificate ID should be same!!
        </span>
      </div >

      <div v-show="!isLoading" style="margin: 0;display: flex">
        <div
          style="flex: 50%;margin: 0 2px;padding: 0 10px;background-color: #E9E8E9"
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            style="margin: 0"
            v-bind:href="$store.getters.getSqlTestNetAcc + '/?tab=interactive'"
            class="btn btn-outline-primary rounded-pill"
            >
            aergoscan
          </a>
          <div style="display: inline-block;margin: 0 0 10px 0">
            <p
            style="width: center;text-align: left;margin: 0"
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
        <div
          style="flex: 50%;margin: 0 2px;padding: 0 10px;background-color: #E9E8E9"
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            style="margin: 0"
            v-bind:href="$store.getters.getMainNetAcc + '/?tab=interactive'"
            class="btn btn-outline-primary rounded-pill"
          >
            aergoscan
          </a>
          <div style="display: inline-block;margin: 0 0 10px 0">
            <p
              style="width: center;text-align: left;margin: 0"
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
      </div>
      <div v-show="isLoading">
        <br />
        <RotateSquare2 style="display: inline-block" />
        <br />
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
      profile: {
        username: null,
        metadata: {
          email: null
        },
        block_no: null,
        address: null
      },
      proof: {
        txHash: null,
        sqlTestChain: {
          addr: null,
          initTx: null
        }
      },
      certId: this.$store.getters.getCert.tx_hash,
      cert: this.$store.getters.getCert,
      certProof: {
        certId: null,
        txHash: null
      },
      isLoading: true
    };
  },
  mounted: function() {
    const self = this;

    var done1 = false;
    var done2 = false;

    this.$store
      .dispatch("getProfile", { useraddr: this.cert.address })
      .then(data => {
        console.log(data.data);
        if (data.data.error_msg) {
          self.$store.commit("SET_ERROR", { errMsg: data.data.error_msg });
          alert(`Fail to get user info: ${data.data.error_msg}`);
        } else {
          self.profile = data.data;
          if (self.profile == null || self.profile.metadata == null) {
            alert("Cannot find the user");
          }
        }
      })
      .catch(function(error) {
        console.log(error);
        alert(`Exception: profile: ${error}`);
      })
      .finally(() => {
        done1 = true;
        if (done1 && done2) {
          self.isLoading = false;
        }
      });

    this.$store
      .dispatch("getAccProof")
      .then(data => {
        console.log(data.data);
        if (data.data.error_msg) {
          self.$store.commit("SET_ERROR", { errMsg: data.data.error_msg });
          alert(`Fail to get user proof: ${data.data.error_msg}`);
        } else {
          self.proof = data.data;
          if (self.proof == null || self.proof.blockNo == null) {
            alert("Cannot find the user proof");
            return;
          }

          var certHashList = self.proof.certHashList;
          for (var i = 0; i < certHashList.length; i++) {
            var cert = certHashList[i];
            if (cert.certId == self.certId) {
              self.certProof = cert;
              break;
            }
          }
        }
      })
      .catch(function(error) {
        console.log(error);
        alert(`Exception: proof: ${error}`);
      })
      .finally(() => {
        done2 = true;
        if (done1 && done2) {
          self.isLoading = false;
        }
      });
  }
};
</script>

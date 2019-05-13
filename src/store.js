import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

//const backendUrl = "http://localhost:5000";
const backendUrl = "http://10.246.7.229:5000";
//const backendUrl = "http://192.168.0.6:5000";
//const backendUrl = "http://3.8.177.236:5000";

export default new Vuex.Store({
  state: {
    sqltestnet: "https://sqltestnet.aergoscan.io",
    mainnet: "https://mainnet.aergoscan.io",
    encKey: "",
    cert: null,
    errMsg: null
  },
  plugins: [
    createPersistedState({
      key: "aergo-demo-vue",
      storage: window.localStorage
    })
  ],
  getters: {
    getEncKey: function(state) {
      return state.encKey;
    },
    getCert: function(state) {
      return state.cert;
    },
    hasCert: function(state) {
      return state.cert !== null;
    },
    getMainNet: function(state) {
      return state.mainnet;
    },
    getSqlTestNet: function(state) {
      return state.sqltestnet;
    },
    getMainNetAcc: function(state) {
      return (
        state.mainnet +
        "/account/AmgSN4dWHuADYmo67dj7CUPoAiAyFYZ91nE3673DfSHGiuTzTXge"
      );
    },
    getSqlTestNetAcc: function(state) {
      return (
        state.sqltestnet +
        "/account/AmgmyriYhaFzzeYerxhxUzhFc5PypKrt5c848cRb947RFwcnmGr6"
      );
    }
  },
  mutations: {
    SET_ENC_KEY: function(state, { encKey }) {
      console.log(`encKey = ${encKey}`);
      state.encKey = encKey;
    },
    SET_CERT: function(state, { cert }) {
      console.log(`cert = ${JSON.stringify(cert)}`);
      state.cert = cert;
    },
    SET_ERROR: function(state, { errMsg }) {
      state.errMsg = errMsg;
    },
    DELETE_CERT: function(state) {
      state.cert = null;
    }
  },
  actions: {
    login: function(context, { encKey, password }) {
      return axios.post(`${backendUrl}/login`, {
        enc_key: encKey,
        password: password
      });
    },
    signup: function(context, payload) {
      return axios.post(`${backendUrl}/signup`, payload);
    },
    logout: function(context) {
      context.commit("DELETE_CERT");
    },
    getProfile2: function(context, { username }) {
      const address = context.state.cert.address;
      return axios.post(`${backendUrl}/profile2/${username}`, {
        address: address
      });
    },
    getProfile: function(context, { useraddr }) {
      const address = context.state.cert.address;
      return axios.post(`${backendUrl}/profile/${useraddr}`, {
        address: address
      });
    },
    getAccProof: function(context) {
      const address = context.state.cert.address;
      return axios.post(`${backendUrl}/accproof`, {
        address: address
      });
    },
    reqContractList: function(context, { address }) {
      return axios.post(`${backendUrl}/contracts/${address}`, {
        address: context.state.cert.address
      });
    },
    saveContract: function(context, payload) {
      return axios.post(`${backendUrl}/newcontract/1on1`, payload);
    },
    getContract: function(context, { contractId }) {
      const address = context.state.cert.address;
      return axios.post(`${backendUrl}/contract/${contractId}`, {
        address: address
      });
    },
    cancelContract: function(context, { contractId }) {
      const address = context.state.cert.address;
      return axios.post(`${backendUrl}/cancel/${contractId}`, {
        address: address
      });
    },
    agreeContract: function(context, { contractId }) {
      const address = context.state.cert.address;
      return axios.post(`${backendUrl}/agree/${contractId}`, {
        address: address
      });
    },
    disagreeContract: function(context, { contractId }) {
      const address = context.state.cert.address;
      return axios.post(`${backendUrl}/disagree/${contractId}`, {
        address: address
      });
    }
  }
});

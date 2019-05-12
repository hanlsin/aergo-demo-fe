import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const backendUrl = "http://localhost:5000";
//const backendUrl = "http://3.8.177.236:5000";

export default new Vuex.Store({
  state: {
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
      return axios
        .post(`${backendUrl}/login`, {
          enc_key: encKey,
          password: password
        })
        .then(data => {
          console.log(data.data);
          if (data.data.error_msg) {
            alert(data.data.error_msg);
            context.commit("SET_ERROR", { errMsg: data.data.error_msg });
          } else {
            context.commit("SET_CERT", { cert: data.data });
          }
        });
    },
    signup: function(context, payload) {
      return axios.post(`${backendUrl}/signup`, payload).then(data => {
        console.log(data.data);
        if (data.data.error_msg) {
          alert(data.data.error_msg);
          context.commit("SET_ERROR", { errMsg: data.data.error_msg });
        } else {
          context.commit("SET_ENC_KEY", { encKey: data.data.encrypted_key });
        }
      });
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

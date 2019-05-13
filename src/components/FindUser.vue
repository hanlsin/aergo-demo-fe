<template>
  <transition name="find-user-modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              Find User
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <input
                placeholder="Enter username"
                v-model="keyword"
                class="input-box"
              />
              <a
                href="#"
                v-on:click="findUser"
                v-show="!isLoading"
                class="btn btn-primary rounded-pill"
              >
                Search
              </a>
            </slot>
            <div v-show="isLoading">
              <br />
              <RotateSquare2 style="display: inline-block" />
              <br />
            </div>
            <div v-show="!isLoading">
              <li
                style="text-align: left"
                v-for="(value, key) in foundUser.metadata"
                :key="key"
              >
                {{ key }}: {{ value }}
              </li>
            </div>
          </div>

          <div class="modal-footer" v-show="!isLoading">
            <slot name="footer">
              <a
                class="btn btn-outline-primary rounded-pill"
                @click="closeModal()"
              >
                OK
              </a>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import store from "../store.js";
import RotateSquare2 from "../components/RotateSquare2.vue";

export default {
  store,
  name: "FindUser",
  components: {
    RotateSquare2
  },
  props: {
    user: null
  },
  data: function() {
    return {
      keyword: null,
      foundUser: {
        metadata: {}
      },
      isLoading: false
    };
  },
  created: function() {
    this.keyword = this.user.metadata.username;
    console.log(this.user);
  },
  methods: {
    findUser: function() {
      this.isLoading = true;
      const self = this;
      this.$store
        .dispatch("getProfile2", { username: this.keyword })
        .then(data => {
          console.log(data.data);
          if (data.data.error_msg) {
            self.$store.commit("SET_ERROR", { errMsg: data.data.error_msg });
            self.foundUser = null;
            alert(`Fail to get user info: ${data.data.error_msg}`);
          } else {
            self.foundUser = data.data;
            if (self.foundUser == null) {
              alert("Cannot find the user");
            }
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
    closeModal: function() {
      this.$emit("close", this.foundUser);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../assets/app.css";
</style>

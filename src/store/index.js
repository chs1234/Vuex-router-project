import Vue from "vue";
import Vuex from "vuex";
import router from "../router/index.js";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: null,
    allUsers: [
      { id: 1, name: "chs", email: "chs@gmail.com", password: "123456" },
      { id: 2, name: "lego", email: "lego@gmail.com", password: "123456" }
    ],

    isLogin: false,
    isLoginError: false
  },
  mutations: {
    // 로그인이 성공했을 때,
    loginSuccess(state, payload) {
      state.isLogin = true;
      state.isLoginError = false;
      state.userInfo = payload;
    },
    // 로그인이 실패했을 때,
    loginError(state) {
      state.isLogin = false;
      state.isLoginError = true;
    },
    logout(state) {
      state.isLogin = false;
      state.isLoginError = false;
      state.userInfo = null;
    }
  },
  actions: {
    // 로그인 시도
    login({ dispatch }, loginObj) {
      // 로그인 => 토큰 반환
      axios
        .post('https://reqres.in/api/login', loginObj) // 두번째 인자는 파라미터(body)
        .then(res => {
          // 성공 시 token(실제로는 user id 값을 받아옴.)
          // 토큰을 헤더에 포함시켜서 유저 정보를 요청
          let token = res.data.token;
          // 토큰을 로컬스토리지에 저장
          localStorage.setItem('access_token', token);
          dispatch("getMemeberInfo");
        })
        .catch(err => {
          alert("이메일과 비밀번호를 확인해주세요.");
        });
    },

    logout({ commit }) {
      commit("logout");
      router.push({name: "home"});
    },

    getMemeberInfo({ commit }) {
      // 로컬스토리지에 저장되어 있는 토큰을 불러온다.
      let token = localStorage.getItem("access_token");
      let config = {
        headers: {
          "access-token": token
        }
      }
      // 토큰 => 멤버 정보를 반환
      // 새로고침 => 토큰만 가지고 멤버정보를 요청
      axios
        .get('https://reqres.in/api/users/2', config)
        .then(response => {
          let userInfo = {
            id: response.data.data.id,
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            avatar: response.data.data.avatar
          };

          commit('loginSuccess', userInfo);
        })
        .catch(error => {
          alert("이메일과 비밀번호를 확인해주세요.");
        });
    }
  }
});

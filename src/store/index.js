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
    login({ commit }, loginObj) {
      axios.post('https://reqres.in/api/login', loginObj) // 두번째 인자는 파라미터(body)
      .then(res => {
        // 성공 시 token(실제로는 user id 값을 받아옴.)
        // 토큰을 헤더에 포함시켜서 유저 정보를 요청
        let token = res.data.token;
        let config = {
          headers: {
            "access-token": token
          }
        }
        axios.get('https://reqres.in/api/users/2', config)
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
      })
      .catch(err => {
        alert("이메일과 비밀번호를 확인해주세요.");
      });

      // let selectedUser = null;

      // state.allUsers.forEach(user => {
      //   if (user.email === loginObj.email) selectedUser = user;
      // });

      // if (selectedUser === null || selectedUser.password !== loginObj.password)  
      //   commit('loginError')
      // else {
      //   commit('loginSuccess', selectedUser);
      //   router.push({name: 'mypage'});
      // }
    },

    logout({ commit }) {
      commit("logout");
      router.push({name: "home"});
    }
  }
});

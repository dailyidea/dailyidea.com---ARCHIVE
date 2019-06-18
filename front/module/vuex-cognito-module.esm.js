/* eslint-disable */
import Auth from '@aws-amplify/auth';
import Amplify from '@aws-amplify/core';

var state = function state() {
  return {
    session: {},
    user: {}
  };
};

var getters = {
  // TODO: ensure best method to verify this
  isLoggedIn: function isLoggedIn() {
    var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Boolean(store.session && store.session.accessToken && store.session.accessToken.jwtToken);
  }
};

// Simple setter
var set = function set(property) {
  return function (state, payload) {
    return state[property] = payload;
  };
};

// Utils
var mutations = {
  setUser: set('user'),
  setSession: set('session')
};

var actions = {
  fetchSession: function fetchSession(_ref) {
    var commit = _ref.commit;
    return new Promise(function (resolve, reject) {
      Auth.currentSession().then(function (session) {
        Auth.currentUserPoolUser().then(function (user) {
          commit('setUser', user);
          commit('setSession', session);
          resolve(session);
        }).catch(reject);
      }).catch(reject);
    });
  },
  signInUser: function signInUser(_ref2, credentials) {
    var commit = _ref2.commit;
    return new Promise(function (resolve, reject) {
      Auth.signIn(credentials.username, credentials.password).then(function (user) {
        commit('setUser', user);
        commit('setSession', user.signInUserSession);
        if (localStorage) localStorage.setItem('USER', JSON.stringify(user));
        resolve(user);
      }).catch(reject);
    });
  },
  registerUser: function registerUser(_ref3, credentials) {
    var commit = _ref3.commit;
    return new Promise(function (resolve, reject) {
      // TODO: Ensure I'm attribute agnostic
      Auth.signUp({
        username: credentials.username,
        password: credentials.password,
        attributes: credentials.attributes
      }).then(function (user) {
        commit('setUser', user);
        commit('setSession', user.signInUserSession);
        if (localStorage) localStorage.setItem('USER', user);
        resolve(user);
      }).catch(reject);
    });
  },
  confirmUser: function confirmUser(_, data) {
    return new Promise(function (resolve, reject) {
      Auth.confirmSignUp(data.username, data.code).then(resolve).catch(reject);
    });
  },
  resendConfirmation: function resendConfirmation(_, data) {
    return new Promise(function (resolve, reject) {
      Auth.resendSignUp(data.username).then(resolve).catch(reject);
    });
  },
  forgotPassword: function forgotPassword(_, data) {
    return new Promise(function (resolve, reject) {
      Auth.forgotPassword(data.username).then(resolve).catch(reject);
    });
  },
  changePassword: function changePassword(_, data) {
    return new Promise(function (resolve, reject) {
      Auth.forgotPasswordSubmit(data.username, data.code, data.newPassword).then(resolve).catch(reject);
    });
  },
  signOut: function signOut(_ref4) {
    var commit = _ref4.commit,
        getters = _ref4.getters;
    return new Promise(function (resolve, reject) {
      if (!getters.isLoggedIn) {
        reject(new Error('User not logged in.'));
      }

      Auth.signOut().then(function (result) {
        commit('setUser', {});
        commit('setSession', {});
        resolve(result);
      }).catch(reject);
      if (localStorage) localStorage.removeItem('USER');
    });
  },
  init: function init(_ref5, config) {
    var commit = _ref5.commit;

    if (!['userPoolId', 'identityPoolId', 'userPoolWebClientId', 'region'].every(function (opt) {
      return Boolean(config[opt]);
    })) {
      throw new Error('userPoolId, identityPoolId, userPoolWebClientId and region are required in the config object.');
    }

    Amplify.configure({
      Auth: config
    });
  }
};

var index = (function (store, config) {
  var namespace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'cognito';
  var vuexModuleOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  store.registerModule(namespace, {
    namespaced: true,
    actions: actions,
    getters: getters,
    mutations: mutations,
    state: state
  }, vuexModuleOptions);
  store.dispatch("".concat(namespace, "/init"), config);
});

export default index;

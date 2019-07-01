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
    var session = store.session;
    if (!session) return false;
    var accessToken = session.accessToken;
    if (!accessToken) return false;
    if (!session.idToken) return false;
    var hasToken = accessToken.jwtToken;
    var isActive = new Date(accessToken.payload.exp * 1000) > new Date();
    var isMe = session.idToken.payload.email === store.user.username;
    return hasToken && isActive && isMe;
  },
  session: function session() {
    var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return 'session' in store && Object.keys(store.session).length !== 0 ? store.session : false;
  },
  userSub: function userSub() {
    var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (store.user && store.user.attributes) {
      return store.user.attributes.sub;
    } else if (store.user && store.user.userSub) {
      return store.user.userSub;
    } else {
      return false;
    }
  },
  username: function username() {
    var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return store.user && store.user.user ? store.user.user.username : false;
  },
  userAttributes: function userAttributes() {
    var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return store.user && store.user.attributes ? store.user.attributes : false;
  },
  userGroups: function userGroups() {
    var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return store.session && store.session.accessToken && store.session.accessToken.payload && store.session.accessToken.payload['cognito:groups'] ? store.session.accessToken.payload['cognito:groups'] : false;
  }
};

var mutations = {
  setUser: function setUser(state, user) {
    state.user = Object.assign({}, user);
    state.session = JSON.parse(JSON.stringify(state.user.signInUserSession));
  }
};

var actions = {
  fetchSession: function fetchSession(_ref) {
    var commit = _ref.commit;
    return new Promise(function (resolve, reject) {
      Auth.currentSession().then(function (session) {
        Auth.currentUserPoolUser().then(function (user) {
          commit('setUser', user);
          resolve(session);
        }).catch(reject);
      }).catch(reject);
    });
  },
  fetchJwtToken: function fetchJwtToken(_ref2) {
    var commit = _ref2.commit;
    return new Promise(function (resolve, reject) {
      Auth.currentSession().then(function (session) {
        resolve(session.getAccessToken().getJwtToken());
      }).catch(reject);
    });
  },
  signInUser: function signInUser(_ref3, credentials) {
    var commit = _ref3.commit;
    return new Promise(function (resolve, reject) {
      Auth.signIn(credentials.username, credentials.password).then(function (user) {
        commit('setUser', user);
        resolve(user);
      }).catch(reject);
    });
  },
  answerCustomChallenge: function answerCustomChallenge(_ref4, credentials) {
    var commit = _ref4.commit;
    return new Promise(function (resolve, reject) {
      Auth.sendCustomChallengeAnswer(credentials.user, credentials.answer).then(function (user) {
        commit('setUser', user);
        resolve(user);
      }).catch(reject);
    });
  },
  registerUser: function registerUser(_ref5, credentials) {
    var commit = _ref5.commit;
    return new Promise(function (resolve, reject) {
      // TODO: Ensure I'm attribute agnostic
      Auth.signUp({
        username: credentials.username,
        password: credentials.password,
        attributes: credentials.attributes
      }).then(function (user) {
        commit('setUser', user);
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
  signOut: function signOut(_ref6) {
    var commit = _ref6.commit,
        getters = _ref6.getters;
    return new Promise(function (resolve, reject) {
      if (!getters.isLoggedIn) {
        reject(new Error('User not logged in.'));
      }

      Auth.signOut().then(function (result) {
        commit('setUser', {});
        resolve(result);
      }).catch(reject);
      if (localStorage) localStorage.removeItem('USER');
    });
  },
  init: function init(_ref7, config) {
    var commit = _ref7.commit;

    if (!['userPoolId', 'userPoolWebClientId', 'region'].every(function (opt) {
      return Boolean(config[opt]);
    })) {
      throw new Error('userPoolId, userPoolWebClientId and region are required in the config object.');
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

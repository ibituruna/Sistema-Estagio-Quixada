import axios from 'axios';
import { make } from 'vuex-pathify';
import router from '../../router'
import store from '@/store';
import Roles from '@/router/roles';

const state = {
    token: null,
    roles: null,
};

// "set" prefix, constant case. e.g: SET_FOO
const mutations = {
    ...make.mutations(state),
    roles: (state, roles) => {
        state.roles = roles;
        localStorage.setItem('roles', roles);

        if (!roles) {
            localStorage.removeItem('roles');
        }
    },
    token: (state, token) => {
        state.token = token;
        localStorage.setItem('token', token);
    
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    },
    initializeStore(state) {
        const token = localStorage.getItem('token');
        const roles = localStorage.getItem('roles');

        if (token && !state.token) {
            state.token = token;
        }

        if (roles && !state.roles) {
            state.roles = roles;
        }
    }
}

// "set" prefix, camel case. e.g: setFoo
const actions = {
    login: ({commit}, { login, password }) => {
        return new Promise((resolve, reject) => {
            axios.post('/login', {
                login,
                password
            })
            .then(res => {
                const { token } = res.data;

                commit('token', token);
                store.commit('user/setProfileData', res.data.user);
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        }); 
    },

    logout: ({commit}) => {
        commit('token', null);
        commit('roles', null);
        router.replace('/login');
    },
    ...make.actions(state)
}

// no prefix, no case conversion. e.g: foo
const getters = {
    isAuthenticated (state) {
        return state.token !== null
    },
    isEditProfileAllowed (state) {
        return state.roles.includes(Roles.COORDINATOR);
    },
    ...make.getters(state)
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

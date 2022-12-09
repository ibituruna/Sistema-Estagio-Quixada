// Utilities
import { make } from 'vuex-pathify'
import axios from 'axios';
import store from '@/store';

const state = {
    name: '',
    login: '',
    course: '',
    email: '',
    id: '',
    notifications: [],
}

const mutations = {
    ...make.mutations(state),
    setProfileData: (state, profileData) => {
        ['id', 'name', 'login', 'course', 'email', 'notifications'].forEach(function (attribute) {
            const value = profileData[attribute];

            if (value) {
                state[attribute] = profileData[attribute];
            }
        });

        if (profileData.roles) {
            store.commit('authentication/roles', profileData.roles);
        }
    }
}

const actions = {
    getUserProfile: ({ commit }) => {
        return new Promise((resolve, reject) => {
            axios.get('/profile')
            .then(res => {
                commit('setProfileData', res.data);
                resolve(res.data);
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            });
        });
    },
    updateProfile: ({ commit, state }, coordinator) => {
        return new Promise((resolve, reject) => {
            const endpoint = `/coordinators/${state.id}`;

            axios.patch(endpoint, coordinator)
            .then(res => {
                if (res.data.success) {
                    const token = res.data.token;
    
                    commit('setProfileData', coordinator);

                    if (token) {
                        store.commit('authentication/token', token);
                    }
                } else {
                    reject(new Error(res.data.message));
                }
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        });
    },
    setReadNotification: ({ commit }, notificationId) => {
        return new Promise((resolve, reject) => {
            axios.post('/readNotification/', {notificationId})
            .then(res => {
                if (res.data.success) {   
                    commit('notifications', res.data.notifications);
                    resolve(res.data.notifications.length);
                } else {
                    reject(new Error(res.data.message));
                }
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
        });
    },
}

const getters = {
    salutation: state => {
        let firstName = state.name && state.name.split(' ')[0];

        return `Olá, ${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}`;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}

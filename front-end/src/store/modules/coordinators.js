import axios from 'axios';
import { make } from 'vuex-pathify';

const state = {
    all: []
}

const mutations = {
    ...make.mutations(state),

    ADD_COORDINATOR: (state, coordinator) => {
        state.all.push(coordinator);
    },

    UPDATE_COORDINATOR: (state, coordinator) => {
        let index = state.all.findIndex(c => c.id === coordinator.id);

        Object.assign(state.all[index], coordinator);
    },

    DELETE_COORDINATOR: (state, coordinator) => {
        let index = state.all.findIndex(c => c.id === coordinator.id);

        state.all.splice(index, 1)
    }
}

const actions = {
    getAllCoordinators: ({commit}) => {
        return new Promise((resolve, reject) => {
            axios.get('/coordinators')
            .then(res => {
                commit('all', res.data);
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        });
    },
    saveCoordinator: ({commit}, coordinator) => {
        return new Promise((resolve, reject) => {
            axios.post('/coordinators', coordinator)
            .then(res => {
                commit('ADD_COORDINATOR', res.data);
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        });
    },
    updateCoordinator: ({commit}, coordinator) => {
        return new Promise((resolve, reject) => {
            axios.patch(`/coordinators/${coordinator.id}`, coordinator)
            .then(res => {
                if (res.data.success) {
                    commit('UPDATE_COORDINATOR', coordinator);
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
    deleteCoordinator: ({commit}, coordinator) => {
        return new Promise((resolve, reject) => {
            axios.delete(`/coordinators/${coordinator.id}`)
            .then((res) => {
                if (res.data.success) {
                    commit('DELETE_COORDINATOR', coordinator);
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
};

const getters = {
    ...make.getters(state)
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
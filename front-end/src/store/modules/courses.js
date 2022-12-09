import { make } from 'vuex-pathify';

const state = {
    all: [
        'Design Digital',
        'Ciência da Computação',
        'Engenharia de Computação',
        'Engenharia de Software',
        'Redes de Computadores',
        'Sistemas de Informação'
    ]
}

const mutations = make.mutations(state);

const actions = {};

const getters = {
    ...make.getters(state)
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};

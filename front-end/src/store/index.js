import Vue from 'vue';
import Vuex from 'vuex';
import pathify from '@/plugins/vuex-pathify';

import * as modules from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules,
    plugins: [
        pathify.plugin
    ]
});

export default store;

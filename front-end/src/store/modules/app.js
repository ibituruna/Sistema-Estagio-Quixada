import { make } from 'vuex-pathify';
import { isAccessAuthorized } from '@/helpers/userHelpers';
import Roles from '@/router/roles';

const state = {
    drawer: null,
    mini: false,
    items: [
        {
            title: 'Inicio',
            icon: 'mdi-view-dashboard',
            to: '/',
        },
        {
            title: 'Perfil',
            icon: 'mdi-account',
            to: '/profile',
        },
        {
            title: 'Convênios',
            icon: 'mdi-clipboard-outline',
            to: '/partners',
        },
        {
            title: 'Coordenadores',
            icon: 'mdi-account-group-outline',
            to: '/coordinators',
            roles: [Roles.SUPER_ADMIN]
        },
        {
            title: 'Processo',
            icon: 'mdi-clipboard-list',
            to: '/process',
            roles: [Roles.STUDENT]
        },
        {
            title: 'Processos',
            icon: 'mdi-clipboard-list',
            to: '/processes',
            roles: [Roles.COORDINATOR]
        },
    ]
}

// "set" prefix, constant case. e.g: SET_FOO
const mutations = {
    ...make.mutations(state)
}

// "set" prefix, camel case. e.g: setFoo
const actions = {
    ...make.actions(state)
}

// no prefix, no case conversion. e.g: foo
const getters = {
    allowedMenuItems (state) {
        return state.items.filter(function (itemMenu) {
            return isAccessAuthorized(itemMenu.roles);
        });
    },
    ...make.getters(state)
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
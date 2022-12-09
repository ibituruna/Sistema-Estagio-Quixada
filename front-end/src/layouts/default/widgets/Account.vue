<template>
    <v-menu origin="top right" min-width="200" transition="scale-transition" bottom left offset-y>
        <template v-slot:activator="{ attrs, on }">
            <v-btn class="ml-2" min-width="0" v-bind="attrs" v-on="on" text>
                <v-icon>mdi-account</v-icon>
            </v-btn>
        </template>

        <v-list :tile="false" flat nav>
            <p class="ml-2 font-weight-bold text-center"> {{ salutation }} </p>

            <template v-for="(item, index) in items">
                <v-divider v-if="item.divider" :key="`divider-${index}`" class="mb-2 mt-2" />

                <v-hover v-else-if="item.hasCustomHandler" v-slot="{ hover }" :key="`item-${index}`">
                    <v-list-item @click="menuItemHandler(item)" :class="{'black--text': !hover, 'white--text secondary elevation-12': hover}" link>
                        <v-list-item-title v-text="item.title"/>
                    </v-list-item>
                </v-hover>

                <app-bar-item v-else :key="`item-${index}`" :to="item.to">
                    <v-list-item-title v-text="item.title"/>
                </app-bar-item>
            </template>
        </v-list>
  </v-menu>
</template>

<script>
    import { get } from 'vuex-pathify';

    export default {
        name: 'DefaultAccount',
        computed: {
            ...get('user', [
                'salutation',
            ])
        },
        data: () => ({
            items: [
                { title: 'Inicio', to: '/' },
                { title: 'Perfil', to: '/profile' },
                { divider: true },
                { title: 'Sair', to: '/logout' },
            ]
        })
    }
</script>

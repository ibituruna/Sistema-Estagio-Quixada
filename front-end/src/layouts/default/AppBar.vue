<template>
    <v-app-bar id="default-app-bar" class="v-bar--underline" color="transparent" height="70" app absolute flat>

        <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />

        <default-drawer-toggle class="hidden-sm-and-down" />

        <v-toolbar-title class="font-weight-light text-h5" v-text="name" />

        <v-spacer />

        <default-notifications />

        <default-account />
    </v-app-bar>
</template>

<script>
    import { dispatch, get, sync } from 'vuex-pathify'

    export default {
        name: 'DefaultBar',
        components: {
            DefaultAccount: () => import(
                /* webpackChunkName: "default-account" */
                './widgets/Account'
            ),
            DefaultDrawerToggle: () => import(
                /* webpackChunkName: "default-drawer-toggle" */
                './widgets/DrawerToggle'
            ),
            DefaultNotifications: () => import(
                /* webpackChunkName: "default-notifications" */
                './widgets/Notifications'
            )
        },
        computed: {
            ...sync('app', [
                'drawer',
            ]),
            name: get('route/name'),
            currentUserId: get('user/id'),
        },
        beforeCreate() {
            this.$OneSignal.showSlidedownPrompt();
        },
        beforeMount() {
            this.$OneSignal.init({
                appId: process.env.VUE_APP_ONE_SIGNAL_APP_ID,
                safari_web_id: process.env.VUE_APP_ONE_SIGNAL_SAFARI_WEB_ID,
                notifyButton: {
                    enable: true,
                },
                allowLocalhostAsSecureOrigin: true,
            });
        },
        mounted() {
            dispatch('user/getUserProfile');

            this.$OneSignal.on('subscriptionChange', (isSubscribed) => {
                if (isSubscribed && this.currentUserId) {
                    this.$OneSignal.setExternalUserId(this.currentUserId);
                }
            });
        },
    }
</script>

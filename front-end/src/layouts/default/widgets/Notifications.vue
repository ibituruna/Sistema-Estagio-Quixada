<template>
    <v-menu origin="top right" transition="scale-transition" :close-on-content-click="false" bottom left offset-y>
        <template v-slot:activator="{ attrs, on }">
            <v-btn id="menuActivator" class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
                <v-badge color="red" bordered overlap>
                    <template v-slot:badge>
                        <span>
                            {{ notifications.length }}
                        </span>
                    </template>

                    <v-icon>
                        mdi-bell
                    </v-icon>
                </v-badge>
            </v-btn>
        </template>

        <v-container class="mt-4">
            <span class="ml-1 font-weight-bold">
                Notificações
            </span>
            <v-row class="justify-end" v-if="notifications.length">
                <v-btn color="primary" @click="setReadNotification" small text>
                    Marcar todas como lidas
                </v-btn>
            </v-row>
            <v-divider class="mt-3"></v-divider>
        </v-container>

        <v-list max-width="500px">
            <v-list-item-group v-if="notifications.length">
                <template v-for="(item, index) in notifications">
                    <v-list-item :key="`notification-${index}`">
                        <template>
                            <v-list-item-content @click="goToProcess(item)">
                                <v-list-item-subtitle class="text--primary text-wrap">
                                        {{item.message}}
                                </v-list-item-subtitle>

                                <v-list-item-subtitle>
                                    {{ $moment(item.createdAt).utcOffset('-0300').format('DD/MM/YYYY à\\s HH:mm:ss') }}
                                </v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-tooltip bottom>
                                    <template #activator="{ on }">
                                        <v-icon class="mr-2" v-on="on" v-if="!item.isRead" @click="setReadNotification(item)">
                                            mdi-email-outline
                                        </v-icon>
                                    </template>

                                    <span>
                                        Marcar como lida
                                    </span>
                                </v-tooltip>
                            </v-list-item-action>
                        </template>
                    </v-list-item>

                    <v-divider v-if="index < notifications.length - 1" :key="index"></v-divider>
                </template>
            </v-list-item-group>

            <p class="px-4" v-else>
                Nenhuma notificação no momento.
            </p>
        </v-list>
    </v-menu>
</template>

<script>
    import { get, dispatch } from 'vuex-pathify';
    import { getUserRoles } from '@/helpers/userHelpers';

    export default {
        name: 'DefaultNotifications',
        computed: {
            notifications: get('user/notifications'),
        },
        methods: {
            setReadNotification(notification) {
                const notificationId = notification && notification._id;

                dispatch('user/setReadNotification', notificationId)
                    .then((qtyNotifications) => {
                        if (qtyNotifications === 0) {
                            document.getElementById("menuActivator").click();
                        }
                    })
                    .catch((e) => {
                        console.log(e.message);
                    });
            },
            goToProcess({ process }) {
                const userRoles = getUserRoles();

                if (userRoles && userRoles[0] === 'student') {
                    if (this.$router.currentRoute.name !== 'Processo') {
                        this.$router.push({ path: '/process' });
                    }
                } else {    
                    if (this.$router.currentRoute.name !== 'Processos') {
                        this.$router.push({ path: `/openProcess/${process}` })
                    }
                }
            }
        } 
    }
</script>

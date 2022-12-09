<template>
    <v-card-text>
        <v-card-text>
            <div class="font-weight-bold ml-8 mb-2">
                Hoje
            </div>

            <v-timeline align-top dense>
                <v-timeline-item v-for="(message, index) in messages" :key="`message-${index}`" :color="message.isReplied ? 'secondary' : 'primary'" small>
                    <div>
                        <div class="font-weight-normal">
                            <strong>
                                {{ message.author && message.author.name }}
                            </strong>
                            @
                            {{ $moment(message.createdAt).utcOffset('-0300').format('DD/MM/YYYY à\\s HH:mm:ss') }}
                        </div>

                        <div>
                            {{ message.message }}
                        </div>
                    </div>
                </v-timeline-item>
            </v-timeline>

            <v-row class="mt-1">
                <template v-if="showNewMessage">
                    <v-col cols="12" sm="12" class="pb-0">
                        <v-textarea label="Adicionar nova mensagem" v-model="message" />
                    </v-col>

                    <v-col cols="12" class="pt-0 pb-0 pl-0 d-flex justify-end">
                        <v-spacer></v-spacer>

                        <v-btn color="primary" text @click="sendMessage">
                            Enviar Mensagem
                        </v-btn>
                    </v-col>
                </template>
                <v-col cols="12" sm="12" class="d-flex justify-center" v-else>
                    <v-btn color="primary" text @click="goToProcess(processId)">
                        Nova Mensagem
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card-text>
</template>

<script>
    import { dispatch } from 'vuex-pathify'

    export default {
        name: "ProcessMessagesTimeline",
        data () {
            return {
                message: null,
            }
        },
        props: {
            messages: {
                type: Array,
                default: () => ([]),
                required: true
            },
            processId: {
                Type: String,
                required: true
            },
            mutation: {
                Type: String,
                required: false
            },
            showNewMessage: {
                Type: String,
                default: false
            }
        },
        methods: {
            goToProcess (processId) {
                this.$router.push({ path: `/openProcess/${processId}` });
            },
            sendMessage() {
                const params =  { 
                    processId: this.processId,
                    message: this.message,
                    mutationTarget: this.mutation
                };

                dispatch('process/sendNewMessage', params)
                    .then((process) => {
                        this.message = '';
                        
                        this.$emit('doProcessUpdateAfterSendingNewMessage', process);
                    });
            }
        }
    }
</script>

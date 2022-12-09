<template>
    <material-card color="primary" full-header>
        <template #heading>
            <div class="pa-8 white--text">
                <div class="text-h4 font-weight-light">
                    Mensagens
                </div>
            </div>
        </template>

        <process-messages-timeline :messages="messages" :processId="processId" :showNewMessage="showNewMessage" :mutation="mutation" @doProcessUpdateAfterSendingNewMessage="emitProcessUpdateAfterSendingNewMessage"/>
    </material-card>
</template>

<script>
    export default {
        name: "ProcessMessages",
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
            emitProcessUpdateAfterSendingNewMessage(process) {
                this.$emit('doProcessUpdateAfterSendingNewMessage', process);
            }
        }
    }
</script>

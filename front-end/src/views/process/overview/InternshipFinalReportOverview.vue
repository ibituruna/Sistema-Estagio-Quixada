<template>
    <div>
        <v-stepper>
            <v-stepper-header>
                <v-stepper-step step="1" color="secondary" :complete="finalReport.isSubmitted">
                    Envio do Relatório Final de Estágio para Ánalise da Coordenação

                    <small v-if="!finalReport.isApproved">
                        <v-btn color="primary" text @click="resendDocument">
                            Modificar Relatório Final de Estágio
                        </v-btn>
                    </small>
                </v-stepper-step>

                <v-divider />
                
                <v-stepper-step step="2" color="secondary" :complete="finalReport.isApproved">
                    Aprovação do Coordenação
                </v-stepper-step>
            </v-stepper-header>
        </v-stepper>
    </div>
</template>

<script>
    import { get } from 'vuex-pathify';
    export default {
        name: 'InternshipFinalReportOverview',
        computed: {
            finalReport: get('process/process@steps.report'),
        },
        methods: {
            resendDocument () {
                this.$store.set('process/steppers@showFinalReportUploader', true);
            }
        }
    }
</script>

<style scoped>

</style>

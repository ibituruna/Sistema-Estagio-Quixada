<template>
    <div>
        <v-stepper>
            <v-stepper-header>
                <v-stepper-step step="1" color="secondary" :complete="performanceEvaluation.isSubmitted">
                    Envio da Avaliação de Rendimento para Ánalise da Coordenação

                    <small v-if="!performanceEvaluation.isApproved">
                        <v-btn color="primary" text @click="resendDocument">
                            Modificar Avaliação de Rendimento
                        </v-btn>
                    </small>
                </v-stepper-step>

                <v-divider />
                
                <v-stepper-step step="2" color="secondary" :complete="performanceEvaluation.isApproved">
                    Aprovação do Coordenação
                </v-stepper-step>
            </v-stepper-header>
        </v-stepper>
    </div>
</template>

<script>
    import { get } from 'vuex-pathify';
    export default {
        name: 'InternshipPerformanceEvaluationOverview',
        computed: {
            performanceEvaluation: get('process/process@steps.performanceEvaluation'),
        },
        methods: {
            resendDocument () {
                this.$store.set('process/steppers@showPerformanceEvaluationUploader', true);
            }
        }
    }
</script>

<style scoped>

</style>

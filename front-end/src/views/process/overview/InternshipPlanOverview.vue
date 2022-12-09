<template>
    <div>
        <v-stepper>
            <v-stepper-header>
                <v-stepper-step step="1" color="secondary" :complete="internshipPlan.isSubmitted">
                    Envio do Plano de Estágio para Ánalise da Coordenação

                    <small v-if="!internshipPlan.isApproved">
                        <v-btn color="primary" text @click="resendDocument">
                            Modificar Plano de Estágio
                        </v-btn>
                    </small>
                </v-stepper-step>

                <v-divider />
                
                <v-stepper-step step="2" color="secondary" :complete="internshipPlan.isApproved">
                    Aprovação da Coordenação
                </v-stepper-step>
            </v-stepper-header>
        </v-stepper>
    </div>
</template>

<script>
    import { get } from 'vuex-pathify';
    export default {
        name: 'InternshipPlanOverview',
        computed: {
            internshipPlan: get('process/process@steps.internshipPlan'),
        },
        methods: {
            resendDocument () {
                this.$store.set('process/steppers@showInternshipPlanUploader', true);
            }
        }
    }
</script>

<style scoped>

</style>

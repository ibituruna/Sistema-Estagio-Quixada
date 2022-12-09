<template>
    <v-stepper :value="currentProcessStep" vertical>
        <v-stepper-step step="1" :editable="currentProcessStep === 1" :complete="currentProcessStep > 1">
            Matricula SIGAA
            <small>Até <strong>22/08/2022</strong></small>
        </v-stepper-step>

        <v-stepper-content step="1">
            <sigaa-registration/>
        </v-stepper-content>

        <v-stepper-step step="2" editable :complete="currentProcessStep > 2">
            Documentação
            <small>Até <strong>26/08/2022</strong></small>
        </v-stepper-step>

        <v-stepper-content step="2">
            <internship-documentation/>
        </v-stepper-content>

        <v-stepper-step step="3" editable :complete="currentProcessStep > 3">
            Plano de Estágio
            <small>Até <strong>09/09/2022</strong></small>
        </v-stepper-step>

        <v-stepper-content step="3">
            <internship-plan/>
        </v-stepper-content>

        <v-stepper-step step="4" editable :complete="currentProcessStep > 4">
            Avaliação de Desempenho
            <small>Até <strong>12/12/2022</strong></small>
        </v-stepper-step>

        <v-stepper-content step="4">
            <internship-performance-evaluation/>
        </v-stepper-content>

        <v-stepper-step step="5" editable :complete="currentProcessStep > 5">
            Relatório Final de Estágio
            <small>Até <strong>12/12/2022</strong></small>
        </v-stepper-step>

        <v-stepper-content step="5">
            <internship-final-report/>
        </v-stepper-content>

        <v-stepper-step step="6" editable :complete="currentProcessStep > 6">
            Seminário de Estágio
            <small>Em <strong>12/12/2022</strong></small>
        </v-stepper-step>

        <v-stepper-content step="6">
            <internship-workshop/>
        </v-stepper-content>

        <div>
            <v-divider class="mt-2 mx-4" />

            <process-messages :messages="process.messages" :processId="process.id" :showNewMessage="true" mutation="updateSingleProcessMessages" />
        </div>
    </v-stepper>
</template>

<script>
  import { dispatch, get } from 'vuex-pathify'

  export default {
    name: 'ProcessView',
    components: {
        SigaaRegistration: () => import(
            /* webpackChunkName: "sigaa-registration" */
            './process/SigaaRegistration'
        ),
        InternshipDocumentation: () => import(
            /* webpackChunkName: "internship-documentation" */
            './process/InternshipDocumentation'
        ),
        InternshipPlan: () => import(
            /* webpackChunkName: "internship-plan" */
            './process/InternshipPlan'
        ),
        InternshipPerformanceEvaluation: () => import(
            /* webpackChunkName: "internship-performance-evaluation" */
            './process/InternshipPerformanceEvaluation'
        ),
        InternshipFinalReport: () => import(
            /* webpackChunkName: "internship-final-report" */
            './process/InternshipFinalReport'
        ),
        InternshipWorkshop: () => import(
            /* webpackChunkName: "internship-workshop" */
            './process/InternshipWorkshop'
        )
    },
    computed: {
        process: get('process/process'),
        currentProcessStep: get('process/process@steps.currentStep.position')
    },
    mounted() {
        dispatch('process/getProcess');
    },
  }
</script>

<style scoped>

</style>

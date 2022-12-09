<template>
    <div>
        <v-stepper>
            <v-stepper-header>
                <v-stepper-step step="1" color="secondary" :complete="documentation.isSubmitted">
                    Envio do Contrato de Trabalho para Ánalise da Coordenação

                    <small v-if="!documentation.isApproved">
                        <v-btn color="primary" text @click="resendDocument">
                            Modificar Contrato de Trabalho
                        </v-btn>
                    </small>
                </v-stepper-step>

                <v-divider />
                
                <v-stepper-step step="2" color="secondary" :complete="documentation.isApproved">
                    Aprovação do Coordenação
                </v-stepper-step>
            </v-stepper-header>
        </v-stepper>
    </div>
</template>

<script>
    import { get } from 'vuex-pathify';
    export default {
        name: 'InternshipDocumentationCltPjOverview',
        computed: {
            documentation : get('process/process@steps.documentation'),
        },
        methods: {
            resendDocument () {
                this.$store.set('process/steppers@showCltPjDocumentationUploader', true);
            }
        }
    }
</script>

<style scoped>

</style>

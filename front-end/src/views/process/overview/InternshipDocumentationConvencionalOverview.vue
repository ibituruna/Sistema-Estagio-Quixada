<template>
    <div>
        <v-stepper v-model="currentStep">
            <v-stepper-header>
                <v-stepper-step step="1" color="secondary" :complete="currentStep > 1">
                    Preenchimento e Geração do TCE
                    <small v-if="!documentation.isApproved && currentStep > 1">
                        <v-btn color="primary" text @click="editTce">
                            Editar TCE
                        </v-btn>
                    </small>
                </v-stepper-step>

                <v-divider />

                <v-stepper-step step="2" color="secondary" :complete="documentation.isSubmitted && currentStep >= 2">
                    Envio do TCE para Ánalise da Coordenação
                    <small v-if="!documentation.isApproved && documentation.isSubmitted && currentStep >= 2">
                        <v-btn color="primary" text @click="resendDocument">
                            Substituir Documento
                        </v-btn>
                    </small>
                </v-stepper-step>

                <v-divider />
                
                <v-stepper-step step="3" color="secondary" :complete="documentation.isApproved">
                    Aprovação do Coordenação
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <internship-tce-form />
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-card class="mb-2" v-if="showTceUploader">
                        <v-file-input
                            :rules="rules"
                            v-model="documentFile"
                            accept="application/pdf"
                            placeholder="Termo de Compromisso de Estágio (TCE)"
                            label="Termo de Compromisso de Estágio (TCE)"
                        ></v-file-input>

                        <v-card-actions class="justify-center">
                            <v-btn color="primary" text @click="submitFile">
                                <v-icon class="mr-1">
                                    mdi-upload-outline
                                </v-icon>

                                Enviar
                            </v-btn>

                            <v-btn color="primary" text @click="goBack">
                                Voltar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>

        <v-snackbar v-model="isSnackbarVisible" multi-line>
            {{ snackbarMessage }}

            <template v-slot:action="{ attrs }">
                <v-btn color="red" text v-bind="attrs" @click="isSnackbarVisible = false">
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
    import { get, dispatch } from 'vuex-pathify';
    export default {
        name: 'InternshipStepperConvencional',
        components: {
            InternshipTceForm: () => import(
                /* webpackChunkName: "internship-tce-form" */
                './../documentation/InternshipTceForm'
            ),
        },
        data: () => ({
            documentFile: null,
            isSnackbarVisible: false,
            snackbarMessage: null,
            rules: [
                value => !value || value.size < 3000000 || 'O documento deve ter no máximo 3 MB!',
            ],
        }),
        computed: {
            documentation: get('process/process@steps.documentation'),
            showTceUploader: get('process/steppers@showTceUploader'),
            showTceEditor: get('process/steppers@showTceEditor'),
            currentStep () {
                if (this.showTceEditor) {
                    return 1;
                }

                if (this.showTceUploader || this.documentation.isSubmitted) {
                    return 2;
                }

                if (this.documentation.isApproved) {
                    return 3;
                }

                return 1;
            },
        },
        methods: {
            goBack () {
                this.$store.set('process/steppers@showTceUploader', false);
            },
            submitFile () {
                if (!this.documentFile) {
                    this.snackbarMessage = "É necessário selecionar um arquivo para ser enviado.";
                    this.isSnackbarVisible = true;
                    return;
                }

                dispatch('process/uploadDocumentation', this.documentFile)
                    .then(() => {
                        this.snackbarMessage = "Documento enviado com sucesso.";
                        this.isSnackbarVisible = true;
                        this.documentFile = null;
                    }).catch((e) => {
                        this.snackbarMessage = e.message;
                        this.isSnackbarVisible = true;
                    });
            },
            resendDocument () {
                this.$store.set('process/steppers@showTceUploader', true);
            },
            editTce () {
                this.$store.set('process/steppers@showTceEditor', true);
            }
        }
    }
</script>

<style scoped>

</style>

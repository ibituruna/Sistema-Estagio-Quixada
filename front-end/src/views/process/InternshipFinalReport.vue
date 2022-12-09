<template>
    <div class="mb-1" >
        <v-card v-if="!finalReport.isSubmitted || showFinalReportUploader">
            <ul>
                <li>Preencher e realizar o upload do arquivo em formato PDF.</li>
                <li><a href="/templates/Relatorio_Final_Estagio_modelo.doc" download>Modelo de Relatório Final do Estágio</a></li>
            </ul>

            <div v-if="showFinalReportUploader">
                <v-file-input
                    :rules="rules"
                    v-model="documentFile"
                    accept="application/pdf"
                    placeholder="Relatório Final de Estágio"
                    label="Relatório Final de Estágio"
                ></v-file-input>
    
                <v-card-actions class="justify-center">
                    <v-btn color="primary" text @click="submitFile">
                        <v-icon class="mr-1">
                            mdi-upload-outline
                        </v-icon>
    
                        Enviar
                    </v-btn>
    
                    <v-btn color="primary" text @click="goBack" v-if="finalReport.isSubmitted">
                        Voltar
                    </v-btn>
                </v-card-actions>
            </div>
        </v-card>
        <internship-final-report-overview v-else />

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
        name: 'InternshipFinalReport',
        components: { 
            InternshipFinalReportOverview: () => import(
                /* webpackChunkName: "internship-final-report-overview" */
                './overview/InternshipFinalReportOverview'
            ),
        },
        computed: {
            finalReport: get('process/process@steps.report'),
            showFinalReportUploader: get('process/steppers@showFinalReportUploader'),
        },
        data: () => ({
            documentFile: null,
            isSnackbarVisible: false,
            snackbarMessage: null,
            rules: [
                value => !value || value.size < 3000000 || 'O documento deve ter no máximo 3 MB!',
            ],
        }),
        methods: {
            goBack () {
                this.$store.set('process/steppers@showFinalReportUploader', false);
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
        },
    }
</script>

<style scoped>

</style>

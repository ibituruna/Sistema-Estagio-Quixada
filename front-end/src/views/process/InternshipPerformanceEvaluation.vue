<template>
    <div class="mb-1" >
        <v-card v-if="!performanceEvaluation.isSubmitted || showPerformanceEvaluationUploader">
            <ul>
                <li>A Avaliação de Rendimento deve ser preenchida e assinada pelo Supervisor de Estágio. O supervisor de estágio é o mesmo que está definido no Termo de Compromisso de Estágio.</li>
                <li>Os estagiários de empresas devem enviar o <a href="/templates/Avaliacao_Rendimento_modelo.doc" download>Modelo de Avaliação de Rendimento</a> para preenchimento e assinatura pelo seu Supervisor de estágio.</li>
                <li>Depois, o estagiário também deve assinar a Avaliação de Rendimento em sua última página.</li>
                <li>Preencher e realizar o upload do arquivo em formato PDF.</li>
            </ul>

            <div v-if="showPerformanceEvaluationUploader">
                <v-file-input
                    :rules="rules"
                    v-model="documentFile"
                    accept="application/pdf"
                    placeholder="Avaliação de Rendimento"
                    label="Avaliação de Rendimento"
                ></v-file-input>

                <v-card-actions class="justify-center">
                    <v-btn color="primary" text @click="submitFile">
                        <v-icon class="mr-1">
                            mdi-upload-outline
                        </v-icon>

                        Enviar
                    </v-btn>

                    <v-btn color="primary" text @click="goBack" v-if="performanceEvaluation.isSubmitted">
                        Voltar
                    </v-btn>
                </v-card-actions>
            </div>
        </v-card>
        <internship-performance-evaluation-overview v-else />

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
        name: 'InternshipPerformanceEvaluation',
        components: { 
            InternshipPerformanceEvaluationOverview: () => import(
                /* webpackChunkName: "internship-performance-evaluation-overview" */
                './overview/InternshipPerformanceEvaluationOverview'
            ),
        },
        computed: {
            performanceEvaluation: get('process/process@steps.performanceEvaluation'),
            showPerformanceEvaluationUploader: get('process/steppers@showPerformanceEvaluationUploader'),
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
                this.$store.set('process/steppers@showPerformanceEvaluationUploader', false);
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

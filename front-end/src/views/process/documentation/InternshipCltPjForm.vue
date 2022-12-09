<template>
    <div>
        <v-card class="mx-auto mb-2" max-width="450px" v-if="showCltPjDocumentationUploader">
            <ul>
                <li>Enquanto a documentação não for entregue, não haverá confirmação de matrícula no SIGAA.</li>
            </ul>
            <v-file-input
                :rules="rules"
                v-model="documentFile"
                accept="application/pdf"
                placeholder="Envie seu Contrato de Trabalho (CLT / PJ)"
                label="Contrato de Trabalho (CLT / PJ)"
            ></v-file-input>

            <v-card-actions>
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
        <internship-documentation-clt-pj-overview v-else />

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
        name: 'InternshipCltPjForm',
        components: {
            InternshipDocumentationCltPjOverview: () => import(
                /* webpackChunkName: "internship-documentation-clt-pj-overview" */
                './../overview/InternshipDocumentationCltPjOverview.vue'
            ),
        },
        computed: {
            documentation: get('process/process@steps.documentation'),
            showCltPjDocumentationUploader: get('process/steppers@showCltPjDocumentationUploader'),
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
                if (this.documentation.isSubmitted) {
                    this.$store.set('process/steppers@showCltPjDocumentationUploader', false);
                } else {
                    dispatch('process/setInternshipType', null);
                }
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

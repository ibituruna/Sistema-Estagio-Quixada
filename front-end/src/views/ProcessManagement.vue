<template>
    <v-container>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisar por Aluno, Curso ou Etapa Atual"
            single-line
            hide-details
        ></v-text-field>

        <v-data-table :headers="headers" :items="processes" :loading="loading" :search="search" class="elevation-1">
            <template v-slot:item="props">
                <tr>
                    <td>{{ props.item.student.name }}</td>
                    <td>{{ props.item.student.course && props.item.student.course[0] }}</td>
                    <td>
                        {{ props.item.steps.currentStep.description }}

                        <!-- ({{ props.item.type === 'convencional' ? 'TCE' : 'Contrato de Trabalho' }}) -->
                        
                        <v-chip color="orange" v-if="props.item.steps[props.item.steps.currentStep.step] && props.item.steps[props.item.steps.currentStep.step].isSubmitted" small dark>
                            Pronto para Análise
                        </v-chip>
                    </td>
                    <td>
                        <v-tooltip bottom>
                            <template #activator="{ on }">
                                <v-icon color="primary" class="mr-2" @click="openProcess(props.item)" v-on="on">
                                    mdi-eye
                                </v-icon>
                            </template>

                            <span>
                                Visualizar Processo
                            </span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template #activator="{ on }">
                                <v-icon color="orange" class="mr-2" @click="goToFile({process: props.item})" v-on="on"
                                    v-if="props.item.steps[props.item.steps.currentStep.step] && props.item.steps[props.item.steps.currentStep.step].isSubmitted
                                        && !props.item.steps[props.item.steps.currentStep.step].isApproved && props.item.steps[props.item.steps.currentStep.step].documentPath">
                                    mdi-file
                                </v-icon>
                            </template>

                            <span>
                                Visualizar Documentação
                            </span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template #activator="{ on }">
                                <v-icon color="green" @click="approveDocumentation(props.item)" v-on="on"
                                    v-if="props.item.steps[props.item.steps.currentStep.step] && props.item.steps[props.item.steps.currentStep.step].isSubmitted 
                                        && !props.item.steps[props.item.steps.currentStep.step].isApproved">
                                    mdi-check
                                </v-icon>
                            </template>

                            <span>
                                Aprovar 
                                {{ props.item.steps[props.item.steps.currentStep.step] && props.item.steps[props.item.steps.currentStep.step].documentPath ? 'Documentação' : '' }}
                            </span>
                        </v-tooltip>
                    </td>
                </tr>
            </template>

            <template v-slot:no-data>
                Nenhum processo encontrado
            </template>
        </v-data-table>

        <!-- View Process Details Dialog -->
        <v-dialog v-model="dialog" max-width="470" persistent>
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col cols="12" v-if="dialog && hasError">
                            <v-alert shaped prominent type="error" elevation="3" transition="fade-transition" >
                                {{ errorMessage }}
                            </v-alert>
                        </v-col>

                        <v-col cols="12" v-if="process">
                            <span class="text-h6">Detalhes do Processo</span>
                            <p class="text-caption mb-0">Código: {{ process._id }}</p>
                            <p class="text-caption mb-0">Aluno: {{ process.student.name }}</p>
                            <p class="text-caption mb-0">Curso: {{ process.student.course[0] }}</p>
                            <p class="text-caption mb-0">Tipo de Estágio: {{ process.type === 'clt_pj' ? 'Contrato de Trabalho (CLT / PJ)' : 'Convencional' }}</p>
                            <p class="text-caption mb-0">Etapa Atual: {{ process.steps.currentStep.description }}</p>
                            <p class="text-caption mb-0">Ultima Modificação: {{ $moment(process.updatedAt).utcOffset('-0300').format('DD/MM/YYYY à\\s HH:mm:ss') }}</p>
                        </v-col>
                    </v-row>
                </v-card-title>

                <v-stepper class="pb-0" :value="selectedProcessCurrentStep" vertical v-if="selectedProcessCurrentStep">
                    <div v-for="(step, i) in steps" :key="`process-step-${i}`">
                        <v-stepper-step :step="i" :complete="selectedProcessCurrentStep > i" edit-icon="mdi-playlist-check" editable>
                            {{ step.heading }}
                            <small v-html="step.subHeading">
                            </small>
                        </v-stepper-step>

                        <v-stepper-content class="mx-3 px-10" :step="i">
                            <internship-step-overview :internshipStep="process.steps[step.id]" :steps="step.steps" @viewDocumention="goToFile" @approveDocumentation="approveDocumentation">
                            </internship-step-overview>
                        </v-stepper-content>
                    </div>

                    <div>
                        <v-divider class="mt-2 mx-4" />

                        <process-messages :messages="process.messages" :processId="process._id" :showNewMessage="true" mutation="updateProcessMessages" @doProcessUpdateAfterSendingNewMessage="updateOpenedProcess" />
                    </div>
                </v-stepper>

                <v-card-actions>
                    <v-spacer>
                    </v-spacer>

                    <v-btn color="blue darken-1" text @click="close">
                        Fechar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="isSnackbarVisible" multi-line>
            {{ snackbarMessage }}

            <template v-slot:action="{ attrs }">
                <v-btn color="red" text v-bind="attrs" @click="isSnackbarVisible = false">
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>
  
<script>
    import { get, sync, dispatch } from 'vuex-pathify';

    export default {
        name: 'ProcessManagementView',
        data () {
            return {
                headers: [
                    { text: 'Aluno', value: 'student.name' },
                    { text: 'Curso', value: 'student.course' },
                    { text: 'Etapa Atual', value: 'steps.currentStep.description' },
                    { text: 'Ações', value: 'actions', sortable: false },
                ],
                loading: true,
                dialog: false,
                process: null,
                hasError: null,
                errorMessage: null,
                isSnackbarVisible: false,
                snackbarMessage: null,
                search: '',
                steps: [
                    { id: "sigaaRegistration", heading: "Matricula SIGAA", subHeading: "Até <strong>22/08/2022</strong>", steps: [{ heading: 'Matricula Realizada', key: 'isFinished', completedDateKey: 'completedDate' }]},
                    { id: "documentation", heading: "Documentação", subHeading: "Até <strong>26/08/2022</strong>" },
                    { id: "internshipPlan", heading: "Plano de Estágio", subHeading: "Até <strong>09/09/2022</strong>" },
                    { id: "performanceEvaluation", heading: "Avaliação de Desempenho", subHeading: "Até <strong>12/12/2022</strong>" },
                    { id: "report", heading: "Relatório Final de Estágio", subHeading: "Até <strong>12/12/2022</strong>" },
                    { id: "workshop", heading: "Seminário de Estágio", subHeading: "Em <strong>12/12/2022</strong>", steps: [{ heading: 'Seminário Apresentado', key: 'isFinished', completedDateKey: 'completedDate' }]},
                ]
            }
        },
        computed: {
            processes: get('process/all'),
            processGoAndOpen: sync('process/processGoAndOpen'),
            selectedProcessCurrentStep() {
                return this.process && this.process.steps && this.process.steps.currentStep.position - 1;
            },
        },
        watch: {
            processGoAndOpen(openProcessId) {
                if (openProcessId) {
                    const openProcessObj = this.processes.find((process) => process._id === openProcessId);
                    localStorage.removeItem('openProcess');
                    this.openProcess(openProcessObj)
                }
            },
        },
        created () {
            dispatch('process/getAllProcesses')
                .then(() => {
                    this.loading = false;

                    if (this.processGoAndOpen) {
                        const openProcessObj = this.processes.find((process) => process._id === this.processGoAndOpen);
                        this.processGoAndOpen = null;

                        if (openProcessObj) {
                            this.openProcess(openProcessObj);
                        }
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        methods: {
            openProcess: function(process) {
                this.process = Object.assign({}, process);
                this.dialog = true;
            },

            close: function () {
                this.dialog = false;
                this.$nextTick(() => {
                    this.process = null;
                    this.$store.set('process/processGoAndOpen', null);
                });
            },

            goToFile: function ({ process, filePath}) {
                const documentPath = filePath || process.steps[process.steps.currentStep.step].documentPath;

                dispatch('process/downloadDocument', documentPath)
                    .then((response) => {
                        var blob = new Blob([response], { type: 'application/pdf' });

                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(blob); // for IE
                        } else {
                            var fileURL = URL.createObjectURL(blob);
                            var newWindow = window.open(fileURL);
                            newWindow.focus();
                            newWindow.reload();
                        }
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            approveDocumentation: function (process) {
                const processId = process ? process._id : this.process._id;

                this.loading = true;

                dispatch('process/approveDocumentation', processId)
                    .then(() => {
                        this.dialog = false;
                        this.loading = false;
                        this.isSnackbarVisible = true;
                        this.snackbarMessage = "Documentação Aprovada com sucesso.";
                    })
                    .catch((e) => {
                        this.loading = false;
                        this.snackbarMessage = e.message;
                        this.isSnackbarVisible = true;
                    });
            },
            updateOpenedProcess: function ({ messages }) {
                this.process = Object.assign({}, this.process, { messages });
            }
        },
    }
</script>

<style>
@media only screen and (max-width: 959px) {
  .v-stepper:not(.v-stepper--vertical) .v-stepper__label {
    display: flex !important;
    font-size: 14px !important;
  }
}
</style>

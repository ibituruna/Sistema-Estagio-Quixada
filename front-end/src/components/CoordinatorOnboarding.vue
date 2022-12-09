<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8">
                <material-card color="orange" full-header>
                    <template #heading>
                        <div class="pa-8 white--text">
                            <div class="text-h4 font-weight-light">
                                Processos Pendentes de Análise
                            </div>
                            <div class="text-caption">
                                Processos que o estudante já enviou a documentação para sua ánalise e está aguardando a sua aprovação.
                            </div>
                        </div>
                    </template>

                    <v-card-text>
                        <v-data-table :headers="processesReadyToReviewHeaders" :items="processesReadyToReview" :loading="processesReadyToReviewLoading" class="elevation-1">
                            <template v-slot:item="props">
                                <tr>
                                    <td>{{ props.item.student.name }}</td>
                                    <td>{{ props.item.student.course && props.item.student.course[0] }}</td>
                                    <td>{{ props.item.steps.currentStep.description }}</td>
                                    <td>
                                        <v-tooltip bottom>
                                            <template #activator="{ on }">
                                                <v-icon color="primary" class="mr-2" @click="goToProcess(props.item)" v-on="on">
                                                    mdi-eye
                                                </v-icon>
                                            </template>

                                            <span>
                                                Visualizar Processo
                                            </span>
                                        </v-tooltip>
                                    </td>
                                </tr>
                            </template>

                            <template v-slot:no-data>
                                Nenhum processo encontrado
                            </template>
                        </v-data-table>
                    </v-card-text>
                </material-card>
            </v-col>

            <v-col cols="12" md="4">
                <material-card color="primary" full-header>
                    <template #heading>
                        <div class="pa-8 white--text">
                            <div class="text-h4 font-weight-light">
                                Mensagens
                            </div>
                            <div class="text-caption">
                                Mensagens relacionadas a processos
                            </div>
                        </div>
                    </template>

                    <v-card-text>
                        <v-data-table :headers="processesMessagesHeaders" :items="processesWithMessages" :loading="processesMessagesLoading" :expanded.sync="expanded" show-expand single-expand class="elevation-1">
                            <template v-slot:expanded-item="{ headers, item }">
                                <td :colspan="headers.length">
                                    <process-messages-timeline :messages="item.messages" :processId="item._id" :showNewMessage="true" mutation="updateProcessesWithMessages" />
                                </td>
                            </template>

                            <template v-slot:no-data>
                                Nenhuma mensagem encontrada
                            </template>
                        </v-data-table>
                    </v-card-text>
                </material-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { dispatch, get } from 'vuex-pathify';

    export default {
        name: 'CoordinatorOnboarding',
        computed: {
            processesReadyToReview: get('process/processesReadyToReview'),
            processesWithMessages: get('process/processesWithMessages'),
        },
        data () {
            return {
                processesReadyToReviewHeaders: [
                    { text: 'Aluno', value: 'student.name' },
                    { text: 'Curso', value: 'student.course' },
                    { text: 'Etapa Atual', value: 'steps.currentStep.description' },
                    { text: 'Ações', value: 'actions', sortable: false },
                ],
                processesMessagesHeaders: [
                    { text: 'Aluno', value: 'student.name' },
                    { text: 'Curso', value: 'student.course' },
                    { text: '', value: 'data-table-expand' },
                ],
                processesReadyToReviewLoading: true,
                processesMessagesLoading: true,
                expanded: [],
            }
        },
        created() {
            dispatch('process/getProcessesReadyToReview')
                .then(() => {
                    this.processesReadyToReviewLoading = false;
                })
                .catch(() => {
                    this.processesReadyToReviewLoading = false;
                });

            dispatch('process/getUnreadCoordinatorMessages')
                .then(() => {
                    this.processesMessagesLoading = false;
                })
                .catch(() => {
                    this.processesMessagesLoading = false;
                });
        },
        methods: {
            goToProcess (process) {
                this.$router.push({ path: `/openProcess/${process._id}` });
            }
        }
    }
</script>

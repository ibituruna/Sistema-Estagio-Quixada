<template>
    <v-card class="mb-4" v-if="!isGeneratingTce">
        <!-- Unidade Concedente -->
        <material-card color="secondary" icon="mdi-account-outline" iconSmall>
            <template #title>
                <div class="text-h6">
                    Unidade Concedente
                </div>
            </template>

            <template #subtitle>
                <p class="mt-0 text-justify text-caption">
                    A unidade concedente deve necessariamente ter convênio ativo com a agência de estágios da UFC. <br/>
                    Clique <router-link to="/partners">aqui</router-link> para verificar a situação do convênio da empresa com a UFC.
                </p>
            </template>

            <v-form>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="5">
                            <v-text-field label="Razão Social" v-model="tce.unidadeConcedente.razaoSocial" counter="255" />
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-text-field label="CNPJ" v-model="tce.unidadeConcedente.cnpj" v-mask="'##.###.###/####-##'" />
                        </v-col>

                        <v-col cols="12" sm="2">
                            <v-text-field label="Fone" v-model="tce.unidadeConcedente.fone" v-mask="maskUnidadeConcedenteFone" />
                        </v-col>

                        <v-col cols="12" sm="2">
                            <v-text-field label="Setor" v-model="tce.unidadeConcedente.setor" counter="255" />
                        </v-col>

                        <v-col cols="12" sm="9">
                            <v-text-field label="Endereço" v-model="tce.unidadeConcedente.endereco" counter="255" />
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-text-field label="CEP" v-model="tce.unidadeConcedente.cep" v-mask="'##.###-###'" />
                        </v-col>

                        <v-col cols="9" sm="3">
                            <v-text-field label="Cidade" v-model="tce.unidadeConcedente.cidade" counter="255" />
                        </v-col>

                        <v-col cols="3" sm="1">
                            <v-text-field label="U.F." v-model="tce.unidadeConcedente.uf" v-mask="'AA'"/>
                        </v-col>

                        <v-col cols="12" sm="8">
                            <v-text-field label="Representante Legal" v-model="tce.unidadeConcedente.representanteLegal" counter="255"/>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field label="Nome do Supervisor" v-model="tce.unidadeConcedente.supervisor.nome" counter="255"/>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field label="Cargo do Supervisor" v-model="tce.unidadeConcedente.supervisor.cargo" counter="255"/>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field label="Email do Supervisor" v-model="tce.unidadeConcedente.supervisor.email" counter="100"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </material-card>

        <!-- Estagiário -->
        <material-card color="secondary" icon="mdi-account-outline" iconSmall>
            <template #title>
                <div class="text-h6">
                    Estagiário
                </div>
            </template>

            <v-form>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="8">
                            <v-text-field label="Nome" readonly v-model="tce.estagiario.name" counter="255" />
                        </v-col>

                        <v-col cols="12" sm="2">
                            <v-text-field label="RG" v-model="tce.estagiario.rg" counter="50" />
                        </v-col>

                        <v-col cols="12" sm="2">
                            <v-text-field label="CPF" readonly v-model="tce.estagiario.login" v-mask="'###.###.###-##'" />
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field label="Matricula" v-model="tce.estagiario.matricula" v-mask="'######'"/>
                        </v-col>

                        <v-col cols="12" sm="5">
                            <v-text-field label="Curso" readonly v-model="tce.estagiario.course" counter="50" />
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-text-field label="Semestre" v-model="tce.estagiario.semestre" counter="50" />
                        </v-col>

                        <v-col cols="12" sm="8">
                            <v-text-field label="Endereço" v-model="tce.estagiario.endereco" counter="255" />
                        </v-col>

                        <v-col cols="9" sm="3">
                            <v-text-field label="Cidade" v-model="tce.estagiario.cidade" counter="255"/>
                        </v-col>

                        <v-col cols="3" sm="1">
                            <v-text-field label="U.F." v-model="tce.estagiario.uf" v-mask="'AA'"/>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-text-field label="Fone" v-model="tce.estagiario.fone" v-mask="maskFone" />
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field label="Email" readonly v-model="tce.estagiario.email" counter="100"/>
                        </v-col>

                        <v-col cols="12" sm="5">
                            <v-text-field label="Nome da Mãe" v-model="tce.estagiario.mae" counter="255"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </material-card>

        <!-- Orientador -->
        <material-card color="secondary" icon="mdi-account-outline" iconSmall>
            <template #title>
                <div class="text-h6">
                    Orientador
                </div>
            </template>

            <v-form>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="9">
                            <v-text-field label="Nome" readonly v-model="tce.orientador.name" counter="255"/>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-text-field label="Siape" readonly v-model="tce.orientador.login" v-mask="'######'" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </material-card>

        <!-- Dados do Estágio e Botões -->
        <material-card color="secondary" icon="mdi-account-outline" iconSmall>
            <template #title>
                <div class="text-h6">
                    Dados do Estágio
                </div>
            </template>

            <v-form>
                <v-container class="py-0">
                    <v-row>
                        <v-col cols="12" sm="3">
                            <v-menu v-model="menuDataInicio" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        :value="formattedDataInicio"
                                        label="Data de Inicio"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    />
                                </template>

                                <v-date-picker v-model="tce.estagio.dataInicio" @input="menuDataInicio = false" />
                            </v-menu>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-menu v-model="menuDataFim" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        :value="formattedDataFim"
                                        label="Data de Fim"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    />
                                </template>

                                <v-date-picker v-model="tce.estagio.dataFim" @input="menuDataFim = false" />
                            </v-menu>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-text-field label="Valor da Bolsa" v-model.number="tce.estagio.valorBolsa" @keypress="isNumber($event)" />
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-text-field label="Valor do Auxílio Transporte" v-model.number="tce.estagio.valorAuxilioTransporte" @keypress="isNumber($event)" />
                        </v-col>

                        <v-col cols="12" sm="3">
                            <v-text-field label="Carga Horária Semanal" v-model="tce.estagio.cargaHorariaSemanal" v-mask="'## h'" />
                        </v-col>

                        <v-col cols="12" sm="9">
                            <v-text-field label="Componente Curricular" v-model="tce.estagio.componenteCurricular" counter="100" />
                        </v-col>

                        <v-col cols="12" sm="12">
                            <p>Horário do estágio</p>

                            <v-data-table :headers="headers" :items="tce.estagio.horarios" class="elevation-1" hide-default-footer>
                                <template v-slot:item="props">
                                    <tr>
                                        <td>
                                            {{ diasDaSemana[props.item.diaSemana] }}
                                        </td>
                                        <td>
                                            <v-text-field v-model="props.item.manha" v-mask="'##:## h as ##:##h'" />
                                        </td>
                                        <td>
                                            <v-text-field v-model="props.item.tarde" v-mask="'##:## h as ##:##h'" />
                                        </td>
                                        <td>
                                            <v-text-field v-model="props.item.noite" v-mask="'##:## h as ##:##h'" />
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-textarea label="Atividades Previstas" v-model="tce.estagio.atividadesPrevistas"/>
                        </v-col>

                        <!-- Botões -->
                        <v-row class="mb-2" id="tce-actions">
                            <v-col cols="12" class="d-flex justify-center">
                                <v-btn color="secondary" text class="mr-2" @click="goBack">
                                    Voltar
                                </v-btn>

                                <v-btn color="primary" class="mr-2" @click="saveTce">
                                    <v-icon class="mr-1">
                                        mdi-mdi-upload-outline
                                    </v-icon>

                                    Salvar
                                </v-btn>

                                <v-btn color="teal darken-1" class="mr-2 white--text" @click="generateTce">
                                    <v-icon class="mr-1">
                                        mdi-file-export
                                    </v-icon>

                                    Gerar TCE
                                </v-btn>

                                <v-btn color="secondary" class="mr-2" @click="uploadTce">
                                    <v-icon class="mr-1">
                                        mdi-upload-outline
                                    </v-icon>

                                    Submeter TCE
                                </v-btn>
                            </v-col>
                        </v-row>

                        
                    </v-row>
                </v-container>
            </v-form>
        </material-card>

        <v-snackbar v-model="isSnackbarVisible" multi-line>
            {{ snackbarMessage }}

            <template v-slot:action="{ attrs }">
                <v-btn color="red" text v-bind="attrs" @click="isSnackbarVisible = false">
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>
    </v-card>
    <v-container id="loader-tce-file-generating" style="height: 400px;" v-else>
        <v-row class="fill-height" align-content="center" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12">
                Gerando TCE. Aguarde um momento
            </v-col>
            <v-col cols="12">
                <div class="text-center">
                    <v-progress-circular :size="50" :width="4" color="primary" indeterminate>
                    </v-progress-circular>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { get, dispatch } from 'vuex-pathify';

    export default {
        name: 'InternshipTceForm',
        computed: {
            tce : get('process/tce'),
            documentation: get('process/process@steps.documentation'),
            maskFone () {
                return this.tce.estagiario.fone && this.tce.estagiario.fone.length == 15 ? '(##) #####-####' : '(##) ####-#####';
            },
            maskUnidadeConcedenteFone () {
                return this.tce.unidadeConcedente.fone && this.tce.unidadeConcedente.fone.length == 15 ? '(##) #####-####' : '(##) ####-#####';
            },
            formattedDataInicio () {
                return this.tce.estagio.dataInicio ? this.$moment(this.tce.estagio.dataInicio).format("DD/MM/YYYY") : '';
            },
            formattedDataFim () {
                return this.tce.estagio.dataFim ? this.$moment(this.tce.estagio.dataFim).format("DD/MM/YYYY") : '';
            },
        },
        data: () => ({
            menuDataInicio: false,
            menuDataFim: false,
            isGeneratingTce: false,
            isSnackbarVisible: false,
            snackbarMessage: null,
            headers: [
                { text: 'Dia da Semana', sortable: false },
                { text: 'Manhã', sortable: false },
                { text: 'Tarde', sortable: false },
                { text: 'Noite', sortable: false },
            ],    
            diasDaSemana: {
                "1": "Segunda-Feira",
                "2": "Terça-Feira",
                "3": "Quarta-Feira",
                "4": "Quinta-Feira",
                "5": "Sexta-Feira",
                "6": "Sábado",
            }
        }),
        mounted() {
            dispatch('process/getTce');
        },
        methods: {
            isNumber (evt) {
                const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
                const keyPressed = evt.key;
                
                if (!keysAllowed.includes(keyPressed)) {
                    evt.preventDefault()
                }
            },
            goBack () {
                if (this.documentation.isSubmitted) {
                    this.$store.set('process/steppers@showTceEditor', false);
                } else {
                    dispatch('process/setInternshipType', null);
                }
            },
            saveTce () {
                dispatch('process/saveTce', this.tce)
                    .then(() => {
                        this.snackbarMessage = "TCE salvo com sucesso.";
                        this.isSnackbarVisible = true;
                    })
                    .catch((e) => {
                        this.snackbarMessage = e.message;
                        this.isSnackbarVisible = true;
                    });
            },
            generateTce () {
                this.isGeneratingTce = true;

                this.$nextTick(() => {
                    this.$vuetify.goTo(document.getElementById("loader-tce-file-generating"));
                });

                dispatch('process/generateTce')
                    .then((data) => {
                        const url = window.URL.createObjectURL(new Blob(data));
                        const link = document.createElement('a');

                        link.href = url;
                        link.setAttribute('download', 'termo-de-compromisso-de-estagio-obrigatorio.pdf');
                        document.body.appendChild(link);
                        link.click();
                        this.isGeneratingTce = false;
                        this.$nextTick(() => {
                            this.$vuetify.goTo(document.getElementById("tce-actions"));
                        });
                    })
                    .catch(() => {
                        this.isGeneratingTce = false;
                        this.$nextTick(() => {
                            this.$vuetify.goTo(document.getElementById("tce-actions"));
                        });
                    });
            },
            uploadTce () {
                this.$store.set('process/steppers@showTceUploader', true);
                this.$store.set('process/steppers@showTceEditor', false);
            }
        }
    }
</script>

<style scoped>

</style>

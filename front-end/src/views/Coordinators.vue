<template>
    <v-container>
        <v-data-table :headers="headers" :items="coordinators" :loading="loading" sort-by="name" class="elevation-1">
            <template v-slot:item="props">
                <tr>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.login }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>
                        <v-chip v-for="course in props.item.course" color="white--text primary" class="ml-1" small :key="`chip-${props.item.login}-${course}`">
                            {{ course }}
                        </v-chip>
                    </td>
                    <td>
                        <v-icon class="mr-2" @click="editCoordinator(props.item)" small>
                            mdi-pencil
                        </v-icon>

                        <v-icon @click="deleteCoordinator(props.item)" small>
                            mdi-delete
                        </v-icon>
                    </td>
                </tr>
            </template>

            <template v-slot:no-data>
                Nenhum coordenador cadastrado
            </template>
        </v-data-table>

        <!-- Edit / New Coordinator Dialog -->
        <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" class="mb-14 mx-2" v-bind="attrs" v-on="on" absolute bottom right fab>
                    <v-icon dark>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </template>

            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col cols="12" v-if="dialog && hasError">
                            <v-alert shaped prominent type="error" elevation="3" transition="fade-transition" >
                                {{ errorMessage }}
                            </v-alert>
                        </v-col>

                        <v-col cols="12">
                            <span class="text-h5">
                                {{ modalTitle }}
                            </span>
                        </v-col>
                    </v-row>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="editedItem.name" label="Nome" :error-messages="nameErrors" @blur="$v.editedItem.name.$touch()">
                                </v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-text-field v-model="editedItem.login" label="Login" :error-messages="loginErrors" @blur="$v.editedItem.login.$touch()">
                                </v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-text-field v-model="editedItem.email" label="Email" :error-messages="emailErrors" @blur="$v.editedItem.email.$touch()">
                                </v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-select class="select-courses" v-model="editedItem.course" :error-messages="courseErrors" :items="courses" label="Cursos(s)" 
                                    multiple chips deletable-chips>
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer>
                    </v-spacer>

                    <v-btn color="blue darken-1" text @click="close">
                        Cancelar
                    </v-btn>

                    <v-btn color="blue darken-1" text @click="saveCoordinator">
                        Salvar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Coordinator Dialog -->
        <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
                <v-card-title class="text-h5">
                    <v-row>
                        <v-col cols="12">
                            <v-alert shaped prominent type="error" elevation="3" transition="fade-transition" v-if="dialogDelete && hasError">
                                {{ errorMessage }}
                            </v-alert>
                        </v-col>
                    </v-row>

                    Você deseja realmente remover esse coordenador?
                </v-card-title>

                <v-card-actions>
                    <v-spacer>
                    </v-spacer>
                    
                    <v-btn color="blue darken-1" text @click="closeDelete">
                        Não
                    </v-btn>
        
                    <v-btn color="blue darken-1" text @click="deleteCoordinatorConfirm">
                        Sim
                    </v-btn>

                    <v-spacer>
                    </v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
  
<script>
    import { get, dispatch } from 'vuex-pathify';
    import { required, minLength, email } from 'vuelidate/lib/validators';

    export default {
        name: 'CoordinatorsView',
        data () {
            return {
                dialog: false,
                dialogDelete: false,
                headers: [
                    { text: 'Nome', value: 'name' },
                    { text: 'Login', value: 'login' },
                    { text: 'Email', value: 'email' },
                    { text: 'Curso(s)', value: 'course' },
                    { text: 'Ações', value: 'actions', sortable: false },
                ],
                editedIndex: -1,
                editedItem: {
                    name: '',
                    login: '',
                    email: '',
                    course: []
                },
                defaultItem: {
                    name: '',
                    login: '',
                    email: '',
                    course: []
                },
                loading: true,
                hasError: false,
                errorMessage: ''
            }
        },
        computed: {
            modalTitle: function () {
                return `${this.editedIndex === -1 ? 'Novo' : 'Editar'} coordenador`;
            },
            coordinators: get('coordinators/all'),
            courses: get('courses/all'),
            nameErrors: function() {
                const errors = [];

                if (!this.$v.editedItem.name.$dirty) {
                    return errors;
                }

                if (!this.$v.editedItem.name.required) {
                    errors.push("Informe o nome do coordenador");
                }

                if (!this.$v.editedItem.name.minLength) {
                    errors.push("Informe no mínimo 4 caracteres");
                }

                return errors;
            },
            loginErrors: function() {
                const errors = [];

                if (!this.$v.editedItem.login.$dirty) {
                    return errors;
                }

                if (!this.$v.editedItem.login.required) {
                    errors.push("Informe o login do coordenador");
                }

                if (!this.$v.editedItem.login.minLength) {
                    errors.push("Informe no mínimo 4 caracteres");
                }

                return errors;
            },
            emailErrors: function() {
                const errors = [];

                if (!this.$v.editedItem.email.$dirty) {
                    return errors;
                }

                if (!this.$v.editedItem.email.required) {
                    errors.push("Informe o email do coordenador");
                }

                if (!this.$v.editedItem.email.email) {
                    errors.push("Informe um email válido");
                }

                return errors;
            },
            courseErrors: function() {
                const errors = [];

                if (!this.$v.editedItem.course.$dirty) {
                    return errors;
                }

                if (!this.$v.editedItem.course.required) {
                    errors.push("Informe pelo menos 1 curso");
                }

                return errors;
            },
        },
        watch: {
            dialog: function (val) {
                val || this.close();
            },
            dialogDelete: function (val) {
                val || this.closeDelete()
            }
        },
        created () {
            dispatch('coordinators/getAllCoordinators')
                .then(() => {
                    this.loading = false;
                });
        },
        methods: {
            editCoordinator: function(coordinator) {
                this.editedIndex = this.coordinators.indexOf(coordinator);
                this.editedItem = Object.assign({}, coordinator);
                this.dialog = true;
            },
            deleteCoordinator: function(coordinator) {
                this.editedIndex = this.coordinators.indexOf(coordinator);
                this.editedItem = Object.assign({}, coordinator);
                this.dialogDelete = true;
            },
            deleteCoordinatorConfirm: function() {
                const coordinatorToDelete = this.coordinators[this.editedIndex];

                this.hasError = false;

                dispatch('coordinators/deleteCoordinator', coordinatorToDelete)
                    .then(() => {
                        this.closeDelete();
                    })
                    .catch((e) => {
                        this.hasError = true;
                        this.errorMessage = e.message;
                    });
            },
            close: function () {
                this.dialog = false;
                this.$v.editedItem.$reset();
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                });
            },
            closeDelete: function () {
                this.dialogDelete = false;
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                });
            },
            saveCoordinator: function () {
                this.$v.editedItem.$reset();
                this.$v.editedItem.$touch();

                if (this.$v.editedItem.$invalid) {
                    return;
                }

                this.hasError = false;

                if (this.editedIndex > -1) {
                    const coordinatorToUpdate = Object.assign({}, this.coordinators[this.editedIndex], this.editedItem);

                    dispatch('coordinators/updateCoordinator', coordinatorToUpdate)
                        .then(() => {
                            this.close();
                        })
                        .catch((e) => {
                            this.hasError = true;
                            this.errorMessage = e.message;
                        });
                } else {
                    dispatch('coordinators/saveCoordinator', this.editedItem)
                        .then(() => {
                            this.close();
                        })
                        .catch((e) => {
                            this.hasError = true;
                            this.errorMessage = e.message;
                        });
                }
            }
        },
        validations: {
            editedItem: {
                name: {
                    required,
                    minLength: minLength(4)
                },
                login: {
                    required,
                    minLength: minLength(4)
                },
                email: {
                    required,
                    email
                },
                course: {
                    required,
                }
            }
        },
    }
</script>
  
<style scoped lang="scss">
    .select-courses::v-deep .v-chip {
        background-color: #1976d2 !important;
        color: white !important;

        button {
            color: white;
        }
    }
</style>

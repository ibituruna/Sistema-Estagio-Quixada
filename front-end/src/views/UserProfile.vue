<template>
    <v-container id="user-profile-view" fluid>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <material-card color="primary" icon="mdi-account-outline">
                    <template #title>
                        Perfil
                    </template>

                    <v-form>
                        <v-container class="py-0">
                            <v-row v-if="isEditProfileAllowed">
                                <v-col cols="12">
                                    <v-text-field label="Nome Completo" v-model="name" :error-messages="nameErrors" @blur="$v.name.$touch()" />
                                </v-col>

                                <v-col cols="6">
                                    <v-text-field label="Login" v-model="login" :error-messages="loginErrors" @blur="$v.login.$touch()" />
                                </v-col>

                                <v-col cols="6">
                                    <v-text-field :readonly="!isEditProfileAllowed" label="Email" v-model="email" :error-messages="emailErrors" @blur="$v.email.$touch()"/>
                                </v-col>

                                <v-col cols="12">
                                    <v-select class="select-courses" v-model="course" :items="courses" label="Cursos(s)" multiple chips deletable-chips
                                        :error-messages="courseErrors" @blur="$v.course.$touch()">
                                    </v-select>
                                </v-col>

                                <v-col cols="12" class="d-flex">
                                    <v-spacer>
                                    </v-spacer>
                                    <v-btn color="blue darken-1 white--text" @click="saveCoordinator" >
                                        Salvar Alterações
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row v-else>
                                <v-col cols="12">
                                    <v-text-field readonly label="Nome Completo" :value="name" />
                                </v-col>

                                <v-col cols="6">
                                    <v-text-field readonly label="Login" :value="login" />
                                </v-col>

                                <v-col cols="6">
                                    <v-text-field readonly label="Curso" :value="course" />
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field readonly label="Email" :value="email" />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </material-card>
            </v-col>

            <v-snackbar v-model="snackbarVisible" v-if="isEditProfileAllowed" multi-line>
                {{ message }}

                <template v-slot:action="{ attrs }">
                    <v-btn color="red" text v-bind="attrs" @click="snackbarVisible = false">
                        Fechar
                    </v-btn>
                </template>
            </v-snackbar>
            <v-col cols="12" md="4" v-else>
                <app-card class="mt-4 text-center">
                    <v-icon class="information-icon">
                        mdi-information-outline
                    </v-icon>

                    <v-card-text class="text-center">
                        <h6 class="text-h6 mb-2 text--secondary">
                            Importante
                        </h6>

                        <p class="text--secondary">
                            <span class="d-block">Todas as informação exibidas aqui são obtidas diretamente da Base Centralizada da UFC Quixadá.</span>
                            <span class="d-block mt-2">Para realizar qualquer modificação nessas informações, é necessário fazer login e realizar essa operação diretamente naquele sistema. </span>
                            <span class="d-block mt-2">Essa informação será refletida aqui após o próximo login. </span>
                        </p>

                        <v-btn class="mr-0" color="primary" min-width="100" rounded @click="goToBaseCentralizada">
                            Acessar Base Centralizada
                        </v-btn>
                    </v-card-text>
                </app-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { get, dispatch } from 'vuex-pathify';
    import { required, minLength, email } from 'vuelidate/lib/validators';

  export default { 
    name: 'UserProfileView',
    data () {
        return {
            name: '',
            login: '',
            course: '',
            email: '',
            hasError: false,
            errorMessage: '',
            snackbarVisible: false,
            message: '',
        }
    },
    computed: {
        isEditProfileAllowed: get('authentication/isEditProfileAllowed'),
        courses: get('courses/all'),
        nameErrors: function() {
            const errors = [];

            if (!this.$v.name.$dirty) {
                return errors;
            }

            if (!this.$v.name.required) {
                errors.push("Informe o nome do coordenador");
            }

            if (!this.$v.name.minLength) {
                errors.push("Informe no mínimo 4 caracteres");
            }

            return errors;
        },
        loginErrors: function() {
            const errors = [];

            if (!this.$v.login.$dirty) {
                return errors;
            }

            if (!this.$v.login.required) {
                errors.push("Informe o login do coordenador");
            }

            if (!this.$v.login.minLength) {
                errors.push("Informe no mínimo 4 caracteres");
            }

            return errors;
        },
        emailErrors: function() {
            const errors = [];

            if (!this.$v.email.$dirty) {
                return errors;
            }

            if (!this.$v.email.required) {
                errors.push("Informe o email do coordenador");
            }

            if (!this.$v.email.email) {
                errors.push("Informe um email válido");
            }

            return errors;
        },
        courseErrors: function() {
            const errors = [];

            if (!this.$v.course.$dirty) {
                return errors;
            }

            if (!this.$v.course.required) {
                errors.push("Informe pelo menos 1 curso");
            }

            return errors;
        },
    },
    mounted() {
        dispatch('user/getUserProfile')
            .then((userProfile) => {
                this.initialize(userProfile);
            });
    },
    methods: {
        initialize: function (userProfile) {
            this.name = userProfile.name;
            this.login = userProfile.login;
            this.course = userProfile.course;
            this.email = userProfile.email;
        },
        goToBaseCentralizada: function () {
            window.open('https://identidadepessoa.quixada.ufc.br', '_blank');
        },
        saveCoordinator: function () {
            this.$v.$reset();
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            this.hasError = false;

            const coordinatorToUpdate = {
                name: this.name,
                login: this.login,
                course: this.course,
                email: this.email,
            };

            dispatch('user/updateProfile', coordinatorToUpdate)
                .then(() => {
                    this.message = 'Dados salvos com sucesso!';
                    this.snackbarVisible = true;
                })
                .catch((e) => {
                    this.hasError = true;
                    this.errorMessage = e.message;
                });
        }
    },
    validations: {
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
    },
}
</script>

<style scoped lang="scss">
    .information-icon {
        font-size: 70px !important;
    }
    .select-courses::v-deep .v-chip {
        background-color: #1976d2 !important;
        color: white !important;

        button {
            color: white;
        }
    }
</style>

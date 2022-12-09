<template>
    <v-app id="login">
        <v-main>
            <v-container fluid fill-height>
                <v-layout row wrap fill-height>
                    <v-flex lg6>
                        <v-layout row wrap fill-height>
                            <v-flex lg12 xs12 align-self-end>
                                <v-card-text>
                                    <h1 class="flex my-3 font-weight-bold">
                                        Solicitação e Acompanhamento do Processo de Aproveitamento de Estágio-Empresa
                                    </h1>
                                    <h4 class="text-xs-justify font-weight-light">
                                    </h4>
                                </v-card-text>
                            </v-flex>
                            <v-flex lg12 xs12 align-self-end>
                                <img id="img-home" src="/static/background.png" alt="Plano de fundo">
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex lg4 offset-lg2>
                        <v-layout row wrap fill-height>
                            <v-flex lg12 align-self-end>
                                <v-form @submit.prevent="onSubmit">
                                    <v-card-text>
                                        <div class="layout column text-xs-center">
                                            <h1 class="flex my-4 headline font-weight-bold">Acesso ao Sistema</h1>
                                            <span class="body-1 red--text">{{error}}</span>
                                        </div>

                                        <v-text-field append-icon="person" name="login" label="Login" type="text" v-model="login"></v-text-field>
                                        <v-text-field append-icon="lock" name="password" label="Senha" id="password" type="password" v-model="password"></v-text-field>

                                        <p>
                                            Utilize as mesmas credenciais cadastradas na <a href="https://identidadepessoa.quixada.ufc.br/" target="_blank">Base Centralizada.</a>
                                        </p>

                                        <div class="text-xs-center">
                                            <v-btn color="secondary" type="submit" :loading="loading" large>Entrar</v-btn>
                                        </div>
                                    </v-card-text>
                                    
                                </v-form>
                            </v-flex>
                            <v-flex lg12 align-self-end>
                                <v-layout row wrap fill-height>
                                    <v-flex lg6 class="text-xs-center" align-end>
                                        <img id="logo-ufc" src="/static/logo-ufc.png" alt="Logo UFC">
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
    import { get, dispatch } from 'vuex-pathify';

    export default {
        name: 'LoginView',
        data () {
            return {
                loading: false,
                login: '',
                password: '',
                error: ''
            }
        },
        methods: {
            onSubmit () {
                this.loading = true;
                dispatch('authentication/login', { login: this.login, password: this.password })
                    .then(() => {
                        this.loading = false;
                        if (get('authentication/isAuthenticated')) {
                            this.$router.push('/')
                        }
                    }).catch((e) => {
                        this.error = e.message;
                        this.loading = false;
                    });
            }
        }
    };
</script>

<style scoped lang="css">
    #logo-ufc{
        max-width: 230px;
    }

    #img-home {
        max-width: 80%;
    }
</style>

<template>
    <app-card class="mt-4 text-center">
        <v-alert shaped prominent type="error" elevation="3" transition="fade-transition" v-if="hasError">
            {{ errorMessage }}
        </v-alert>

        <v-icon class="information-icon">
            mdi-information-outline
        </v-icon>

        <v-card-text class="text-center">
            <h6 class="text-h6 mb-2 text--secondary">
                Importante
            </h6>

            <p class="text--secondary">
                <span class="d-block">
                    É necessário solicitar matrícula na atividade de Estágio Supervisionado 1 ou 2 no SIGAA, ainda no período de solicitação de matrícula em disciplinas. 
                    Em caso de dúvida, entrar em contato através do e-mail <a href="mailto:estagioquixada@ufc.br">estagioquixada@ufc.br</a>.
                </span>

                <span class="d-block mt-3 font-weight-bold">
                    Mesmo que você ainda não tenha um estágio já definido, mas tenha a intenção de estagiar durante o próximo período letivo, deve solicitar a matrícula. 
                </span>

                <span class="d-block mt-3">
                    Caso o estágio não se concretize, você pode solicitar a supressão do estágio até o prazo de trancamento de disciplinas. 
                    Nesse caso de supressão do estágio, não haverá reprovação no estágio e o IRA não será afetado.
                </span>
            </p>

            <div class="text-left">
                <p class="font-weight-bold">
                    Requisitos Mínimos para estágio supervisionado:
                </p>
                <ul>
                    <li>Ter matrícula ativa e frequência em disciplinas.</li>
                    <li>As atividades de Estágio Supervisionado devem ter:.</li>
                    <ul>
                        <li>Carga horária mínima de 160 horas</li>
                        <li>Período mínimo de 4 meses de atividade</li>
                    </ul>
                </ul>
            </div>

            <v-btn color="primary" rounded @click="confirmSigaaRegistration">
                <v-icon class="mr-1">
                    mdi-check-outline
                </v-icon>

                Já realizei minha matricula no SIGAA
            </v-btn>
        </v-card-text>
    </app-card>
</template>

<script>
    import { dispatch } from 'vuex-pathify';

    export default {
        name: 'SigaaRegistration',
        data () {
            return {
                hasError: false,
                errorMessage: ''
            };
        },
        methods: {
            confirmSigaaRegistration () {
                this.hasError = false;

                dispatch('process/confirmSigaaRegistration')
                    .catch((e) => {
                        this.hasError = true;
                        this.errorMessage = e.message;
                    });
            }
        }
    }
</script>

<style scoped>

</style>

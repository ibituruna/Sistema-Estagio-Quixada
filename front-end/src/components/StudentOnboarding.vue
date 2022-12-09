<template>
    <v-card flat tile>
        <v-window class="elevation-1" v-model="onboarding">
            <v-window-item v-for="(item, index) in items" :key="`card-${index}`">
                <v-card class="items px-4 py-3" flat>
                    <p class="font-weight-bold">
                        {{ item.title }}
                    </p> 
                    <v-row align="center" justify="center">                        
                        <v-card-text v-html="item.content"></v-card-text>
                    </v-row>
                </v-card>
            </v-window-item>
        </v-window>
  
        <v-card-actions class="justify-space-between">
            <v-btn @click="prev" text>
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <v-item-group v-model="onboarding" class="text-center" mandatory>
                <v-item v-for="(item, index) in items" :key="`btn-${index}`" v-slot="{ active, toggle }">
                    <v-btn :input-value="active" @click="toggle" icon>
                        <v-icon>mdi-record</v-icon>
                    </v-btn>
                </v-item>
            </v-item-group>
        
            <v-btn @click="next" text>
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </v-card-actions>

        <v-row class="mt-3 justify-center">
            <v-btn color="primary" text @click="goToProcess">
                Iniciar/Continuar processo de estágio
            </v-btn>
        </v-row>
    </v-card>
</template>

<script>
    const marked = require('marked');

    import fluxoGeral from "@/articles/fluxo-geral.md";
    import passos from "@/articles/passo-a-passo.md";
    import cronograma from "@/articles/cronograma.md";

    export default {
        name: 'StudentOnboarding',
        data () {
            return {
                items: [
                    {
                        title: 'Processo de acompanhamento de estágio',
                        content: marked.parse(fluxoGeral),
                    },
                    {
                        title: 'Passos para cumprir a atividade obrigatória de estágio supervisionado 1 ou 2',
                        content: marked.parse(passos),
                    },
                    {
                        title: 'Cronograma de Estágio em 2022.2',
                        content: marked.parse(cronograma),
                    },
                ],         
                onboarding: 0,
            }
        },
        methods: {
            next () {
                this.onboarding = this.onboarding + 1 === this.length ? 0 : this.onboarding + 1
            },
            prev () {
                this.onboarding = this.onboarding - 1 < 0 ? this.length - 1 : this.onboarding - 1
            },
            goToProcess () {
                this.$router.push({ path: '/process' });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .v-card__text::v-deep  {
        table {
            border-collapse: collapse;
            width: 100%;
        }

        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
    }
</style>

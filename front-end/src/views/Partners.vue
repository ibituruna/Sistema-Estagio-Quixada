<template>
    <v-container id="partners" fluidtag="section">
        <v-container style="height: 400px;" v-if="loading">
            <v-row class="fill-height" align-content="center" justify="center">
                <v-col class="text-subtitle-1 text-center" cols="12">
                    Carregando módulo de busca de convênios do SIGAA
                </v-col>
                <v-col cols="12">
                    <div class="text-center">
                        <v-progress-circular :size="50" :width="4" color="primary" indeterminate>
                        </v-progress-circular>
                    </div>
                </v-col>
            </v-row>
        </v-container>
        <iframe src="https://si3.ufc.br/sigaa/public/estagio/lista.jsf" :class="{'d-none': loading}"  @load="iframeLoaded" 
           title="Lista de Convenios de Estágio UFC" height="500px" width="100%"> 
        </iframe>

        <a href="https://estagios.ufc.br/pt/convenios/" target="_blank" rel="noopener noreferrer">Veja mais informações sobre convênios para estágio</a>
    </v-container>
</template>

<script>
  export default {
    name: 'PartnersView',
    data () {
        return {
            loading: true
        }
    },
    methods: {
        iframeLoaded: function () {
            this.loading = false;
        }
    }
  }
</script>

<style scoped>
  iframe {
    height: 100vh,
  }
</style>

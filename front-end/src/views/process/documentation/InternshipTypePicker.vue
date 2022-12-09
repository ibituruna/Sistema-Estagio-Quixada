<template>
    <v-card class="mx-auto mb-2" max-width="450px">
        <v-alert shaped prominent type="error" elevation="3" transition="fade-transition" v-if="hasError">
            {{ errorMessage }}
        </v-alert>

        <v-card-title class="justify-center">
            Qual tipo de estágio você irá realizar?
        </v-card-title>

        <v-card-actions>
            <v-btn color="primary" text @click="setInternshipType('convencional')">
                <v-icon class="mr-1">
                    mdi-check-outline
                </v-icon>

                Estágio Convencional
            </v-btn>

            <v-btn color="primary" text @click="setInternshipType('clt_pj')">
                <v-icon class="mr-1">
                    mdi-file-sign
                </v-icon>

                Contrato CLT / PJ
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import { dispatch } from 'vuex-pathify';
    export default {
        name: 'InternshipTypePicker',
        data () {
            return {
                hasError: false,
                errorMessage: ''
            };
        },
        methods: {
            setInternshipType (intershipType) {
                this.hasError = false;

                dispatch('process/setInternshipType', intershipType)
                    .catch((e) => {
                        this.hasError = true;
                        this.errorMessage = e.message;
                    });
            },
        }
    }
</script>

<style scoped>

</style>

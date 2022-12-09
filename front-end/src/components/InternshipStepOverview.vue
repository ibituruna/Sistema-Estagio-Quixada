<template>
    <div>
        <v-stepper :value="steps.length + 1" vertical>
            <internship-step 
                v-for="(step, i) in steps" 
                :key="`internship-step-${step.key}-${i}`"
                :step="i + 1"
                :heading="step.heading"
                :completedDate="internshipStep[step.completedDateKey]"
                :isCompleted="internshipStep[step.key]"
            />

            <slot />

            <v-row class="internship-step-actions" v-if="hasDocumentation">
                <v-col cols="12" class="justify-center">
                    <v-btn color="orange" class="mb-2 white--text" @click="goToFile" small v-if="internshipStep.isSubmitted">
                        <v-icon class="mr-1">
                            mdi-file
                        </v-icon>

                        Visualizar Documentação
                    </v-btn>

                    <v-btn color="green" class="white--text" @click="approveDocumentation" small v-if="!internshipStep.isApproved">
                        <v-icon class="mr-1">
                            mdi-check
                        </v-icon>

                        Aprovar Documentação
                    </v-btn>
                </v-col>
            </v-row>
        </v-stepper>
    </div>
</template>

<script>
    export default {
        name: "InternshipStepOverview",
        computed: {
            hasDocumentation() {
                return !!this.internshipStep.documentPath;
            },
        },
        props: {
            internshipStep: {
                type: Object,
                required: true,
                default: () => ({}),
            },
            steps: {
                type: Array,
                default: () => {
                    return [
                        { heading: 'Envio da Documentação para Análise da Coordenação', key: 'isSubmitted', completedDateKey: 'documentSubmittedDate' },
                        { heading: 'Aprovação da Coordenação', key: 'isApproved', completedDateKey: 'documentApprovedDate'},
                    ];
                },
            }
        },
        methods: {
            goToFile() {
                this.$emit('viewDocumention', { filePath: this.internshipStep.documentPath });
            },
            approveDocumentation() {
                this.$emit('approveDocumentation');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .internship-step-actions {
        button {
            width: 100%
        }
    }
</style>

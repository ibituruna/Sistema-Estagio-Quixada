<template>
    <v-stepper-step :step="step" color="secondary" :complete="isCompleted">
            {{ heading }}
            
            <p class="mb-0 mt-1">
                <small>
                    <span v-if="isCompleted">
                        Concluído em {{ $moment(completedDate).format('DD/MM/YYYY') }}
                    </span>
                    <span v-else>
                        (Aguardando)
                    </span>
                </small>
            </p>

        <template #subheading v-if="hasSubHeading">
            <small>
                <v-btn color="primary" text @click="doSubHeadingAction">
                    {{ subHeading }}
                </v-btn>
            </small>
        </template>

    </v-stepper-step>

</template>

<script>
    export default {
        name: "InternshipStep",
        computed: {
            hasSubHeading () {
                return !!(
                    this.subHeading ||
                    this.$slots.subheading
                );
            },
        },
        props: {
            step: {
                type: Number,
                required: true,
            },
            heading:  {
                type: String,
                required: true,
            },
            subheading: String,
            isCompleted: Boolean,
            completedDate: String
        },
        methods: {
            doSubHeadingAction () {
                this.$emit('onSubHeadingClick');
            },
        }
    }
</script>

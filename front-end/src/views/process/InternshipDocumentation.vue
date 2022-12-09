<template>
    <internship-type-picker v-if="!intershipType" />
    <internship-documentation-convencional-overview v-else-if="intershipType === 'convencional'" />
    <internship-clt-pj-form v-else />
</template>

<script>
    import { get } from 'vuex-pathify';
    export default {
        name: 'InternshipDocumentation',
        components: {
            InternshipTypePicker: () => import(
                /* webpackChunkName: "internship-type-picker" */
                './documentation/InternshipTypePicker'
            ),
            InternshipCltPjForm: () => import(
                /* webpackChunkName: "internship-clt-pj-form" */
                './documentation/InternshipCltPjForm'
            ),
            InternshipDocumentationConvencionalOverview: () => import(
                /* webpackChunkName: "internship-documentation-convencional-overview" */
                './overview/InternshipDocumentationConvencionalOverview'
            ),
        },
        computed: {
            intershipType: get('process/process@type'),
        },
    }
</script>

<style scoped>

</style>

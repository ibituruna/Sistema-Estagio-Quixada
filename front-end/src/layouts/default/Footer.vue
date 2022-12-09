<template>
    <v-footer id="default-footer" color="grey lighten-2" absolute app inset>
        <links />
    </v-footer>
</template>

<script>
    // Components
    import Links from '@/components/LinksComponent'

    export default {
        name: 'DefaultFooter',
        components: { Links },
    }
</script>

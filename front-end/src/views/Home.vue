<template>
    <student-onboarding v-if="isStudent" />
    <coordinator-onboarding v-else />
</template>

<script>
    import { getUserRoles } from '@/helpers/userHelpers';

    export default {
        name: 'HomePage',
        components: {
            StudentOnboarding: () => import(
                /* webpackChunkName: "student-onboarding" */
                '@/components/StudentOnboarding'
            ),
            CoordinatorOnboarding: () => import(
                /* webpackChunkName: "coordinator-onboarding" */
                '@/components/CoordinatorOnboarding'
            )
        },
        data () {
            return {
                isStudent: true,
            }
        },
        mounted() {
            const userRoles = getUserRoles();

            this.isStudent = userRoles && userRoles[0] === 'student';
        }
    }
</script>

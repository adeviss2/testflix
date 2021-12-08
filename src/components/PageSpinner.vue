<template>
<div v-if="show" class="opacity-75" style="position: fixed; top: 0; left: 0; z-index: 1101; width: 100vw; height: 100vh; background-color: #000;">
    <div class="text-center position-absolute" style="top: calc(50% - 50px); left: calc(50% - 50px); z-index: 1102;">
        <ProgressSpinner size="lg" type="grow" color="primary"/>
    </div>
</div>
<ScrollTop />
</template>

<script>
import ProgressSpinner from 'primevue/progressspinner';
import BlockUI from 'primevue/blockui';
import ScrollTop from 'primevue/scrolltop';
import { watch, onMounted } from 'vue';

export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        }
    },
    components: { ProgressSpinner, BlockUI, ScrollTop },
    
    setup(props) {
        const showprop = props.show;
        onMounted(() => {
            if(showprop === true) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        watch(() => props.show, (sh) => {
            if(sh === true) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        })
    },
}
</script>

<style lang="scss" scoped>

</style>
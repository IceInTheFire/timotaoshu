<template>
    <div>
        <img :src="img" :style="{right:right? ((right + 100) + 'px') : 'auto' , top: top ? ((top-100) + 'px') : '100px'}" class="wb-img">
    </div>
</template>
<style>
    .wb-img{
        position: fixed;
        max-width: 60%;
        max-height: 80%;
        z-index: 1000;
        top:100px;
    }
</style>
<script type="text/ecmascript-6">
    export default {
        props:['img', 'right', 'top'],
        name: "wb-img",
        data() {
            return {
            }
        },
        computed: {},
        methods: {},
        components: {},
        created() {

        },
        mounted() {
        },
        beforeDestroy() {

        },
        destroyed() {
        },
    }
</script>

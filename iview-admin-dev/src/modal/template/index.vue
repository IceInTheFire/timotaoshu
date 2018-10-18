<template>
    <div>
        <Modal v-model="modal.showModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" class="modal-header-color">模板</h3>
            <div slot="footer">
                <Button type="text" @click="onClickCancel">取消</Button>
                <Button type="primary" :loading="loading" @click="onClickSave">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less">

</style>
<script type="text/ecmascript-6">
    export default {
        name: "edit-role",
        props:{
            modal: {
                type: Object,
                default: {showModal:false}
            },
        },
        data() {
            return {
                loading:false,
            }
        },
        computed: {},
        methods: {
            onClickCancel(){
                this.modal.showModal = false;
            },
            onClickSave(){
                this.modal.showModal = false;
            }
        },
        components: {},
        created() {

        },
        mounted() {
        },
        beforeDestroy() {

        },
        destroyed() {
        },
        activated() {

        },
        deactivated() {

        }
    }
</script>

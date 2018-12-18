<template>
    <div>
        <!--:closable  启用右上角关闭（含Esc键）-->
        <!--mask-closable  启用遮罩层关闭-->
        <Modal v-model="modal.showModal" :closable='false' :mask-closable='true' :width="500" @on-cancel="onClickCancel">
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
        name: "edit-template",
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
            this.$on('reset', (data) => {
                console.log(data);
                console.log("初始化");
            });
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

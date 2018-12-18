<template>
    <layout>
        <edit-staff :modal="modal" v-on:getStaffList="getStaffList" ref="editStaff"></edit-staff>
        <Card>
            <Row>
                <Col span="12" class="tl">
                    <Button type="primary" :disabled="loading" @click="onClickAddStaff">新增职员</Button>
                </Col>
                <Col span="12" class="tr">
                    <span>批量操作：</span>
                    <Button type="primary" :disabled="loading" @click="onClickDel()">删除职员</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="staffList" ref="table" @on-selection-change="onClickSelect"></Table>
        </Card>
        <Card shadow>
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="getStaffList"></Page>
        </Card>
    </layout>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less">

</style>
<script type="text/ecmascript-6">
    import editStaff from 'modal/permission/editStaff.vue';
    import util from "util";
    export default {
        name: "staff",
        data() {
            return {
                loading:false,
                columns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'id',
                        key: 'id'
                    },
                    {
                        title: '职员花名',
                        key: 'name',
                    },
                    {
                        title: '权限',
                        key: 'roleName',
                    },
                    {
                        title: '操作',
                        key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);'
                                    },
                                    on:{
                                        click: () => {
                                            this.$refs.editStaff.$emit('reset', params.row);
                                            this.modal.showModal = true;
                                        }
                                    }
                                }, `编辑`),
                                h('a', {
                                    attrs:{
                                        href:'javascript:void(0);',
                                        style:`margin-left:10px;`
                                    },
                                    on:{
                                        click: () => {
                                            this.onClickDel(params.row.id);
                                        }
                                    }
                                }, `删除`),
                            ])
                        }
                    }
                ],
                staffList:[],
                params:{
                    page:1,
                    limit:20
                },
                total:0,
                modal:{
                    showModal:false
                },
                selection:[]
            }
        },
        computed: {},
        methods: {
            getStaffList(page) {
                if(this.loading) return;
                if(!page) page = 1;
                let obj = {
                    params:{
                        page: this.params.page,
                        limit: this.params.limit
                    }
                };
                this.loading = true;
                util.post.permission.staffList(obj).then((data) => {
                    this.loading = false;
                    this.total = data.count;
                    this.staffList = data.userList;
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickAddStaff(){
                this.$refs.editStaff.$emit('reset');
                this.modal.showModal = true;
            },
            onClickDel(ids){
                if(this.loading) return;
                if(!ids) {
                    let idArr = [];
                    this.selection.forEach((value, index) => {
                        idArr.push(value.id);
                    });
                    ids = idArr.join(',');
                }
                if(!ids) {
                    this.$Message.info("请选择");
                    return;
                }
                let obj = {
                    params:{ids:ids}
                };
                this.loading = true;
                util.post.permission.delStaff(obj).then((data) => {
                    this.loading = false;
                    this.getStaffList();
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickSelect(selection){
                this.selection = selection;
            }
        },
        components: {
            editStaff
        },
        created() {

        },
        mounted() {
            this.getStaffList();
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

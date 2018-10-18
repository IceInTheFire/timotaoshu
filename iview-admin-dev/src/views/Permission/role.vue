<template>
    <layout>
        <edit-role :modal="modal" v-on:getRoleList="getRoleList"></edit-role>
        <Card>
            <Row>
                <Col span="12" class="tl">
                    <Button type="primary" :disabled="loading" @click="onClickAddRole">新增角色</Button>
                </Col>
                <Col span="12" class="tr">
                    <span>批量操作：</span>
                    <Button type="primary" :disabled="loading" @click="onClickDel()">删除角色</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="roleList" ref="table" @on-selection-change="onClickSelect"></Table>
        </Card>
        <Card shadow>
            <Page :current="params.page" :page-size="params.limit" :total="total" show-total show-elevator @on-change="getRoleList"></Page>
        </Card>
    </layout>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less">

</style>
<script type="text/ecmascript-6">
    import editRole from 'modal/permission/editRole.vue';
    import util from "util";
    export default {
        name: "role",
        data() {
            return {
                columns: [
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
                        title: '角色',
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
                                            this.$children[0].$children[0].$emit('reset',params.row);
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
                loading: false,
                roleList: [],
                params: {
                    page:1,
                    limit:20
                },
                total:30,
                selection:[],
                modal:{
                    showModal:false
                }
            }
        },
        computed: {},
        methods: {
            getRoleList(page) {
                if(this.loading) return;
                if(!page) page = 1;
                let obj = {
                    params:{
                        page: this.params.page,
                        limit: this.params.limit
                    }
                };
                this.loading = true;
                util.post.permission.roleList(obj).then((data) => {
                    this.loading = false;
                    this.total = data.count;
                    this.roleList = data.roleList;
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickAddRole() {
                this.$children[0].$children[0].$emit('reset',null);
                this.modal.showModal = true;
            },
            onClickDel(ids) {
                if(this.loading) return;
                if(!ids) {
                    let idArr = [];
                    this.selection.forEach((value, index) => {
                        idArr.push(value.id);
                    });
                    ids = idArr.join(',');
                }
                let obj = {
                    params:{ids:ids}
                };
                this.loading = true;
                util.post.permission.delRole(obj).then((data) => {
                    this.loading = false;
                    this.getRoleList();
                }).catch((err) => {
                    this.loading = false;
                });
            },
            onClickSelect(selection){       //check选择框选中
                this.selection = selection;
            }
        },
        components: {
            editRole
        },
        created() {

        },
        mounted() {
            this.getRoleList();
            // this.$on('getRoleList', () => {
            //     this.getRoleList();
            // });
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

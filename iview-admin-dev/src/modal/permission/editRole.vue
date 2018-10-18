<template>
    <div>
        <Modal v-model="modal.showModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" class="modal-header-color">{{isAdd?"新增角色":"编辑角色"}}</h3>
            <Form ref="roleForm" :model="role" :label-width="100" label-position="right" :rules="rules">
                <Form-item label="角色名称" prop="roleName" >
                    <Input v-model="role.roleName" placeholder="请输入角色名称" ></Input>
                </Form-item>
                <Form-item label="选择菜单" >
                    <Tree :data="role.permission" show-checkbox @on-check-change="onCheckChange" ></Tree>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button type="text"  @click="onClickCancel">取消</Button>
                <Button type="primary" :loading="loading" @click="onClickSave">{{isAdd?"新增":"保存"}}</Button>
            </div>
        </Modal>
    </div>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less">

</style>
<script type="text/ecmascript-6">
    import util from "util"
    export default {
        name: "edit-role",
        props:{
            modal: {
                type: Object,
                default: {
                    showModal:true
                }
            },
        },
        data() {
            return {
                loading:false,
                oldPassError: '',
                rules: {
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ]
                },
                role:{
                    roleName:'',
                    permission:[],
                    id:null
                },
                baseData: [],
                selection:[],
                isAdd:true
            }
        },
        computed: {},
        methods: {
            onClickCancel(){
                this.modal.showModal = false;
            },
            onClickSave(){
                this.$refs['roleForm'].validate((valid) => {
                    if(valid) {
                        if(this.loading) return;
                        // this.modal.showModal = false;
                        let moduleArr = [];
                        let selectArr = [];
                        this.selection.forEach((value, index) => {
                            if(!value.id) return;
                            let id = value.id + '';
                            let moduleNum = id.substr(0, id.length - 3)
                            if(moduleArr.indexOf(moduleNum + "000") == -1) {
                                moduleArr.push(moduleNum + "000");
                            };
                            selectArr.push(id);
                        });

                        if(this.isAdd) {
                            let obj = {
                                params:{
                                    roleName: this.role.roleName,
                                    permission: (moduleArr.concat(selectArr)).join(',')
                                }
                            };
                            this.loading = true;
                            util.post.permission.addRole(obj).then((data) => {
                                this.loading = false;
                                this.modal.showModal = false;
                                this.$emit("getRoleList");  //调用父组件的方法
                            }).catch((err) => {
                                this.loading = false;
                            });
                        } else {
                            let obj = {
                                params:{
                                    roleName: this.role.roleName,
                                    permission: (moduleArr.concat(selectArr)).join(','),
                                    id:this.role.id
                                }
                            };
                            this.loading = true;
                            util.post.permission.editRole(obj).then((data) => {
                                this.loading = false;
                                this.modal.showModal = false;
                                this.$emit("getRoleList");  //调用父组件的方法
                            }).catch((err) => {
                                this.loading = false;
                            });
                        }
                    }
                });
            },
            onCheckChange(selection){
                this.selection = selection;
            },
            getList(){
                let obj = {
                    params:{}
                };
                util.post.permission.list(obj).then((data) => {
                    this.baseData  = data;
                    this.role.permission = JSON.parse(JSON.stringify(this.baseData));
                }).catch((err) => {

                });
            },
            editInitPermission(permission, permissionArr){
                permission.forEach((value, index) => {
                    if(value.children) {
                        this.editInitPermission(value.children, permissionArr);
                    } else {
                        if(permissionArr.indexOf('all') != -1 || permissionArr.indexOf(value.id + "") != -1){
                            value.checked = true;
                        }
                    }
                });
            }
        },
        components: {},
        created() {
            this.getList();
        },
        mounted() {
            this.$on('reset', (data) => {
                if(!data) {
                    this.role.permission = JSON.parse(JSON.stringify(this.baseData));
                    this.role.roleName = "";
                    this.role.id = null;
                    this.isAdd = true;
                } else {
                    this.role.roleName = data.roleName
                    this.role.id = data.id;
                    let permission = JSON.parse(JSON.stringify(this.baseData));
                    let permissionArr = data.permission.split(',');
                    this.editInitPermission(permission, permissionArr);
                    this.role.permission = permission;
                    this.isAdd = false;
                }
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

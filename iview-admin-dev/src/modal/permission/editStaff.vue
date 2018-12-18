<template>
    <Modal v-model="modal.showModal" :closable='false' :mask-closable='true' :width="500" @on-cancel="onClickCancel">
        <h3 slot="header" class="modal-header-color">{{isAdd?"新增":"编辑"}}职员</h3>
        <Form ref="staffFrom" :model="staff" :label-width="100" label-position="right" :rules="rules">
            <Form-item label="职员花名" prop="staffName">
                <Input v-model="staff.staffName" placeholder="请输入职员花名"></Input>
            </Form-item>
            <Form-item label="职员手机" prop="staffMobile">
                <Input v-model="staff.staffMobile" placeholder="请输入职员号码"></Input>
            </Form-item>
            <Form-item label="职员密码" prop="staffPwd">
                <Input v-model="staff.staffPwd" placeholder="请输入职员密码，如若不填，默认密码为123456"></Input>
            </Form-item>
            <Form-item label="职员权限" prop="roleId" >
                <Select v-model="staff.roleId" placeholder="请选择职员权限">
                    <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
                </Select>
            </Form-item>
        </Form>
        <div slot="footer">
            <Button type="text"  @click="onClickCancel">取消</Button>
            <Button type="primary" :loading="loading" @click="onClickSave">{{isAdd?"新增":"保存"}}</Button>
        </div>
    </Modal>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less">

</style>
<script type="text/ecmascript-6">
    import util from "util"
    import crypto from 'crypto'
    export default {
        name: "edit-staff",
        props:{
            modal: {
                type: Object,
                default: {
                    showModal:true
                }
            },
        },
        data() {
            const validatePhone = (rule, value, callback) => {
                // if (!value) {
                //     return callback(new Error('请输入手机号码'));
                // }
                var reg = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
                if(reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('手机号码格式错误'));
                }

                // // 模拟异步验证效果
                // setTimeout(() => {
                //     if (!Number.isInteger(value)) {
                //         callback(new Error('请输入数字值'));
                //     } else {
                //         if (value < 18) {
                //             callback(new Error('必须年满18岁'));
                //         } else {
                //             callback();
                //         }
                //     }
                // }, 1000);
            };
            const validateRoleId = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择职员权限'));
                }
                return callback();
            };
            return {
                loading:false,
                rules: {
                    staffName: [
                        { required: true, message: '请输入职员花名', trigger: 'blur' }
                    ],
                    staffMobile:[
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { validator: validatePhone, message: '手机号码格式错误', trigger: 'blur' }
                    ],
                    staffPwd:[
                        { required: true, message: '请输入职员密码', trigger: 'blur' }
                    ],
                    roleId:[
                        // { required: true, message: '请选择职员权限', trigger: 'blur' },
                        { validator: validateRoleId, required:true, message: '请选择职员权限', trigger: 'blur' }
                    ]
                },
                staff:{
                    staffName:'',
                    staffPwd:'123456',
                    staffMobile:'',
                    roleId:'',
                    id:''
                },
                baseData: [],
                selection:[],
                isAdd:true,
                staffList:[],
                roleList:[]
            }
        },
        computed: {},
        methods: {
            onClickCancel(){
                this.modal.showModal = false;
            },
            onClickSave(){
                this.$refs['staffFrom'].validate((valid) => {
                    if(valid) {
                        let obj = {
                            params:{
                                name: this.staff.staffName,
                                pwd: this.getSha1(this.staff.staffPwd),
                                mobile: this.staff.staffMobile,
                                roleId: this.staff.roleId,
                            }
                        };
                        if(this.isAdd) {
                            this.loading = true;
                            util.post.permission.addStaff(obj).then((data) => {
                                this.loading = false;
                                this.modal.showModal = false;
                                this.$emit("getStaffList");  //调用父组件的方法
                            }).catch((err) => {
                                this.loading = false;
                            });
                        } else {
                            obj.params.id = this.staff.id;
                            this.loading = true;
                            util.post.permission.editStaff(obj).then((data) => {
                                this.loading = false;
                                this.modal.showModal = false;
                                this.$emit("getStaffList");  //调用父组件的方法
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
            getRoleList(){
                let obj = {
                    params:{
                        limit:100
                    }
                };
                util.post.permission.roleList(obj).then((data) => {
                   this.roleList = data.roleList;
                }).catch((err) => {

                });
            },
            eitdInitPermission(permission, permissionArr){
                permission.forEach((value, index) => {
                    if(value.children) {
                        this.eitdInitPermission(value.children, permissionArr);
                    } else {
                        if(permissionArr.indexOf(value.id + "") != -1){
                            value.checked = true;
                        }
                    }
                });
            },
            getSha1(str){
                try{
                    var sha1 = crypto.createHash("sha1");
                    sha1.update(str);
                    return sha1.digest('hex');
                }catch(err) {
                    console.log(err);
                }
            }
        },
        components: {},
        created() {
            this.getRoleList();
        },
        mounted() {
            this.$on('reset', (data) => {
                if(!data) {
                    this.staff.staffName = "";
                    this.staff.staffPwd = "";
                    this.staff.staffMobile = "";
                    this.staff.roleId = null;
                    this.isAdd = true;
                } else {
                    this.staff.staffName = data.name;
                    this.staff.staffPwd = "";
                    this.staff.staffMobile = data.mobile;
                    this.staff.roleId = data.roleId;
                    this.staff.id = data.id;
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

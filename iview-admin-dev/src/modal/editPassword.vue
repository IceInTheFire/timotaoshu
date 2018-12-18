<template>
    <Modal v-model="editPasswordModal.editPasswordModal" :closable='false' :mask-closable='false' :width="500">
        <h3 slot="header" class="modal-header-color">修改密码</h3>
        <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
            <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码"  type="password" @keyup.native.13="saveEditPass"></Input>
            </FormItem>
            <FormItem label="新密码" prop="newPass">
                <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" type="password" @keyup.native.13="saveEditPass"></Input>
            </FormItem>
            <FormItem label="确认新密码" prop="rePass">
                <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" type="password" @keyup.native.13="saveEditPass"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="cancelEditPass">取消</Button>
            <Button type="primary" :loading="loading" @click="saveEditPass">保存</Button>
        </div>
    </Modal>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less">

</style>
<script type="text/ecmascript-6">
    import util from "util";
    import crypto from 'crypto';
    export default {
        name: "edit-password",
        props:{
            editPasswordModal: {
                type: Object,
                default: {editPasswordModal: true}
            },
        },
        data() {
            const valideRePassword = (rule, value, callback) => {
                if (value !== this.editPasswordForm.newPass) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                editPasswordForm: {
                    oldPass: '',
                    newPass: '',
                    rePass: ''
                },
                oldPassError: '',
                passwordValidate: {
                    oldPass: [
                        { required: true, message: '请输入原密码', trigger: 'blur' }
                    ],
                    newPass: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                        { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                    ],
                    rePass: [
                        { required: true, message: '请再次输入新密码', trigger: 'blur' },
                        { validator: valideRePassword, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            loading() {
                return this.$store.state.loading.loading;
            }
        },
        methods: {
            saveEditPass () {
                this.$refs['editPasswordForm'].validate((valid) => {
                    if (valid) {
                        let obj = {
                            params:{
                                oldPass: this.getsha1(this.editPasswordForm.oldPass),
                                newPass: this.getsha1(this.editPasswordForm.newPass),
                                rePass: this.getsha1(this.editPasswordForm.rePass)
                            }
                        };
                        console.log(obj);
                        util.post.editPassword(obj).then(() => {
                            this.$Message.success('密码修改成功');
                            this.cancelEditPass();
                        });
                    }
                });
            },
            cancelEditPass () {
                this.editPasswordModal.editPasswordModal = false;
            },
            getsha1(str){
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

        },
        mounted() {
        },
        beforeDestroy() {

        },
        destroyed() {
        }
    }
</script>

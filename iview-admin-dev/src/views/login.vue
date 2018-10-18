<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名" name="timo-user-name">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码" name="timo-pwd">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long :loading="loading">登录</Button>
                        </FormItem>
                    </Form>
                    <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import util from 'util';
import crypto from 'crypto'
export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
      loading() {
          return this.$store.state.loading.loading;
        }
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    let obj = {
                        params:{
                            userName: this.form.userName,
                            pwd: this.getsha1(this.form.password)
                        }
                    }
                    util.post.login(obj).then((data) => {
                        this.$Message.success('登录成功');
                        Cookies.set('token', data.token);
                        Cookies.set('user', data.user);
                        Cookies.set('access', data.user.permission);
                        this.$router.push({
                            name: 'home_index'
                        });
                    })
                }
            })
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
    }
};
</script>

<style>

</style>

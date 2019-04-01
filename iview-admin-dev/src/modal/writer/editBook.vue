<template>
    <Modal v-model="edit.status" :closable='false' :mask-closable='false' :width="500">
        <h3 slot="header" class="modal-header-color" v-show="!isAdd">编辑 {{editBook.name}}</h3>
        <h3 slot="header" class="modal-header-color" v-show="isAdd">新增</h3>

        <Form ref="editBook" :model="editBook" :label-width="100" label-position="right" :rules="validate">
            <FormItem label="小说名称：" prop="id" :error="eidtError" v-show="!isAdd">
                <label>{{editBook.id}}</label>
            </FormItem>
            <FormItem label="小说名称：" prop="name" :error="eidtError">
                <Input v-model="editBook.name" placeholder="请输入小说名称" type="text" @keyup.native.13="save" :disabled="!isAdd"></Input>
            </FormItem>
            <FormItem label="小说类型：" prop="bookType" :error="eidtError">
                <Select v-model="editBook.bookType" class="w100" placeholder="全部" label-in-value>
                    <Option v-for="item in bookTypeList" :value="item.bookType" :key="item.bookType" v-show="item.bookType!='全部'">{{ item.bookType }}</Option>
                </Select>
            </FormItem>
            <FormItem label="小说作者：" prop="author" :error="eidtError">
                <Input v-model="editBook.author" placeholder="请输入小说作者" type="text" @keyup.native.13="save" disabled></Input>
            </FormItem>
            <FormItem label="小说描述：" prop="description" :error="eidtError">
                <Input v-model="editBook.description" placeholder="请输入小说描述" type="textarea" @keyup.native.13="save"></Input>
            </FormItem>
        </Form>

        <div slot="footer">
            <Button type="text" @click="cancel" :loading="loading">取消</Button>
            <Button type="primary" :loading="loading" @click="save">{{isAdd?"新增":"保存"}}</Button>
        </div>
    </Modal>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less">

</style>
<script type="text/ecmascript-6">
    import config from "config";
    import util from "util";
    export default {
        name: "edit-book",
        props:{
            edit: {
                type: Object,
                default: {status: false}
            },
            bookTypeList:{
                type:Array,
                default:[]
            }
        },
        data() {
            return {
                loading:false,
                eidtError: '',
                editBook:{

                },
                validate:{
                    name: [
                        { required: true, message: '请输入小说名称', trigger: 'blur' }
                    ],
                    bookType: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ],
                    author: [
                        { required: true, message: '请输入小说作者', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入小说描述', trigger: 'blur' }
                    ],
                },
                isAdd:false,
                user:{}
            }
        },
        computed: {},
        methods: {
            cancel(){
                this.edit.status = false;
            },
            save(){
                this.$refs["editBook"].validate((valid) => {
                    if (valid) {
                        if(this.isAdd){
                            this.addBook();
                        } else {
                            this.editBookInfo();
                        }
                    } else {
                        // this.$Message.error('表单验证失败!');
                    }
                });
            },
            addBook(){
                if(this.loading) return;
                let obj = {
                    params:{
                        name:this.editBook.name,
                        bookType:this.editBook.bookType,
                        author:this.editBook.author,
                        description:this.editBook.description,
                    }
                };
                this.loading = true;
                util.post.writer.addBook(obj).then((data) => {
                    this.loading = false;
                    this.cancel();
                    this.$emit("search");
                }).catch((error) => {
                    this.loading = false;
                });
            },
            editBookInfo(){
                if(this.loading) return;
                let obj = {
                    params:{
                        id:this.editBook.id,
                        bookType:this.editBook.bookType,
                        description:this.editBook.description
                    }
                };
                this.loading = true;
                util.post.writer.editBook(obj).then((data) => {
                    this.loading = false;
                    this.cancel();
                    this.$emit("search");
                }).catch((error) => {
                    this.loading = false;
                });
            }
        },
        components: {},
        created() {

        },
        mounted() {
            this.$on('editBook', (book) => {
                this.user = this.$store.state.user.user;
                console.log(this.user);
                this.edit.status = true;
                if(book) {
                    this.isAdd = false;
                } else {
                    this.isAdd = true;
                }
                console.log(this.isAdd);
                this.editBook = Object.assign({author:this.user.name},book || {});
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

<template>
    <Modal v-model="edit.status" :closable='false' :mask-closable='false' :width="500">
        <h3 slot="header" class="modal-header-color">编辑 {{editBook.name}}</h3>
        <Form ref="editBook" :model="editBook" :label-width="100" label-position="right" :rules="validate">
            <FormItem label="小说编号：" prop="id" :error="eidtError">
                <label>{{editBook.id}}</label>
            </FormItem>
            <FormItem label="小说类型：" prop="bookType" :error="eidtError">
                <Select v-model="editBook.bookType" class="w100" placeholder="全部" label-in-value>
                    <Option v-for="item in bookTypeList" :value="item.bookType" :key="item.bookType" v-show="item.bookType!='全部'">{{ item.bookType }}</Option>
                </Select>
            </FormItem>
            <FormItem label="小说作者：" prop="author" :error="eidtError">
                <Input v-model="editBook.author" placeholder="请输入小说作者" type="text" @keyup.native.13="save" disabled></Input>
            </FormItem>
            <!--<FormItem label="图片地址：" prop="imgUrl" :error="eidtError">-->
                <!--&lt;!&ndash;<Input v-model="config.apiUrl + '/images/' + params.row.id" placeholder="小说作者" type="text" @keyup.native.13="save"></Input>&ndash;&gt;-->
            <!--</FormItem>-->
        </Form>
        <div slot="footer">
            <Button type="text" @click="cancel" :loading="loading">取消</Button>
            <Button type="primary" :loading="loading" @click="save">保存</Button>
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
                    bookType: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ],
                    author: [
                        { required: true, message: '请输入小说作者', trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {},
        methods: {
            cancel(){
                this.edit.status = false;
            },
            save(){
                if(this.loading) return;
                let obj = {
                    params:{
                        id:this.editBook.id,
                        bookType:this.editBook.bookType
                    }
                };
                this.loading = true;
                util.post.books.editBookInfo(obj).then((data) => {
                    this.loading = false;
                    this.cancel();
                    console.log(this.$parent);
                    this.$emit("search");
                    console.log(data);
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
                this.edit.status = true;
                this.editBook = Object.assign({},book);
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

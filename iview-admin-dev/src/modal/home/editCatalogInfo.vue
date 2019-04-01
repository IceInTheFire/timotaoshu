<template>
    <Modal v-model="edit.status" :closable='false' :mask-closable='false' :width="500">
        <h3 slot="header" class="modal-header-color">{{isAdd?"新增":"编辑"}}《{{book.name}}》章节</h3>

        <Form ref="editCatalog" :model="editCatalog" :label-width="100" label-position="right" :rules="validate">
            <FormItem label="小说名称：">
                <label>{{book.name}}</label>
            </FormItem>
            <FormItem label="小说作者：">
                <label>{{book.author}}</label>
            </FormItem>
            <FormItem label="章节名称：" prop="name" :error="eidtError">
                <Input v-model="editCatalog.name" placeholder="请输入章节名称" type="text" @keyup.native.13="save"></Input>
            </FormItem>
            <FormItem label="排序NUM：" prop="num" :error="eidtError">
                <Input v-model="editCatalog.num" placeholder="请输入排序NUM（可选填）" type="text" @keyup.native.13="save" :maxlength="9"></Input>
            </FormItem>
            <FormItem label="章节类型：">
                <Select v-model="editCatalog.type" class="w100" placeholder="全部" label-in-value>
                    <Option v-for="item in catalogTypeList" :value="item.type" :key="item.type" >{{ item.name }}</Option>
                </Select>
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
        name: "edit-catalog-info",
        props:{
            edit: {
                type: Object,
                default: {status: false}
            },
            book:{
                type:Object,
                default:{}
            }
        },
        data() {
            return {
                loading:false,
                eidtError: '',
                editCatalog:{
                    type:1,
                },
                validate:{
                    name: [
                        { required: true, message: '请输入章节名称', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择章节类型', trigger: 'blur' }
                    ]
                },
                isAdd:false,
                user:{},
                catalogTypeList:[
                    {name:"普通章节",type:1},
                    {name:"特殊章节",type:2},
                ]
            }
        },
        computed: {},
        methods: {
            cancel(){
                this.edit.status = false;
            },
            save(){
                this.$refs["editCatalog"].validate((valid) => {
                    if (valid) {
                        if(this.isAdd){
                            this.addCatalog();
                        } else {
                            this.editCatalogInfo();
                        }
                    } else {
                        // this.$Message.error('表单验证失败!');
                    }
                });


            },
            addCatalog(){
                if(this.loading) return;
                let obj = {
                    params:{
                        name:this.editCatalog.name,
                        type:this.editCatalog.type,
                        num:this.editCatalog.num,
                        bookId:this.book.id
                    }
                };
                this.loading = true;
                util.post.writer.addCatalog(obj).then((data) => {
                    this.loading = false;
                    this.cancel();
                    this.$emit("search");
                }).catch((error) => {
                    this.loading = false;
                });
            },
            editCatalogInfo(){
                if(this.loading) return;
                let obj = {
                    params:{
                        name:this.editCatalog.name,
                        type:this.editCatalog.type,
                        num:this.editCatalog.num,
                        bookId:this.book.id,
                        catalogId:this.editCatalog.id
                    }
                };
                this.loading = true;
                util.post.writer.addCatalog(obj).then((data) => {
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
            this.$on('editCatalog', (catalog) => {
                this.user = this.$store.state.user.user;
                console.log(this.user);
                this.edit.status = true;
                if(catalog) {
                    this.isAdd = false;
                } else {
                    this.isAdd = true;
                }
                console.log(catalog);
                console.log("asdasda");
                this.editCatalog = Object.assign({type:1}, catalog || {});
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

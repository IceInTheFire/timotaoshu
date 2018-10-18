<template>
    <div>
        <Card>
            <Upload class="upload" :show-upload-list="false" multiple :action="baseUrl + '/upload'" :data="uploadParams" :on-success="uploadIpSuccess" :on-error="uploadIpError" :format="['jpg','png','gif']" :on-format-error="uploadFormatError">
                <Button type="primary">图片上传</Button>
            </Upload>
        </Card>
        <Card shadow>
            <Table border highlight-row :loading="loading" :columns="columns" :data="imgList" ref="table"></Table>
        </Card>
    </div>
</template>

<style scoped rel="stylesheet/less" type="text/less" lang="less">

</style>
<script type="text/ecmascript-6">
    import config from '../../libs/config';
    import Cookies from 'js-cookie';
    export default {
        name: "index",
        data() {
            return {
                baseUrl:config.apiUrl,
                uploadParams:{
                    token:Cookies.get("token")
                },
                loading:false,
                columns:[
                    {
                        title:'图片',
                        render: (h, params) => {
                            return h('img', {
                                    attrs:{
                                        src:params.row.imgUrl
                                    },
                                    style:{
                                        width:'100px',
                                        margin: "0 auto",
                                        display: "block"
                                    }
                                }, ``
                            )
                        }
                    },
                    {
                        title:'图片地址',
                        key:'imgUrl'
                    },
                ],
                imgList:[]
            }
        },
        computed: {},
        methods: {
            uploadIpSuccess(data) {
                this.succesFun(data);
            },
            uploadIpError(err){
                this.$Message.error("上传失败，失败原因:" + err);
            },
            uploadFormatError(file, fileList){
                this.$Message.error("上传失败，失败原因：文件格式不正确，只支持图片后缀的格式");
            },
            succesFun(data) {
                if(data.code == "1002") {
                    this.$Message.error(data.msg);
                } else if(data.code == "1003") {
                    this.$Message.error(data.msg);
                } else if(data.code == "1000"){
                    this.$Message.success(data.msg);
                    this.imgList.push({
                        imgUrl:config.apiUrl + '/img/' +data.data.imgUrl
                    })
                } else {
                    this.$Message.error("上传失败，失败原因：文件格式不正确，只支持图片后缀的格式")
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
        },
        activated() {

        },
        deactivated() {

        }
    }
</script>

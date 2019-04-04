<template>
    <div>
        <Card>
            <Upload class="upload" :show-upload-list="false" multiple :action="baseUrl + '/upload'" :data="uploadParams" :on-success="uploadSuccess" :on-error="uploadError" :format="['jpg','png','gif']" :on-format-error="uploadFormatError">
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
            succesFun(data) {
                this.imgList.push({
                    imgUrl:config.apiUrl + '/img/' +data.data.imgUrl
                })
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

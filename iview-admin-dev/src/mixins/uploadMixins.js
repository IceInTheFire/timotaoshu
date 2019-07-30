
/*
* 图片上传的公共方法
*
* */

export default {
    data(){
        return {
            uploadErrorMsg: '上传失败，失败原因：文件格式不正确，只支持图片后缀的格式',
        }
    },
    created() {
    },
    methods: {
        uploadSuccess(data) {

            if(data.code == "1002") {
                this.$Message.error(data.msg);
            } else if(data.code == "1003") {
                this.$Message.error(data.msg);
            } else if(data.code == "1000"){
                this.$Message.success(data.msg);
                this.succesFun && this.succesFun(data);
            } else {
                this.$Message.error(this.uploadErrorMsg);
            }
        },
        uploadError(err, file, fileList){
            let regex = /<pre.*?>(.*?)<\/pre>/ig;
            let result = regex.exec(file);
            if(result.length) {
                let errorObj = JSON.parse(result[1].replace(/&quot;/g,'\"'))
                this.$Message.error(`上传失败，失败原因: ${errorObj.msg}`);
            } else {
                this.$Message.error(`上传失败，失败原因: ${err}`);
            }
        },
        uploadFormatError(file, fileList){
            this.$Message.error(this.uploadErrorMsg);
        },
    },
    activated(){
    },
    deactivated() {
    }
};

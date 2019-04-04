
/*
* ieMe
*
* */

export default {
    data(){
        return {
            isme:false,
        }
    },
    created() {
    },
    methods: {

    },
    activated(){
        this.$nextTick(() =>{
            this.isme = true;
        })
    },
    deactivated() {
        this.isme = false;
    }
};
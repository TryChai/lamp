<template>
    <div class="agreement ">
        <van-nav-bar :title="content.title"
            left-text
            left-arrow
            class="navbar"
            @click-left="dz_back" />
        <div class="ql-container">
            <div class="ql-editor">
                <div v-html="content.content"></div>
            </div>
        </div>

    </div>
</template>


<script>
export default {
    name: 'useragreement',
    data () {
        return {
            content: ""
        }
    },
    props:{
        id:{
            type:String,
            default:""
        }
    },
    created () {
        if(this.id!=''){
            this.getUserAgreement(this.id);
        }else{
            this.getUserAgreement(this.$route.query.id);
        } 
    },
    methods: {
        dz_back(){
            if(this.id!=''){
                this.$emit("close_self");
            }else{
                this.toBack();
            } 
        },
        getUserAgreement (id) {
            this.$api.getUser.getUserAgreement({ id: id }).then(res => {
                if (res.code == 200) {
                    this.content = res.result;
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../assets/css/quill.css";

.navbar {
    position: fixed;
    width: 100%;
    top: 0;
}
.agreement {
    font-size: 14px;
    background: #f9f9f9;
    color: #666;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
}
.ql-container {
    margin-top: 46px;
    overflow: auto;
}
.ql-edito {
    padding: 0 16px;
    overflow: auto;
}
</style>

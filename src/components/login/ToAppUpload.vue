<template>
    <div class="app-upload" :style="{background:'url('+appInfo.appdown_bj+') no-repeat'}">
        <div class="tc">
            <a @click.prevent="checkLoad(appInfo.droidapp)">
            <div class="android fx">
                <i class="fa fa-android"></i>
                <span>Android 版本下载</span>
            </div>
            </a>
            <a @click.prevent="checkLoad(appInfo.iphoneapp)">
            <div class="ios fx">
                 <i class="fa fa-apple"></i>
                 <span>Iphone 版本下载</span>
            </div>
            </a>
            <a href="/index">
            <div class="android fx toindex">
                <span>返回首页</span>
            </div>
            </a>
        </div>
        <van-popup v-model="showLoad"
            position="top"
            get-container="body"
            class="share-zd"
            style=" height: 100%;background-color: transparent;"
            @click="showLoad=false">
            <img src="../../assets/img/shop/share-wx1.png"
                alt
                style="width:100%" />
        </van-popup>
    </div>
</template>


<script>
export default {
    name:"ToAppUpload",
    data(){
        return{
            appInfo:{
                appdown_bj:"",
                droidapp:'',
                iphoneapp:''
            },
            showLoad:false
        }
    },
    created(){
        this.getAppConfig();
    },
    methods:{
        getAppConfig(){
            this.$api.getConfig.getAppConfig({}).then(res=>{
                if(res.code==200){
                    this.appInfo=res.result;
                }
            })
        },
        checkLoad(url){
            if(url+' '.indexOf('apps.apple.com')>=0){
                window.location.href=url;
            }else if(this.$fnc.isWx()){
                this.showLoad=true;
            }else{
                window.location.href=url;
            }
            
        }
    }
}
</script>

<style lang="less" scoped>
.app-upload{
    height: 100%;
    overflow: auto;
    background-size: 100% 100% !important;
    padding-bottom: 18px;
    >div{
        width: 100%;
        position: absolute;
        bottom: 18px;
        .android,.ios{
            width: 241px;
            height: 55px;
            font-size: 18px;
            color: #fff;
            border-radius: 10px;
            border: 1px solid #fff;
            margin: 0 auto 18px auto;
            justify-content: center;
            >i{
                font-size: 35px;
                margin-right: 12px;
            }
        }
        .toindex{
            margin:  0 auto !important;
        }
    }
}
</style>

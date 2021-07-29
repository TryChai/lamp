<template>
    <div>
        <div class="zhanye_info_part zhanye_info_table" >
            <div class="zhanye_info_title">
                <p><img src="./../../../../assets/img/zhanye/zhanye_vip_icon.png" alt="">数据报表</p>
            </div>
            <div class="zhanye_table">
                <div class="zhanye_table_p">
                    <p>总浏览次数：<span>{{$route.query.hit || '0'}}次</span></p>
                    <p>总时长：<span><van-count-down style="display:inline" :auto-start="false" :time="Number(($route.query.time || 0)*1000)" /></span></p>
                </div>
                <p v-if="isWzyNew">留言：<span>暂无留言</span></p>
                <p v-if="isWzyNew">询价：<span>暂无询价</span></p>
                <div class="zhanye_table_phone">
                    <div class="zhanye_table_phone_left">
                        <van-icon name="phone-o" size="20px" color="#595959" style="padding-right: 5px"></van-icon>
                        <span class="phone"  id="phone">客户电话：{{user.tel || '暂无电话'}}</span>
                    </div>
                    <span
                            @click="copy_tel(user.tel)"
                            class="copy_btn"
                            :data-clipboard-text="user.tel"
                            data-clipboard-action="copy"
                    >一键复制</span>
                </div>
                <div class="zhanye_table_sel" v-if="isWzyNew">
                    <div class="zhanye_table_sel_left" @click="showType=true">
                        <span>{{isType(custom_type) || '选择客户标注'}}</span>
                        <van-icon name="play" color="#ffffff" size="10px"></van-icon>
                    </div>
                    <div class="zhanye_table_sel_right">
                        <span @click="$router.push('/zhanye/addfollowup?id='+user.follow_id+'&name='+user.nickname+'&title='+(custom_type || 4))">填写用户跟进</span >
                    </div>
                </div>
            </div>
        </div>
        <van-popup v-model="showType" position="bottom">
            <van-picker :columns="columns"  value-key='title' :show-toolbar='true' @confirm='getType'  />
        </van-popup>
    </div>
</template>

<script>
    import { CountDown,Picker } from "vant";
    import Clipboard from "clipboard";
    export default {
        name: "ZhanYeinfo_table",
        components: {
            [CountDown.name]: CountDown,
            [Picker.name]:Picker

        },
        props:{
            user:[String,Number,Object]
        },
        data(){
            return {
                phone:"13557578544",
                show:false,
                showType:false,
                 columns:[
                    {title:"A类客户",custom_type:'1'},
                    {title:"B类客户",custom_type:'2'},
                    {title:"C类客户",custom_type:'3'},
                    {title:"其他",custom_type:'4'},
                ],
                actions: [
                    { name: '选项' },
                    { name: '选项' },
                ],
                custom_type:this.user.custom_type 
            }
        },
        computed:{
            isWzyNew(){
                if(this.$route.query.types=='news'){
                    return false;
                }else{
                    return true;
                }
            }
        },
        watch:{
            user(){
                 this.custom_type=this.user.custom_type;
            }
        },
        methods: {

            getType(picker, value, index){
                this.showType=false;
                this.custom_type=picker.custom_type;
                var params={};
                    params.follow_id=this.user.follow_id || '';
                    params.custom_type=picker.custom_type;
                this.$api.getZhanYe.addType(params).then(res=>{
                    if(res.code==200){
                        this.$toast.success("标注成功")
                    }
                })
            },
            copy_tel(){

                var clipboard = new Clipboard(".copy_btn");
                clipboard.on("success", () => {
                    this.$toast.success("复制成功");
                    // 释放内存
                    clipboard.destroy();
                });
                clipboard.on("error", () => {
                    // 不支持复制
                     _this.$fnc.ykAPPCopy(value);
                });
            },
            sel_client(){
                this.show = true;
            },
            onSelect() {
                // 点击选项时默认不会关闭菜单，可以手动关闭
                this.show = false;

            },
            isType(index){
                if(index==1){
                    return 'A类客户'
                }else if(index==2){
                    return 'B类客户';
                }else if(index==3){
                    return 'C类客户';
                }else if(index==4){
                    return '其他';
                }else{
                    return '';
                }
            }
        }
    }
</script>

<style scoped>
    @import "./../../../../assets/css/zhanye.css";

</style>
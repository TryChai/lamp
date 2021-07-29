<template>
    <div class="zhan-ye-member-head">
        <!-- <div class="tr">
            <van-icon name="setting-o" size="20px" color="#2d3868" />
            <van-icon name="chat-o" size="20px" info='22' color="#2d3868" />
        </div> -->
        <div class="z-avater">
            <div class="fx">
                <div>
                    <img :src="$fnc.getImgUrl($store.state.user.avatar,'sex') || ($store.state.user.sex==2? require('../../../../assets/img/member/sex2.png'): require('../../../../assets/img/member/sex1.png'))"
                        alt="">
                </div>
                <div>
                    <p>
                        {{($store.state.user.nickname && ($store.state.user.nickname+'').slice(0,10)) || ($store.state.user.username && ($store.state.user.username+'').slice(0,10))}}
                        <small>供应商</small>

                    </p>
                    <p v-show="$store.state.user.tid_cn">
                        推荐人：{{$store.state.user.tid_cn? ($store.state.user.tid_cn.nickname || $store.state.user.tid_cn.username) : ''}}
                    </p>
                </div>
            </div>
        </div>
        <div class="fx z-head-menu">
            <div @click="$router.push('/supplier/suppliershoplist')">
                <span>{{info.resources}}</span>
                <p>资源量</p>
            </div>
            <div @click="$router.push('/supplier/supplierorder')">
                <span>{{info.order_quantity}}</span>
                <p>订单量</p>
            </div>
            <div @click="toZh">
                <span>{{info.pageviews}}</span>
                <p>浏览量</p>
            </div>
            <div @click="goto_im">
                <span>{{info.consultation_volume}}</span>
                <p>咨询量</p>
            </div>
        </div>
        <div class="z-foot fx">
            <div class="fx">
                <div>
                    供应商
                    <span class="z-foot-lin">|</span>
                    店铺收款二维码
                </div>
                <div>
                    <router-link to="/zhanye/receipt">
                        立即查看
                        <i class="fa fa-caret-right"></i>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => { }
        },
        isZyfh:[String,Number]
    },
    methods: {
        toZh(){
            if(this.isZyfh==1){
                this.$router.push('/zhanye/analysis?sn=last_time')
            }
            
        },
        goto_im(){
            if(this.$store.state.config.plugin.imhyjsnt.is_open == 1){
                this.$router.push('/im/imindex')
            }
        },
    },
}
</script>


<style lang="less" scoped>
.zhan-ye-member-head {
    height: 215px;
    background: url("../../../../assets/img/zhanye/z-head.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
    margin-bottom: 13px;
    > .tr {
        margin-top: 16px;
        > i:last-child {
            margin: 0 15px 0 22px;
        }
    }
    > .z-avater {
        height: 66px;
        margin-top: 34px;
        padding-left: 19px;
        > div {
            justify-content: flex-start;
            min-height: 66px;
            > div:first-child {
                height: 66px;
                width: 66px;
                padding: 2px;
                border-radius: 50%;
                overflow: hidden;
                background: #fff;
                > img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            > div:last-child {
                margin-left: 12px;
                min-height: 66px;
                flex: 3;
                > p:first-child {
                    font-size: 17px;
                    color: #161415;
                    font-weight: bold;
                    margin-bottom: 11px;
                    margin-top: 10px;
                    > small {
                        font-size: 14px;
                    }
                }
                > p:last-child {
                    display: inline-block;
                    color: #373737;
                    border: 1px solid #283562;
                    border-radius: 27px;
                    padding: 3px 6px;
                    font-weight: bold;
                    font-size: 12px;
                    background: #f7e39d;
                }
            }
        }
    }
    > .z-head-menu {
        > div {
            flex: 1;
            text-align: center;
            height: 68px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #000000;
            > span {
                font-size: 19px;
                font-weight: bold;
            }
            > p {
                font-size: 12px;
                margin-top: 5px;
            }
        }
    }
    > .z-foot {
        height: 47px;
        margin: 0px 19px 0;
        border-radius: 10px 10px 0 0;
        position: relative;
        padding: 0 12px;
        font-size: 12px;
        color: #eed25a;
        > .fx {
            margin: 4px 0 0;
            width: 100%;
            .z-foot-lin {
                padding: 0 10px;
            }
            a {
                display: block;
                background: #fcdd61;
                color: #373737;
                font-size: 12px;
                padding: 5px 10px;
                border-radius: 27px;
            }
        }
    }
}
</style>


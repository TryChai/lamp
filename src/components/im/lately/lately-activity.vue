<template>
    <div class="tdgl_con_list">

        <a @click.prevent="toMsg(conversation.id)"
            class="fx">
            <div class="f_l avter fx_1">
                <div class="im-status">
                    <div class="status-bg"></div>

                    <img :src="isActivi?require('../../../assets/img/im/acactive.jpg'):require('../../../assets/img/im/xt.jpg')"
                        class="tdgl_con_list_img1 "
                        alt="">
                    <span class=""></span>
                </div>

            </div>
            <div class="f_r tdgl_con_list_div1 fx_4">
                <div class="tdgl_con_list_div3">

                    <span class="f_l">{{isActivi?'活动消息':'系统消息'}}</span>

                    <span class="f_r tdgl_con_list_span1">{{date}}</span>
                </div>
                <div class="tdgl_con_list_div4">
                    <div class="tdgl_con_list_div2 hid_text">
                        {{conversation.msg || conversation.title}}</div>
                </div>

            </div>
        </a>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isToday, getDate, getTime } from "../../../utils/date";
import wxTime from "../../../utils/wxDate"

export default {
    name: "",
    props: {
        conversation: {
            type: Object,
            default: () => { }
        },
        isActivi: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            popoverVisible: false,
            hasMessageAtMe: false
        };
    },
    computed: {

        date: function () {
            const date = (this.conversation.update_time * 1000);
            return wxTime(date, false);
        },


    },
    components: {},
    created () { },
    mounted () {

    },
    methods: {
        toMsg (id) {
            if (this.isActivi) {  // activemsg
                this.$router.push('/page/activemsg');
            } else {
                this.$router.push('/page/notice');
            }
        },


    },
    watch: {

    }
};
</script>
<style lang='less' scoped>
.tdgl_con_list {
    width: 100%;
    border-bottom: solid 1px #f9f9f9;
    padding: 16px 0;
}
.tdgl_con_list .unread {
    position: absolute;
    background: #fa5251;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    height: 18px;
    width: 18px;
    right: 10px;
    top: -4px;
    line-height: 18px;
    font-size: 12px;
}
.tdgl_con_list_img1 {
    width: 50px;
    height: 50px;
    border-radius: 10px;
}
.tdgl_con_list_div1 {
    width: 250px;
    height: 56px;
    justify-content: center;
    display: flex;
    flex-direction: column;
    /* padding-left: 20px; */
}
.tdgl_con_list_div2 {
    color: #9f9f9f;
    height: 16px;
    line-height: 16px;
    font-size: 13px;
}
.tdgl_con_list_div3 {
    color: #313131;
    line-height: 13px;
    font-size: 15px;
    padding-bottom: 4px;
}
.tdgl_con_list_span1 {
    font-size: 12px;
    color: #b1b1b1;
}

.tdgl_con_list_div4 {
    line-height: 16px;
    font-size: 12px;
    color: #fff;
    margin-top: 4px;
}
.tdgl_con_list_div4_span {
    display: inline-block;
    height: 14px;
    padding: 0 5px;
    border-radius: 5px;
    text-align: center;
    margin-right: 5px;
}
.tdgl_con_list_span2 {
    background-color: #fd77b9;
}
.tdgl_con_list_span3 {
    background-color: #6ec4e9;
}
.tdgl_con_list_span4 {
    background-color: #ffb500;
}
.tdgl_con_list_span5 {
    background-color: #9867ff;
}
.tdgl_con_list_img2 {
    height: 6px;
    width: 6px;
    margin-right: 4px;
    vertical-align: middle;
    margin-top: -5px;
}
</style>

<template>
    <div class="complaint-con">
        <van-nav-bar :title="$h('反馈问题')"
            left-text
            left-arrow
            class="navbar"
            :border="false"
            @click-left="toBack()" />{{$h('')}}
        <div class="complaint">
            <div class="complaint_part">
                <div class="complaint_part_title">
                    <p><span>*</span>{{$h('请描述您遇到的问题')}}</p>
                </div>
                <div class="complaint_part_problem">
                    <span v-for="(item,k) in pro_option"
                        :key="k"
                        :class="[item.is_active == 1 ? 'active_problem' : '']"
                        @click="pro_btn(item)">{{$h(item.title)}}</span>

                </div>
                <div class="complaint_part_description">
                    <p>{{$h('描述您的问题')}}</p>
                    <textarea name=""
                        v-model="sub_form.message"
                        rows="3"> </textarea>
                    <span>{{num}}/200</span>

                </div>
            </div>
            <div class="complaint_part">
                <div class="complaint_part_up_title">
                    <p>{{$h('上传凭证')}}<span>{{$h('(不超过3张)')}}</span></p>
                </div>
                <div class="complaint_part_upload">

                    <van-uploader :after-read="afterRead"
                        multiple
                        :max-count="3"
                        preview-size="100px"
                        v-model="image" />
                </div>
            </div>
            <div class="complaint_part"
                style="border-bottom:none">
                <div class="complaint_part_item">
                    <div class="complaint_part_item_info">
                        <p><span>*</span>{{$h('联系人')}}</p>
                        <!-- <input @blur="windowScorll" type="text"
                            v-model="sub_form.tel"
                            placeholder="请输入"
                            style="   "> -->
                        <van-cell-group class="sc_con3_box_input fx_2"
                            :border="false">
                            <van-field  @blur="windowScorll" v-model="sub_form.username"
                                type="text"
                                style="width:90%"
                                placeholder="请输入"
                                clearable />
                        </van-cell-group>
                    </div>
                </div>
                <div class="complaint_part_item">
                    <div class="complaint_part_item_info">
                        <p><span>*</span>{{$h('联系方式')}}</p>

                        <van-cell-group class="sc_con3_box_input fx_2"
                            :border="false">
                            <van-field  @blur="windowScorll" v-model="sub_form.tel"
                                type="text"
                                style="width:90%"
                                placeholder="请输入"
                                clearable />
                        </van-cell-group>
                    </div>
                </div>
            </div>
            <div class="complaint_btn"
                @click="sub_btn">
                {{$h('提交反馈')}}
            </div>
        </div>

    </div>
</template>
<script>
import { Picker, Field } from "vant";
import exif from "@/assets/js/exif.js";
export default {
    name: "complaint",
    data () {
        return {
            pro_option: [
            ],
            num: 0,
            image: [],
            sub_form: {
                tel: this.$store.state.user.tel,
                username: this.$store.state.user.nickname,
                reason: "",
                cardpositive: "",
                message: "",
                file_list: "",
            }

        };
    },
    components: {
        [Field.name]: Field,
        [Picker.name]: Picker,

    },
    created () {
        this.get_pro_option();
    },
    methods: {

        get_pro_option () {
            this.$api.getUser.get_complaint_pro().then((res) => {
                if (res.code == 200) {
                    res.result.forEach(item => {
                        var params = {
                            "title": item,
                            "is_active": "0",
                        };
                        this.pro_option.push(params)
                    });
                }
            })

        },
        sub_btn () {
            var params = {
                types: this.sub_form.reason,
                content: this.sub_form.message,
                piclink: this.sub_form.file_list,
                man: this.sub_form.username,
                tel: this.sub_form.tel,
            }
            this.$api.getUser.submit_complaint(params).then((res) => {
                if (res.code == 200) {
                    this.$toast.fail(this.$h("已提交"), 1000);
                } else {
                    this.$toast.fail(res.result);
                }
            })
        },
        pro_btn (obj) {
            this.pro_option.forEach((item) => {
                item.is_active = 0;
            })
            obj.is_active = 1;
            this.sub_form.reason = obj.title;
        },
        afterRead (file) {
            var that = this;
            // this.$fnc.imgCompress(file.content, function (src) {
            //     that.sub_form.file_list = that.sub_form.file_list + src + "@";
            // });
            exif.imageListConvert([file.file], function (res) {
                that.sub_form.file_list = that.sub_form.file_list + res + "@";
            });
        },

    },
    computed: {
        getName () {
            return this.sub_form.message;
        }
    },
    watch: {
        getName (old, after) {
            this.num = old.length;
            if (old.length > 200) {
                this.sub_form.message = String(old).slice(0, 200);
            }
        },
    }
}
</script>
<style scoped>
.complaint-con{
    height: 100%;
    overflow: auto;
    background-color: #ffffff;
}
.complaint {
    width: 100%;
}
.complaint_part {
    width: 100%;
    border-top: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
    margin-bottom: 10px;
}
.complaint_part_title {
    width: 95%;
    margin: 8px auto;
}
.complaint_part_title p {
    font-size: 14px;
    color: #6a6a6a;
    line-height: 32px;
}
.complaint_part_title p span {
    font-size: 20px;
    color: #dc5c3f;
    line-height: 16px;
    padding-right: 5px;
}
.complaint_part_problem {
    width: 93%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.complaint_part_problem span {
    font-size: 14px;
    color: #999999;
    border: 1px solid #999999;
    border-radius: 20px;
    padding: 2px 10px;
    margin: 0 5px 10px 0;
}
.active_problem {
    background-color: #dc5c3f;
    color: #ffffff !important;
    border: none !important;
}
.complaint_part_description {
    width: 95%;
    margin: 0 auto;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
}
.complaint_part_description p {
    font-size: 14px;
    color: #6a6a6a;
}
.complaint_part_description textarea {
    /* border-radius: 10px; */
    border: none;
    font-size: 16px;
    color: #6a6a6a;
    width: 100%;
    overflow: auto;
    word-break: break-all;
    padding: 5px 10px;
}
.complaint_part_description span {
    font-size: 14px;
    line-height: 26px;
    align-self: flex-end;
}

.complaint_part_up_title {
    width: 95%;
    margin: 8px auto;
}
.complaint_part_up_title p {
    font-size: 14px;
    color: #6a6a6a;
    line-height: 32px;
}
.complaint_part_up_title p span {
    font-size: 14px;
    color: #9c9c9c;
    line-height: 16px;
    padding-right: 5px;
}
.complaint_part_upload {
    width: 95%;
    margin: 8px auto;
}
.complaint_part_item {
    width: 95%;
    margin: 0 auto;
    padding: 5px 0;
}
.complaint_part_item_info {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
}
.complaint_part_item_info p {
    font-size: 14px;
    color: #6a6a6a;

    width: 25%;
    /* line-height: 40px; */
}
.complaint_part_item_info p span {
    font-size: 20px;
    color: #dc5c3f;
    line-height: 16px;
    padding-right: 5px;
}
.complaint_part_item_info input {
    width: 70%;
    height: 20px;
    font-size: 14px;
    /*line-height: 20px;*/
    border-bottom: 1px solid #eeeeee;
}
.complaint_btn {
    width: 95%;
    height: 40px;
    border-radius: 10px;
    background-color: #ff7254;
    color: #ffffff;
    font-size: 14px;
    margin: 20px auto;
    text-align: center;
    line-height: 40px;
}
</style>
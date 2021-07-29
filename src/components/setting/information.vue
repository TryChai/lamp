<template>
    <div class=" inf_height">
        <van-nav-bar :title="$h('功德主管理')"
            left-text
            left-arrow
            class="navbar"
            @click-left="backLeft" />

        <div>
            <div>
                <div v-for="(item,index) in list"
                    :key="index">
                    <van-radio-group class=""
                        v-model="showId">
                        <div class="cu-form-group margin-top up_dizhi"
                            @click="closeAddress(item)">
                            <div class="title">{{$h('功德主姓名')}}：{{item.name}} &nbsp;&nbsp;&nbsp;{{$h('电话')}}：{{item.tel}}
                            </div>

                            <div>
                                 <!-- {{$fnc.deleteNumber(item.province+'-'+item.city+'-'+item.area+(item.town ?'-'+item.town : ''))+' '+item.address}} -->
                                {{item.address}}
                            </div>
                        </div>
                        <div class="bgwrite item_address fx">
                            <div class="cu-form-group"
                                @click="RadioChange(item)">
                                <van-radio :name="item"
                                    icon-size='26px'
                                    checked-color='#39b54a'> </van-radio>
                                <span class="shouhuodizhi">{{$h('设为常用')}}</span>
                            </div>

                            <div class="">
                                <a>
                                    <span class="left_edit">
                                        <span class="fa fa-edit"></span>
                                        <span class="text-df"
                                            @click="onEdit(item,index)">{{$h('编辑')}}</span>
                                    </span>
                                </a>
                                <span>
                                    <span class="fa fa-trash-o"></span>
                                    <span class="text-delete"
                                        @click="close(item.id)">{{$h('删除')}}</span>
                                </span>
                            </div>
                        </div>
                    </van-radio-group>
                </div>

            </div>
            <div class="padding no_zhi_sub">
                <a url="/pages/component/setting/tianjiaaddres"
                    hover-class="none"
                    animation-duration="300"
                    animation-type="fade-in">
                    <button class="cu-btn bg-gradual-orange block margin-tb-sm lg"
                        :style="$store.state.config.shop.button_bj_color?{background:$store.state.config.shop.button_bj_color}:{}"
                        @click="onAdd">{{$h('添加功德主')}}</button>
                </a>
            </div>
        </div>
        <!-- <div class="no_zhi bg-gradual-write" v-if="list.length==0 &&  is_address ">
			<image src="../../../static/img/setting/no_dizhi.png"></image>
			<div>抱歉，您未填写收货地址</div>
			<div class="padding no_zhi_sub">
				<a url="/pages/component/setting/tianjiaaddres" hover-class="none" animation-duration="300" animation-type="fade-in">
					<button class="cu-btn bg-gradual-orange block margin-tb-sm lg" >新增地址</button>
				</a>
			</div>
		</div> -->

        <van-popup v-model="show"
            class="add_show_edit"
            get-container="body"
            position="right">
            <addAddres @back='back'
                @getAddressItem='getAddressItem'
                :isOrder="true"
                v-if="show"
                :item='item' />
        </van-popup>

    </div>
</template>


<script>
import { AddressList } from "vant";
import addAddres from './addAddres'
import { RadioGroup, Radio } from 'vant'
export default {
    data () {
        return {
            showId: '',
            name: "",
            tel: "",
            address: "",
            radio: "1",
            addressList: [],
            load: false,
            is_address: false,
            chosenAddressId: "",
            list: [],
            show: false,
            item: {}

        };
    },
    props: {
        isShop: {
            type: Boolean,
            default: false
        }
    },

    components: {
        [AddressList.name]: AddressList,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        addAddres
    },
    created () {
        this.getAddress();
    },
    methods: {
        
        backLeft () {
            if (this.isShop == true) {
                this.$emit("close_information");
                this.$emit("back");
            } else {
                this.toBack()
            }

        },
        getAddressItem (item) {
            this.$emit("getAddressItem", item)
        },
        closeAddress (e) {
            if (this.isShop == true) {
                this.$emit("getAddressItem", e);
                this.$emit('pay_gdz',e.id)
            }
        },
        RadioChange (e) {
            var params = {};
            params.is_show = 1;
            params.id = e.id;
            this.$api.getSetting.set_default_address(params).then(res => {
                if (res.code == 200) {
                    this.$toast.success(this.$h("设置成功"))
                    this.$store.commit('setDefaultAddress',res.result)
                    this.$emit("getAddressItem", res.result)
                    this.getAddress();
                }
            })

        },
        close (id) {
            var that = this;
            that.$dialog.confirm({
                title:this.$h("提示") ,
                message:this.$h("是否删除"),
            }).then(() => {
                var params = {};
                params.id = id;
                that.$api.getSetting.delAddres(params).then(res => {
                    if (res.code == 200) {
                        that.$toast.success(this.$h("删除成功"));
                        setTimeout(() => {
                            that.getAddress();
                        }, 2000)
                    }
                })
            })
        },
        onAdd () {
            //   Toast("新增地址");
            this.show = true;
            this.item = {birth_date:"",sex:"1"};
            console.log(this.item)
        },
        onSelect (item) {
            console.log(item)
        },
        onEdit (item, index) {
            //   Toast("编辑地址:" + index);
            // this.$router.push('/setting/addAddres')
            item.county = item.area;
            item.addressDetail = item.add;
            this.item = item;
            this.show = true;

        },

        getAddress () {
            this.$api.getSetting.getAddres({}).then(res => {
                if (res.code === 200) {
                    var arr = [];
                    arr = res.result;
                    arr.filter((item) => {
                        item.add = item.address
                        // item.address=item.province+item.city+item.area+item.address

                        if (item.is_show == 1) {
                            this.$store.commit('setDefaultAddress',item)
                            this.showId = item;
                        }
                    });
                    this.list = arr;
                    this.load = true;

                }
            });
        },
        back (bool) {
            this.show = false
            if (bool) {
                this.getAddress();
            }
        }
    }
};
</script>

<style lang='less' >
.item_address {
    padding: 0 15px;
    > .cu-form-group {
        padding: 0;
        justify-content: flex-start;
    }
}
.inf_height {
    background: #f3f3f3;
    font-size: 14px;
    line-height: 1.8;
    overflow: auto;
    position: relative;
}
.addreslist {
    position: relative;
    z-index: 1;
}
.add_show_edit {
    width: 100%;
    height: 100%;
    border-radius: 0;
}
.title {
    font-size: 14px !important;
}
.tishi {
    background: none;
}
.beiz > div {
    min-height: 30px;
    line-height: 1.5;
    height: auto;
    padding-right: 0;
    font-size: 10px;
    padding: 10px 0;
}
.tishi > div {
    color: #999999;
    font-size: 12px;
}
.inf_height {
    height: 100%;
}
.no_zhi {
    /* position: absolute; */
    /* top: 0; */
}
.no_zhi > div {
    position: absolute;
    z-index: 1;
    width: 100%;
    text-align: center;
    top: 60%;
    color: #373923;
}
.no_zhi > img {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}
.no_zhi_sub {
    top: 85% !important;
}
.up_dizhi {
    flex-wrap: wrap;
    padding: 20px 15px;
    font-size: 15px;
}
.up_dizhi > div {
    width: 100%;
    height: 20px !important;
    line-height: 20px !important;
    font-size: 13px;
}
.title {
    color: #333;
    font-weight: bold;
    font-size: 14px;
}
.left_edit {
    margin-right: 12px;
}
.bg-gradual-orange {
    background: linear-gradient(45deg, #ff9700, #ed1c24);
    border: none;
    border-radius: 5px;
}
</style>

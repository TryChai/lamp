<template>
    <div class=" inf_height">
        <van-address-list v-model="chosenAddressId"
            :list="list"
            @add="onAdd"
            @edit="onEdit"
            @select="onSelect"
            class="addreslist" />

        <van-popup v-model="show"
            class="add_show_edit"
            position="right">
            <addAddres @back='back'
                :item='item' />
        </van-popup>

    </div>
</template>


<script>
import { AddressList } from "vant";
import addAddres from './addAddres';
import { RadioGroup, Radio } from 'vant'
export default {
    data () {
        return {
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

    watch: {

        chosenAddressId (val) {
            console.log(val)
            if (val && this.load) {
                var params = {};
                params.id = val;
                params.is_show = '1';
                this.$api.getSetting.setDefaultAddress(params);
                // this.toBack();
            }
        }
    },
    components: {
        [AddressList.name]: AddressList,
        addAddres,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
    },
    created () {
        this.getAddress();
    },
    methods: {
        onAdd () {
            //   Toast("新增地址");
            this.show = true;
            this.item = {};
        },
        onSelect (item) {
            // console.log(item)
        },
        onEdit (item, index) {
            //   Toast("编辑地址:" + index);
            // this.$router.push('/setting/addAddres')
            item.county = item.area;
            item.addressDetail = item.add;
            this.item = item;
            this.show = true;

        },
        deleteAddress (id) {
            uni.showModal({
                title: "提示",
                content: "确定要删除吗？",
                cancelText: "再想想",
                confirmText: "删除",
                success: res => {
                    if (res.confirm) {
                        this.loadModal = true;
                        var params = {};
                        params.id = id || "";
                        this.$api.http
                            .post("/mobile/address/del_address", params)
                            .then(res => {
                                if (res.data.code == 200) {
                                    this.getAddress();
                                    this.$api.msg("删除成功");
                                } else {
                                    this.$api.msg(res.data.result);
                                }
                                this.loadModal = false;
                            });
                    }
                }
            });
        },
        getAddress () {
            this.$api.getSetting.getAddres({}).then(res => {
                if (res.code === 200) {
                    var arr = [];
                    arr = res.result;
                    arr.filter((item) => {
                        item.add = item.address
                        item.address = item.province + item.city + item.area + item.address

                        if (item.is_show == 1) {
                            this.chosenAddressId = item.id;
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
}
</style>

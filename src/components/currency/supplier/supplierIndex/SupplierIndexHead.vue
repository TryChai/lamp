<template>
    <div class="supplier-index-head">
        <div class="supplier-index-head-menu fx">
            <div v-for="(item,i) in menuList"
                :key="i">
                <a  @click.prevent="toLInks(item.links)">
                    <img :src="item.piclink"
                        v-lazy='item.piclink'
                        alt />
                    <p>{{item.title}}</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { Field } from "vant";
export default {
    props: {
        menuList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data () {
        return {
            value: ""
        };
    },
    components: {
        [Field.name]: Field
    },
    methods:{
        toLInks(val){
            if (val == "" || val == null || val == undefined) {
                return;
            } else {
                if ((val + "").indexOf("http") >= 0 || (val + "").indexOf("www") >= 0) {
                window.location.href = val;
                } else {
                this.$router.push(val);
                }
            }
        }
    }
};
</script>


<style lang="less" scoped>
.supplier-index-head {
    background: #fff;
    margin: 0 10px;
    border-radius: 10px;
    .supplier-index-head-search {
        justify-content: flex-start;
        padding: 10px 17px 0;

        > div {
            height: 100%;
            .supplier-search {
                padding: 0;
                display: inline-block;
                width: auto;
                background-color: transparent;
            }
        }
        > .s-head-text1 {
            color: #0a0a0a;
            font-size: 19px;
            font-weight: bold;
            margin-right: 29px;
            > i {
                vertical-align: middle;
                font-weight: bold;
                margin-left: 5px;
            }
        }
        > .s-head-text2 {
            background: #f4f4f4;
            width: 214px;

            border-radius: 10px;
            padding-left: 27px;
            height: 42px;
            > i {
                color: #a3a3a3;
                font-weight: bold;
                margin-right: 8px;
            }
        }
        > .s-head-text3 {
            margin-left: 18px;
            i {
                font-size: 19px;
                font-weight: bold;
                color: #232323;
            }
        }
    }
    .supplier-index-head-menu {
        padding: 10px 0;
        justify-content: flex-start;
        flex-wrap: wrap;
        > div {
            width: 20%;
            text-align: center;
            overflow: hidden;
            img {
                width: 40px;
                height: 40px;
                // border-radius: 50%;
            }
            p {
                margin: 7px 0 0;
                font-size: 12px;
                color: #7a7a7a;
            }
        }
    }
}
</style>


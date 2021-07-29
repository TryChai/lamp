<template>
    <div class="z-y-menu">
        <div class="fx">
            <div>
                <router-link to="/pay/income?iden=supply">
                    <p>{{info.closed_payment || 0}}</p>
                    <p>供货款</p>
                </router-link>
            </div>
            <div class="z-menu-right">
                <router-link to="/supplier/supplierorder">
                    <p>{{info.sum_supply || 0}}</p>
                    <p>累计供货款</p>
                </router-link>
            </div>
            <div class="z-menu-right">
                <router-link to="/supplier/supplierorder?status=未完成">
                    <p>{{info.outstanding_payment || 0}}</p>
                    <p>未结供货款</p>
                </router-link>
            </div>
            <div>
                <router-link to="/supplier/suppliershop">
                    <p>
                        <i class="fa fa-id-card-o"></i>
                    </p>
                    <p>我的资料</p>
                </router-link>
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
        }
    }
}
</script>



<style lang="less" scoped>
.z-y-menu {
    padding: 0 19px;
    background: #fff;
    font-size: 14px;
    line-height: 1;
    border-radius: 10px;
    .z-menu-right {
        // background: url("../../../../assets/img/zhanye/z-menu-right.png")
        //     no-repeat right center;
        // background-size: 16% 70%;
    }
    > .fx > div {
        flex: 1;
        text-align: center;
        color: #000000;
        position: relative;
        p:first-child {
            font-size: 18px;
            font-weight: bold;
            height: 22px;
            line-height: 22px;
            margin: 22px 0 7px;
            i {
                color: #ff0000;
                font-size: 22px;
            }
        }
        p:last-child {
            font-size: 12px;
            margin-bottom: 22px;
        }
    }
}
</style>


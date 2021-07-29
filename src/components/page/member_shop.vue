<template>
    <div class="member_shop">
        <Mall v-if="nowtype && nowtype == 0"></Mall>
        <upgrade v-if="nowtype && nowtype == 1"></upgrade>
    </div>
</template>
<script>
import Mall from '@/components/page/member/mall'
import upgrade from '@/components/page/member/upgrade'
export default {

    name: "member_shop",
    data () {
        return {
            nowtype: null,
        };
    },
    created () {
        this.getistype()
    },
    components: {
        Mall,
        upgrade
    },
    methods: {
        getistype () {
            this.$api.getSetting.findReward({ iden: 'vip_mode' }).then(res => {
                if (res.code == 200) {       
                    if(res.result!=null ){
                        this.nowtype = res.result
                    }else{
                        this.nowtype='0';
                    }
                }
            })
        },
    },
}
</script>
<style lang="less" scoped>
.member_shop {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
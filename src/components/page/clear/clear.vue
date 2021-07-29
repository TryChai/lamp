<template>
    <div>

    </div>
</template>
<script>
import Cookies from "js-cookie"
export default {
    name: "clear",
    data () {
        return {
        };
    },
    created () {
        sessionStorage.clear();
        localStorage.clear()
        this.$store.commit("loginOut");
    },
    components: {

    },
    methods: {

    },
}
</script>
<style lang="less" scoped>
</style>
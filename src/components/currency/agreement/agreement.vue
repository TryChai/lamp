<template>
  <div class="agreement">
    <div class="agreement-box">
      请你务必审慎阅读、充分理解
      <router-link
        v-for="(item, i) in article"
        :key="i"
        style="color: #7aa3bf"
        :to="'/useragreement?id=' + item.id"
        >《{{ item.title }}》</router-link
      >
      的详细信息，如果你同意，请点击“同意”开始接受我们的服务
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      loginConfig: (state) => state.loginConfig,
    }),
    article() {
      try {
        var arr = [];
        arr = this.loginConfig.footer || [];
        return arr;
      } catch (error) {
        return [];
      }
    },
  },
};
</script>

<style lang='less'>
.agreement {
  font-size: 14px;
  line-height: 1.2;
  .agreement-box {
    padding: 0 16px 16px;
    line-height: 1.4;
    a {
      color: #7aa3bf;
    }
  }
}
</style>
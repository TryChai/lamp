<template>
  <div class="fx percent_box">
    <div class="percent_left" :style="{ width: num + '%' }"></div>
  </div>
</template>
<script>
export default {
  name: "limit_percent",
  data() {
    return {};
  },
  props: {
    num: {
      type: Number,
      default: 0,
    },
  },
  components: {},
  methods: {},
};
</script>
<style scoped>
.percent_box {
  width: 70px;
  background: rgba(255, 255, 255, 0.6);
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}
.percent_box .percent_left {
  height: 100%;
  background: #fff;
  border-radius: 3px;
}
</style>
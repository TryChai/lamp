<template>
  <div>

  </div>
</template>
<script>
import { Dialog } from 'vant';
export default {
  name: "pagescan",
  data () {
    return {
    };
  },
  created () {
    var that = this;
    if (this.$route.query.result) {
      let str = decodeURIComponent(this.$route.query.result);
      if (str.indexOf('/order/mention/code?id=') >= 0) {
        Dialog.confirm({
          title: '是否确认取货',
        }).then(() => {
          let id = this.$fnc.getUrlquery(str, 'id');
          var params = { id: id };
          that.$api.getOrder.complect_mention(params).then(res1 => {
            if (res1.code == 200) {
              that.$toast.success('操作成功')
            }
            setTimeout(() => {
              this.$router.push('/')
            }, 1500);
          })
        }).catch(() => {
          setTimeout(() => {
            this.$router.push('/')
          }, 1500);
        });
      } else if (str.indexOf('/order/orderdetails') >= 0) {
        var obj = this.$fnc.urlparse(str);
        if (obj['type'] == '14') {
          this.$dialog.confirm({
            title: '是否确认开始服务',
          }).then(() => {
            var params = {
              id: obj['id']
            }
            this.$api.getOrder.start_reserve(params).then(res1 => {
              if (res1.code == 200) {
                this.$toast.success('开始服务')
              }
            })
          }).catch(() => {

          });
        }
      } else {
        this.$router.push('/')
      }

    } else {
      this.$router.push('/')
    }
  },
  components: {
    [Dialog.name]: Dialog
  },
  methods: {

  },

}
</script>
<style lang="less" scoped>
</style>
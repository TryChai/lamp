
<template>
  <div>
    <md-landscape :value="sellanshow" class="index-man-pop member-man-pop" style="">
      <div class="selpop">
        <van-icon name="cross" @click="calsel"> </van-icon>
        <div class="selitem" v-for="(item,i) in language_type" :key="i" @click="onConfirm(item)">{{item.title}}</div>
      </div>
    </md-landscape>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Landscape } from "mand-mobile";
import Vue from "vue"
export default {
  name: "selLanguage",
  data () {
    return {
      sellanshow: false,
    };
  },
  props: {
    show: {
      type: Boolean,
      default: null
    }
  },
  watch: {
    show (old, after) {
      this.sellanshow = old;
    }
  },
  computed: {
    ...mapState({
      language_type: state => state.language_type,
    }),
  },
  components: {

    [Landscape.name]: Landscape
  },

  methods: {
    onConfirm (val) {
      var save = {
        iden: val.iden,
        title: val.title,
      }
      this.$store.commit('set_nowlanguage', save)
      localStorage.setItem('nowlan', JSON.stringify(save))
      this.$emit("close")
      // this.$router.go(0);
      location.reload();
    },
    calsel () {
      this.$emit("close")
    },
  },
}
</script>
<style lang="less" scoped>
.member-man-pop .md-icon {
  display: none !important;
}
.index-man-pop .md-landscape-content {
  width: 270px;
}

.index-man-pop .md-landscape-close {
  width: 26px;
  height: 26px;
  line-height: 26px;
  font-size: 26px;
}

.selpop {
  width: 250px;
  min-height: 180px;
  background-color: #ffffff;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 20px 0;
  position: relative;
  border-radius: 10px;
}
.selpop .van-icon {
  font-size: 16px;
  position: absolute;
  right: 10px;
  top: 10px;
}
.selpop .selitem {
  /* width: 100%; */
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f1eef2;
  margin-bottom: 10px;
}
</style>
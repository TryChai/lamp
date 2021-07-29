<template>
  <div class="order-friend">
    <van-cell-group>
      <van-switch-cell
        v-model="isFriendChecked"
        title="帮好友下单"
        active-color="#F32A0B"
      />
    </van-cell-group>

    <van-cell-group v-show="isFriendChecked">
      <van-field
        @blur="getBlur"
        v-model="username"
        placeholder="请输入好友用户名或手机号"
      />
    </van-cell-group>
    <div class="friend-info fx" v-show="isFriendChecked">
      <div>
        <van-image
          style="display: block"
          round
          width="40"
          height="40"
          :src="friendInfo.avatar"
          lazy-load
        />
      </div>
      <div v-if="isHaveUser">
        <p>会员昵称：{{ friendInfo.nickname }}</p>
        <p>会员账号：{{ friendInfo.username }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Field, Image, SwitchCell } from "vant";
export default {
  name: "order-friend",
  data() {
    return {
      friendInfo: {},
      username: "",
      isHaveUser: false,
      isFriendChecked: false,
    };
  },
  components: {
    [Field.name]: Field,
    [Image.name]: Image,
    [SwitchCell.name]: SwitchCell,
  },
  created() {},
  mounted() {},
  methods: {
    getBlur() {
      window.scroll(0, 0);
      this.getFriendInfo(this.username);
    },
    getFriendInfo(username) {
      if (username) {
        this.$api.getUser.selectUsername({ username }).then((res) => {
          if (res.code == 200) {
            this.friendInfo = res.result;
            this.isHaveUser = true;
            this.$emit("toFriend", res.result.username);
          } else {
            this.$emit("toFriend", "");
          }
        });
      } else {
        this.friendInfo = {
          avatar: "",
        };
        this.$emit("toFriend", "");
      }
    },
  },
  watch: {
    isFriendChecked(val) {
      this.$emit("toCheckFriend", val);
    },
  },
};
</script>

<style lang='less' scoped>
.order-friend {
  .friend-info {
    height: 60px;
    justify-content: flex-start;
    padding: 0 0 0 16px;
    p {
      margin-left: 10px;
      line-height: 1.4;
      font-size: 14px;
    }
  }
}

.van-cell .van-cell__title {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
}
</style>

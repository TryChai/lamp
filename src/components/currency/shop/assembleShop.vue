<template>
  <div
    class="fx assembleShopItem"
    @click="$router.push('/shop/shopdetails?id=' + item.id)"
  >
    <img :src="$fnc.getImgUrl(item.piclink)" />
    <span>
      <p class="van-multi-ellipsis--l2">{{ item.title }}</p>
      <p class="fx">
        <span>{{ item.group_people }}人成团</span>
        <span v-if="item.group_face == 1">团长免单</span>
      </p>
      <p>
        <span class="price_regular">
          <small>￥</small>
          <b>{{
            $fnc.toFixedZ(
              Number(item.price) * Number(item.group_discount) * 0.1
            )
          }}</b>
          <i>拼团价</i>
        </span>
        <span class="price_regular">
          <small>￥</small>
          <b>{{ $fnc.toFixedZ(Number(item.price)) }}</b>
          <i>单买价</i>
        </span>
      </p>
      <p class="fx">
        <span>{{ item.real_sale || 0 }}人已拼</span>
        <span>去拼团</span>
      </p>
    </span>
  </div>
</template>


<script>
export default {
  name: "assembleShop",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="less" scoped>
.assembleShopItem {
  width: 100%;
  font-size: 14px;
  background: #fff;
  border-radius: 10px;
  padding: 10px;

  > img {
    width: 120px;
    height: 120px;
    border-radius: 10px;
    margin-right: 6px;
  }

  > span {
    width: 208px;

    > p:nth-of-type(1) {
      width: 100%;
      line-height: 1.3;
      font-weight: bold;
      font-size: 15px;
      min-height: 21px;
    }

    > p:nth-of-type(2) {
      width: 100%;
      padding: 6px 0 0;
      justify-content: flex-start;
      flex-direction: initial !important;
      > span {
        color: #f2270c;
        padding: 3px 8px 2px;
        font-size: 11px;
        border-radius: 3px;
        border: 1px solid #f2270c;
        line-height: 1.2;
      }
      > span:not(:first-child) {
        margin-left: 6px;
      }
    }

    > p:nth-of-type(3) {
      width: 100%;
      padding: 6px 0 0;
      > span:nth-of-type(1) {
        color: #f2270c !important;
        > small {
          font-size: 12px;
          font-weight: bold;
        }
        > b {
          font-size: 18px;
        }
        > i {
          font-size: 11px;
          font-weight: normal;
          font-style: normal;
          padding-left: 2px;
        }
      }
      > span:nth-of-type(2) {
        color: #bebebe !important;
        padding-left: 5px;
        > small {
          font-size: 11px;
          font-weight: bold;
        }
        > b {
          font-size: 12px;
        }
        > i {
          font-size: 10px;
          font-weight: normal;
          font-style: normal;
          padding-left: 1px;
        }
      }
    }

    > p:nth-of-type(4) {
      width: 100%;
      height: 32px;
      border-radius: 6px;
      background: #fff09e;
      padding: 0 5px;

      background: url(../../../assets/img/shop/pintuan.png) no-repeat;
      background-position: center;
      background-size: 100%;

      > span:nth-of-type(1) {
        color: #c56300;
        line-height: 1;
        width: 110px;
        text-align: center;
        font-size: 12px;
      }
      > span:nth-of-type(2) {
        color: #ffffff;
        line-height: 1;
        font-size: 12px;
        width: 74px;
        text-align: center;
      }
    }
  }
}
</style>
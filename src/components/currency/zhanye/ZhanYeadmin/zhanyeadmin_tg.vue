<template>
    <div>
        <div class="admin_part">
            <div class="admin_part_title ">
                <p>上周推广周报</p>

            </div>
            <div class="admin_tg_box">
                <div class="admin_tg_box_top">
                    <p>上周总点击量</p>
                    <p>2019-05-27 ~ 2019-06-02</p>
                </div>
                <div class="admin_tg_box_bottom">
                    <div class="admin_tg_box_bottom_left">
                        <p>总次数(次)</p>
                        <p>0.00</p>
                    </div>
                    <div class="admin_tg_box_bottom_right">
                        <div class="admin_tg_box_bottom_right_item">
                            <van-icon name="stop"
                                size="12px"
                                color="#ff5167">
                            </van-icon>
                            <p>点击数 </p>
                            <span>0</span>
                        </div>
                        <div class="admin_tg_box_bottom_right_item">
                            <van-icon name="stop"
                                size="12px"
                                color="#1acc78">
                            </van-icon>
                            <p>转换数 </p>
                            <span>0</span>
                        </div>
                        <div class="admin_tg_box_bottom_right_item">
                            <van-icon name="stop"
                                size="12px"
                                color="#ffb804">
                            </van-icon>
                            <p>推手数 </p>
                            <span>0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
   name: "zhanyeadmin_tg",
   data () {
      return {
      };
   },
   components:{
   },
   methods:{

   },
}
</script>
<style  scoped>
</style>
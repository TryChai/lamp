<template>
    <div>
        <div class="admin_part">
            <div class="z-zhan-box-title" style="padding-left:0">
                数据看板
            </div>
            <div class="admin_part_title ">
            </div>
            <div class="admin_data_box">
                <div class="admin_data_item admin_data_item_no">
                    <p>总点击量</p>
                    <p>{{info.num_1}}</p>
                    <p>--</p>
                </div>
                <div class="admin_data_item admin_data_item_no">
                    <p>今日点击</p>
                    <p>{{info.num_2}}</p>
                    <p>--</p>
                </div>
                <div class="admin_data_item admin_data_item_no">
                    <p>昨日击量</p>
                    <p>{{info.num_3}}</p>
                    <p>--</p>
                </div>
                <div class="admin_data_item admin_data_item_no">
                    <p>总咨询量</p>
                    <p>{{info.num_4}}</p>
                    <p>--</p>
                </div>
                <div class="admin_data_item admin_data_item_no">
                    <p>今日咨询</p>
                    <p>{{info.num_5}}</p>
                    <p>--</p>
                </div>
                <div class="admin_data_item admin_data_item_no">
                    <p>昨日咨询</p>
                    <p>{{info.num_6}}</p>
                    <p>--</p>
                </div>
            </div>
        </div>

    </div>
</template>
<script>

	export default {
    name: "zhanyeadmin_data",
    
    props:{
        info:{
            type:Object,
            default:()=>{}
        }
    },
		data () {
			return {
				time:"",
				time_show:false,
			};      
		},

	methods:{
		time_btn(){
			this.time_show = true;
		},
	},
	}
</script>
<style  scoped>
</style>
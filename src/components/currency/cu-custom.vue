<template>
	<div>
		<div class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<div class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<div class="action" @tap="BackPage" v-if="isBack">
					<text class="icon-back_android"></text>
					<slot name="backText"></slot>
				</div>
				<div class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</div>
				<slot name="right"></slot>
			</div>
		</div>
	</div>
</template>

<script>
		import {  
	  mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
			backUrl:{
				type:String,
				default:""
			},
			istabbar:{
				type:Boolean,
				default:false
			}
		},
		methods: {
			...mapMutations(['setIsOrder',]),
			BackPage() {
					
				var pages=getCurrentPages();
				var  url=pages[pages.length-1].route;
				if(url.indexOf('pages/star/starjyzx')>=0){
					this.setIsOrder(false);
				}

				// #ifndef H5  
				uni.navigateBack({
					delta: 1
				});
				// #endif
				// #ifdef H5 
				if(this.istabbar){
					uni.switchTab({
						url: this.backUrl,
						animationType: 'pop-in',
						animationDuration: 400
						
					});
				}else{
					uni.redirectTo({
						url: this.backUrl,
						animationType: 'pop-in',
						animationDuration: 400
						
					});
				}
				// #endif
			}
		}
	}
</script>

<style>

</style>

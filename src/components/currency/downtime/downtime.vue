<template>
	<div>
		<div class="uni-countdown" v-if="time==''">
			<div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}"><text class="icon-time"></text> 剩</div>
			<div v-if="showDay" class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{d}}</div>
			<div v-if="showDay" class="uni-countdown__splitor" :style="{color:splitorColor}">天</div>
			<div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{h}}</div>
			<div class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '时'}}</div>
			<div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{i}}</div>
			<div class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '分'}}</div>
			<div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{s}}</div>
			<div v-if="!showColon" class="uni-countdown__splitor" :style="{color:splitorColor}">秒</div>
		</div>
		<div  class="uni-countdown"  v-if="time=='h'">
			<div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{h}}</div>
			<div class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '时'}}</div>
			<div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{i}}</div>
			<div class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '分'}}</div>
			<div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{s}}</div>
			<div v-if="!showColon" class="uni-countdown__splitor" :style="{color:splitorColor}">秒</div>
		</div>
		<div  class="uni-countdown"  v-if="time=='i'">
			<div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{i}}</div>
			<div class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '分'}}</div>
			<div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{s}}</div>
			<div v-if="!showColon" class="uni-countdown__splitor" :style="{color:splitorColor}">秒</div>
		</div>
		<div  class="uni-countdown"  v-if="time=='s'">
			<div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{s}}</div>
			<div v-if="!showColon" class="uni-countdown__splitor" :style="{color:splitorColor}">秒</div>
		</div>
		<div  class="uni-countdown"  v-if="time=='is'">
			<div class="sss" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{i}}</div>
			<div class="sss" :style="{color:splitorColor}">{{showColon ? ':' : ':'}}</div>
			<div class="sss" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{s}}</div>
		</div>
		<div class="uni-countdown" v-if="time=='days'">
			<div v-if=" day>=1" class="sssday uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{d}}</div>
			<div v-if="day>=1" class="sss uni-countdown__splitor" :style="{color:splitorColor}">天</div>
			<div class="sssday uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{h}}</div>
			<div class=" sssday uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '时'}}</div>
			<div class="sssday uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{i}}</div>
			<div class="sssday uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '分'}}</div>
			<div class="sssday uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{s}}</div>
			<div v-if="!showColon" class="uni-countdown__splitor" :style="{color:splitorColor}">秒</div>
		</div>
	</div>
	
</template>

<script>
	export default {
		name: "uni-countdown",
		props: {
			showDay: {
				type: Boolean,
				default: true
			},
			showColon: {
				type: Boolean,
				default: true
			},
			backgroundColor: {
				type: String,
				default: "#FFFFFF"
			},
			borderColor: {
				type: String,
				default: "#000000"
			},
			color: {
				type: String,
				value: "#000000"
			},
			splitorColor: {
				type: String,
				default: "#000000"
			},
			day: {
				type: Number,
				default: 0
			},
			hour: {
				type: Number,
				default: 0
			},
			minute: {
				type: Number,
				default: 0
			},
			second: {
				type: Number,
				default: 0
			},
			time:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				timer: null,
				d: '00',
				h: '00',
				i: '00',
				s: '00',
				leftTime: 0,
				seconds: 0
			}
		},
		created: function(e) {
			this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second)
			this.countDown()
			this.timer = setInterval(() => {
				this.seconds--
				if (this.seconds < 0) {
					this.timeUp()
					return
				}
				this.countDown()
			}, 1000)
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		methods: {
			toSeconds(day, hours, minutes, seconds) {
				return (day * 60 * 60 * 24) + (hours * 60 * 60) + (minutes * 60) + seconds
			},
			timeUp() {
				clearInterval(this.timer)
				this.$emit('timeup')
			},
			countDown() {
				let seconds = this.seconds
				let [day, hour, minute, second] = [0, 0, 0, 0]
				if (seconds > 0) {
					day = Math.floor(seconds / (60 * 60 * 24))
					hour = Math.floor(seconds / (60 * 60)) - (day * 24)
					minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
					second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
				} else {
					this.timeUp()
				}
				if (day < 10) {
					day = '0' + day
				}
				if (hour < 10) {
					hour = '0' + hour
				}
				if (minute < 10) {
					minute = '0' + minute
				}
				if (second < 10) {
					second = '0' + second
				}
				this.d = day
				this.h = hour
				this.i = minute
				this.s = second
			}
		}
	}
</script>
<style>
	@charset "UTF-8";

	.uni-countdown {
		padding: 1px 0;
		display: inline-flex;
		flex-wrap: nowrap;
		justify-content: center
	}

	.uni-countdown__splitor {
		justify-content: center;
		line-height: 22px;
		padding: 0 2.5px;
		font-size: 14px
	}

	.uni-countdown__number {
		line-height: 22px;
		justify-content: center;
		height: 22px;
		border-radius: 3px;
		margin: 0 2.5px;
		font-size: 14px;
		font-size: 12px;
		padding: 0 5px
	}
	.sss{
		padding: 0 2px;
	}
	.sssday{
		padding: 0 !important;
		margin: 0 !important;
	}
</style>
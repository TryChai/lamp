
<template>
<div id="product-sec-countdown"> </div>
</template>


<script>
export default {
  created () {
   this.$nextTick(() => {
   this.countdown(175620) //结束时间到开始时间的时间差，单位秒
 })
},
countdown (sec) {
  setTimeout(function () {
     var hour = 0
     var minute = 0
     var second = 0
      setInterval(function () {
       if (sec >= 60) {
        minute = Math.floor(sec / 60)
        second = sec % 60
        if (minute >= 60) {
           hour = Math.floor(minute / 60)
           minute = minute % 60
         } else {
              hour = 0
            }
       } else {
         second = sec
         hour = 0
         minute = 0
       }
 
       hour = parerInt(hour) < 10 && parerInt(hour) > 0 ? '0' + hour : hour
       minute = parerInt(minute) < 10 && parerInt(minute) > 0 ? '0' + minute : minute
       second = parerInt(second) < 10 && parerInt(second) > 0 ? '0' + second : second
       var countdownStr = '距结束 ' + hour + ':' + minute + ':' + second
       document.getElementById('product-sec-countdown').innerHTML = countdownStr
       sec--
       if (sec <= 0) {
         window.location.reload()
       }
     }, 1000)
   }, 1000)
}
}
</script>

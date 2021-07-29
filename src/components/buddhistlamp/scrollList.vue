<template>
    <div class="list" ref="list">
        <slot></slot>
    </div>
</template>
<script>
    export default{
        name:'',
        props:['loading'],
        data(){
            return {

            }
        },
        methods:{
            throttle(func, delay) {     
                var timer = null;     
                var startTime = Date.now();     
                    return function() {             
                        var curTime = Date.now();             
                        var remaining = delay - (curTime - startTime);             
                        var context = this;             
                        var args = arguments;             
                        clearTimeout(timer);              
                        if (remaining <= 0) {                    
                            func.apply(context, args);                    
                            startTime = Date.now();              
                        } else {                    
                            timer = setTimeout(func, remaining);              
                        }      
                    }
            },
            handle() { 
                //通过节流的方式 监听滚动 
                let that = this    
                let {scrollTop ,clientHeight , scrollHeight} = this.$refs.list
                    if(scrollTop + clientHeight == scrollHeight && !this.loading ){
                    this.$emit('scrollBottom')
                    }
            },
        },
        mounted(){
            this.$refs.list.addEventListener('scroll', this.throttle(this.handle, 300));
        },
        created(){

        },
        
        beforeDestroy(){
            this.$refs.list.removeEventListener('scroll', this.throttle(this.handle, 300)); 
        }
}
  

</script>
<style scoped>
 .list{
    height: 100%;
    overflow: auto;
    position: fixed;
    width: 100%;
    z-index: 1;
 }
</style>
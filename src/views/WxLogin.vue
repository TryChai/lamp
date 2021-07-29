<template>
  <div class="content_height">
       <wxLogin />
  </div>
</template>
<script>
import wxLogin from '@/components/login/wxLogin.vue'
export default {
    name:"wx",
    components:{
        wxLogin
    }
}
</script>

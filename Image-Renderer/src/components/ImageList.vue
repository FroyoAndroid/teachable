<template>
    <div class="image-list-wrapp">
        <h2>Image List</h2>
        <image-item></image-item>
        
        <!--<router-view></router-view>-->
    </div>
</template>
<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        images: [],
      }
    },
    created () {
      axios.get('/api/images').then((response) => {
        this.images = response.data
      }).catch(e => {
        console.error(e)
      })
    },
  }
</script>
<style rel='stylesheet/scss' lang='scss'></style>

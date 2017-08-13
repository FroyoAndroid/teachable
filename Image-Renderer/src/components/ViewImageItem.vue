<template>
    <div class="row">
        <div class="col-md-12">
            <div id="nifti-image" ref="nifti-image"></div>
        </div>
    </div>
</template>
<script>
  import axios from 'axios'
  import niftiLoader from '../cornerstone-loaders/nifti-loader'

  export default {
    data () {
      return {
        element: null
      }
    },
    mounted () {
      this.element = this.$refs['nifti-image']
      cornerstone.enable(this.element)
      this.drawImage(this.$route.params.imageId)
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchImageData',
    },
    methods: {
      drawImage (id) {
        // id="IM-0004-0001.jpg";
        var data = `niftiLoader://${id}`;
        console.log('loadImage' + data);
        cornerstone.loadImage(data).then(image => {
          console.log('loadImage' + JSON.stringify(image));
          cornerstone.displayImage(this.element, image)
        })
      },
      fetchImageData () {
        const id = this.$route.params.imageId
        this.drawImage(id)
      },
    },
  }
</script>
<style rel='stylesheet/scss' lang='scss'>
    #nifti-image {
        width: 512px;
        height: 512px;
    }
</style>

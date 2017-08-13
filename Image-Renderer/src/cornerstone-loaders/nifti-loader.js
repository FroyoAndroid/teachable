import axios from 'axios'

(function (cs) {
    function str2ab (str) {
      var bufView = new Uint16Array(str)
      var index = 0
      var i = 0
      var strLen = str.length
      for (; i < strLen; i += 2) {
        var lower = str.charCodeAt(i)
        var upper = str.charCodeAt(i + 1)
        bufView[index] = lower + (upper << 8)
        index++
      }
      return bufView
    }

    function getPixelData (pixelData) {
      pixelData = str2ab(pixelData)
      //console.log("pixelData nifti" + pixelData.length);
      return pixelData
    }

    function createImageObject (imageId, bytes, headers) {
      const width = headers.dims[1], height = headers.dims[2]
      console.log("createImageObject bytes" + bytes.length);
      function _getPixelData () {
        return getPixelData(bytes)
      }
      console.log("NIFTI LOADER");
      return {
        imageId: imageId,
        minPixelValue: 0,
        maxPixelValue: 10000,
        slope: 1.0,
        intercept: 0,
        windowCenter: Math.ceil(width / 2),
        windowWidth: width,
        getPixelData: _getPixelData,
        rows: height,
        columns: width,
        height: height,
        width: width,
        // render: cornerstone.renderGrayscaleImage,
        // color: false,
        // columnPixelSpacing: 1,
        // rowPixelSpacing: 1,
        // invert: false
        // sizeInBytes: width * height * 2,
      }
    }

    function loadNiftiImage (imageId) {
      const id = imageId.split('niftiLoader://')[1]

      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          responseType: 'arraybuffer',
          url: `/api/nifti-bytes/${id}`,
        }).then(response => {
          const bytes = response.data
          console.log(' nifti-bytes response ' + JSON.stringify(response));
          console.log(' bytes1 ' + JSON.stringify(bytes));
          axios({
            method: 'GET',
            responseType: 'json',
            url: `/api/nifti-header/${id}`
          }).then(response => {
            const headers = response.data
            const image = createImageObject(imageId, bytes, headers)
            resolve(image)
          })
        }).catch(e => {
          reject(e)
        })
      })
    }

    cs.registerImageLoader('niftiLoader', loadNiftiImage)

  }(cornerstone)
)
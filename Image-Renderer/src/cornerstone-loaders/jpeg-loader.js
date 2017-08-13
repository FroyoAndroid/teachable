
import axios from 'axios'

(function (cs) {

    function str2ab(str) {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        var index = 0;
        for (var i=0, strLen=str.length; i<strLen; i+=2) {
            var lower = str.charCodeAt(i);
            var upper = str.charCodeAt(i+1);
            bufView[index] = lower + (upper <<8);
            index++;
        }
        return bufView;
    }

    function getPixelData(base64PixelData)
    {
        var pixelDataAsString = window.atob(base64PixelData);
        // var pixelDataAsString = base64PixelData;
        var pixelData = str2ab(pixelDataAsString);
        return pixelData;
    }

    function createImageObject(imageId, bytes, headers) {

        function getPngDimensions(bytes) {
            let header = atob(bytes.slice(0, 50)).slice(16,24)
            let uint8 = Uint8Array.from(header, c => c.charCodeAt(0))
            let dataView = new DataView(uint8.buffer)

            return {
                width: dataView.getInt32(0),
                height: dataView.getInt32(4)
            }
        }

        

        // Just to get some bytes png example
        var canvas = document.createElement('canvas')
        var dimensionBytes = canvas.toDataURL().split(',')[1]

        var dimensions = getPngDimensions(dimensionBytes)
        
        var width = JSON.stringify(dimensions.width)
        var height = JSON.stringify(dimensions.height)

        function _getPixelData () {
            return getPixelData(bytes)
        }

        console.log("JPEG LOADER" + bytes);
        return {
            imageId: imageId,
            minPixelValue: 0,
            maxPixelValue: 1000,
            slope: 1.0,
            intercept: 0,
            windowCenter: Math.ceil(width / 2),
            windowWidth: width,
            getPixelData: _getPixelData,
            rows: height,
            columns: width,
            height: height,
            width: width,
            render: cs.renderGrayscaleImage,
            color: false,
            // columnPixelSpacing: .8984375,
            // rowPixelSpacing: .8984375,
            invert: false,
            sizeInBytes: width * height * 2
        }

    }

    function getJPEGImage(imageId) {
       
        const id = imageId.split('jpegLoader://')[1]

        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                responseType: 'json',
                url: `/api/jpeg-bytes/${id}`,
            }).then(response => {
                var bytes = response.data.data;
                document.getElementById('baseImg').setAttribute( 'src', bytes);
                bytes = bytes.replace(/^data:image\/[a-z]+;base64,/, "");
                // console.log(' bytes ' + JSON.stringify(bytes));
                const image = createImageObject(imageId, bytes, {})
                resolve(image)
                // axios({
                //     method: 'GET',
                //     responseType: 'json',
                //     url: `/api/jpeg-header/${id}`
                // }).then(response => {
                //     const headers = response.data
                // })
            }).catch(e => {
                reject(e)
            })
        })
        return deferred;
    }


    // register our imageLoader plugin with cornerstone
    cs.registerImageLoader('jpegLoader', getJPEGImage);

}(cornerstone));
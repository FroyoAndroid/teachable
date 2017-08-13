<template>
    <!--<li class="list-group-item">
        <router-link :to="{ name: 'image-link', params: {imageId: image.index} }">{{ image.name }}</router-link>
    </li>-->
    
    <div class="container">
        <div class="col-xs-2">
            <h4>JPEG Image</h4>
        </div>
        <div class="col-xs-2">
            <ul class="list-group">
                <a href="#" id="playClip" class="list-group-item">Play Clip</a>
                <a href="#" id="stopClip" class="list-group-item">Stop Clip</a>
            </ul>
            <label>Loop</label>
            <input type="checkbox" id="loop" checked />
            <input type="range" id="sliceRange" ref="sliceRange">
        </div>

        <div class="col-xs-6">
            <div style="width:512px;height:512px;position:relative;display:inline-block;color:white;"
                oncontextmenu="return false"
                class='cornerstone-enabled-image'
                unselectable='on'
                onselectstart='return false;'
                onmousedown='return false;'>
                <div id="jpegImageStackScroll" ref="jpegImageStackScroll" 
                    style="width:512px;height:512px;top:0px;left:0px; position:absolute;">
                </div>
                <div id="mrtopleft" style="position: absolute;top:3px; left:3px">
                    Patient Name
                </div>
                <div id="mrtopright" style="position: absolute;top:3px; right:3px">
                    Hospital
                </div>
                <div id="mrbottomright" style="position: absolute;bottom:6px; right:3px">
                    <div id="frameRate"></div>
                    <div id="zoomText">Zoom: </div>
                    <div id="sliceText" ref="sliceText">Image: </div>
                </div>
                <div id="mrbottomleft" style="position: absolute;bottom:3px; left:3px">
                    WW/WC:
                </div>
            </div>
        </div>
        <img src="" id="baseImg" />
    </div>

</template>
<script>
  import niftiLoader from '../cornerstone-loaders/nifti-loader'
  import jpegLoader from '../cornerstone-loaders/jpeg-loader'

  export default {
    props: ['item'],
    data () {
      return {
        image: '',
      }
    },
    created () {
      this.image = this.item
    },
    methods: {

    },
    mounted () {

    let THIS = this;
    const element = this.$refs.jpegImageStackScroll

    function onViewportUpdated(e, data) {
        let viewport = data.viewport;
        $('#mrbottomleft').text("WW/WC: " + Math.round(viewport.voi.windowWidth) + "/" + Math.round(viewport.voi.windowCenter));
        $('#zoomText').text("Zoom: " + viewport.scale.toFixed(2));
    };

    $(element).on("CornerstoneImageRendered", onViewportUpdated);
    
    function onNewImage(e, data) {
        console.log('onNewImage');
        let newImageIdIndex = stack.currentImageIdIndex;

        // Update the slider value
        let slider = THIS.$refs.sliceRange
        slider.value = newImageIdIndex;

        // Populate the current slice span
        let currentValueSpan = THIS.$refs.sliceText
        currentValueSpan.textContent = "Image " + (newImageIdIndex + 1) + "/" + imageIds.length;

        // if we are currently playing a clip then update the FPS
        let playClipToolData = cornerstoneTools.getToolState(element, 'playClip');
        if (playClipToolData !== undefined && !$.isEmptyObject(playClipToolData.data)) {
            $("#frameRate").text("FPS: " + Math.round(data.frameRate));
        } else {
            if ($("#frameRate").text().length > 0) {
                $("#frameRate").text("");
            }
        }
    }
    $(element).on("CornerstoneNewImage", onNewImage);

    let loopCheckbox = $("#loop");
    loopCheckbox.on('change', function() {
        let playClipToolData = cornerstoneTools.getToolState(element, 'playClip');
        playClipToolData.data[0].loop = loopCheckbox.is(":checked");
    })

    // let imageIds = [
    //     'IM-0004-0001.dcm',
    //     'IM-0004-0002.dcm',
    //     'IM-0004-0003.dcm'
    // ];

    // let imageIds = [
    //     'IM-0003-0001.tif',
    //     'IM-0003-0002.tif',
    //     'IM-0003-0003.tif'
    // ];

    let imageIds = [
        'IM-0004-0001.jpg',
        'IM-0004-0002.jpg',
        'IM-0004-0003.jpg',
        'IM-0004-0004.jpg',
        'IM-0004-0005.jpg'
    ];

    // let imageIds = [
    //     'example://1',
    //     'example://2',
    //     'example://3'
    // ];

    let stack = {
        currentImageIdIndex : 0,
        imageIds: imageIds
    };

    // Initialize range input
    let range, max, slice, currentValueSpan;
    range = this.$refs.sliceRange

    // Set minimum and maximum value
    range.min = 0;
    range.step = 1;
    range.max = imageIds.length - 1;

    // Set current value
    range.value = stack.currentImageIdIndex;

    function selectImage(event){
        console.log(' selectImage ');
        let targetElement = this.$refs.jpegImageStackScroll

        // Get the range input value
        let newImageIdIndex = parseInt(event.currentTarget.value, 10);

        // Get the stack data
        let stackToolDataSource = cornerstoneTools.getToolState(targetElement, 'stack');
        if (stackToolDataSource === undefined) {
            return;
        }
        let stackData = stackToolDataSource.data[0];

        // Switch images, if necessary
        if(newImageIdIndex !== stackData.currentImageIdIndex && stackData.imageIds[newImageIdIndex] !== undefined) {
            //THIS.drawImage(imageIds[newImageIdIndex]);
            cornerstone.loadAndCacheImage(stackData.imageIds[newImageIdIndex]).then(function(image) {
                let viewport = cornerstone.getViewport(targetElement);
                stackData.currentImageIdIndex = newImageIdIndex;
                cornerstone.displayImage(targetElement, image, viewport);
            });
        }
    }

    // Bind the range slider events
    $("#slice-range").on("input", selectImage);

    // Enable the jpegImageStackScroll element and the mouse input9++++++++++++++++++++++++++-s...
    cornerstoneTools.mouseInput.enable(element);
    cornerstoneTools.mouseWheelInput.enable(element);
    var id = imageIds[0];
    // alert('id ' + id);
    cornerstone.loadImage(`jpegLoader://${imageIds[0]}`).then(function(image) {
    // cornerstone.loadImage(`jpegLoader://${id}`).then(function(image) {
        console.log('loadImage' + JSON.stringify(image));

        // Display the image
        cornerstone.displayImage(element, image);

        // Set the stack as tool state
        cornerstoneTools.addStackStateManager(element, ['stack', 'playClip']);
        cornerstoneTools.addToolState(element, 'stack', stack);

        // Enable all tools we want to use with this element
        cornerstoneTools.stackScroll.activate(element, 1);
        cornerstoneTools.stackScrollWheel.activate(element);

        cornerstoneTools.scrollIndicator.enable(element);

        function activate(id)
        {
            $('a').removeClass('active');
            $(id).addClass('active');
        }

        $('#playClip').click(function() {
            activate("#playClip");
            cornerstoneTools.playClip(element, 31);
            return false;
        });
        $('#stopClip').click(function() {
            activate("#stopClip");
            cornerstoneTools.stopClip(element);
            $("#frameRate").text("");
            return false;
        });
    });
   },
  }
</script>
<style rel='stylesheet/scss' lang='scss'></style>

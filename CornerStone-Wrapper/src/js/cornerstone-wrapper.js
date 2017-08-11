"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jQ = require("jquery");
var CornerStoneModule;
(function (CornerStoneModule) {
    var CornerStoneWrapper = (function () {
        //constructor 
        function CornerStoneWrapper(cornerStone, imageId, elementId) {
            this.cornerstoneEl = cornerStone;
            this._imageEl = jQ(elementId).get(0);
            this.viewport = this.cornerstoneEl.getViewport(this._imageEl);
            this.renderImage(imageId, elementId);
            //registerEventHandlers();
        }
        //function 
        CornerStoneWrapper.prototype.renderImage = function (imageId, elementId) {
            var element = this._imageEl;
            this.cornerstoneEl.enable(element);
            this.cornerstoneEl.loadImage(imageId).done(function (image) {
                this.viewport = this.cornerstoneEl.getViewport(element);
                this.cornerstoneEl.displayImage(element, image);
            });
            console.log();
        };
        CornerStoneWrapper.prototype.zoomOut = function (zoomFactor, zoomLabelId) {
            if (zoomFactor > 0) {
                zoomFactor = zoomFactor * -1;
            }
            this.viewport.scale += (zoomFactor / 100);
            this.cornerstoneEl.setViewport(this.cornerstoneEl, this.viewport);
            if (zoomLabelId)
                jQ('#bottomright').text("Zoom: " + this.viewport.scale.toFixed(2) + "x");
        };
        CornerStoneWrapper.prototype.zoomIn = function (zoomFactor, zoomLabelId) {
            if (zoomFactor < 0) {
                zoomFactor = zoomFactor * -1;
            }
            this.viewport.scale += (zoomFactor / 100);
            this.cornerstoneEl.setViewport(this.cornerstoneEl, this.viewport);
            if (zoomLabelId)
                jQ('#bottomright').text("Zoom: " + this.viewport.scale.toFixed(2) + "x");
        };
        CornerStoneWrapper.prototype.changeImageSize = function (imgId, imgWrapperId, width, height) {
            jQ(imgId).width(width).height(height);
            jQ(imgWrapperId).width(width).height(height);
            this.cornerstoneEl.resize(this._imageEl);
        };
        CornerStoneWrapper.prototype.highlightSection = function (canvasId, x, y, width, ht, text, strokeWidth, strokeColor) {
            // once image has loaded set the canvas context to the image coordinate system
            // Set the nighlighted portion
            var canvas = document.getElementById(canvasId);
            var context = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = strokeColor || 'white';
            context.lineWidth = strokeWidth || .5;
            context.rect(x, y, width, ht);
            context.stroke();
            context.fillStyle = "white";
            context.font = "6px Arial";
            context.fillText(text, x, y - 10);
        };
        CornerStoneWrapper.prototype.rotate = function () {
            this.viewport.rotation += 90;
            this.cornerstoneEl.setViewport(this._imageEl, this.viewport);
        };
        CornerStoneWrapper.prototype.flipHorizintally = function () {
            this.viewport.hflip = !this.viewport.hflip;
            this.cornerstoneEl.setViewport(this._imageEl, this.viewport);
        };
        CornerStoneWrapper.prototype.flipVertically = function () {
            this.viewport.vflip = !this.viewport.vflip;
            this.cornerstoneEl.setViewport(this._imageEl, this.viewport);
        };
        CornerStoneWrapper.prototype.interpolate = function () {
            if (this.viewport.pixelReplication === true) {
                this.viewport.pixelReplication = false;
            }
            else {
                this.viewport.pixelReplication = true;
            }
            this.cornerstoneEl.setViewport(this._imageEl, this.viewport);
        };
        CornerStoneWrapper.prototype.invert = function () {
            if (this.viewport.pixelReplication === true) {
                this.viewport.pixelReplication = false;
            }
            else {
                this.viewport.pixelReplication = true;
            }
            this.cornerstoneEl.setViewport(this._imageEl, this.viewport);
        };
        return CornerStoneWrapper;
    }());
    CornerStoneModule.CornerStoneWrapper = CornerStoneWrapper;
})(CornerStoneModule || (CornerStoneModule = {}));
//# sourceMappingURL=cornerstone-wrapper.js.map
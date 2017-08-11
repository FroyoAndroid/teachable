import * as jQ from "jquery";
namespace CornerStoneModule {
    export default class CornerStoneWrapper {
        //field 
        cornerstoneEl: any;
        viewport: any;
        private _imageEl: HTMLElement;

        //constructor 
        constructor(cornerStone: any, imageId: string, elementId: string) {
            this.cornerstoneEl = cornerStone;
            this._imageEl = jQ(elementId).get(0);
            this.viewport = this.cornerstoneEl.getViewport(this._imageEl);
            this.renderImage(imageId, elementId);
            //registerEventHandlers();
        }

        //function 
        renderImage(imageId: string, elementId: string): void {
            var element = this._imageEl;
            this.cornerstoneEl.enable(element);
            this.cornerstoneEl.loadImage(imageId).done(function (image) {
                this.viewport = this.cornerstoneEl.getViewport(element);
                this.cornerstoneEl.displayImage(element, image);
            });
            console.log();
        }
        zoomOut(zoomFactor: number, zoomLabelId?: string): void {
            if (zoomFactor > 0) {
                zoomFactor = zoomFactor * -1;
            }
            this.viewport.scale += (zoomFactor / 100);
            this.cornerstoneEl.setViewport(this.cornerstoneEl, this.viewport);
            if (zoomLabelId)
                jQ('#bottomright').text("Zoom: " + this.viewport.scale.toFixed(2) + "x");
        }
        zoomIn(zoomFactor: number, zoomLabelId?: string): void {
            if (zoomFactor < 0) {
                zoomFactor = zoomFactor * -1;
            }
            this.viewport.scale += (zoomFactor / 100);
            this.cornerstoneEl.setViewport(this.cornerstoneEl, this.viewport);
            if (zoomLabelId)
                jQ('#bottomright').text("Zoom: " + this.viewport.scale.toFixed(2) + "x");
        }
        changeImageSize(imgId: string, imgWrapperId: string, width: number, height: number): void {
            jQ(imgId).width(width).height(height);
            jQ(imgWrapperId).width(width).height(height);
            this.cornerstoneEl.resize(this._imageEl);
        }
        highlightSection(canvasId: string, x: number, y: number,
            width: number, ht: number, text: string, strokeWidth?: number, strokeColor?: string): void {

            // once image has loaded set the canvas context to the image coordinate system

            // Set the nighlighted portion
            let canvas: any = document.getElementById(canvasId);
            let context: any = canvas.getContext('2d');
            context.beginPath();
            context.strokeStyle = strokeColor || 'white';
            context.lineWidth = strokeWidth || .5;
            context.rect(x, y, width, ht);
            context.stroke();
            context.fillStyle = "white";
            context.font = "6px Arial";
            context.fillText(text, x, y - 10);

        }
        rotate(): void {
            this.viewport.rotation += 90;
            this.cornerstoneEl.setViewport(this._imageEl, this.viewport);
        }
        flipHorizintally(): void {
            this.viewport.hflip = !this.viewport.hflip;
            this.cornerstoneEl.setViewport(this._imageEl, this.viewport);
        }
        flipVertically(): void {
            this.viewport.vflip = !this.viewport.vflip;
            this.cornerstoneEl.setViewport(this._imageEl, this.viewport);
        }
        interpolate(): void {

            if (this.viewport.pixelReplication === true) {
                this.viewport.pixelReplication = false;
            } else {
                this.viewport.pixelReplication = true;
            }
            this.cornerstoneEl.setViewport(this._imageEl, this.viewport);
        }
        invert(): void {
            if (this.viewport.pixelReplication === true) {
                this.viewport.pixelReplication = false;
            } else {
                this.viewport.pixelReplication = true;
            }
            this.cornerstoneEl.setViewport(this._imageEl, this.viewport);
        }
    }
}
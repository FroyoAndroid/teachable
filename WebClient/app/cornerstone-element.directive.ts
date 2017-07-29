import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[myCornerstoneElement]',
})
export class CornerstoneElementDirective {
    @Input('myCornerstoneElement') imageId: string;
    
    constructor(private elementRef: ElementRef) {
       
    }
    /*Called after every change to input properties and before processing content or child views.*/
    ngOnChanges () {
        // If no imageId is given, do nothing
        if (!this.imageId) {
            return;
        }

        // Retrieve the DOM element itself
        var element = this.elementRef.nativeElement;
      

        cornerstoneWebImageLoader.configure({
           beforeSend: function(xhr) {
               // Add custom headers here (e.g. auth tokens)
               //xhr.setRequestHeader('x-auth-token', 'my auth token');
           }
        });
        // Enable the element with Cornerstone
        cornerstone.enable(element);
  
            // Load the image and enable tools wirh custom webimage loader
            cornerstoneWebImageLoader.loadImage(this.imageId).then(function(image) {

                cornerstone.displayImage(element, image);
                cornerstoneTools.mouseInput.enable(element);
                cornerstoneTools.mouseWheelInput.enable(element);

                // Enable all tools we want to use with this element
                cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
                cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
                cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
                cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
            });
          
    }
}
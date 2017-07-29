import {Component} from '@angular/core';

/*Import image service to communicate with server web services*/
import { 
   ImageService 
} from './_services/image.service';  

@Component({
    selector: 'my-app',
    templateUrl:  'app/app.component.html',
    providers : [ImageService],    
})
export class AppComponent { 

    name = 'User'; 
    imageData = '';

    constructor(private imageService: ImageService) {}
   
    //Method to call image API and show data
    displayImage() {
        this.imageService.getImage().subscribe(data => this.imageData = data[11] );
    }


}
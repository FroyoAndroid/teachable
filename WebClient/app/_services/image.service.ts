import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
//import the file that refers to global constants
import { GlobalVariable } from '../global.js';

@Injectable()
export class ImageService {
  constructor (
    private http: Http
  ) {}

  /* Get the list of images from server */
  getImage() {
    return this.http.get("http://192.168.100.109:3005/images/"+GlobalVariable.GET_IMAGE_URI)
    .map((res:Response) => {
      res.json();
    });
  }

}
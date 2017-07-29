System.register(['@angular/core', '@angular/http', 'rxjs/add/operator/map', '../global.js'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, global_js_1;
    var ImageService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (global_js_1_1) {
                global_js_1 = global_js_1_1;
            }],
        execute: function() {
            ImageService = (function () {
                function ImageService(http) {
                    this.http = http;
                }
                /* Get the list of images from server */
                ImageService.prototype.getImage = function () {
                    return this.http.get("http://192.168.100.109:3005/images/" + global_js_1.GlobalVariable.GET_IMAGE_URI)
                        .map(function (res) {
                        res.json();
                    });
                };
                ImageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ImageService);
                return ImageService;
            }());
            exports_1("ImageService", ImageService);
        }
    }
});
//# sourceMappingURL=image.service.js.map
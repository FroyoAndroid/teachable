import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { routing } from './app.routing';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app.component';
import { CornerstoneElementDirective } from './cornerstone-element.directive';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { LoginComponent } from './login/index';
import { StudyListComponent } from './studyList/index';

//NgModules help organize an application into cohesive blocks of functionality.
@NgModule({
  imports: [BrowserModule, HttpModule, routing, FormsModule],
  declarations: [
    AppComponent, CornerstoneElementDirective,
    Ng2SmartTableModule, LocalDataSource,
    LoginComponent, StudyListComponent
    ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }

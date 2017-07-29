import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/index';
import { StudyListComponent } from './studyList/index';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    {path: 'study', component: StudyListComponent},
    // otherwise redirect to home
    { path: '**', redirectTo: 'login' }
];

export const routing = RouterModule.forRoot(appRoutes);
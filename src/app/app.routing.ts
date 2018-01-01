import { ContactsComponent } from './contacts/contacts/contacts.component';
import{Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth/auth.component';



const APP_ROUTES:Routes=[
    {path:'',redirectTo:'/',pathMatch:'full'},
    {path:'home',component:ContactsComponent},
    {path:'',component:AuthComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);

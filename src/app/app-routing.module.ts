import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { MenuComponent } from './menu/menu.component';
import {NotFoundComponent} from './not-found/not-found.component';
import{ContactComponent} from './contact/contact.component';
import{MessageSentComponent} from './message-sent/message-sent.component';

const routes: Routes = [
	{path: 'admin', component: AdminComponent},
	{path: 'main', component: MenuComponent},
	{path: '', redirectTo: '/main', pathMatch: 'full'},
	{path: 'comic/:comicNum', component: MenuComponent},
	{path: '404', component: NotFoundComponent},
	{path: 'contact', component: ContactComponent},
	{path: 'messageSent', component: MessageSentComponent},
	{path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})

export class AppRoutingModule {}
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component'
import { MenuComponent } from './menu/menu.component'

const routes: Routes = [
	{path: 'admin', component: AdminComponent},
	{path: 'main', component: MenuComponent},
	{path: '', redirectTo: '/main', pathMatch: 'full'},
];

@NgModule({
	imports: [RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})

export class AppRoutingModule {}
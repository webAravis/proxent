import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { DashComponent } from './dash/dash.component';
import { ShootingComponent } from './shooting/shooting.component';
import { GirlsComponent } from './girls/girls.component';
import { CorruptComponent } from './corrupt/corrupt.component';
import { RecordComponent } from './record/record.component';
import { StudioComponent } from './studio/studio.component';
import { InventoryComponent } from './inventory/inventory.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: StartComponent,
	},
	{
		path: 'main',
		component: DashComponent,
	},
	{
		path: 'shooting',
		component: ShootingComponent,
	},
	{
		path: 'corrupt',
		component: CorruptComponent,
	},
	{
		path: 'record',
		component: RecordComponent,
	},
	{
		path: 'studio',
		component: StudioComponent,
	},
	{
		path: 'girls',
		component: GirlsComponent,
	},
	{
		path: 'inventory',
		component: InventoryComponent,
	},
	{
		path: '**',
		component: StartComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})
export class AppRoutingModule {}

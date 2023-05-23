import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { DashComponent } from './dash/dash.component';
import { ShootingComponent } from './shooting/shooting.component';
import { GirlsComponent } from './girls/girls.component';
import { CorruptComponent } from './corrupt/corrupt.component';
import { RecordComponent } from './record/record.component';
import { StudioComponent } from './studio/studio.component';
import { InventoryComponent } from './inventory/inventory.component';
import { LeadersComponent } from './leaders/leaders.component';
import { LeaderBattleComponent } from './leader-battle/leader-battle.component';
import { SkillsComponent } from './skills/skills.component';
import { SettingsComponent } from './settings/settings.component';

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
		path: 'leaders',
		component: LeadersComponent,
	},
	{
		path: 'battle',
		component: LeaderBattleComponent,
	},
	{
		path: 'skills',
		component: SkillsComponent,
	},
	{
		path: 'settings',
		component: SettingsComponent,
	},
	{
		path: '**',
		component: StartComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules})],
	exports: [RouterModule],
})
export class AppRoutingModule {}

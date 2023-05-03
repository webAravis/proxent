import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { DashComponent } from './dash/dash.component';
import { StatusComponent } from './status/status.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DialogsComponent } from './dialogs/dialogs.component';
import { ShootingComponent } from './shooting/shooting.component';
import { RewardComponent } from './reward/reward.component';
import { GirlsComponent } from './girls/girls.component';
import { HttpClientModule } from '@angular/common/http';
import { CorruptComponent } from './corrupt/corrupt.component';
import { RecordComponent } from './record/record.component';
import { StudioComponent } from './studio/studio.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ResultsComponent } from './record/results/results.component';
import { FreedomComponent } from './girls/freedom/freedom.component';
import { NewRecordComponent } from './new-record/new-record.component';
import { CeremonyComponent } from './ceremony/ceremony.component';
import { BackgroundComponent } from './girls/background/background.component';
import { SelectorComponent } from './girls/selector/selector.component';
import { StudioRecordsComponent } from './studio/studio-records/studio-records.component';

@NgModule({
	declarations: [
		AppComponent,
		StartComponent,
		DashComponent,
		StatusComponent,
		NavigationComponent,
		DialogsComponent,
		ShootingComponent,
		RewardComponent,
		GirlsComponent,
		CorruptComponent,
		RecordComponent,
		StudioComponent,
		InventoryComponent,
		ResultsComponent,
		FreedomComponent,
		NewRecordComponent,
		CeremonyComponent,
		BackgroundComponent,
		SelectorComponent,
		StudioRecordsComponent,
	],
	imports: [BrowserModule, AppRoutingModule, HttpClientModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}

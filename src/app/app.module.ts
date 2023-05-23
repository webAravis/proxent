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
import { SaveChooserComponent } from './start/save-chooser/save-chooser.component';
import { LeadersComponent } from './leaders/leaders.component';
import { LeaderBattleComponent } from './leader-battle/leader-battle.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkillsComponent } from './skills/skills.component';
import { SettingsComponent } from './settings/settings.component';

import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NewGameComponent } from './start/new-game/new-game.component';

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
    SaveChooserComponent,
    LeadersComponent,
    LeaderBattleComponent,
    SkillsComponent,
    SettingsComponent,
    NewGameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxMasonryModule,
    MatSliderModule,
    MatInputModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

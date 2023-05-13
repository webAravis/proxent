import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Girl } from './girl.model';
import { DialogsService } from 'src/app/dialogs/dialogs.service';
import { Position } from '../position.model';

@Injectable({
	providedIn: 'root',
})
export class GirlsService {
	currentGirl: BehaviorSubject<Girl> = new BehaviorSubject<Girl>(new Girl());
	playerGirls: BehaviorSubject<Girl[]> = new BehaviorSubject<Girl[]>([]);
	gameGirls: BehaviorSubject<Girl[]> = new BehaviorSubject<Girl[]>([]);

  girlTimings: {girlId: number, timings: Position[]}[] = [];

	constructor(
    private _httpClient: HttpClient,
    private _dialogsService: DialogsService
  ) {
    this.loadTimings();

		this.loadGirls();
	}

  loadTimings(): void {
    this.girlTimings.push(
      {girlId: 1, timings: [
        {
          "name": "intro",
          "corruption": 0,
          "timing": [],

          "xp": 0,
          "gold": 0,
          "fans": 0,

          "timeout": 4000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "tease",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 80,
          "fans": 100,

          "timeout": 7000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "rub",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 120,
          "fans": 80,

          "timeout": 10000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "handjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 140,
          "fans": 180,

          "timeout": 2000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "masturbate",
          "corruption": 2,
          "timing": [],

          "xp": 100,
          "gold": 160,
          "fans": 50,

          "timeout": 10000,

          "stamcost": 100,
          "orgasm": 10
        },
        {
          "name": "boobjob",
          "corruption": 3,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 180,
          "fans": 90,

          "timeout": 10000,

          "stamcost": 125,
          "orgasm": 15
        },
        {
          "name": "blowjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 200,
          "fans": 60,

          "timeout": 7000,

          "stamcost": 150,
          "orgasm": 15
        },
        {
          "name": "missionary",
          "corruption": 6,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 220,
          "fans": 120,

          "timeout": 10000,

          "stamcost": 175,
          "orgasm": 40
        },
        {
          "name": "reversecowgirl",
          "corruption": 8,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 240,
          "fans": 230,

          "timeout": 10000,

          "stamcost": 200,
          "orgasm": 40
        },
        {
          "name": "cowgirl",
          "corruption": 6,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 260,
          "fans": 300,

          "timeout": 5000,

          "stamcost": 225,
          "orgasm": 40
        },
        {
          "name": "doggy",
          "corruption": 6,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 300,
          "fans": 350,

          "timeout": 10000,

          "stamcost": 250,
          "orgasm": 40
        },
        {
          "name": "doggy2",
          "corruption": 9,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 150,
          "gold": 350,
          "fans": 600,

          "timeout": 7000,

          "stamcost": 275,
          "orgasm": 60
        },
        {
          "name": "standing",
          "corruption": 10,
          "timing": [1500, 2000, 3000, 3500],

          "xp": 100,
          "gold": 350,
          "fans": 250,

          "timeout": 5000,

          "stamcost": 300,
          "orgasm": 75
        }
      ]
      },
      {girlId: 2, timings: [
        {
          "name": "intro",
          "corruption": 0,
          "timing": [],

          "xp": 0,
          "gold": 0,
          "fans": 0,

          "timeout": 4000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "tease",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 80,
          "fans": 100,

          "timeout": 7000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "rub",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 120,
          "fans": 80,

          "timeout": 5000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "handjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 140,
          "fans": 180,

          "timeout": 10000,

          "stamcost": 100,
          "orgasm": 10
        },
        {
          "name": "masturbate",
          "corruption": 2,
          "timing": [],

          "xp": 100,
          "gold": 160,
          "fans": 50,

          "timeout": 4000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "boobjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 180,
          "fans": 90,

          "timeout": 3000,

          "stamcost": 125,
          "orgasm": 15
        },
        {
          "name": "blowjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 200,
          "fans": 60,

          "timeout": 3000,

          "stamcost": 150,
          "orgasm": 15
        },
        {
          "name": "missionary",
          "corruption": 6,
          "timing": [500, 950, 1380, 1890, 2270, 2750, 3220, 3700, 4200, 4600, 5000, 5450, 5870, 6310, 6710, 7050, 7500, 7920, 8300, 8770, 9200, 9650],

          "xp": 100,
          "gold": 220,
          "fans": 120,

          "timeout": 10000,

          "stamcost": 175,
          "orgasm": 40
        },
        {
          "name": "reversecowgirl",
          "corruption": 8,
          "timing": [510, 960, 1460, 1950, 2800, 3800, 4680, 5550, 6300, 7230, 8100, 8990],

          "xp": 100,
          "gold": 240,
          "fans": 230,

          "timeout": 10000,

          "stamcost": 200,
          "orgasm": 40
        },
        {
          "name": "cowgirl",
          "corruption": 6,
          "timing": [270, 590, 880, 1200, 1520, 1810, 2130, 2460, 2720, 3030, 3360, 3660, 3980, 4670],

          "xp": 100,
          "gold": 260,
          "fans": 300,

          "timeout": 5000,

          "stamcost": 225,
          "orgasm": 40
        },
        {
          "name": "cowgirl2",
          "corruption": 6,
          "timing": [270, 590, 880, 1200, 1520, 1810, 2130, 2460, 2720, 3030, 3360, 3660, 3980, 4670],

          "xp": 100,
          "gold": 260,
          "fans": 300,

          "timeout": 5000,

          "stamcost": 225,
          "orgasm": 40
        },
        {
          "name": "doggy",
          "corruption": 6,
          "timing": [510, 980, 1390, 1780, 2240, 2640, 3050, 3550, 3970, 4440, 4880],

          "xp": 100,
          "gold": 300,
          "fans": 350,

          "timeout": 5000,

          "stamcost": 250,
          "orgasm": 40
        },
        {
          "name": "doggy2",
          "corruption": 9,
          "timing": [370, 690, 1060, 1410, 1780, 2100, 2360, 2730, 3030, 3350, 3670, 3990, 4290, 4570, 4860, 5200, 5550, 5780, 6070, 6410, 6700, 6960, 7320, 7620, 7960, 8240, 8510, 8860, 9140, 9430],

          "xp": 150,
          "gold": 350,
          "fans": 600,

          "timeout": 10000,

          "stamcost": 275,
          "orgasm": 60
        },
        {
          "name": "doggy3",
          "corruption": 9,
          "timing": [370, 690, 1060, 1410, 1780, 2100, 2360, 2730, 3030, 3350, 3670, 3990, 4290, 4570, 4860, 5200, 5550, 5780, 6070, 6410, 6700, 6960, 7320, 7620, 7960, 8240, 8510, 8860, 9140, 9430],

          "xp": 150,
          "gold": 350,
          "fans": 600,

          "timeout": 6000,

          "stamcost": 275,
          "orgasm": 60
        },
        {
          "name": "standing",
          "corruption": 10,
          "timing": [390, 760, 1050, 1540, 1870, 2150, 2520, 2850, 3180, 3500, 3930, 4250, 4530, 4880, 5260, 5580, 5880, 6260, 6580, 6880, 7260, 7580, 7880, 8260, 8580, 8880, 9260, 9580, 9880],

          "xp": 100,
          "gold": 350,
          "fans": 250,

          "timeout": 10000,

          "stamcost": 300,
          "orgasm": 75
        }
      ]
      },
      {girlId: 3, timings: [
        {
          "name": "intro",
          "corruption": 0,
          "timing": [],

          "xp": 0,
          "gold": 0,
          "fans": 0,

          "timeout": 4000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "tease",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 80,
          "fans": 100,

          "timeout": 6000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "rub",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 120,
          "fans": 80,

          "timeout": 10000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "handjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 140,
          "fans": 180,

          "timeout": 4000,

          "stamcost": 100,
          "orgasm": 10
        },
        {
          "name": "masturbate",
          "corruption": 2,
          "timing": [],

          "xp": 100,
          "gold": 160,
          "fans": 50,

          "timeout": 7000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "boobjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 180,
          "fans": 90,

          "timeout": 10000,

          "stamcost": 125,
          "orgasm": 15
        },
        {
          "name": "blowjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 200,
          "fans": 60,

          "timeout": 3000,

          "stamcost": 150,
          "orgasm": 15
        },
        {
          "name": "missionary",
          "corruption": 6,
          "timing": [],

          "xp": 100,
          "gold": 220,
          "fans": 120,

          "timeout": 10000,

          "stamcost": 175,
          "orgasm": 40
        },
        {
          "name": "reversecowgirl",
          "corruption": 8,
          "timing": [],

          "xp": 100,
          "gold": 240,
          "fans": 230,

          "timeout": 10000,

          "stamcost": 200,
          "orgasm": 40
        },
        {
          "name": "cowgirl",
          "corruption": 6,
          "timing": [],

          "xp": 100,
          "gold": 260,
          "fans": 300,

          "timeout": 10000,

          "stamcost": 225,
          "orgasm": 40
        },
        {
          "name": "doggy",
          "corruption": 6,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 300,
          "fans": 350,

          "timeout": 10000,

          "stamcost": 250,
          "orgasm": 40
        },
        {
          "name": "doggy2",
          "corruption": 9,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 150,
          "gold": 350,
          "fans": 600,

          "timeout": 10000,

          "stamcost": 275,
          "orgasm": 60
        },
        {
          "name": "standing",
          "corruption": 10,
          "timing": [1500, 2000, 3000, 3500],

          "xp": 100,
          "gold": 350,
          "fans": 250,

          "timeout": 10000,

          "stamcost": 300,
          "orgasm": 75
        }
      ]
      },
      {girlId: 4, timings: [
        {
          "name": "intro",
          "corruption": 0,
          "timing": [],

          "xp": 0,
          "gold": 0,
          "fans": 0,

          "timeout": 4000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "tease",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 80,
          "fans": 100,

          "timeout": 10000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "rub",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 120,
          "fans": 80,

          "timeout": 10000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "handjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 140,
          "fans": 180,

          "timeout": 7000,

          "stamcost": 100,
          "orgasm": 10
        },
        {
          "name": "masturbate",
          "corruption": 2,
          "timing": [],

          "xp": 100,
          "gold": 160,
          "fans": 50,

          "timeout": 8000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "boobjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 180,
          "fans": 90,

          "timeout": 10000,

          "stamcost": 125,
          "orgasm": 15
        },
        {
          "name": "blowjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 200,
          "fans": 60,

          "timeout": 5000,

          "stamcost": 150,
          "orgasm": 15
        },
        {
          "name": "missionary",
          "corruption": 6,
          "timing": [],

          "xp": 100,
          "gold": 220,
          "fans": 120,

          "timeout": 6000,

          "stamcost": 175,
          "orgasm": 40
        },
        {
          "name": "reversecowgirl",
          "corruption": 8,
          "timing": [],

          "xp": 100,
          "gold": 240,
          "fans": 230,

          "timeout": 10000,

          "stamcost": 200,
          "orgasm": 40
        },
        {
          "name": "cowgirl",
          "corruption": 6,
          "timing": [],

          "xp": 100,
          "gold": 260,
          "fans": 300,

          "timeout": 5000,

          "stamcost": 225,
          "orgasm": 40
        },
        {
          "name": "doggy",
          "corruption": 6,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 300,
          "fans": 350,

          "timeout": 5000,

          "stamcost": 250,
          "orgasm": 40
        },
        {
          "name": "doggy2",
          "corruption": 9,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 150,
          "gold": 350,
          "fans": 600,

          "timeout": 10000,

          "stamcost": 275,
          "orgasm": 60
        },
        {
          "name": "standing",
          "corruption": 10,
          "timing": [1500, 2000, 3000, 3500],

          "xp": 100,
          "gold": 350,
          "fans": 250,

          "timeout": 8000,

          "stamcost": 300,
          "orgasm": 75
        }
      ]
      },
      {girlId: 5, timings: [
        {
          "name": "intro",
          "corruption": 0,
          "timing": [],

          "xp": 0,
          "gold": 0,
          "fans": 0,

          "timeout": 4000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "tease",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 80,
          "fans": 100,

          "timeout": 10000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "rub",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 120,
          "fans": 80,

          "timeout": 7000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "reveal",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 140,
          "fans": 180,

          "timeout": 10000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "masturbate",
          "corruption": 2,
          "timing": [],

          "xp": 100,
          "gold": 160,
          "fans": 50,

          "timeout": 10000,

          "stamcost": 100,
          "orgasm": 10
        },
        {
          "name": "boobjob",
          "corruption": 3,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 180,
          "fans": 90,

          "timeout": 10000,

          "stamcost": 125,
          "orgasm": 15
        },
        {
          "name": "blowjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 200,
          "fans": 60,

          "timeout": 10000,

          "stamcost": 150,
          "orgasm": 15
        },
        {
          "name": "missionary",
          "corruption": 6,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 220,
          "fans": 120,

          "timeout": 10000,

          "stamcost": 175,
          "orgasm": 40
        },
        {
          "name": "reversecowgirl",
          "corruption": 8,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 240,
          "fans": 230,

          "timeout": 7000,

          "stamcost": 200,
          "orgasm": 40
        },
        {
          "name": "cowgirl",
          "corruption": 6,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 260,
          "fans": 300,

          "timeout": 10000,

          "stamcost": 225,
          "orgasm": 40
        },
        {
          "name": "doggy",
          "corruption": 6,
          "timing": [400, 810, 1210, 1570, 1930, 2310, 2680, 3020, 3420, 3740, 4100, 4510, 4890, 5240, 5600, 6000, 6370, 6740, 7140, 7520, 7910, 8290, 8630, 9010, 9400, 9800],

          "xp": 100,
          "gold": 300,
          "fans": 350,

          "timeout": 10000,

          "stamcost": 250,
          "orgasm": 40
        },
        {
          "name": "doggy2",
          "corruption": 9,
          "timing": [370, 1120, 1790, 2460, 3250, 4270, 5950, 7860, 8880],

          "xp": 150,
          "gold": 350,
          "fans": 600,

          "timeout": 10000,

          "stamcost": 275,
          "orgasm": 60
        },
        {
          "name": "standing",
          "corruption": 10,
          "timing": [200, 530, 900, 1230, 1600, 2000, 2300, 2640, 3000, 3330, 3700, 4000, 4450, 4810, 5240, 5550, 5996, 6340, 6740, 7130, 7520, 7860, 8270, 8650, 9100, 9350, 9750],

          "xp": 100,
          "gold": 350,
          "fans": 250,

          "timeout": 10000,

          "stamcost": 300,
          "orgasm": 75
        }
      ]
      },
      {girlId: 6, timings: [
        {
          "name": "intro",
          "corruption": 0,
          "timing": [],

          "xp": 0,
          "gold": 0,
          "fans": 0,

          "timeout": 4000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "tease",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 80,
          "fans": 100,

          "timeout": 8000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "rub",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 120,
          "fans": 80,

          "timeout": 4000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "handjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 140,
          "fans": 180,

          "timeout": 7000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "masturbate",
          "corruption": 2,
          "timing": [],

          "xp": 100,
          "gold": 160,
          "fans": 50,

          "timeout": 10000,

          "stamcost": 100,
          "orgasm": 10
        },
        {
          "name": "boobjob",
          "corruption": 3,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 180,
          "fans": 90,

          "timeout": 10000,

          "stamcost": 125,
          "orgasm": 15
        },
        {
          "name": "blowjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 200,
          "fans": 60,

          "timeout": 10000,

          "stamcost": 150,
          "orgasm": 15
        },
        {
          "name": "missionary",
          "corruption": 6,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 220,
          "fans": 120,

          "timeout": 10000,

          "stamcost": 175,
          "orgasm": 40
        },
        {
          "name": "reversecowgirl",
          "corruption": 8,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 240,
          "fans": 230,

          "timeout": 10000,

          "stamcost": 200,
          "orgasm": 40
        },
        {
          "name": "cowgirl",
          "corruption": 6,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 260,
          "fans": 300,

          "timeout": 10000,

          "stamcost": 225,
          "orgasm": 40
        },
        {
          "name": "doggy",
          "corruption": 6,
          "timing": [400, 810, 1210, 1570, 1930, 2310, 2680, 3020, 3420, 3740, 4100, 4510, 4890, 5240, 5600, 6000, 6370, 6740, 7140, 7520, 7910, 8290, 8630, 9010, 9400, 9800],

          "xp": 100,
          "gold": 300,
          "fans": 350,

          "timeout": 7000,

          "stamcost": 250,
          "orgasm": 40
        },
        {
          "name": "doggy2",
          "corruption": 9,
          "timing": [370, 1120, 1790, 2460, 3250, 4270, 5950, 7860, 8880],

          "xp": 150,
          "gold": 350,
          "fans": 600,

          "timeout": 10000,

          "stamcost": 275,
          "orgasm": 60
        },
        {
          "name": "standing",
          "corruption": 10,
          "timing": [200, 530, 900, 1230, 1600, 2000, 2300, 2640, 3000, 3330, 3700, 4000, 4450, 4810, 5240, 5550, 5996, 6340, 6740, 7130, 7520, 7860, 8270, 8650, 9100, 9350, 9750],

          "xp": 100,
          "gold": 350,
          "fans": 250,

          "timeout": 10000,

          "stamcost": 300,
          "orgasm": 75
        }
      ]
      },
      {girlId: 7, timings: [
        {
          "name": "intro",
          "corruption": 0,
          "timing": [],

          "xp": 0,
          "gold": 0,
          "fans": 0,

          "timeout": 4000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "tease",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 80,
          "fans": 100,

          "timeout": 10000,

          "stamcost": 0,
          "orgasm": 0
        },
        {
          "name": "twerk",
          "corruption": 0,
          "timing": [],

          "xp": 100,
          "gold": 120,
          "fans": 80,

          "timeout": 10000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "spank",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 140,
          "fans": 180,

          "timeout": 10000,

          "stamcost": 100,
          "orgasm": 10
        },
        {
          "name": "masturbate",
          "corruption": 2,
          "timing": [],

          "xp": 100,
          "gold": 160,
          "fans": 50,

          "timeout": 7000,

          "stamcost": 0,
          "orgasm": 10
        },
        {
          "name": "blowjob",
          "corruption": 3,
          "timing": [],

          "xp": 100,
          "gold": 200,
          "fans": 60,

          "timeout": 3000,

          "stamcost": 150,
          "orgasm": 15
        },
        {
          "name": "missionary",
          "corruption": 5,
          "timing": [],

          "xp": 100,
          "gold": 220,
          "fans": 120,

          "timeout": 10000,

          "stamcost": 175,
          "orgasm": 40
        },
        {
          "name": "doggy",
          "corruption": 5,
          "timing": [],

          "xp": 100,
          "gold": 240,
          "fans": 230,

          "timeout": 10000,

          "stamcost": 200,
          "orgasm": 40
        },
        {
          "name": "cowgirl",
          "corruption": 6,
          "timing": [],

          "xp": 100,
          "gold": 260,
          "fans": 300,

          "timeout": 10000,

          "stamcost": 225,
          "orgasm": 40
        },
        {
          "name": "doggy2",
          "corruption": 7,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 100,
          "gold": 300,
          "fans": 350,

          "timeout": 10000,

          "stamcost": 250,
          "orgasm": 40
        },
        {
          "name": "cowgirl2",
          "corruption": 8,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 150,
          "gold": 350,
          "fans": 600,

          "timeout": 10000,

          "stamcost": 275,
          "orgasm": 60
        },
        {
          "name": "standing",
          "corruption": 9,
          "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

          "xp": 150,
          "gold": 350,
          "fans": 600,

          "timeout": 10000,

          "stamcost": 275,
          "orgasm": 60
        },
        {
          "name": "doggy3",
          "corruption": 10,
          "timing": [1500, 2000, 3000, 3500],

          "xp": 100,
          "gold": 350,
          "fans": 250,

          "timeout": 10000,

          "stamcost": 300,
          "orgasm": 75
        }
      ]
      }
    );
  }

	loadGirls(): void {
		const unlockedGirls = [];
		const allGirls = [];

		const yiny = new Girl();
		yiny.id = 1;
		yiny.name = 'Yiny';
		yiny.freedom = 0;

		unlockedGirls.push(yiny);
		allGirls.push(yiny);

		this.playerGirls.next(unlockedGirls);

		const peta = new Girl();
		peta.id = 2;
		peta.name = 'Peta';
		peta.freedom = 1;

		allGirls.push(peta);

		const ava = new Girl();
		ava.id = 3;
		ava.name = 'Ava';
		ava.freedom = 1;
		ava.unlockPrice = [
			{ type: 'gold', quantity: 15_000 },
			{ type: 'recordmonthly_badge', quantity: 2 },
		];

		allGirls.push(ava);

		const madison = new Girl();
		madison.id = 4;
		madison.name = 'Madison';
		madison.freedom = 1;
		madison.unlockPrice = [
			{ type: 'gold', quantity: 15_000 },
			{ type: 'fans_badge', quantity: 2 },
		];

		allGirls.push(madison);

		const karma = new Girl();
		karma.id = 5;
		karma.name = 'Karma';
		karma.freedom = 1;
		karma.unlockPrice = [
			{ type: 'gold', quantity: 15_000 },
			{ type: 'money_badge', quantity: 2 },
		];

		allGirls.push(karma);

		const nikki = new Girl();
		nikki.id = 6;
		nikki.name = 'Nikki';
		nikki.freedom = 1;
		nikki.unlockPrice = [
			{ type: 'gold', quantity: 15_000 },
			{ type: 'recordyearly_badge', quantity: 2 },
		];

		allGirls.push(nikki);

		const abella = new Girl();
		abella.id = 7;
		abella.name = 'Abella';
		abella.freedom = 1;
		abella.unlockPrice = [
			{ type: 'gold', quantity: 20_000 },
			{ type: 'recordmonthly_badge', quantity: 3 },
		];

		allGirls.push(abella);

    let toSave = this.initAttributes(allGirls);
		this.gameGirls.next(toSave);
	}

  initAttributes(girls: Girl[]) : Girl[] {
    const toReturn: Girl[] = [];

    for (const girl of girls) {
      switch (girl.name) {
        case 'Peta':
          girl.attributes = ['brunette', 'tattoo', 'fit', 'dark eyes', 'american'];
          break;
        case 'Ava':
          girl.attributes = ['milf', 'brunette', 'dark eyes', 'euro'];
          break;
        case 'Madison':
          girl.attributes = ['blond', 'fit', 'flexible', 'dark eyes', 'small', 'euro'];
          break;
        case 'Karma':
          girl.attributes = ['blond', 'green eyes', 'tattoo', 'american'];
          break;
        case 'Nikki':
          girl.attributes = ['blond', 'dark eyes', 'producer', 'euro'];
          break;
        case 'Abella':
          girl.attributes = ['teen', 'brunette', 'dark eyes', 'natural boobs', 'american'];
          break;
      }

      toReturn.push(girl);
    }

    return toReturn;
  }

	addGirl(girl: Girl): void {
		const allGirls = this.playerGirls.getValue();
		allGirls.push(girl);

		this.playerGirls.next(allGirls);
    if (allGirls.length-1 >= 2 && this._dialogsService.dialogsStarted[7] === false) {
      this._dialogsService.startDialog(7);
    }
	}

  removeGirl(toRemove: Girl): void {
    const filteredGirls = this.playerGirls.getValue().filter((girl: Girl) => girl.id !== toRemove.id);
    this.playerGirls.next(filteredGirls);
  }

	getTimingRecord(girl: Girl): Position[] {
		return this.girlTimings.find((timing: {girlId: number, timings: Position[]}) => timing.girlId === girl.id)?.timings ?? [];
	}

	updateGirl(girl: Girl): void {
		const allGirls = this.playerGirls.getValue();
		const filtered = allGirls.filter((savedGirl) => savedGirl.id !== girl.id);
		filtered.push(girl);

		this.playerGirls.next(filtered);
	}

	unlockPosition(position: string, girl: Girl): void {
		girl.unlockedPostions.push(position);

		this.updateGirl(girl);
	}

	_fileExists(url: string): Observable<boolean> {
		return this._httpClient.get(url).pipe(
			map(() => true),
			catchError(() => of(false))
		);
	}
}

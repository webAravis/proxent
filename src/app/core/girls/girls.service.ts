import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Girl } from './girl.model';
import { DialogsService } from 'src/app/dialogs/dialogs.service';
import { Position, PositionType } from '../position.model';

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
        new Position({
          "name": "intro",
          "label": "Intro",
          "corruption": 0,
          "timeout": 4000,

          "type": PositionType.INTRO,
          "unlocker": undefined
        }),
        new Position({
          "name": "tease",
          "label": "Tease",
          "corruption": 0,
          "timeout": 7000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "rub",
          "label": "Rub",
          "corruption": 0,
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "masturbate",
          "label": "Masturbate",
          "corruption": 2,
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "handjob",
          "label": "Handjob",
          "corruption": 3,
          "timeout": 2000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "boobjob",
          "label": "Boobjob",
          "corruption": 3,
          "timeout": 10000,

          "type": PositionType.FOREPLAY
        }),
        new Position({
          "name": "blowjob",
          "label": "Blowjob",
          "corruption": 3,
          "timeout": 7000,

          "type": PositionType.FOREPLAY,
          "unlocker": new Position({
            "name": "blowjob2",
            "label": "Blowjob 2",
            "corruption": 4,
            "timeout": 5000,

            "type": PositionType.FOREPLAY_SKILL,
            "unlocker": new Position({
              "name": "blowjob3",
              "label": "Blowjob 3",
              "corruption": 5,
              "timeout": 10000,

              "type": PositionType.FOREPLAY_SKILL,
              "unlocker": new Position({
                "name": "blowjob4",
                "label": "Blowjob 4",
                "corruption": 6,
                "timeout": 10000,

                "type": PositionType.FOREPLAY_SKILL,
                "unlocker": new Position({
                  "name": "blowjob5",
                  "label": "Blowjob 5",
                  "corruption": 7,
                  "timeout": 5000,

                  "type": PositionType.FOREPLAY_SKILL
                })
              })
            })
          })
        }),
        new Position({
          "name": "missionary",
          "label": "Missionary",
          "corruption": 6,
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "missionary2",
            "label": "Missionary 2",
            "corruption": 7,
            "timeout": 5000,

            "type": PositionType.PENETRATION
          })
        }),
        new Position({
          "name": "reversecowgirl",
          "label": "Reverse Cowgirl",
          "corruption": 8,
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "reversecowgirl2",
            "label": "Reverse Cowgirl 2",
            "corruption": 9,
            "timeout": 10000,

            "type": PositionType.PENETRATION,
            "unlocker": new Position({
              "name": "reversecowgirl3",
              "label": "Reverse Cowgirl 3",
              "corruption": 10,
              "timeout": 10000,

              "type": PositionType.SKILL,
              "unlocker": new Position({
                "name": "reversecowgirl4",
                "label": "Reverse Cowgirl 4",
                "corruption": 11,
                "timeout": 5000,

                "type": PositionType.SKILL,
                "unlocker": undefined
              })
            })
          }),
        }),
        new Position({
          "name": "cowgirl",
          "label": "Cowgirl",
          "corruption": 6,
          "timeout": 5000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "cowgirl2",
            "label": "Cowgirl 2",
            "corruption": 7,
            "timeout": 5000,

            "type": PositionType.PENETRATION,
            "unlocker": new Position({
              "name": "cowgirl3",
              "label": "Cowgirl 3",
              "corruption": 8,
              "timeout": 10000,

              "type": PositionType.SKILL,
              "unlocker": new Position({
                "name": "cowgirl4",
                "label": "Cowgirl 4",
                "corruption": 9,
                "timeout": 10000,

                "type": PositionType.SKILL,
                "unlocker": undefined
              })
            })
          })
        }),
        new Position({
          "name": "doggy",
          "label": "Doggy",
          "corruption": 6,
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "doggy2",
            "label": "Doggy 2",
            "corruption": 9,
            "timeout": 7000,

            "type": PositionType.PENETRATION,
            "unlocker": new Position({
              "name": "doggy3",
              "label": "Doggy 3",
              "corruption": 11,
              "timeout": 10000,

              "type": PositionType.PENETRATION,
              "unlocker": new Position({
                "name": "doggy4",
                "label": "Doggy 4",
                "corruption": 12,
                "timeout": 10000,

                "type": PositionType.PENETRATION,
                "unlocker": undefined
              })
            })
          })
        }),
        new Position({
          "name": "standing",
          "label": "Standing",
          "corruption": 10,
          "timeout": 5000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "standing2",
            "label": "Standing 2",
            "corruption": 11,
            "timeout": 8000,

            "type": PositionType.PENETRATION,
            "unlocker": new Position({
              "name": "standing3",
              "label": "Standing 3",
              "corruption": 12,
              "timeout": 3000,

              "type": PositionType.PENETRATION,
              "unlocker": undefined
            })
          })
        }),

        ///////////////////// SPECIALS //////////////////////
        new Position({
          "name": "anal",
          "label": "Anal",
          "timeout": 10000,
          "corruption": 15,

          "type": PositionType.SPECIAL,
          "unlocker": new Position({
            "name": "anal2",
            "label": "Anal 2",
            "timeout": 10000,
            "corruption": 16,

            "type": PositionType.SPECIAL,
            "unlocker": new Position({
              "name": "anal3",
              "label": "Anal 3",
              "timeout": 5000,
              "corruption": 17,

              "type": PositionType.SPECIAL,
              "unlocker": new Position({
                "name": "anal4",
                "label": "Anal 4",
                "timeout": 10000,
                "corruption": 18,

                "type": PositionType.SPECIAL,
                "unlocker": new Position({
                  "name": "anal5",
                  "label": "Anal 5",
                  "timeout": 10000,
                  "corruption": 19,

                  "type": PositionType.SPECIAL,
                })
              })
            })
          })
        }),
        new Position({
          "name": "footjob",
          "label": "Footjob",
          "timeout": 10000,
          "corruption": 15,

          "type": PositionType.SPECIAL,
        })
      ]
      },
      {girlId: 2, timings: [
        new Position({
          "name": "intro",
          "label": "Intro",
          "corruption": 0,
          "timeout": 4000,

          "type": PositionType.INTRO,
          "unlocker": undefined
        }),
        new Position({
          "name": "tease",
          "label": "Tease",
          "corruption": 0,
          "timeout": 7000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "rub",
          "label": "Rub",
          "corruption": 0,
          "timeout": 5000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "masturbate",
          "label": "Masturbate",
          "corruption": 2,
          "timeout": 4000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "handjob",
          "label": "Handjob",
          "corruption": 3,
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "boobjob",
          "label": "Boobjob",
          "corruption": 3,
          "timeout": 3000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "blowjob",
          "label": "Blowjob",
          "corruption": 3,
          "timeout": 3000,

          "type": PositionType.FOREPLAY,
          "unlocker": new Position({
            "name": "blowjob2",
            "label": "Blowjob 2",
            "corruption": 4,
            "timeout": 10000,

            "type": PositionType.FOREPLAY_SKILL,
            "unlocker": new Position({
              "name": "blowjob3",
              "label": "Blowjob 3",
              "corruption": 5,
              "timeout": 10000,

              "type": PositionType.FOREPLAY_SKILL,
              "unlocker": new Position({
                "name": "blowjob4",
                "label": "Blowjob 4",
                "corruption": 6,
                "timeout": 10000,

                "type": PositionType.FOREPLAY_SKILL,
                "unlocker": new Position({
                  "name": "blowjob5",
                  "label": "Blowjob 5",
                  "corruption": 7,
                  "timeout": 5000,

                  "type": PositionType.FOREPLAY_SKILL
                })
              })
            })
          })
        }),
        new Position({
          "name": "missionary",
          "label": "Missionary",
          "corruption": 6,
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": undefined
        }),
        new Position({
          "name": "doggy",
          "label": "Doggy",
          "corruption": 6,
          "timeout": 5000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "doggy2",
            "label": "Doggy 2",
            "corruption": 7,
            "timeout": 10000,

            "type": PositionType.PENETRATION,
            "unlocker": new Position({
              "name": "doggy3",
              "label": "Doggy 3",
              "corruption": 8,
              "timeout": 6000,

              "type": PositionType.PENETRATION,
              "unlocker": new Position({
                "name": "doggy4",
                "label": "Doggy 4",
                "corruption": 9,
                "timeout": 5000,

                "type": PositionType.PENETRATION,
                "unlocker": new Position({
                  "name": "doggy5",
                  "label": "Doggy 5",
                  "corruption": 10,
                  "timeout": 10000,

                  "type": PositionType.PENETRATION,
                  "unlocker": undefined
                })
              })
            })
          })
        }),

        new Position({
          "name": "reversecowgirl",
          "label": "Reverse Cowgirl",
          "corruption": 8,
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "reversecowgirl2",
            "label": "Reverse Cowgirl 2",
            "corruption": 9,
            "timeout": 10000,

            "type": PositionType.PENETRATION,
            "unlocker": new Position({
              "name": "reversecowgirl3",
              "label": "Reverse Cowgirl 3",
              "corruption": 10,
              "timeout": 10000,

              "type": PositionType.SKILL,
              "unlocker": new Position({
                "name": "reversecowgirl4",
                "label": "Reverse Cowgirl 4",
                "corruption": 11,
                "timeout": 10000,

                "type": PositionType.SKILL,
                "unlocker": undefined
              })
            })
          }),
        }),
        new Position({
          "name": "cowgirl",
          "label": "Cowgirl",
          "corruption": 6,
          "timeout": 5000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "cowgirl2",
            "label": "Cowgirl 2",
            "corruption": 7,
            "timeout": 8000,

            "type": PositionType.PENETRATION,
            "unlocker": new Position({
              "name": "cowgirl3",
              "label": "Cowgirl 3",
              "corruption": 8,
              "timeout": 10000,

              "type": PositionType.SKILL,
              "unlocker": new Position({
                "name": "cowgirl4",
                "label": "Cowgirl 4",
                "corruption": 9,
                "timeout": 10000,

                "type": PositionType.SKILL,
                "unlocker": undefined
              })
            })
          })
        }),
        new Position({
          "name": "standing",
          "label": "Standing",
          "corruption": 10,
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": undefined
        }),

        // SPECIAL
        new Position({
          "name": "piledriving",
          "label": "Piledriving",
          "corruption": 15,
          "timeout": 10000,

          "type": PositionType.SPECIAL,
          "unlocker": new Position({
            "name": "piledriving2",
            "label": "Piledriving 2",
            "corruption": 16,
            "timeout": 10000,

            "type": PositionType.SPECIAL,
            "unlocker": undefined
          })
        }),
        new Position({
          "name": "sidefuck",
          "label": "Sidefuck",
          "corruption": 15,
          "timeout": 10000,

          "type": PositionType.SPECIAL,
          "unlocker": new Position({
            "name": "sidefuck2",
            "label": "Sidefuck 2",
            "corruption": 16,
            "timeout": 42000,

            "type": PositionType.SPECIAL,
            "unlocker": new Position({
              "name": "sidefuck3",
              "label": "Sidefuck 3",
              "corruption": 17,
              "timeout": 4000,

              "type": PositionType.SPECIAL,
              "unlocker": new Position({
                "name": "sidefuck4",
                "label": "Sidefuck 4",
                "corruption": 18,
                "timeout": 10000,

                "type": PositionType.SPECIAL,
                "unlocker": new Position({
                  "name": "sidefuck5",
                  "label": "Sidefuck 5",
                  "corruption": 19,
                  "timeout": 10000,

                  "type": PositionType.SPECIAL,
                  "unlocker": undefined
                })
              })
            })
          })
        }),
        new Position({
          "name": "cosplay",
          "label": "Cosplay",
          "corruption": 15,
          "timeout": 153000,

          "type": PositionType.SPECIAL,
          "unlocker": new Position({
            "name": "cosplay2",
            "label": "Cosplay 2",
            "corruption": 7,
            "timeout": 233000,

            "type": PositionType.SPECIAL,
            "unlocker": new Position({
              "name": "cosplay3",
              "label": "Cosplay 3",
              "corruption": 8,
              "timeout": 189000,

              "type": PositionType.SPECIAL,
              "unlocker": new Position({
                "name": "cosplay4",
                "label": "Cosplay 4",
                "corruption": 9,
                "timeout": 170000,

                "type": PositionType.SPECIAL,
                "unlocker": new Position({
                  "name": "cosplay5",
                  "label": "Cosplay 5",
                  "corruption": 10,
                  "timeout": 177000,

                  "type": PositionType.SPECIAL,
                  "unlocker": undefined
                })
              })
            })
          })
        }),
      ]}
      // {girlId: 3, timings: [
      //   {
      //     "name": "intro",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 0,
      //     "gold": 0,
      //     "fans": 0,

      //     "timeout": 4000,

      //     "stamcost": 0,
      //     "orgasm": 0
      //   },
      //   {
      //     "name": "tease",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 80,
      //     "fans": 100,

      //     "timeout": 6000,

      //     "stamcost": 0,
      //     "orgasm": 0
      //   },
      //   {
      //     "name": "rub",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 120,
      //     "fans": 80,

      //     "timeout": 10000,

      //     "stamcost": 0,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "handjob",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 140,
      //     "fans": 180,

      //     "timeout": 4000,

      //     "stamcost": 100,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "masturbate",
      //     "corruption": 2,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 160,
      //     "fans": 50,

      //     "timeout": 7000,

      //     "stamcost": 0,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "boobjob",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 180,
      //     "fans": 90,

      //     "timeout": 10000,

      //     "stamcost": 125,
      //     "orgasm": 15
      //   },
      //   {
      //     "name": "blowjob",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 200,
      //     "fans": 60,

      //     "timeout": 3000,

      //     "stamcost": 150,
      //     "orgasm": 15
      //   },
      //   {
      //     "name": "missionary",
      //     "corruption": 6,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 220,
      //     "fans": 120,

      //     "timeout": 10000,

      //     "stamcost": 175,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "reversecowgirl",
      //     "corruption": 8,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 240,
      //     "fans": 230,

      //     "timeout": 10000,

      //     "stamcost": 200,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "cowgirl",
      //     "corruption": 6,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 260,
      //     "fans": 300,

      //     "timeout": 10000,

      //     "stamcost": 225,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "doggy",
      //     "corruption": 6,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 300,
      //     "fans": 350,

      //     "timeout": 10000,

      //     "stamcost": 250,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "doggy2",
      //     "corruption": 9,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 150,
      //     "gold": 350,
      //     "fans": 600,

      //     "timeout": 10000,

      //     "stamcost": 275,
      //     "orgasm": 60
      //   },
      //   {
      //     "name": "standing",
      //     "corruption": 10,
      //     "timing": [1500, 2000, 3000, 3500],

      //     "xp": 100,
      //     "gold": 350,
      //     "fans": 250,

      //     "timeout": 10000,

      //     "stamcost": 300,
      //     "orgasm": 75
      //   }
      // ]
      // },
      // {girlId: 4, timings: [
      //   {
      //     "name": "intro",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 0,
      //     "gold": 0,
      //     "fans": 0,

      //     "timeout": 4000,

      //     "stamcost": 0,
      //     "orgasm": 0
      //   },
      //   {
      //     "name": "tease",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 80,
      //     "fans": 100,

      //     "timeout": 10000,

      //     "stamcost": 0,
      //     "orgasm": 0
      //   },
      //   {
      //     "name": "rub",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 120,
      //     "fans": 80,

      //     "timeout": 10000,

      //     "stamcost": 0,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "handjob",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 140,
      //     "fans": 180,

      //     "timeout": 7000,

      //     "stamcost": 100,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "masturbate",
      //     "corruption": 2,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 160,
      //     "fans": 50,

      //     "timeout": 8000,

      //     "stamcost": 0,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "boobjob",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 180,
      //     "fans": 90,

      //     "timeout": 10000,

      //     "stamcost": 125,
      //     "orgasm": 15
      //   },
      //   {
      //     "name": "blowjob",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 200,
      //     "fans": 60,

      //     "timeout": 5000,

      //     "stamcost": 150,
      //     "orgasm": 15
      //   },
      //   {
      //     "name": "missionary",
      //     "corruption": 6,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 220,
      //     "fans": 120,

      //     "timeout": 6000,

      //     "stamcost": 175,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "reversecowgirl",
      //     "corruption": 8,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 240,
      //     "fans": 230,

      //     "timeout": 10000,

      //     "stamcost": 200,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "cowgirl",
      //     "corruption": 6,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 260,
      //     "fans": 300,

      //     "timeout": 5000,

      //     "stamcost": 225,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "doggy",
      //     "corruption": 6,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 300,
      //     "fans": 350,

      //     "timeout": 5000,

      //     "stamcost": 250,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "doggy2",
      //     "corruption": 9,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 150,
      //     "gold": 350,
      //     "fans": 600,

      //     "timeout": 10000,

      //     "stamcost": 275,
      //     "orgasm": 60
      //   },
      //   {
      //     "name": "standing",
      //     "corruption": 10,
      //     "timing": [1500, 2000, 3000, 3500],

      //     "xp": 100,
      //     "gold": 350,
      //     "fans": 250,

      //     "timeout": 8000,

      //     "stamcost": 300,
      //     "orgasm": 75
      //   }
      // ]
      // },
      // {girlId: 5, timings: [
      //   {
      //     "name": "intro",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 0,
      //     "gold": 0,
      //     "fans": 0,

      //     "timeout": 4000,

      //     "stamcost": 0,
      //     "orgasm": 0
      //   },
      //   {
      //     "name": "tease",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 80,
      //     "fans": 100,

      //     "timeout": 10000,

      //     "stamcost": 0,
      //     "orgasm": 0
      //   },
      //   {
      //     "name": "rub",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 120,
      //     "fans": 80,

      //     "timeout": 7000,

      //     "stamcost": 0,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "reveal",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 140,
      //     "fans": 180,

      //     "timeout": 10000,

      //     "stamcost": 0,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "masturbate",
      //     "corruption": 2,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 160,
      //     "fans": 50,

      //     "timeout": 10000,

      //     "stamcost": 100,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "boobjob",
      //     "corruption": 3,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 180,
      //     "fans": 90,

      //     "timeout": 10000,

      //     "stamcost": 125,
      //     "orgasm": 15
      //   },
      //   {
      //     "name": "blowjob",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 200,
      //     "fans": 60,

      //     "timeout": 10000,

      //     "stamcost": 150,
      //     "orgasm": 15
      //   },
      //   {
      //     "name": "missionary",
      //     "corruption": 6,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 220,
      //     "fans": 120,

      //     "timeout": 10000,

      //     "stamcost": 175,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "reversecowgirl",
      //     "corruption": 8,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 240,
      //     "fans": 230,

      //     "timeout": 7000,

      //     "stamcost": 200,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "cowgirl",
      //     "corruption": 6,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 260,
      //     "fans": 300,

      //     "timeout": 10000,

      //     "stamcost": 225,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "doggy",
      //     "corruption": 6,
      //     "timing": [400, 810, 1210, 1570, 1930, 2310, 2680, 3020, 3420, 3740, 4100, 4510, 4890, 5240, 5600, 6000, 6370, 6740, 7140, 7520, 7910, 8290, 8630, 9010, 9400, 9800],

      //     "xp": 100,
      //     "gold": 300,
      //     "fans": 350,

      //     "timeout": 10000,

      //     "stamcost": 250,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "doggy2",
      //     "corruption": 9,
      //     "timing": [370, 1120, 1790, 2460, 3250, 4270, 5950, 7860, 8880],

      //     "xp": 150,
      //     "gold": 350,
      //     "fans": 600,

      //     "timeout": 10000,

      //     "stamcost": 275,
      //     "orgasm": 60
      //   },
      //   {
      //     "name": "standing",
      //     "corruption": 10,
      //     "timing": [200, 530, 900, 1230, 1600, 2000, 2300, 2640, 3000, 3330, 3700, 4000, 4450, 4810, 5240, 5550, 5996, 6340, 6740, 7130, 7520, 7860, 8270, 8650, 9100, 9350, 9750],

      //     "xp": 100,
      //     "gold": 350,
      //     "fans": 250,

      //     "timeout": 10000,

      //     "stamcost": 300,
      //     "orgasm": 75
      //   }
      // ]
      // },
      // {girlId: 6, timings: [
      //   {
      //     "name": "intro",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 0,
      //     "gold": 0,
      //     "fans": 0,

      //     "timeout": 4000,

      //     "stamcost": 0,
      //     "orgasm": 0
      //   },
      //   {
      //     "name": "tease",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 80,
      //     "fans": 100,

      //     "timeout": 8000,

      //     "stamcost": 0,
      //     "orgasm": 0
      //   },
      //   {
      //     "name": "rub",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 120,
      //     "fans": 80,

      //     "timeout": 4000,

      //     "stamcost": 0,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "handjob",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 140,
      //     "fans": 180,

      //     "timeout": 7000,

      //     "stamcost": 0,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "masturbate",
      //     "corruption": 2,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 160,
      //     "fans": 50,

      //     "timeout": 10000,

      //     "stamcost": 100,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "boobjob",
      //     "corruption": 3,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 180,
      //     "fans": 90,

      //     "timeout": 10000,

      //     "stamcost": 125,
      //     "orgasm": 15
      //   },
      //   {
      //     "name": "blowjob",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 200,
      //     "fans": 60,

      //     "timeout": 10000,

      //     "stamcost": 150,
      //     "orgasm": 15
      //   },
      //   {
      //     "name": "missionary",
      //     "corruption": 6,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 220,
      //     "fans": 120,

      //     "timeout": 10000,

      //     "stamcost": 175,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "reversecowgirl",
      //     "corruption": 8,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 240,
      //     "fans": 230,

      //     "timeout": 10000,

      //     "stamcost": 200,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "cowgirl",
      //     "corruption": 6,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 260,
      //     "fans": 300,

      //     "timeout": 10000,

      //     "stamcost": 225,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "doggy",
      //     "corruption": 6,
      //     "timing": [400, 810, 1210, 1570, 1930, 2310, 2680, 3020, 3420, 3740, 4100, 4510, 4890, 5240, 5600, 6000, 6370, 6740, 7140, 7520, 7910, 8290, 8630, 9010, 9400, 9800],

      //     "xp": 100,
      //     "gold": 300,
      //     "fans": 350,

      //     "timeout": 7000,

      //     "stamcost": 250,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "doggy2",
      //     "corruption": 9,
      //     "timing": [370, 1120, 1790, 2460, 3250, 4270, 5950, 7860, 8880],

      //     "xp": 150,
      //     "gold": 350,
      //     "fans": 600,

      //     "timeout": 10000,

      //     "stamcost": 275,
      //     "orgasm": 60
      //   },
      //   {
      //     "name": "standing",
      //     "corruption": 10,
      //     "timing": [200, 530, 900, 1230, 1600, 2000, 2300, 2640, 3000, 3330, 3700, 4000, 4450, 4810, 5240, 5550, 5996, 6340, 6740, 7130, 7520, 7860, 8270, 8650, 9100, 9350, 9750],

      //     "xp": 100,
      //     "gold": 350,
      //     "fans": 250,

      //     "timeout": 10000,

      //     "stamcost": 300,
      //     "orgasm": 75
      //   }
      // ]
      // },
      // {girlId: 7, timings: [
      //   {
      //     "name": "intro",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 0,
      //     "gold": 0,
      //     "fans": 0,

      //     "timeout": 4000,

      //     "stamcost": 0,
      //     "orgasm": 0
      //   },
      //   {
      //     "name": "tease",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 80,
      //     "fans": 100,

      //     "timeout": 10000,

      //     "stamcost": 0,
      //     "orgasm": 0
      //   },
      //   {
      //     "name": "twerk",
      //     "corruption": 0,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 120,
      //     "fans": 80,

      //     "timeout": 10000,

      //     "stamcost": 0,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "masturbate",
      //     "corruption": 2,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 160,
      //     "fans": 50,

      //     "timeout": 7000,

      //     "stamcost": 0,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "spank",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 140,
      //     "fans": 180,

      //     "timeout": 10000,

      //     "stamcost": 100,
      //     "orgasm": 10
      //   },
      //   {
      //     "name": "blowjob",
      //     "corruption": 3,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 200,
      //     "fans": 60,

      //     "timeout": 3000,

      //     "stamcost": 150,
      //     "orgasm": 15
      //   },
      //   {
      //     "name": "missionary",
      //     "corruption": 5,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 220,
      //     "fans": 120,

      //     "timeout": 10000,

      //     "stamcost": 175,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "doggy",
      //     "corruption": 5,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 240,
      //     "fans": 230,

      //     "timeout": 10000,

      //     "stamcost": 200,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "cowgirl",
      //     "corruption": 6,
      //     "timing": [],

      //     "xp": 100,
      //     "gold": 260,
      //     "fans": 300,

      //     "timeout": 10000,

      //     "stamcost": 225,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "doggy2",
      //     "corruption": 7,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 100,
      //     "gold": 300,
      //     "fans": 350,

      //     "timeout": 10000,

      //     "stamcost": 250,
      //     "orgasm": 40
      //   },
      //   {
      //     "name": "cowgirl2",
      //     "corruption": 8,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 150,
      //     "gold": 350,
      //     "fans": 600,

      //     "timeout": 10000,

      //     "stamcost": 275,
      //     "orgasm": 60
      //   },
      //   {
      //     "name": "standing",
      //     "corruption": 9,
      //     "timing": [1500, 2000, 2500, 3000, 3600, 4300, 4800, 5400, 6000, 6500],

      //     "xp": 150,
      //     "gold": 350,
      //     "fans": 600,

      //     "timeout": 10000,

      //     "stamcost": 275,
      //     "orgasm": 60
      //   },
      //   {
      //     "name": "doggy3",
      //     "corruption": 10,
      //     "timing": [1500, 2000, 3000, 3500],

      //     "xp": 100,
      //     "gold": 350,
      //     "fans": 250,

      //     "timeout": 10000,

      //     "stamcost": 300,
      //     "orgasm": 75
      //   }
      // ]
      // }
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
		girl.unlockedPositions.push(position);

		this.updateGirl(girl);
	}

	_fileExists(url: string): Observable<boolean> {
		return this._httpClient.get(url).pipe(
			map(() => true),
			catchError(() => of(false))
		);
	}
}

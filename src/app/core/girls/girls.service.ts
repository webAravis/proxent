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
            "timeout": 10000,

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
              "timeout": 10000,

              "type": PositionType.PENETRATION,
              "unlocker": new Position({
                "name": "standing4",
                "label": "Standing 4",
                "corruption": 13,
                "timeout": 5000,

                "type": PositionType.PENETRATION,
                "unlocker": undefined
              })
            })
          })
        }),
        new Position({
          "name": "outdoor",
          "label": "Outdoor",
          "corruption": 10,
          "timeout": 10000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "outdoor2",
            "label": "Outdoor 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
          })
        }),
        new Position({
          "name": "sitted",
          "label": "Sitted",
          "corruption": 10,
          "timeout": 5000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "sitted2",
            "label": "Sitted 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
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
          "unlocker": new Position({
            "name": "standing2",
            "label": "Standing 2",
            "corruption": 11,
            "timeout": 9000,

            "type": PositionType.PENETRATION,
            "unlocker": new Position({
              "name": "standing3",
              "label": "Standing 3",
              "corruption": 12,
              "timeout": 6000,
            })
          })
        }),
        new Position({
          "name": "outdoor",
          "label": "Outdoor",
          "corruption": 10,
          "timeout": 10000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "outdoor2",
            "label": "Outdoor 2",
            "corruption": 11,
            "timeout": 5000,

            "type": PositionType.SKILL
          })
        }),
        new Position({
          "name": "sitted",
          "label": "Sitted",
          "corruption": 10,
          "timeout": 10000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "sitted2",
            "label": "Sitted 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
          })
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
      ]},
      {girlId: 3, timings: [
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
          "timeout": 6000,

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
          "timeout": 7000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "handjob",
          "label": "Handjob",
          "corruption": 3,
          "timeout": 4000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "boobjob",
          "label": "Boobjob",
          "corruption": 3,
          "timeout": 10000,

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
                "timeout": 5000,

                "type": PositionType.FOREPLAY_SKILL,
                "unlocker": new Position({
                  "name": "blowjob5",
                  "label": "Blowjob 5",
                  "corruption": 7,
                  "timeout": 10000,

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
          "timeout": 10000,

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
              "timeout": 10000,

              "type": PositionType.PENETRATION,
              "unlocker": new Position({
                "name": "doggy4",
                "label": "Doggy 4",
                "corruption": 9,
                "timeout": 10000,

                "type": PositionType.PENETRATION,
                "unlocker": new Position({
                  "name": "doggy5",
                  "label": "Doggy 5",
                  "corruption": 10,
                  "timeout": 9000,

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
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "cowgirl2",
            "label": "Cowgirl 2",
            "corruption": 7,
            "timeout": 10000,

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
                "timeout": 6000,

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
          "unlocker": new Position({
            "name": "standing2",
            "label": "Standing 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.PENETRATION
          })
        }),
        new Position({
          "name": "outdoor",
          "label": "Outdoor",
          "corruption": 10,
          "timeout": 10000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "outdoor2",
            "label": "Outdoor 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
          })
        }),
        new Position({
          "name": "sitted",
          "label": "Sitted",
          "corruption": 10,
          "timeout": 8000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "sitted2",
            "label": "Sitted 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
          })
        }),

        // SPECIAL
        new Position({
          "name": "mouthfuck",
          "label": "Mouthfuck",
          "corruption": 15,
          "timeout": 7000,

          "type": PositionType.SPECIAL,
          "unlocker": new Position({
            "name": "mouthfuck2",
            "label": "Mouthfuck 2",
            "corruption": 16,
            "timeout": 5000,

            "type": PositionType.SPECIAL,
            "unlocker": new Position({
              "name": "mouthfuck3",
              "label": "Mouthfuck 3",
              "corruption": 17,
              "timeout": 2000,

              "type": PositionType.SPECIAL,
              "unlocker": undefined
            })
          })
        }),
        new Position({
          "name": "anal",
          "label": "Anal",
          "corruption": 15,
          "timeout": 10000,

          "type": PositionType.SPECIAL,
          "unlocker": new Position({
            "name": "anal2",
            "label": "Anal 2",
            "corruption": 16,
            "timeout": 42000,

            "type": PositionType.SPECIAL,
            "unlocker": new Position({
              "name": "anal3",
              "label": "Anal 3",
              "corruption": 17,
              "timeout": 4000,

              "type": PositionType.SPECIAL,
              "unlocker": new Position({
                "name": "anal4",
                "label": "Anal 4",
                "corruption": 18,
                "timeout": 2000,

                "type": PositionType.SPECIAL
              })
            })
          })
        }),
        new Position({
          "name": "double",
          "label": "Double",
          "corruption": 15,
          "timeout": 10000,

          "type": PositionType.SPECIAL,
          "unlocker": new Position({
            "name": "double2",
            "label": "Double 2",
            "corruption": 7,
            "timeout": 25000,

            "type": PositionType.SPECIAL,
            "unlocker": new Position({
              "name": "double3",
              "label": "Double 3",
              "corruption": 8,
              "timeout": 40000,

              "type": PositionType.SPECIAL
            })
          })
        }),
        new Position({
          "name": "triple",
          "label": "Triple",
          "corruption": 20,
          "timeout": 5000,

          "type": PositionType.SPECIAL
        })
      ]},
      {girlId: 4, timings: [
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
          "timeout": 10000,

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
          "timeout": 8000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "handjob",
          "label": "Handjob",
          "corruption": 3,
          "timeout": 7000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "boobjob",
          "label": "Boobjob",
          "corruption": 3,
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "blowjob",
          "label": "Blowjob",
          "corruption": 3,
          "timeout": 5000,

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
                  "timeout": 10000,

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
          "timeout": 6000,

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
            "timeout": 10000,

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

          "type": PositionType.PENETRATION
        }),
        new Position({
          "name": "outdoor",
          "label": "Outdoor",
          "corruption": 10,
          "timeout": 10000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "outdoor2",
            "label": "Outdoor 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
          })
        }),
        new Position({
          "name": "sitted",
          "label": "Sitted",
          "corruption": 10,
          "timeout": 6000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "sitted2",
            "label": "Sitted 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
          })
        }),
      ]},
      {girlId: 5, timings: [
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
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "reveal",
          "label": "Reveal",
          "corruption": 0,
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "rub",
          "label": "Rub",
          "corruption": 0,
          "timeout": 7000,

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
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "boobjob",
          "label": "Boobjob",
          "corruption": 3,
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "blowjob",
          "label": "Blowjob",
          "corruption": 3,
          "timeout": 10000,

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
                  "timeout": 10000,

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
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "doggy2",
            "label": "Doggy 2",
            "corruption": 7,
            "timeout": 10000,

            "type": PositionType.PENETRATION
          })
        }),

        new Position({
          "name": "reversecowgirl",
          "label": "Reverse Cowgirl",
          "corruption": 8,
          "timeout": 7000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "reversecowgirl2",
            "label": "Reverse Cowgirl 2",
            "corruption": 9,
            "timeout": 7000,

            "type": PositionType.PENETRATION,
            "unlocker": new Position({
              "name": "reversecowgirl3",
              "label": "Reverse Cowgirl 3",
              "corruption": 10,
              "timeout": 5000,

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
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "cowgirl2",
            "label": "Cowgirl 2",
            "corruption": 7,
            "timeout": 6000,

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
                "timeout": 25000,

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

          "type": PositionType.PENETRATION
        }),
        new Position({
          "name": "outdoor",
          "label": "Outdoor",
          "corruption": 10,
          "timeout": 7000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "outdoor2",
            "label": "Outdoor 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
          })
        }),
        new Position({
          "name": "sitted",
          "label": "Sitted",
          "corruption": 10,
          "timeout": 6000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "sitted2",
            "label": "Sitted 2",
            "corruption": 11,
            "timeout": 9000,

            "type": PositionType.SKILL
          })
        }),
      ]},
      {girlId: 6, timings: [
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
          "timeout": 8000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "rub",
          "label": "Rub",
          "corruption": 0,
          "timeout": 4000,

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
          "timeout": 7000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "boobjob",
          "label": "Boobjob",
          "corruption": 3,
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "blowjob",
          "label": "Blowjob",
          "corruption": 3,
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": new Position({
            "name": "blowjob2",
            "label": "Blowjob 2",
            "corruption": 4,
            "timeout": 4000,

            "type": PositionType.FOREPLAY_SKILL,
            "unlocker": new Position({
              "name": "blowjob3",
              "label": "Blowjob 3",
              "corruption": 5,
              "timeout": 8000,

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
                  "timeout": 10000,

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
          "timeout": 7000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "doggy2",
            "label": "Doggy 2",
            "corruption": 7,
            "timeout": 10000,

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
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "cowgirl2",
            "label": "Cowgirl 2",
            "corruption": 7,
            "timeout": 10000,

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

          "type": PositionType.PENETRATION
        }),
        new Position({
          "name": "outdoor",
          "label": "Outdoor",
          "corruption": 10,
          "timeout": 5000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "outdoor2",
            "label": "Outdoor 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
          })
        }),
        new Position({
          "name": "sitted",
          "label": "Sitted",
          "corruption": 10,
          "timeout": 10000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "sitted2",
            "label": "Sitted 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
          })
        }),
      ]},
      {girlId: 7, timings: [
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
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "twerk",
          "label": "Twerk",
          "corruption": 0,
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "masturbate",
          "label": "Masturbate",
          "corruption": 2,
          "timeout": 2000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "spank",
          "label": "Spank",
          "corruption": 3,
          "timeout": 10000,

          "type": PositionType.FOREPLAY,
          "unlocker": undefined
        }),
        new Position({
          "name": "blowjob",
          "label": "Blowjob",
          "corruption": 3,
          "timeout": 10000,

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
                  "timeout": 10000,

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
          "timeout": 10000,

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
              "timeout": 10000,

              "type": PositionType.PENETRATION
            })
          })
        }),

        new Position({
          "name": "reversecowgirl",
          "label": "Reverse Cowgirl",
          "corruption": 8,
          "timeout": 5000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "reversecowgirl2",
            "label": "Reverse Cowgirl 2",
            "corruption": 9,
            "timeout": 5000,

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
          "timeout": 10000,

          "type": PositionType.PENETRATION,
          "unlocker": new Position({
            "name": "cowgirl2",
            "label": "Cowgirl 2",
            "corruption": 7,
            "timeout": 10000,

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

          "type": PositionType.PENETRATION
        }),
        new Position({
          "name": "outdoor",
          "label": "Outdoor",
          "corruption": 10,
          "timeout": 10000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "outdoor2",
            "label": "Outdoor 2",
            "corruption": 11,
            "timeout": 5000,

            "type": PositionType.SKILL
          })
        }),
        new Position({
          "name": "sitted",
          "label": "Sitted",
          "corruption": 10,
          "timeout": 8000,

          "type": PositionType.SKILL,
          "unlocker": new Position({
            "name": "sitted2",
            "label": "Sitted 2",
            "corruption": 11,
            "timeout": 10000,

            "type": PositionType.SKILL
          })
        }),
      ]}
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
		allGirls.push(ava);

		const madison = new Girl();
		madison.id = 4;
		madison.name = 'Madison';
		madison.freedom = 1;

		allGirls.push(madison);

		const karma = new Girl();
		karma.id = 5;
		karma.name = 'Karma';
		karma.freedom = 1;

		allGirls.push(karma);

		const nikki = new Girl();
		nikki.id = 6;
		nikki.name = 'Nikki';
		nikki.freedom = 1;

		allGirls.push(nikki);

		const abella = new Girl();
		abella.id = 7;
		abella.name = 'Abella';
		abella.freedom = 1;

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
          girl.unlockPrice = [
            { type: 'gold', quantity: 15_000 },
            { type: 'recordmonthly_badge', quantity: 2 },
          ];

          break;
        case 'Madison':
          girl.attributes = ['blond', 'fit', 'flexible', 'dark eyes', 'small', 'euro'];
          girl.unlockPrice = [
            { type: 'gold', quantity: 15_000 },
            { type: 'fans_badge', quantity: 2 },
          ];
          break;
        case 'Karma':
          girl.attributes = ['blond', 'green eyes', 'tattoo', 'american'];
          girl.unlockPrice = [
            { type: 'gold', quantity: 15_000 },
            { type: 'money_badge', quantity: 2 },
          ];
          break;
        case 'Nikki':
          girl.attributes = ['blond', 'dark eyes', 'producer', 'euro'];
          girl.unlockPrice = [
            { type: 'gold', quantity: 15_000 },
            { type: 'recordyearly_badge', quantity: 2 },
          ];
          break;
        case 'Abella':
          girl.attributes = ['teen', 'brunette', 'dark eyes', 'natural boobs', 'american'];
          girl.unlockPrice = [
            { type: 'gold', quantity: 20_000 },
            { type: 'recordmonthly_badge', quantity: 3 },
          ];
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

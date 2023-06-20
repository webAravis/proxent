modsConfig.push({ // Personally, I recommend learning json syntax basics. It makes things a lot easier.
  name: 'angelawhite', // This has to match the folder name of the mod.
  girls: [
    {
       "id":"1", // Unique ID of the girl in this mod. Has to match the folder name of the girl
       "name":"Angela", // Name of the girl, which will be shown in-game.
       "attributes":[ // Individual attributes of the girl. These are used in contracts and battle bonuses/maluses.
         "brunette",
         "american",
         "milf",
         "dark eyes"
       ],
       "xpModifier":2.5, // You can define different modifiers for each stat. These can be golds, xp, fans and cum. (2.5 = 250%)
       "goldsModifier":0.5,
       "unlockPrice":[ // The unlock price of the girl is defined here. Each resource type has to be defined in a separate object.
          {
             "type":"gold", // Resource type. The names of all resource types can be found in the items folder in assets.
             "quantity":15000 // Amount required.
          },
          {
             "type":"recordmonthly_badge",
             "quantity":2
          }
       ],
       "positions":[ // This is where all the scenes are defined. Each scene is a separate object. An object is defined with curly brackets "{}". Objects in an array("[]") are separated by a comma ",".
          {
             "name":"intro", // Internal name of the scene. This should match the filename of the corresponding video without the .webm extension.
             "label":"Intro", // Label is how the scene will be displayed as in-game.
             "corruption":0, // Corruption level required to unlock this scene.
             "type":"INTRO" // This determines the type of scene. INTRO plays when you begin a recording session.
          },
          {
             "name":"tease",
             "label":"Tease",
             "corruption":0,
             "type":"FOREPLAY" // FOREPLAY will be a foreplay scene which yields no orgasm, but increases boner.
          },
          {
             "name":"blowjob",
             "label":"Blowjob",
             "corruption":3,
             "type":"FOREPLAY",
             "unlocker":{ // Advanced scenes are defined and chained with the unlocker attribute.
                "name":"blowjob2",
                "label":"Blowjob 2",
                "corruption":4,
                "type":"FOREPLAY_SKILL", // FOREPLAY_SKILL is a foreplay scene that can only be unlocked through a skill. It won't show up during corruption.
                "unlocker":{
                   "name":"blowjob3",
                   "label":"Blowjob 3",
                   "corruption":5,
                   "type":"FOREPLAY_SKILL"
                }
             }
          },
          {
             "name":"missionary",
             "label":"Missionary",
             "corruption":6,
             "type":"PENETRATION", // PENETRATION scenes consume boner and generate orgasm.
          },
          {
             "name":"outdoor",
             "label":"Outdoor",
             "corruption":10,
             "type":"SKILL" // SKILL is the same as FOREPLAY_SKILL, but for penetration scenes.
          },
          {
             "name":"anal",
             "label":"Anal",
             "corruption":15,
             "type":"SPECIAL" // SPECIAL is similar to SKILL, but special scenes are higher value and unlock for both recording and battles.
          }
       ],
       "photos":[ // The photos attribute is an array where all the photos are defined. Each photo is an object.
          {
             "name":"1_normal", // Name of the photo. This should match the filename of the corresponding image without the .jpg extension.
             "corruptionLevel":0, // Corruption level required to unlock this photo.
             "attributes":{ // Attributes of the photo.
                "type":"normal", // Sluttiness of the photo. This can be normal, sexy, slutty, sex, cum. The higher the sluttiness, the bigger the value and price of the photo.
                "place":"gym", // Place attribute.
                "outfit":"sports", // Outfit attribute.
                "body":[ // Body tags. The more a photo has, the more expensive it is to unlock and the less golds and fans it will yield.
                   "face",
                   "boobs"
                ],
                "format":"4:3" // Format of the photo. Either portrait or 4:3. Use 4:3 even if the photo is for example 16:9 to keep format list short.
             }
          },
          { // Sexy photo example
             "name":"1_sexy",
             "corruptionLevel":2,
             "attributes":{
                "type":"sexy",
                "place":"outdoor",
                "outfit":"swimsuit",
                "body":[
                   "face",
                   "boobs",
                   "legs",
                   "feet"
                ],
                "format":"portrait"
             }
          },
          { // Slutty photo example
             "name":"1_slutty",
             "corruptionLevel":4,
             "attributes":{
                "type":"slutty",
                "place":"bedroom",
                "outfit":"lingerie",
                "body":[
                   "face",
                   "boobs",
                   "legs",
                   "feet"
                ],
                "format":"portrait"
             }
          }
       ],
       "skills":[ // The skills attribute is also an array. This is where all the skill trees and individual skills are defined. Each skill or skill tree is an object.
          { // This is the definition of the skill tree.
             "name":"special", // Name of the skill tree. It'll usually be either special, recording or battle.
             "description":"Special skills and scenes", // Description of the skill tree which is shown in-game.
             "skillTiers":[ // Skill tiers are the rows of a skill tree. Each tier is a separate object. Tier 0 would be the first row in a skill tree.
                {
                   "tier":0, // Tier. Pretty obvious.
                   "skills":[ // Each tier should have a skills attribute. This is an array of all skills at this tier.
                      {
                         "name":"Fetishist", // Name of the skill
                         "description":"Unlocks Yiny's special scenes", // Description of the skill.
                         "maxlevel":1, // This defines how many levels a skill has.
                         "unlockPrice":[ // An array of the unlock prices of skill levels. Each level has an array of costs giving the option to have multiple items cost. It's very similar to the unlock prices of girls.
                            [
                               {
                                  "type":"gold",
                                  "quantity":15000
                               }
                            ]
                         ]
                      }
                   ]
                   // This skill is only used as a requirement for later skills, so it does nothing.
                },
                {
                   "tier":1,
                   "skills":[
                      {
                         "name":"Anal",
                         "description":"Unlocks or upgrades anal scenes",
                         "maxlevel":5,
                         "unlockPrice":[ // You don't have to define the cost of each individual level. As you can see, this skill has 5 levels, but only two defined costs.
                                         // This game will always use the last cost it can find for further levels.
                            [
                               {
                                  "type":"gold",
                                  "quantity":30000
                               },
                               {
                                  "type":"basic_skill_gem",
                                  "quantity":1
                               }
                            ],
                            [
                               {
                                  "type":"gold",
                                  "quantity":45000
                               },
                               {
                                  "type":"advanced_skill_gem",
                                  "quantity":1
                               }
                            ]
                         ],
                         "requires":[ // The requires attribute is an array of all the skills you need to have before you can unlock this skill. Use the names of the skills which you defined.
                            "Fetishist"
                         ],
                         "effects":[ // The effects attribute is an array which defines the effects of each level of a skill. Each level can have multiple effects. That's why each level has an array.
                                     // Each effect is an object.
                            [
                               {
                                  "stat":"scene", // Defines what kind of effect it is. "scene" unlocks a scene
                                  "label":"New scene: Anal", // Description of what it unlocks displayed in-game.
                                  "value":"Anal" // Value of the effect. In this case, it's the scene which it unlocks. Strangely, this uses the label attribute of a scene, not name.
                               }
                            ],
                            [ // This is an example of a skill level which has multiple effects.
                                {
                                    "stat":"golds", // Just like girl stat modifiers, you can use the same here. These can be golds, fans, xp.
                                    "position":"anal", // Defines which position it affects.
                                    "label":"Anal +8% Gold", // Description.
                                    "value":"+8%" // Percentual improvement. You can use "-" to make the gains of a stat worse.
                                 },
                                 {
                                    "stat":"orgasm", // In addition to normal stats, you can also use orgasm and boner. To improve or worsen their gains.
                                    "position":"all_penetration", // You can use all_penetration to make a skill affect all penetration positions/scenes. all_foreplay for foreplay scenes. all_special for special scenes.
                                    "label":"All penetration +5% orgasm",
                                    "value":"+5%"
                                 }
                            ],
                            [ // This is an example of a trigger skill effect.
                                {
                                    "stat":"trigger", // Trigger effects are effects which have a chance to randomly trigger and have a set duration.
                                    "triggerEffect":"boner", // Which stat it affects.
                                    "label":"30% chance to get +8 boner/s for 15s", // Description
                                    "value":"+8", // +8 means you get 8 every second
                                    "duration":15000, // Duration in miliseconds
                                    "chance":0.3 // Trigger chance. 0.3 = 30%
                                }
                            ]
                         ]
                      }
                   ]
                },
             ]
          },
          {
             // This is where you would define another skill tree.
          }
       ]
    }
 ]
});

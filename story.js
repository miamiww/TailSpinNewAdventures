let seaduck = require("seaduck");

let n = new seaduck.Narrative({
    "nouns": [
      {
        "name": "Baloo",
        "properties": {
          "hungry": false,
          "adventure":8,
          "goofoff": 8,
          "money-making": 8
        },
        "tags": ["person","goodguys"]
      },
      {
        "name": "Kit",
        "properties": {
          "hungry": true,
          "adventure":10,
          "goof off": 5,
          "money-making": 5
        },
        "tags": ["person","goodguys"]
      },
      {
        "name": "Rebecca",
        "properties": {
          "hungry": false,
          "adventure":0,
          "goof off": 0,
          "money-making": 5
        },
        "tags": ["person","goodguys"]
      },
      {
        "name": "Louis",
        "properties": {
          "hungry": false,
          "adventure":0,
          "goof off": 10,
          "money-making": 10
        },
        "tags": ["person","goodguys"]
      },
      {
        "name": "Don Karnage",
        "properties": {
          "hungry": false,
          "adventure":8,
          "goof off": 3,
          "money-making": 10
        },
        "tags": ["person","bad guys"]
      },
      {
        "name": "Don Karnage",
        "properties": {
          "hungry": false,
          "adventure":8,
          "goof off": 3,
          "money-making": 9
        },
        "tags": ["person","bad guys"]
      },
      {
        "name": "Shere Khan",
        "properties": {
          "hungry": false,
          "adventure": 0,
          "goof off": 0,
          "money-making": 10
        },
        "tags": ["person","bad guys"]
      },
      // {
      //   "name": "cookie",
      //   "properties": {
      //     "tastiness": 2,
      //     "eaten": false
      //   },
      //   "tags": ["food"]
      // },
      // {
      //   "name": "spinach",
      //   "properties": {
      //     "tastiness": 1,
      //     "eaten": false
      //   },
      //   "tags": ["food"]
      // },
      // {
      //   "name": "cake",
      //   "properties": {
      //     "tastiness": 3,
      //     "eaten": false
      //   },
      //   "tags": ["food"]
      // },
      {
        "name": "castle",
        "properties": {
          "action": 5,
          "visited": false,
          "two-parter": false
        },
        "tags": ["adventureplace"]
      },
    ],
    "initialize": function*() {
      for (let noun of this.getNounsByProperty("hungry", true)) {
        yield (new seaduck.StoryEvent("isHungry", noun));
      }
    },
    "actions": [
      {
        "name": "adventure",
        "match": ["#goodguys", "#adventureplace"],
        "when": function(a, b) {
          return a.properties.adventure > 4 
            && b.properties.action > 4 
            && !b.properties.visited;
        },
        "action": function*(a, b) {
          yield (new seaduck.StoryEvent("adventure", a, b));
          a.properties.adventure = a.properties.adventure - 1;
          b.properties.visited = true;
          a.properties.goofoff = a.properties.goofoff + 1;
          if (b.properties.two_parter) {
            yield (new seaduck.StoryEvent("sequel", a, b));
          }
        }
      },
      {
        "name": "eat",
        "match": ["#person", "#food"],
        "when": function(a, b) {
          return a.properties.hungry 
            && b.properties.tastiness > 0 
            && !b.properties.eaten;
        },
        "action": function*(a, b) {
          yield (new seaduck.StoryEvent("eat", a, b));
          a.properties.hungry = false;
          b.properties.eaten = true;
          a.properties.happiness += b.properties.tastiness;
          if (b.properties.tastiness >= 2) {
            yield (new seaduck.StoryEvent("reallyLike", a, b));
          }
        }
      },
      {
        "name": "befriend",
        "match": ["#person", "#person"],
        "when": function(a, b) {
          return (
            (!a.properties.hungry && !b.properties.hungry) 
            && !this.isRelated("friendship", a, b));
        },
        "action": function*(a, b) {
          yield (new seaduck.StoryEvent("makeFriends", a, b));
          this.reciprocal("friendship", a, b);
        }
      },
      {
        "name": "express happiness",
        "match": ["#person"],
        "when": function(a) {
          return !a.properties.hungry 
            && a.properties.goofoff >= 2 
            && this.allRelatedByTag("friendship", a, "#person").length > 0;
        },
        "action": function*(a) {
          yield (new seaduck.StoryEvent("isHappy", a));
        }
      }
    ],
    "traceryDiscourse": {
      "isHappy": ["#nounA# was happy", "#nounA# felt good!"],
      "isHungry": [
        "#nounA#'s new get rich quick scheme",
        "#nounA# felt very hungry."],
      "makeFriends": [
        "#nounA# made friends with #nounB#.",
        "#nounA# and #nounB# became friends."],
      "reallyLike": [
        "And let me tell you, #nounA# really enjoyed that #nounB#.",
        "#nounA# says, 'This #nounB# is so delicious!'"
      ],
      "eat": [
        "#nounA# ate a #nounB#.",
        "#nounA# gobbled up a #nounB#."
      ],
      "adventure": [
        "A mysterious old man tells #nounA# and Kit about a treasure hidden in #nounB#, but #"
      ],
      "_end": ["The end.", "And they lived happily ever after."]
    }
  });


for (let i = 0; i < 100; i++) {
  let storyEvents = n.stepAndRender();
  if (storyEvents.length > 0) {
    for (let ev of storyEvents) {
      console.log(ev);
    }
  }
  else {
    break;
  }
}

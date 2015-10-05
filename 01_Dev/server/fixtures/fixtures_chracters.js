var Characters = MongoCollections.Characters;
if (Characters.find().count() === 0) {
  var CharacterImages = MongoCollections.CharacterImages;

  var narration = Characters.insert({identifier: 'narration', name: 'ナレーション', position:'friend', useForNovel:true});
  CharacterImages.insert({characterId:narration, pose:'通常', portraitImageUrl: '', iconUrl: '/material/chara_image/icon/narration.gif'});

  var mika = Characters.insert({identifier: 'Mika@Rabbit', name: 'ウサギのミカ', position:'friend', useForNovel:true});
  var mikaImages = [];
  mikaImages.push(CharacterImages.insert({characterId:mika, useForNovel:true, pose:'通常', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/mika/mika_550_portrait_normal.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/mika/mika_icon_normal.jpg'}));
  mikaImages.push(CharacterImages.insert({characterId:mika, useForNovel:true, pose:'笑顔', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/mika/mika_550_portrait_smile.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/mika/mika_icon_smile.jpg'}));
  mikaImages.push(CharacterImages.insert({characterId:mika, useForNovel:true, pose:'怒り', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/mika/mika_550_portrait_angry.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/mika/mika_icon_angry.jpg'}));
  mikaImages.push(CharacterImages.insert({characterId:mika, useForNovel:true, pose:'悲しい', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/mika/mika_550_portrait_sad.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/mika/mika_icon_sad.jpg'}));

  var ayumi = Characters.insert({identifier: 'Ayumi@Tartle', name: 'カメのアユミ', position:'friend', useForNovel:true});
  var ayumiImages = [];
  ayumiImages.push(CharacterImages.insert({characterId:ayumi, useForNovel:true, pose:'通常', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/ayumi/ayumi_550_portrait_normal.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/ayumi/ayumi_icon_normal.jpg'}));
  ayumiImages.push(CharacterImages.insert({characterId:ayumi, useForNovel:true, pose:'笑顔', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/ayumi/ayumi_550_portrait_smile.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/ayumi/ayumi_icon_smile.jpg'}));
  ayumiImages.push(CharacterImages.insert({characterId:ayumi, useForNovel:true, pose:'怒り', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/ayumi/ayumi_550_portrait_angry.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/ayumi/ayumi_icon_angry.jpg'}));
  ayumiImages.push(CharacterImages.insert({characterId:ayumi, useForNovel:true, pose:'悲しい', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/ayumi/ayumi_550_portrait_sad.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/ayumi/ayumi_icon_sad.jpg'}));

  var ran = Characters.insert({identifier: 'Ran@GoldFish', name: 'キンギョのラン', position:'friend', useForNovel:true});
  var ranImages = [];
  ranImages.push(CharacterImages.insert({characterId:ran, useForNovel:true, pose:'通常', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/ran/ran_550_portrait_normal.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/ran/ran_icon_normal.jpg'}));
  ranImages.push(CharacterImages.insert({characterId:ran, useForNovel:true, pose:'笑顔', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/ran/ran_550_portrait_smile.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/ran/ran_icon_smile.jpg'}));
  ranImages.push(CharacterImages.insert({characterId:ran, useForNovel:true, pose:'怒り', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/ran/ran_550_portrait_angry.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/ran/ran_icon_angry.jpg'}));
  ranImages.push(CharacterImages.insert({characterId:ran, useForNovel:true, pose:'悲しい', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/ran/ran_550_portrait_sad.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/ran/ran_icon_sad.jpg'}));

  var tsubasa = Characters.insert({identifier: 'Tsubasa@Parakeet', name: 'インコのツバサ', position:'friend', useForNovel:true});
  var tsubasaImages = [];
  tsubasaImages.push(CharacterImages.insert({characterId:tsubasa, useForNovel:true, pose:'通常', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/tsubasa/tsubasa_550_portrait_normal.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/tsubasa/tsubasa_icon_normal.jpg'}));
  tsubasaImages.push(CharacterImages.insert({characterId:tsubasa, useForNovel:true, pose:'笑顔', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/tsubasa/tsubasa_550_portrait_smile.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/tsubasa/tsubasa_icon_smile.jpg'}));
  tsubasaImages.push(CharacterImages.insert({characterId:tsubasa, useForNovel:true, pose:'怒り', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/tsubasa/tsubasa_550_portrait_angry.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/tsubasa/tsubasa_icon_angry.jpg'}));
  tsubasaImages.push(CharacterImages.insert({characterId:tsubasa, useForNovel:true, pose:'悲しい', portraitImageUrl: 'https://www.emastation.com/wrt/material/chara_image/portrait/official/tsubasa/tsubasa_550_portrait_sad.png', iconUrl: 'https://www.emastation.com/wrt/material/chara_image/icon/official/tsubasa/tsubasa_icon_sad.jpg'}));


  // ここから敵キャラ
  var ork = Characters.insert({identifier: 'Ork', name: 'オーク', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:ork, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/dh09_po2.png",
      "naturalWidth": 177,
      "naturalHeight": 225,
      "textureWidth": 256,
      "textureHeight": 256
    },
    "movement": "verticalShaking"
  });

  var greenDragon = Characters.insert({identifier: 'GreenDragon', name: 'グリーンドラゴン', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:greenDragon, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/dh12_po2.png",
      "naturalWidth": 229,
      "naturalHeight": 185,
      "textureWidth": 256,
      "textureHeight": 256
    },
    "movement": "sincos"
  });

  var heavyDragon = Characters.insert({identifier: 'HeavyDragon', name: 'ヘビードラゴン', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:heavyDragon, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/monster04_po2.png",
      "naturalWidth": 380,
      "naturalHeight": 275,
      "textureWidth": 512,
      "textureHeight": 512
    },
    "movement": "verticalShaking"
  });

  var cerberus = Characters.insert({identifier: 'Cerberus', name: 'ケルベロス', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:cerberus, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/monster24_po2.png",
      "naturalWidth": 119,
      "naturalHeight": 170,
      "textureWidth": 128,
      "textureHeight": 256
    },
    "movement": "verticalShaking"
  });

  var mushroom = Characters.insert({identifier: 'Mushroom', name: '人食いキノコ', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:mushroom, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/plant01_po2.png",
      "naturalWidth": 146,
      "naturalHeight": 220,
      "textureWidth": 256,
      "textureHeight": 256
    },
    "movement": "pulsing"
  });

  var darkNinja = Characters.insert({identifier: 'DarkNinja', name: '暗黒忍者', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:darkNinja, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/human14_po2.png",
      "naturalWidth": 111,
      "naturalHeight": 170,
      "textureWidth": 128,
      "textureHeight": 256
    },
    "movement": "sidefly"
  });

  var mimic = Characters.insert({identifier: 'Mimic', name: 'ミミック', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:mimic, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/solid02_po2.png",
      "naturalWidth": 98,
      "naturalHeight": 120,
      "textureWidth": 128,
      "textureHeight": 128
    },
    "movement": "jump"
  });

  var unmannedWeapon = Characters.insert({identifier: 'UnmannedWeapon', name: '翼型無人兵器', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:unmannedWeapon, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/m03_po2.png",
      "naturalWidth": 496,
      "naturalHeight": 260,
      "textureWidth": 512,
      "textureHeight": 512
    },
    "movement": "updown"
  });

  var movingVine = Characters.insert({identifier: 'MovingVine', name: '動くつた', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:movingVine, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/plant06_p02.png",
      "naturalWidth": 180,
      "naturalHeight": 220,
      "textureWidth": 256,
      "textureHeight": 256
    },
    "movement": "pulsing"
  });

  var bigWaterCreature = Characters.insert({identifier: 'BigWaterCreature', name: '巨大水生生物', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:bigWaterCreature, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler01/aquatic17_po2.png",
      "naturalWidth": 421,
      "naturalHeight": 288,
      "textureWidth": 512,
      "textureHeight": 512
    },
    "movement": "verticalShaking"
  });

  var evilPriest = Characters.insert({identifier: 'EvilPriest', name: 'エビルプリースト', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:evilPriest, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler01/human38_po2.png",
      "naturalWidth": 134,
      "naturalHeight": 220,
      "textureWidth": 256,
      "textureHeight": 256
    },
    "movement": "updown"
  });

  var deadAngel = Characters.insert({identifier: 'DeadAngel', name: 'デッドエンジェル', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:deadAngel, useForNovel:false, pose:'通常',
    battleImage: {
      "url": "https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler01/undead22_po2.png",
      "naturalWidth": 489,
      "naturalHeight": 280,
      "textureWidth": 512,
      "textureHeight": 512
    },
    "movement": "none"
  });

}


var Stories = MongoCollections.Stories;
var storyIds = [];
if (Stories.find().count() === 0) {
  [
    {title: 'Story_1'},
    {title: 'Story_2'},
    {title: 'Story_3'},
    {title: 'Story_4'}
  ].forEach(function (attribute, i) {
        storyIds.push(Stories.insert({
          title: attribute.title,
          order: i
        }));
      }
  );

  // Story_1
  var StoryScenes = MongoCollections.StoryScenes;
  var sceneOfStory_1 = StoryScenes.insert({storyId: storyIds[0], name: 'シーン１', order: 0});
  var sentence1_OfSceneOfStory_1 = {
    sceneId: sceneOfStory_1,
    comment: "This is a sentence.",
    text: 'Story_1だよ！',
    characterId: mika,
    characterImageId: mikaImages[0],
    position: 'RightEdge'
  };
  var sentence2_OfSceneOfStory_1 = {
    sceneId: sceneOfStory_1,
    comment: "This is a sentence.",
    text: 'そんなこといわれても…',
    characterId: ran,
    characterImageId: ranImages[1],
    position: 'LeftEdge'
  };
  var sentence3_OfSceneOfStory_1 = {
    sceneId: sceneOfStory_1,
    comment: "This is a sentence.",
    text: '焦ってもしょうがないですわ',
    characterId: ayumi,
    characterImageId: ayumiImages[2],
    position: 'Center'
  };
  var sentence4_OfSceneOfStory_1 = {
    sceneId: sceneOfStory_1,
    comment: "This is a sentence.",
    text: 'そうだよ。ここはボクにまかせて',
    characterId: tsubasa,
    characterImageId: tsubasaImages[3],
    position: 'LeftEdge'
  };
  Meteor.call("pushSentence", sentence1_OfSceneOfStory_1);
  Meteor.call("pushSentence", sentence2_OfSceneOfStory_1);
  Meteor.call("pushSentence", sentence3_OfSceneOfStory_1);
  Meteor.call("pushSentence", sentence4_OfSceneOfStory_1);

  // Story_2
  var StoryScenes = MongoCollections.StoryScenes;
  var sceneOfStory_2 = StoryScenes.insert({storyId: storyIds[1], name: 'シーン１', order: 0});
  var sentence1_OfSceneOfStory_2 = {
    sceneId: sceneOfStory_2,
    comment: "This is a sentence.",
    text: 'Story_2だよ！',
    characterId: mika,
    characterImageId: mikaImages[0],
    position: 'RightEdge'
  };
  var sentence2_OfSceneOfStory_2 = {
    sceneId: sceneOfStory_2,
    comment: "This is a sentence.",
    text: 'そんなこといわれても…',
    characterId: ran,
    characterImageId: ranImages[1],
    position: 'LeftEdge'
  };
  var sentence3_OfSceneOfStory_2 = {
    sceneId: sceneOfStory_2,
    comment: "This is a sentence.",
    text: '焦ってもしょうがないですわ',
    characterId: ayumi,
    characterImageId: ayumiImages[2],
    position: 'Center'
  };
  var sentence4_OfSceneOfStory_2 = {
    sceneId: sceneOfStory_2,
    comment: "This is a sentence.",
    text: 'そうだよ。ここはボクにまかせて',
    characterId: tsubasa,
    characterImageId: tsubasaImages[3],
    position: 'LeftEdge'
  };
  Meteor.call("pushSentence", sentence1_OfSceneOfStory_2);
  Meteor.call("pushSentence", sentence2_OfSceneOfStory_2);
  Meteor.call("pushSentence", sentence3_OfSceneOfStory_2);
  Meteor.call("pushSentence", sentence4_OfSceneOfStory_2);

}

wrt_fixtureLoadedCount = (typeof wrt_fixtureLoadedCount !== "undefined") ? wrt_fixtureLoadedCount++ : 0;

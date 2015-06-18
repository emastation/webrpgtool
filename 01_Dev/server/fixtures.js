if (Maps.find().count() === 0) {
  Maps.insert({
    title: 'Map 1',
    width: 5,
    height: 5
  });
  Maps.insert({
    title: 'Map 2',
    width: 10,
    height: 7
  });
  Maps.insert({
    title: 'Map 3',
    width: 3,
    height: 11
  });
}


if (MapTextures.find().count() === 0) {
  MapTextures.insert({
    mtId: 0,
    name: 'メタル',
    gametex_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/gameTile/Metal_lightgray.png',
    tooltex_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/toolTile/Metal_lightgray.jpg'
  });
  MapTextures.insert({
    mtId: 1,
    name: '水晶',
    gametex_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/gameTile/suisyou1.png',
    tooltex_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/toolTile/suisyou1.jpg'
  });
  MapTextures.insert({
    mtId: 2,
    name: '青いタイル',
    gametex_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/gameTile/bluetile.png',
    tooltex_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/toolTile/bluetile.jpg'
  });
  MapTextures.insert({
    mtId: 3,
    name: '虎の毛皮',
    gametex_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/gameTile/FauxFur.png',
    tooltex_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/toolTile/FauxFur.jpg'
  });
  MapTextures.insert({
    mtId: 4,
    name: '木目',
    gametex_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/gameTile/wood.png',
    tooltex_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/toolTile/wood.jpg'
  });
}


if (MapTileTypes.find().count() === 0) {
  MapTileTypes.insert({
    mttId: 0,
    name: '通常',
    identifier: 'N',
    image_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/typeTypeImage/normal.png'
  });
  MapTileTypes.insert({
    mttId: 1,
    name: '壁',
    identifier: 'W',
    image_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/typeTypeImage/Wall.png'
  });
  MapTileTypes.insert({
    mttId: 2,
    name: 'ダークゾーン',
    identifier: 'Dk',
    image_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/typeTypeImage/darkzone.png'
  });
  MapTileTypes.insert({
    mttId: 3,
    name: 'プラットフォーム',
    identifier: 'P',
    image_url: 'http://www.emastation.net/uploadspace/WebRPGTool/material/typeTypeImage/platform.png'
  });
}

if (Codes.find().count() === 0) {
  Codes.insert({
    codeId: 0,
    name: 'コード１',
    typescript: 'Hello World!',
    javascript: 'Hello World!'
  });
  Codes.insert({
    codeId: 1,
    name: 'コード２',
    typescript: 'Hello Meteor!',
    javascript: 'Hello Meteor !'
  });
}

if (Stories.find().count() === 0) {
  [
    {title: 'Story_1'},
    {title: 'Story_2'},
    {title: 'Story_3'},
    {title: 'Story_4'}
  ].forEach(function (attribute, i) {
        Stories.insert({
          title: attribute.title,
          order: i
        });
      }
  );
}

if (Characters.find().count() === 0) {
  var narration = Characters.insert({identifier: 'narration', name: 'ナレーション', position:'friend', useForNovel:true});
  CharacterImages.insert({characterId:narration, pose:'通常', portraitImageUrl: '', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/narration.gif'});

  var mika = Characters.insert({identifier: 'Mika@Rabbit', name: 'ウサギのミカ', position:'friend', useForNovel:true});
  CharacterImages.insert({characterId:mika, pose:'通常', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/mika/mika_550_portrait_normal.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/mika/mika_icon_normal.jpg'});
  CharacterImages.insert({characterId:mika, pose:'笑顔', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/mika/mika_550_portrait_smile.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/mika/mika_icon_smile.jpg'});
  CharacterImages.insert({characterId:mika, pose:'怒り', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/mika/mika_550_portrait_angry.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/mika/mika_icon_angry.jpg'});
  CharacterImages.insert({characterId:mika, pose:'悲しい', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/mika/mika_550_portrait_sad.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/mika/mika_icon_sad.jpg'});

  var ayumi = Characters.insert({identifier: 'Ayumi@Tartle', name: 'カメのアユミ', position:'friend', useForNovel:true});
  CharacterImages.insert({characterId:ayumi, pose:'通常', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/ayumi/ayumi_550_portrait_normal.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/ayumi/ayumi_icon_normal.jpg'});
  CharacterImages.insert({characterId:ayumi, pose:'笑顔', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/ayumi/ayumi_550_portrait_smile.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/ayumi/ayumi_icon_smile.jpg'});
  CharacterImages.insert({characterId:ayumi, pose:'怒り', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/ayumi/ayumi_550_portrait_angry.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/ayumi/ayumi_icon_angry.jpg'});
  CharacterImages.insert({characterId:ayumi, pose:'悲しい', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/ayumi/ayumi_550_portrait_sad.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/ayumi/ayumi_icon_sad.jpg'});

  var ran = Characters.insert({identifier: 'Ran@GoldFish', name: 'キンギョのラン', position:'friend', useForNovel:true});
  CharacterImages.insert({characterId:ran, pose:'通常', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/ran/ran_550_portrait_normal.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/ran/ran_icon_normal.jpg'});
  CharacterImages.insert({characterId:ran, pose:'笑顔', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/ran/ran_550_portrait_smile.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/ran/ran_icon_smile.jpg'});
  CharacterImages.insert({characterId:ran, pose:'怒り', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/ran/ran_550_portrait_angry.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/ran/ran_icon_angry.jpg'});
  CharacterImages.insert({characterId:ran, pose:'悲しい', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/ran/ran_550_portrait_sad.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/ran/ran_icon_sad.jpg'});

  var tsubasa = Characters.insert({identifier: 'Tsubasa@Parakeet', name: 'インコのツバサ', position:'friend', useForNovel:true});
  CharacterImages.insert({characterId:tsubasa, pose:'通常', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/tsubasa/tsubasa_550_portrait_normal.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/tsubasa/tsubasa_icon_normal.jpg'});
  CharacterImages.insert({characterId:tsubasa, pose:'笑顔', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/tsubasa/tsubasa_550_portrait_smile.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/tsubasa/tsubasa_icon_smile.jpg'});
  CharacterImages.insert({characterId:tsubasa, pose:'怒り', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/tsubasa/tsubasa_550_portrait_angry.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/tsubasa/tsubasa_icon_angry.jpg'});
  CharacterImages.insert({characterId:tsubasa, pose:'悲しい', portraitImageUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/portrait/official/tsubasa/tsubasa_550_portrait_sad.png', iconUrl: 'http://www.emastation.net/uploadspace/WebNovelTool/material/chara_image/icon/official/tsubasa/tsubasa_icon_sad.jpg'});


  // ここから敵キャラ
  var ork = Characters.insert({identifier: 'Ork', name: 'オーク', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:ork, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler00/dh09_po2.png",
      "naturalWidth": 177,
      "naturalHeight": 225,
      "textureWidth": 256,
      "textureHeight": 256
    },
    "movement": "verticalShaking"
  });

  var greenDragon = Characters.insert({identifier: 'GreenDragon', name: 'グリーンドラゴン', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:greenDragon, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler00/dh12_po2.png",
      "naturalWidth": 229,
      "naturalHeight": 185,
      "textureWidth": 256,
      "textureHeight": 256
    },
    "movement": "sincos"
  });

  var heavyDragon = Characters.insert({identifier: 'HeavyDragon', name: 'ヘビードラゴン', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:heavyDragon, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler00/monster04_po2.png",
      "naturalWidth": 380,
      "naturalHeight": 275,
      "textureWidth": 512,
      "textureHeight": 512
    },
    "movement": "verticalShaking"
  });

  var cerberus = Characters.insert({identifier: 'Cerberus', name: 'ケルベロス', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:cerberus, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler00/monster24_po2.png",
      "naturalWidth": 119,
      "naturalHeight": 170,
      "textureWidth": 128,
      "textureHeight": 256
    },
    "movement": "verticalShaking"
  });

  var mushroom = Characters.insert({identifier: 'Mushroom', name: '人食いキノコ', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:mushroom, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler00/plant01_po2.png",
      "naturalWidth": 146,
      "naturalHeight": 220,
      "textureWidth": 256,
      "textureHeight": 256
    },
    "movement": "pulsing"
  });

  var darkNinja = Characters.insert({identifier: 'DarkNinja', name: '暗黒忍者', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:darkNinja, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler00/human14_po2.png",
      "naturalWidth": 111,
      "naturalHeight": 170,
      "textureWidth": 128,
      "textureHeight": 256
    },
    "movement": "sidefly"
  });

  var mimic = Characters.insert({identifier: 'Mimic', name: 'ミミック', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:mimic, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler00/solid02_po2.png",
      "naturalWidth": 98,
      "naturalHeight": 120,
      "textureWidth": 128,
      "textureHeight": 128
    },
    "movement": "jump"
  });

  var unmannedWeapon = Characters.insert({identifier: 'UnmannedWeapon', name: '翼型無人兵器', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:unmannedWeapon, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler00/m03_po2.png",
      "naturalWidth": 496,
      "naturalHeight": 260,
      "textureWidth": 512,
      "textureHeight": 512
    },
    "movement": "updown"
  });

  var movingVine = Characters.insert({identifier: 'MovingVine', name: '動くつた', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:movingVine, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler00/plant06_p02.png",
      "naturalWidth": 180,
      "naturalHeight": 220,
      "textureWidth": 256,
      "textureHeight": 256
    },
    "movement": "pulsing"
  });

  var bigWaterCreature = Characters.insert({identifier: 'BigWaterCreature', name: '巨大水生生物', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:bigWaterCreature, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler01/aquatic17_po2.png",
      "naturalWidth": 421,
      "naturalHeight": 288,
      "textureWidth": 512,
      "textureHeight": 512
    },
    "movement": "verticalShaking"
  });

  var evilPriest = Characters.insert({identifier: 'EvilPriest', name: 'エビルプリースト', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:evilPriest, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler01/human38_po2.png",
      "naturalWidth": 134,
      "naturalHeight": 220,
      "textureWidth": 256,
      "textureHeight": 256
    },
    "movement": "updown"
  });

  var deadAngel = Characters.insert({identifier: 'DeadAngel', name: 'デッドエンジェル', position:'enemy', useForNovel:false});
  CharacterImages.insert({characterId:deadAngel, pose:'通常',
    battleImage: {
      "url": "http://www.emastation.net/uploadspace/WebRPGTool/material/enemyImage/lud.sakura.ne.jp/battler01/undead22_po2.png",
      "naturalWidth": 489,
      "naturalHeight": 280,
      "textureWidth": 512,
      "textureHeight": 512
    },
    "movement": "none"
  });

}

if (UiTables.find().count() === 0) {
  UiTables.insert({
    identifier: 'system-command',
    title: 'システムコマンド',
    records: [
      {
        columns:[
          {
            title: 'ゲームを始める'
          }
        ]
      },
      {
        columns:[
          {
            title: 'セーブする'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      },
      {
        columns:[
          {
            title: 'やめる'
          }
        ]
      }
    ]
  });
}

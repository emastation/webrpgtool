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

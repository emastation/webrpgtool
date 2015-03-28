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
    code: 'Hello World!'
  });
  Codes.insert({
    codeId: 1,
    name: 'コード２',
    code: 'Hello Meteor!'
  });
}


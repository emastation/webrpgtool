var Maps = MongoCollections.Maps;
if (Maps.find().count() === 0) {

}


var MapTextures = MongoCollections.MapTextures;
if (MapTextures.find().count() === 0) {
  MapTextures.insert({
    mtId: 0,
    name: 'メタル',
    gametex_url: 'https://www.emastation.com/wrt/material/tileImage/gameTile/Metal_lightgray.png',
    game_model_url: 'https://www.emastation.com/wrt/material/tile3d/Metal.babylon',
    tooltex_url: 'https://www.emastation.com/wrt/material/tileImage/toolTile/Metal_lightgray.jpg'
  });
  MapTextures.insert({
    mtId: 1,
    name: '水晶',
    gametex_url: 'https://www.emastation.com/wrt/material/tileImage/gameTile/suisyou1.png',
    game_model_url: 'https://www.emastation.com/wrt/material/tile3d/Cristal.babylon',
    tooltex_url: 'https://www.emastation.com/wrt/material/tileImage/toolTile/suisyou1.jpg'
  });
  MapTextures.insert({
    mtId: 2,
    name: '氷',
    gametex_url: 'https://www.emastation.com/wrt/material/tileImage/gameTile/bluetile.png',
    game_model_url: 'https://www.emastation.com/wrt/material/tile3d/Ice.babylon',
    tooltex_url: 'https://www.emastation.com/wrt/material/tileImage/toolTile/bluetile.jpg'
  });
  MapTextures.insert({
    mtId: 3,
    name: '植物',
    gametex_url: 'https://www.emastation.com/wrt/material/tileImage/gameTile/FauxFur.png',
    game_model_url: 'https://www.emastation.com/wrt/material/tile3d/Plant.babylon',
    tooltex_url: 'https://www.emastation.com/wrt/material/tileImage/toolTile/lichen.jpg'
  });
  MapTextures.insert({
    mtId: 4,
    name: '木目',
    gametex_url: 'https://www.emastation.com/wrt/material/tileImage/gameTile/wood.png',
    game_model_url: 'https://www.emastation.com/wrt/material/tile3d/Wood.babylon',
    tooltex_url: 'https://www.emastation.com/wrt/material/tileImage/toolTile/wood.jpg'
  });
}


var MapTileTypes = MongoCollections.MapTileTypes;
if (MapTileTypes.find().count() === 0) {
  MapTileTypes.insert({
    mttId: 0,
    name: '通常',
    identifier: 'N',
    image_url: '/material/typeTypeImage/normal.png'
  });
  MapTileTypes.insert({
    mttId: 1,
    name: '壁',
    identifier: 'W',
    image_url: '/material/typeTypeImage/Wall.png'
  });
  MapTileTypes.insert({
    mttId: 2,
    name: 'ダークゾーン',
    identifier: 'Dk',
    image_url: '/material/typeTypeImage/darkzone.png'
  });
  MapTileTypes.insert({
    mttId: 3,
    name: 'プラットフォーム',
    identifier: 'P',
    image_url: '/material/typeTypeImage/platform.png'
  });
}

wrt_fixtureLoadedCount = (typeof wrt_fixtureLoadedCount !== "undefined") ? wrt_fixtureLoadedCount++ : 0;

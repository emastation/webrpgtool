var ObjectSchemata = MongoCollections.ObjectSchemata;
if (ObjectSchemata.find().count() === 0) {

  ObjectSchemata.insert({
    name: 'ゲームキャラクター',
    identifier: 'wrt_game_character',
    game_id: '',
    extends: '',
    attributes: [
      {
        identifier: 'name',
        name: '名前',
        type: 'string',
        options: []
      },
      {
        identifier: 'hp',
        name: 'HP',
        type: 'number',
        options: []
      },
      {
        identifier: 'mp',
        name: 'MP',
        type: 'number',
        options: []
      },
      {
        identifier: 'situation',
        name: '立場',
        type: 'select',
        options: [
          {
            identifier: "friend",
            name: "味方"
          },
          {
            identifier: "npc",
            name: "NPC"
          },
          {
            identifier: "enemy",
            name: "敵"
          }
        ]
      },
      {
        identifier: 'battleEnemyImageUrl',
        name: '戦闘時の敵としての画像URL',
        type: 'string',
        options: []
      }
    ]
  });
}

var Objects = MongoCollections.Objects;
if (Objects.find().count() === 0) {

  Objects.insert({
    identifier: 'Mika@Rabbit',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: 'ウサギのミカ'
      },
      {
        identifier: 'hp',
        value: 100
      },
      {
        identifier: 'mp',
        value: 100
      },
      {
        identifier: 'situation',
        value: 'friend'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: ''
      }
    ]
  });

  Objects.insert({
    identifier: 'Ayumi@Tartle',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: 'カメのアユミ'
      },
      {
        identifier: 'hp',
        value: 80
      },
      {
        identifier: 'mp',
        value: 120
      },
      {
        identifier: 'situation',
        value: 'friend'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: ''
      }
    ]
  });

  Objects.insert({
    identifier: 'ork',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: 'オーク'
      },
      {
        identifier: 'hp',
        value: 110
      },
      {
        identifier: 'mp',
        value: 90
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/dh09.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'greenDragon',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: 'グリーンドラゴン'
      },
      {
        identifier: 'hp',
        value: 130
      },
      {
        identifier: 'mp',
        value: 40
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/dh12.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'darkNinja',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: '暗黒忍者'
      },
      {
        identifier: 'hp',
        value: 90
      },
      {
        identifier: 'mp',
        value: 80
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/human14.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'unmannedFlyingMachine',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: '翼型無人兵器'
      },
      {
        identifier: 'hp',
        value: 130
      },
      {
        identifier: 'mp',
        value: 50
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/m03.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'heavyDragon',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: 'ヘビードラゴン'
      },
      {
        identifier: 'hp',
        value: 200
      },
      {
        identifier: 'mp',
        value: 110
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/monster04.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'cerberus',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: 'ケルベロス'
      },
      {
        identifier: 'hp',
        value: 120
      },
      {
        identifier: 'mp',
        value: 50
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/monster24.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'manEaterMushroom',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: '人食いキノコ'
      },
      {
        identifier: 'hp',
        value: 130
      },
      {
        identifier: 'mp',
        value: 30
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/plant01.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'movingVine',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: '動くつた'
      },
      {
        identifier: 'hp',
        value: 120
      },
      {
        identifier: 'mp',
        value: 40
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/plant06.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'mimic',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: 'ミミック'
      },
      {
        identifier: 'hp',
        value: 100
      },
      {
        identifier: 'mp',
        value: 90
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/solid02.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'bigWaterCreature',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: '巨大水生生物'
      },
      {
        identifier: 'hp',
        value: 180
      },
      {
        identifier: 'mp',
        value: 60
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/aquatic17.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'evilPriest',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: 'エビルプリースト'
      },
      {
        identifier: 'hp',
        value: 90
      },
      {
        identifier: 'mp',
        value: 220
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/human38.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'deadAngel',
    schema_identifier: 'wrt_game_character',
    game_id: '',
    attributes: [
      {
        identifier: 'name',
        value: 'デッドエンジェル'
      },
      {
        identifier: 'hp',
        value: 130
      },
      {
        identifier: 'mp',
        value: 180
      },
      {
        identifier: 'situation',
        value: 'enemy'
      },
      {
        identifier: 'battleEnemyImageUrl',
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/undead22.png'
      }
    ]
  });
}

wrt_fixtureLoadedCount = (typeof wrt_fixtureLoadedCount !== "undefined") ? wrt_fixtureLoadedCount++ : 0;

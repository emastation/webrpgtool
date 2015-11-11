var ObjectSchemata = MongoCollections.ObjectSchemata;
if (ObjectSchemata.find().count() === 0) {

  ObjectSchemata.insert({
    name: 'ゲームキャラクター',
    identifier: 'wrt_game_character',
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
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/dh09_po2.png'
      }
    ]
  });

  Objects.insert({
    identifier: 'greenDragon',
    schema_identifier: 'wrt_game_character',
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
        value: 'https://www.emastation.com/wrt/material/enemyImage/lud.sakura.ne.jp/battler00/dh12_po2.png'
      }
    ]
  });

}

wrt_fixtureLoadedCount = (typeof wrt_fixtureLoadedCount !== "undefined") ? wrt_fixtureLoadedCount++ : 0;

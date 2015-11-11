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
      }
    ]
  });
}

wrt_fixtureLoadedCount = (typeof wrt_fixtureLoadedCount !== "undefined") ? wrt_fixtureLoadedCount++ : 0;

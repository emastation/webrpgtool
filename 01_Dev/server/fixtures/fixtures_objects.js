var ObjectSchemata = MongoCollections.ObjectSchemata;
if (ObjectSchemata.find().count() === 0) {

  ObjectSchemata.insert({
    name: 'ゲームキャラクター',
    identifier: 'wrt_game_character',
    extends: '',
    attributes: [
      {
        identifier: 'hp',
        name: 'HP',
        type: 'number'
      }
    ]
  });
}

wrt_fixtureLoadedCount = (typeof wrt_fixtureLoadedCount !== "undefined") ? wrt_fixtureLoadedCount++ : 0;

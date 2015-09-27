var Codes = MongoCollections.Codes;
if (Codes.find().count() === 0) {
  Codes.insert({
    name: 'Story_1再生',
    identifier: 'play_story1_next',
    javascript: (function () {/*
     var result = yield callEngineMethod('playNovelNext', 'Story_1');
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]
  });
  Codes.insert({
    name: 'Story_2再生',
    identifier: 'play_story2_next',
    javascript: (function () {/*
     var result = yield callEngineMethod('changePlayerIsMovable', false);
     result = yield callEngineMethod('playNovelNext', 'Story_2');
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]
  });
}

wrt_fixtureLoadedCount = (typeof wrt_fixtureLoadedCount !== "undefined") ? wrt_fixtureLoadedCount++ : 0;

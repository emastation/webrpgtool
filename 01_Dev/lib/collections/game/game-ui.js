UiOperations = new Mongo.Collection(null); // Client side only collection
UiOperations.insert({
  operation: 'L_UI_NO_MOVE',
  times: 0
});

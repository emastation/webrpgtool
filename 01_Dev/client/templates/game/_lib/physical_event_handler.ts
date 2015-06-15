/**
 * 物理的なイベントを処理する関数群
 */
module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック


  function whichDown() {
    return function (event) {
      return [event.keyCode, KEY_DOWN];
    }
  }

  function whichUp() {
    return function (event) {
      return [event.keyCode, KEY_UP];
    }
  }

  function keyCodeIs(keyCodes) {
    return function (event) {
      return _.contains(keyCodes, event.keyCode);
    }
  }

  function keyDownEvents(keyCodes) {
    return $(document).asEventStream("keydown").filter(keyCodeIs(keyCodes));
  }

  function keyUpEvents(keyCodes) {
    return $(document).asEventStream("keyup").filter(keyCodeIs(keyCodes));
  }

  function keyStateProperty(keyCodes) {
    return keyDownEvents(keyCodes).flatMapLatest(whichDown())
        .merge(keyUpEvents(keyCodes).flatMap(whichUp()))
        .skipDuplicates(_.isEqual).toProperty();
  }

  function keyProperty(keyCodes) {
    return keyDownEvents(keyCodes).flatMapLatest(whichDown())
        .merge(keyUpEvents(keyCodes).flatMap(whichUp()))
        .toProperty();
  }

  export function initMapMovementEventHandler(): any {
    var gameState = GameState.getInstance();
    var allowedStateKeys:Array<Number> = gameState.allowedStateKeyCodes;

    return keyStateProperty(allowedStateKeys);
  }

  export function initUiEventHandler(): any {
    var gameState = GameState.getInstance();
    var allowedUiKeys:Array<Number> = gameState.allowedUiKeyCodes;

    return keyProperty(allowedUiKeys);
  }

}
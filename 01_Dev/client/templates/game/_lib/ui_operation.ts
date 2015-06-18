declare var MongoCollections:any;

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  /**
   *  マップ上の移動を処理するクラス
   */
  export class UiOperation {
    private static _instance:UiOperation;

    public static getInstance():UiOperation
    {
      if(UiOperation._instance == null) {
        UiOperation._instance = new UiOperation();
      }
      return UiOperation._instance;
    }

    public init(logicalUiCommandProperty:any) {
      logicalUiCommandProperty.onValue((value)=> {
        var uiOperation:any = MongoCollections.UiOperations.findOne();

        if (value === L_UI_NO_MOVE || value === L_UI_PUSH_OK) {
          var times = 0;
        } else {
          var times = <number>uiOperation.times + 1;
        }

        var attributes = {
          operation: value,
          times: times
        };

        MongoCollections.UiOperations.update(uiOperation._id, {$set: attributes}, function(error) {
          if (error) {
            // display the error to the user
            alert(error.reason);
          }
        });

      });
    }
  }
}
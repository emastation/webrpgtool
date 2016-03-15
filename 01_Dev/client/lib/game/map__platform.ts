module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class MapPlatform {
    protected heightMap:any;
    protected x_onMap:number;
    protected y_onMap:number;
    private platformMode:string;
    private levels:any;
    private currentLevel:any;
    protected _floorSprite3D:any = {};
    protected _ceilingSprite3D:any = {};
    private _loopN:number = 0; // プラットフォームの上下の動きの繰り返し数。0なら片道。1なら往復。

    private _timeLeft:number = 0; // プラットフォームを動かし始めてからの経過時間
    private _direction:number = 1; // プラットフォームが動く上下の方向
    private _remainLoopN:number = 0; // プラットフォームの残り繰り返し数
    private _fired:boolean = false; // プラットフォームが起動されるとtrueになる。

    // コンストラクタの宣言
    constructor(x:number, y:number, heightMap:any, parameter:string) {
      this.heightMap = heightMap;
      this.x_onMap = x;
      this.y_onMap = y;

      this.platformMode = parameter.split('|')[0];
      var levelParameters:string = parameter.split('|')[1];
      this.levels = levelParameters.split('~');
      for (var i=0; i<this.levels.length; i++) {
        this.levels[i] = parseInt(this.levels[i], 10);
      }

      this._loopN = parseInt(parameter.split('|')[2]);
//            console.log("パラメータ:", this.levels);

      this.currentLevel = this.heightMap[this.y_onMap][this.x_onMap][0]; //this.levels[0];

      if(this.levels[0] > this.levels[1]) {
        var tmpLevel = this.levels[0];
        this.levels[0] = this.levels[1];
        this.levels[1] = tmpLevel;
      }
      
      this.initDirection();
    }

    private initDirection() {
      if (this.currentLevel === this.levels[0]) { // プラットフォームの現在レベルがlevels[0]であれば、
        this._direction = 1; // プラットフォームは上に動かす
      } else {
        this._direction = -1; // そうでなければ、下に動かす
      }
    }

    public move() {
      // プラットフォームの稼働アニメーション
      var span = Math.abs(this.levels[1] - this.levels[0]);
      var time = 5;
      var delta = 1 / 60 * span / time; //60は仮定するFPS値
      var breakTime = 1;

      if (this.platformMode === 'A') { // マニュアルモードのプラットフォームであれば、プレーヤーが乗っかった時に動かす
        this._remainLoopN = -1;
        this.moveInner(
            delta, time, breakTime, this._floorSprite3D.mesh, 60
        );
      } else if (this.platformMode === 'M') {
        // もし、プレーヤーがこのプラットフォームに乗っているなら
        var mapMovement = MapMovement.getInstance();
        if (mapMovement.playerXInteger === this.x_onMap && mapMovement.playerYInteger === this.y_onMap) {
          if(!mapMovement.onPlatformNow) { // それまで、プラットフォーム上にいなかったら
            this._fired = true;
          }
          if (this._direction > 0) {
            this._remainLoopN = this._loopN;
          } else {
            this._remainLoopN = 0;
          }
        }
        if (this._fired) {
          this.moveInner(
              delta, time, breakTime, this._floorSprite3D.mesh, 60
          );
        }
      }

    }

    public isPlayerOnThisPlatform():boolean {
      var mapMovement = MapMovement.getInstance();
      if (mapMovement.playerXInteger === this.x_onMap && mapMovement.playerYInteger === this.y_onMap) {
        return true;
      } else {
        return false;
      }
    }

    private moveInner(delta:number, time:number, breakTime:number, sprite:any, fps:number) {
      this._timeLeft += 1 / fps;

      //var newHeight = sprite.position.y + delta * this._direction;
      var newHeight = sprite.translate.y + delta * this._direction;
      if (newHeight > this.levels[1]) {
        newHeight = this.levels[1];
        this.currentLevel = this.levels[1];
      }
      if (newHeight < this.levels[0]) {
        newHeight = this.levels[0];
        this.currentLevel = this.levels[0];
      }
      //sprite.position = new BABYLON.Vector3(sprite.position.x, newHeight, sprite.position.z);
      sprite.translate = new GLBoost.Vector3(sprite.translate.x, newHeight, sprite.translate.z);

      // もし、プレーヤーがこのプラットフォームに乗っているなら、プレーヤーの高さを更新する
      var mapMovement = MapMovement.getInstance();
      if (mapMovement.playerXInteger === this.x_onMap && mapMovement.playerYInteger === this.y_onMap) {
        if (flyMode_f) {
          if (newHeight > mapMovement.playerH) {
            mapMovement.playerH = newHeight;
          }
        } else {
          mapMovement.playerH = newHeight;
        }
      }

      //this.heightMap[this.y_onMap][this.x_onMap][0] = sprite.position.y;
      this.heightMap[this.y_onMap][this.x_onMap][0] = sprite.translate.y;

      if(this._timeLeft > time+breakTime) { // 動かし終わったら、次に動かすまでbreakTime時間だけ休む
        if(this._remainLoopN !== 0) { // -1か正の数であれば
          this._timeLeft = 0;
          this._direction *= -1;
          this._remainLoopN -= 1;
        } else {
          this._fired = false;
          this._timeLeft = 0;
          this.initDirection();
        }
      }
    }

    public setupMesh(scene:BABYLON.Scene, mapPlatformTitle:string, floorHeight:number, ceilingHeight:number, imageUrl:string, typeMapData:any, canvasId:string) :void {

    }

  }
}

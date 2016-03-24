var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// WrtGameモジュールの作成
var WrtGame;
(function (WrtGame) {
    var foooooooo = (function () {
        function foooooooo() {
        }
        return foooooooo;
    }());
    WrtGame.foooooooo = foooooooo;
})(WrtGame || (WrtGame = {}));
window.WrtGame = WrtGame;
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var Scene = (function () {
        function Scene() {
        }
        Scene.prototype.sceneLoop = function () { };
        return Scene;
    }());
    WrtGame.Scene = Scene;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var BattleScene = (function (_super) {
        __extends(BattleScene, _super);
        function BattleScene() {
            _super.call(this);
            this._renderer = null;
            this.initGLBoost();
        }
        BattleScene.prototype.initGLBoost = function () {
            var glboostCtx = WrtGame.GLBoostContext.getInstance();
            this._renderer = glboostCtx.getRenderer();
            var characters = MongoCollections.Objects.find({ schema_identifier: 'wrt_game_character' }).fetch();
            var enemies = _.filter(characters, function (character) {
                var result = false;
                for (var i = 0; i < character.attributes.length; i++) {
                    if (character.attributes[i].identifier === 'situation' && character.attributes[i].value === 'enemy') {
                        result = true;
                    }
                }
                return result;
            });
            console.log(enemies);
        };
        BattleScene.prototype.sceneLoop = function () {
        };
        return BattleScene;
    }(WrtGame.Scene));
    WrtGame.BattleScene = BattleScene;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    /**
     * BGM再生のためのクラス
     */
    var BgmPlayer = (function () {
        function BgmPlayer() {
            this.fadeoutTween = null;
            this.fadeinTween = null;
            this.fadeoutTween_as_stop = null;
            this.lastTimeOfBGM1 = null;
            this.lastTimeOfBGM2 = null;
            this.countInteval = 0;
            this.volume = 1;
        }
        BgmPlayer.getInstance = function () {
            if (BgmPlayer._instance == null) {
                BgmPlayer._instance = new BgmPlayer();
            }
            return BgmPlayer._instance;
        };
        BgmPlayer.prototype.setup = function () {
        };
        BgmPlayer.prototype.preloadBGMs = function (firstBgm, secondBgm, crossfadeTime) {
            if (crossfadeTime === void 0) { crossfadeTime = 3000; }
            this.bgm_1_src = firstBgm;
            this.bgm_2_src = secondBgm;
            this.crossfadeTime = crossfadeTime;
            /*
                  for (var bgmName in bgmObj) {
                      tm.sound.SoundManager.add(bgmName, bgmObj[bgmName], 1);
                  }
            */
            var that = this;
            this.fadeoutTween = new TWEEN.Tween({ volume: 1.0 });
            this.fadeoutTween.bgmurl = this.bgm_1_src;
            this.fadeoutTween
                .to({ volume: 0 }, that.crossfadeTime)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(function () {
                var bgm = tm.asset.Manager.get(that.fadeoutTween.bgmurl);
                if (bgm) {
                    bgm.volume = this.volume;
                }
            });
            this.fadeinTween = new TWEEN.Tween({ volume: 0.0 });
            this.fadeinTween.bgmurl = this.bgm_2_src;
            this.fadeinTween
                .to({ volume: 1 }, that.crossfadeTime)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(function () {
                var bgm = tm.asset.Manager.get(that.fadeinTween.bgmurl);
                if (bgm) {
                    bgm.volume = this.volume;
                }
            });
            this.fadeoutTween.setFlag("CrossFadeToBGM1");
            this.fadeinTween.setFlag("CrossFadeToBGM1");
            //            setInterval(TWEEN.update.bind(TWEEN), 0.37);
        };
        BgmPlayer.prototype.playAtFirst = function () {
            var bgm1 = tm.asset.Manager.get(this.bgm_1_src);
            bgm1.loop = true;
            bgm1.volume = this.volume;
            bgm1.play();
            if (this.bgm_2_src) {
                var bgm2 = tm.asset.Manager.get(this.bgm_2_src);
                bgm2.loop = true;
                bgm2.volume = 0.0;
                bgm2.play();
            }
            this.currentBGM = "bgm_1";
        };
        BgmPlayer.prototype.play = function (bgmName, volume, crossfadeTime) {
            if (volume === void 0) { volume = 1.0; }
            if (crossfadeTime === void 0) { crossfadeTime = 3000; }
            this.volume = volume;
            this.crossfadeTime = crossfadeTime;
            this.fadeoutTween.to({ volume: 0 }, this.crossfadeTime);
            this.fadeinTween.to({ volume: this.volume }, this.crossfadeTime);
            var that = this;
            var timer = setInterval(function () {
                if (true) {
                    if (typeof that.currentBGM === 'undefined') {
                        that.bgm_1_src = bgmName;
                        that.fadeoutTween.bgmurl = that.bgm_1_src;
                        that.playAtFirst();
                    }
                    else if (that.currentBGM === "bgm_1") {
                        if (that.bgm_2_src) {
                            tm.asset.Manager.get(that.bgm_2_src).stop();
                        }
                        that.bgm_2_src = bgmName;
                        that.switchToBGM_2();
                    }
                    else {
                        tm.asset.Manager.get(that.bgm_1_src).stop();
                        that.bgm_1_src = bgmName;
                        that.switchToBGM_1();
                    }
                    clearInterval(timer);
                }
            }, 100);
        };
        BgmPlayer.prototype.switchToBGM_2 = function () {
            this.fadeoutTween.setFlag("CrossFadeToBGM2");
            this.fadeinTween.setFlag("CrossFadeToBGM2");
            if (this.fadeoutTween.isFlagChanged() === true) {
                this.fadeoutTween.swapProperties(this.fadeinTween);
                //                this.ejsCore.assets[this.bgm_2_src].play();
                var bgm2 = tm.asset.Manager.get(this.bgm_2_src);
                bgm2.loop = true;
                bgm2.play();
                this.fadeoutTween.bgmurl = this.bgm_1_src;
                this.fadeinTween.bgmurl = this.bgm_2_src;
                this.fadeoutTween.start();
                this.fadeinTween.start();
                this.currentBGM = "bgm_2";
                console.log("BGM2に切り替えた！");
            }
        };
        BgmPlayer.prototype.switchToBGM_1 = function () {
            this.fadeoutTween.setFlag("CrossFadeToBGM1");
            this.fadeinTween.setFlag("CrossFadeToBGM1");
            if (this.fadeoutTween.isFlagChanged() === true) {
                this.fadeoutTween.swapProperties(this.fadeinTween);
                //                this.ejsCore.assets[this.bgm_1_src].play();
                var bgm1 = tm.asset.Manager.get(this.bgm_1_src);
                bgm1.loop = true;
                bgm1.play();
                this.fadeoutTween.bgmurl = this.bgm_2_src;
                this.fadeinTween.bgmurl = this.bgm_1_src;
                this.fadeoutTween.start();
                this.fadeinTween.start();
                this.currentBGM = "bgm_1";
                console.log("BGM1に切り替えた！");
            }
        };
        BgmPlayer.prototype.stop = function () {
            if (typeof this.currentBGM === 'undefined') {
                return;
            }
            else if (this.currentBGM === "bgm_1") {
                var volume = this.volume;
                var crossfadeTime = 1500;
                var bgm_1_src = this.bgm_1_src;
                this.fadeoutTween_as_stop = new TWEEN.Tween({ volume: volume });
                this.fadeoutTween_as_stop
                    .to({ volume: 0 }, crossfadeTime)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(function () {
                    tm.asset.Manager.get(bgm_1_src).volume = this.volume;
                }).onComplete(function () {
                    tm.asset.Manager.get(bgm_1_src).stop();
                })
                    .start();
            }
            else {
                var volume = this.volume;
                var crossfadeTime = 1500;
                var bgm_2_src = this.bgm_2_src;
                this.fadeoutTween_as_stop = new TWEEN.Tween({ volume: volume });
                this.fadeoutTween_as_stop
                    .to({ volume: 0 }, crossfadeTime)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(function () {
                    tm.asset.Manager.get(bgm_2_src).volume = this.volume;
                }).onComplete(function () {
                    tm.asset.Manager.get(bgm_2_src).stop();
                }).start();
            }
        };
        BgmPlayer.prototype.loop = function () {
            TWEEN.update();
        };
        return BgmPlayer;
    }());
    WrtGame.BgmPlayer = BgmPlayer;
})(WrtGame || (WrtGame = {}));
/// <reference path="../../../typings/browser.d.ts" />
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var DungeonScene = (function (_super) {
        __extends(DungeonScene, _super);
        function DungeonScene(data) {
            _super.call(this);
            this._mapMovement = null;
            this._map = null;
            this._camera = null;
            this._scene = null;
            this._renderer = null;
            this._fadeTween = null;
            //this._mapMovement = mapMovement;
            this._initEvent();
            this._initGLBoost(data);
        }
        DungeonScene.prototype._initEvent = function () {
            // 物理イベントのプロパティ初期化
            var physicalMapMovementEventProperty = WrtGame.initMapMovementEventHandler();
            var gameState = WrtGame.GameState.getInstance();
            // 論理移動コマンドプロパティ初期化
            var logicalMovementCommandProperty = gameState.mapPhysicalEventPropertyToLogicalMovementCommandProperty(physicalMapMovementEventProperty);
            // マップ移動クラスの初期化
            this._mapMovement = WrtGame.MapMovement.getInstance();
            this._mapMovement.init(logicalMovementCommandProperty);
        };
        DungeonScene.prototype._initGLBoost = function (data) {
            var glboostCtx = WrtGame.GLBoostContext.getInstance();
            var renderer = glboostCtx.getRenderer();
            var canvasId = glboostCtx.getCanvasId();
            var canvas = glboostCtx.getCanvas();
            var scene = new GLBoost.Scene();
            var aspect = canvas.width / canvas.height;
            var camera = new GLBoost.Camera({
                eye: new GLBoost.Vector3(0, 0, 0),
                center: new GLBoost.Vector3(0.0, 0.0, 1.0),
                up: new GLBoost.Vector3(0.0, 1.0, 0.0)
            }, {
                fovy: 50.0,
                aspect: aspect,
                zNear: 0.1,
                zFar: 300.0
            });
            scene.add(camera);
            var directionalLight_1 = new GLBoost.DirectionalLight(new GLBoost.Vector3(1, 1, 1), new GLBoost.Vector3(-1, -1, 0), canvasId);
            var directionalLight_2 = new GLBoost.DirectionalLight(new GLBoost.Vector3(1, 1, 1), new GLBoost.Vector3(1, 1, 0), canvasId);
            var directionalLight_3 = new GLBoost.DirectionalLight(new GLBoost.Vector3(1, 1, 1), new GLBoost.Vector3(0, 1, 1), canvasId);
            var directionalLight_4 = new GLBoost.DirectionalLight(new GLBoost.Vector3(0.5, 0.5, 0.5), new GLBoost.Vector3(0, 0, -1), canvasId);
            scene.add(directionalLight_1);
            scene.add(directionalLight_2);
            scene.add(directionalLight_3);
            scene.add(directionalLight_4);
            this._map = new WrtGame.PolygonMapGLBoost(scene, data.map, data.mapTextures, canvasId);
            // Windowのリサイズ対応
            window.addEventListener("resize", function (e) {
                var windowAspect = $(e.target).width() / $(e.target).height();
                if (windowAspect > aspect) {
                    var width = $(e.target).height() * aspect;
                    var height = $(e.target).height();
                    $(canvas).css('width', width);
                    $(canvas).css('height', height);
                    renderer.resize(width, height);
                }
                else {
                    var width = $(e.target).width();
                    var height = $(e.target).width() * 1 / aspect;
                    $(canvas).css('width', width);
                    $(canvas).css('height', height);
                    renderer.resize(width, height);
                }
            });
            this._scene = scene;
            this._camera = camera;
            this._renderer = renderer;
        };
        DungeonScene.prototype.sceneLoop = function () {
            var mapMovement = this._mapMovement;
            // 平行移動する
            var moveDelta = 1.0 / 60 * 3;
            mapMovement.move(this._map, moveDelta);
            // 水平方向の向きを変える
            mapMovement.rotate(60 * 0.8);
            // 垂直方向の向きを変える
            mapMovement.faceUpOrLow(1 / 60 * 0.5);
            this._map.movePlatforms();
            // カメラの位置・回転をセット
            var cameraPos = this.convertGLBoostPlayerPosition(mapMovement.playerX, mapMovement.playerH, mapMovement.playerY, mapMovement.playerAngle, mapMovement.playerElevationAngle);
            this._camera.eye = cameraPos.viewPos;
            this._camera.center = cameraPos.centerPos;
            this._renderer.clearCanvas();
            this._renderer.draw(this._scene);
            //console.log("this.opacity:" + this._scene.opacity);
            /*
            if (this._fadeTween) {
              this._fadeTween.update();
            }
            */
            TWEEN.update();
        };
        /**
         * MapMovementクラスが返すプレーヤー座標を、GLBoostでの表示仕様を満たす座標に変換する
         * @param x
         * @param h
         * @param y
         * @returns {BABYLON.Vector3}
         */
        DungeonScene.prototype.convertGLBoostPlayerPosition = function (x, h, y, angle, playerElevationAngle) {
            // プレーヤーが0.5後ろに下がって、背中が後ろのマスの壁にひっつくようにするためのオフセット座標
            var rotateMtx = GLBoost.Matrix44.rotateY(GLBoost.MathUtil.radianToDegree(-angle));
            var rotateElevationMtx = GLBoost.Matrix44.rotateX(GLBoost.MathUtil.radianToDegree(playerElevationAngle));
            var viewPosOffset = new GLBoost.Vector4(0, 0, 0.5, 1);
            var centerPosOffset = new GLBoost.Vector4(0, 0, -0.5, 1);
            // そのオフセット座標を、プレーヤーの向きに合わせて回転する
            viewPosOffset = rotateMtx.multiplyVector(viewPosOffset);
            centerPosOffset = rotateElevationMtx.multiplyVector(centerPosOffset);
            centerPosOffset = rotateMtx.multiplyVector(centerPosOffset);
            // プレーヤーのBabylonJSにおける位置座標
            var viewPos = new GLBoost.Vector3(x - 0.5, h + 0.5, y - 0.5);
            //var viewPos = new GLBoost.Vector3(x, h + 1, y);
            // オフセットを考慮するために足す
            return {
                viewPos: GLBoost.Vector3.add(viewPos, new GLBoost.Vector3(viewPosOffset.x, viewPosOffset.y, viewPosOffset.z)),
                centerPos: GLBoost.Vector3.add(viewPos, new GLBoost.Vector3(centerPosOffset.x, centerPosOffset.y, centerPosOffset.z))
            };
        };
        DungeonScene.prototype.fadeIn = function (callback) {
            this._fadeTween = new TWEEN.Tween(this._scene);
            this._fadeTween
                .to({ opacity: 1.0 }, 1500.0)
                .easing(TWEEN.Easing.Quartic.In);
            if (callback) {
                this._fadeTween.onComplete(callback).start();
            }
            else {
                this._fadeTween.start();
            }
        };
        DungeonScene.prototype.fadeOut = function (callback) {
            this._fadeTween = new TWEEN.Tween(this._scene);
            this._fadeTween
                .to({ opacity: 0.0 }, 1500.0)
                .easing(TWEEN.Easing.Quartic.Out);
            if (callback) {
                this._fadeTween.onComplete(callback).start();
            }
            else {
                this._fadeTween.start();
            }
        };
        return DungeonScene;
    }(WrtGame.Scene));
    WrtGame.DungeonScene = DungeonScene;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var Game = (function () {
        function Game() {
        }
        Game.getInstance = function () {
            if (Game._instance == null) {
                Game._instance = new Game();
            }
            return Game._instance;
        };
        Game.prototype.init = function (data, onlyNovel, callbackWhenOnlyNovel) {
            var _this = this;
            if (onlyNovel === void 0) { onlyNovel = false; }
            if (callbackWhenOnlyNovel === void 0) { callbackWhenOnlyNovel = null; }
            var novelPlayer = WrtGame.NovelPlayer.getInstance();
            novelPlayer.init();
            if (onlyNovel) {
                this.initTmlib(callbackWhenOnlyNovel);
            }
            else {
                this.initTmlib(function () {
                    _this.initEvents();
                    var glboostCtx = WrtGame.GLBoostContext.getInstance();
                    glboostCtx.init('#renderCanvas');
                    var sm = WrtGame.SceneManager.getInstance();
                    sm.addScene('battle', new WrtGame.BattleScene());
                    sm.addScene('dungeon', new WrtGame.DungeonScene(data));
                    _this.initUserFunctions();
                    _this._gameLoop();
                    var e = document.createEvent('UIEvents');
                    // type, canBubble, cancelable, view, detail
                    e.initUIEvent('resize', true, true, window, 0);
                    window.dispatchEvent(e);
                });
            }
        };
        Game.prototype._handleGameLogicalEvent = function (event) {
            if (typeof event === 'undefined') {
                return;
            }
            if (event === WrtGame.LG_ENCOUNTER) {
                var mapMovement = WrtGame.MapMovement.getInstance();
                mapMovement.playerIsMovable = false;
                var sm_1 = WrtGame.SceneManager.getInstance();
                var dungeonScene = sm_1.getScene('dungeon');
                dungeonScene.fadeOut(function () {
                    sm_1.switchScene('battle');
                });
            }
        };
        Game.prototype._gameLoop = function () {
            var _this = this;
            var gameLogic = WrtGame.GameLogic.getInstance();
            var event = gameLogic.getGameLogicalEvent();
            this._handleGameLogicalEvent(event);
            var sm = WrtGame.SceneManager.getInstance();
            var scene = sm.getCurrentScene();
            scene.sceneLoop();
            requestAnimationFrame(function () {
                _this._gameLoop();
            });
        };
        Game.prototype.initEvents = function () {
            // 物理イベントのプロパティ初期化
            var physicalUiEventProperty = WrtGame.initUiEventHandler();
            var gameState = WrtGame.GameState.getInstance();
            // 論理UIコマンドプロパティ初期化
            var logicalUiCommandProperty = gameState.mapPhysicalEventPropertyToLogicalUiCommandProperty(physicalUiEventProperty);
            // UiOperation初期化
            var uiOperation = WrtGame.UiOperation.getInstance();
            uiOperation.init(logicalUiCommandProperty);
        };
        Game.prototype.initTmlib = function (callback) {
            var ASSETS = {};
            var characterImages = MongoCollections.CharacterImages.find({ useForNovel: true }).fetch();
            var backgroundImages = MongoCollections.BackgroundImages.find().fetch();
            for (var key in characterImages) {
                if ("" !== characterImages[key].portraitImageUrl) {
                    ASSETS[characterImages[key].portraitImageUrl] = characterImages[key].portraitImageUrl;
                }
            }
            for (var key in backgroundImages) {
                if ("" !== backgroundImages[key].imageUrl) {
                    ASSETS[backgroundImages[key].imageUrl] = backgroundImages[key].imageUrl;
                }
            }
            var bgmAudios = MongoCollections.BgmAudios.find().fetch();
            bgmAudios.forEach(function (bgmAudio) {
                if (bgmAudio.identifier === 'none') {
                    return;
                }
                ASSETS[bgmAudio.identifier] = bgmAudio.audioUrl;
            });
            var soundEffectAudios = MongoCollections.SoundEffectAudios.find().fetch();
            soundEffectAudios.forEach(function (soundEffectAudio) {
                if (soundEffectAudio.identifier === 'none') {
                    return;
                }
                ASSETS[soundEffectAudio.identifier] = soundEffectAudio.audioUrl;
            });
            // main
            tm.main(function () {
                // キャンバスアプリケーションを生成
                var app = tm.display.CanvasApp("#tmlibCanvas");
                app.background = 'rgba(0,0,0,0)';
                // リサイズ
                app.resize(Game.SCREEN_WIDTH, Game.SCREEN_HEIGHT);
                // ウィンドウにフィットさせる
                //        app.fitWindow();
                // ローダーでアセットを読み込む
                var loading = tm.game.LoadingScene({
                    assets: ASSETS,
                    width: Game.SCREEN_WIDTH,
                    height: Game.SCREEN_HEIGHT,
                });
                // 読み込み完了後に呼ばれるメソッドを登録
                loading.onload = function () {
                    // メインシーンに入れ替える
                    var scene = window.MainScene();
                    app.replaceScene(scene);
                    callback();
                };
                // ローディングシーンに入れ替える
                app.replaceScene(loading);
                // 実行
                app.run();
                var aspect = Game.SCREEN_WIDTH / Game.SCREEN_HEIGHT;
                window.addEventListener("resize", function (e) {
                    var windowAspect = $(e.target).width() / $(e.target).height();
                    if (windowAspect > aspect) {
                        var newWidth = $(e.target).height() * aspect;
                        var newHeight = $(e.target).height();
                    }
                    else {
                        var newWidth = $(e.target).width();
                        var newHeight = $(e.target).width() * 1 / aspect;
                    }
                    var scale = newWidth / Game.SCREEN_WIDTH;
                    var translateX = Game.SCREEN_WIDTH * (1 - scale) / 2;
                    var translateY = Game.SCREEN_HEIGHT * (1 - scale) / 2;
                    var value = 'translateX(' + -translateX + 'px) ' +
                        'translateY(' + -translateY + 'px)' +
                        'scale(' + scale + ', ' + scale + ') ';
                    $('#tmlibCanvas').css('transform', value);
                    $('#game-ui-body').css('transform', value);
                });
            });
            if (document.readyState == "complete") {
                if (!document.createEvent) {
                    window.fireEvent('onload');
                }
                else {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent("load", false, true);
                    window.dispatchEvent(event);
                }
            }
        };
        Game.prototype.initUserFunctions = function () {
            var userFunctionManager = WrtGame.UserFunctionsManager.getInstance();
        };
        Game.prototype.clear = function () {
            var novelPlayer = WrtGame.NovelPlayer.getInstance();
            novelPlayer.clear();
        };
        Game.SCREEN_WIDTH = 1200;
        Game.SCREEN_HEIGHT = 800;
        return Game;
    }());
    WrtGame.Game = Game;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    function doesThisTypeExist(str_array, typeIdentifier) {
        var exist_f = false;
        for (var i = 0; i < str_array.length; i++) {
            var matchN = 0;
            for (var j = 0; j < typeIdentifier.length; j++) {
                if (str_array[i][j] === typeIdentifier[j]) {
                    matchN++;
                }
            }
            if (matchN === typeIdentifier.length) {
                exist_f = true;
            }
        }
        return exist_f;
    }
    WrtGame.doesThisTypeExist = doesThisTypeExist;
    /**
     * タイプ文字の後ろにある[*]のパラメーター文字列を返す
     * @param str_array
     * @param typeIdentifier
     * @returns {any}
     */
    function getTypeParameter(str_array, typeIdentifier) {
        var exist_f = false;
        for (var i = 0; i < str_array.length; i++) {
            var matchN = 0;
            for (var j = 0; j < typeIdentifier.length; j++) {
                if (str_array[i][j] === typeIdentifier[j]) {
                    matchN++;
                }
            }
            if (matchN === typeIdentifier.length) {
                var tmp = str_array[i].split(']')[0];
                return tmp.split('[')[1];
            }
        }
        return "";
    }
    WrtGame.getTypeParameter = getTypeParameter;
    var Map = (function () {
        function Map(isCalledFromChild) {
            if (!isCalledFromChild) {
                throw new Error("This class is a abstract class.");
            }
        }
        Map.prototype.makeTexMapData = function (map) {
            this._texMapData = new Array(this.height + 2); //マップデータ２次元配列を用意
            for (var i = 0; i < this.height + 2; i++) {
                this._texMapData[i] = new Array(this.width + 2); //２次元配列にする
            }
            var x = 0;
            var y = 0;
            var mapDataStr = map;
            var split_with_n = mapDataStr.split("\n"); // マップ文字列を行ごとに区切る
            for (var i = 0; i < split_with_n.length - 1; i++) {
                var split_with_comma = split_with_n[i].split(","); //カンマで区切り、各列の値を配列に
                for (var j = 0; j < split_with_comma.length; j++) {
                    var split_with_space = split_with_comma[j].split(" "); // タイルのデータをスプリットする。例えば"10 Dh5% Dk"だったら、"10","Dh5%","Dk"の配列にする
                    var texId = parseInt(split_with_space[0], 10); // テクスチャIDを記憶する。 "10 Dk"だったら、10を数値として保存
                    y = i + 1;
                    x = j + 1;
                    this._texMapData[y][x] = texId;
                }
            }
            console.log("テクスチャマップ：");
            /// マップデータのデバッグ表示
            var mapDataValueStr = "";
            for (var i = 0; i < this.height + 2; i++) {
                for (var j = 0; j < this.width + 2; j++) {
                    mapDataValueStr += this._texMapData[i][j] + " ";
                }
                mapDataValueStr += "\n";
            }
            console.log(mapDataValueStr);
            // 端っこのチップはその内側のチップと同じテクスチャになってもらう
            for (var i = 0; i < this.height + 2; i++) {
                for (var j = 0; j < this.width + 2; j++) {
                    //                    if (i == 0 || i == this.height + 1 || j == 0 || j == this.width + 1) { //配列の端は0(壁)にする
                    //                        this.mapData[i][j] = -1;
                    //                    }
                    if (i === 0) {
                        this._texMapData[i][j] = this._texMapData[i + 1][j];
                    }
                    if (i === this.height + 1) {
                        this._texMapData[i][j] = this._texMapData[this.height][j];
                    }
                    if (j === 0) {
                        this._texMapData[i][j] = this._texMapData[i][j + 1];
                    }
                    if (j === this.width + 1) {
                        this._texMapData[i][j] = this._texMapData[i][this.width];
                    }
                }
            }
            console.log("テクスチャマップ：");
            /// マップデータのデバッグ表示
            var mapDataValueStr = "";
            for (var i = 0; i < this.height + 2; i++) {
                for (var j = 0; j < this.width + 2; j++) {
                    mapDataValueStr += this._texMapData[i][j] + " ";
                }
                mapDataValueStr += "\n";
            }
            console.log(mapDataValueStr);
        };
        Map.prototype.makeTypeMapData = function (map) {
            this._typeMapData = new Array(this.height + 2); //マップデータ２次元配列を用意
            for (var i = 0; i < this.height + 2; i++) {
                this._typeMapData[i] = new Array(this.width + 2); //２次元配列にする
                for (var j = 0; j < this.width + 2; j++) {
                    if (i === 0 || i === this.height + 1 || j === 0 || j === this.width + 1) {
                        this._typeMapData[i][j] = 'W';
                    }
                }
            }
            var x = 0;
            var y = 0;
            var mapDataStr = map;
            var split_with_n = mapDataStr.split("\n"); // マップ文字列を行ごとに区切る
            for (var i = 0; i < split_with_n.length - 1; i++) {
                var split_with_comma = split_with_n[i].split(","); //カンマで区切り、各列の値を配列に
                for (var j = 0; j < split_with_comma.length; j++) {
                    var split_with_space = split_with_comma[j].split(" "); // タイルのデータをスプリットする。例えば"10 Dh5% Dk"だったら、"10","Dh5%","Dk"の配列にする
                    y = i + 1;
                    x = j + 1;
                    /*
                     var typesStr = "";
                     for (var k=1; k<split_with_space.length; k++) {
                     typesStr += split_with_space[k];
                     }*/
                    split_with_space.splice(0, 1); // 0番目を削除して詰める。つまり、テクスチャ番号を消して、タイルタイプ文字列のみの配列にする。
                    this._typeMapData[y][x] = split_with_space;
                }
            }
            console.log("タイプマップ：");
            // マップデータのデバッグ表示
            var mapDataValueStr = "";
            for (var i = 0; i < this.height + 2; i++) {
                for (var j = 0; j < this.width + 2; j++) {
                    mapDataValueStr += this._typeMapData[i][j] + ",";
                }
                mapDataValueStr += "\n";
            }
            console.log(mapDataValueStr);
        };
        Map.prototype.makeHeightMapData = function (map) {
            this._heightMapData = new Array(this.height + 2); //マップデータ２次元配列を用意
            for (var i = 0; i < this.height + 2; i++) {
                this._heightMapData[i] = new Array(this.width + 2); //２次元配列にする
                for (var j = 0; j < this.width + 2; j++) {
                    if (i === 0 || i === this.height + 1 || j === 0 || j === this.width + 1) {
                        this._heightMapData[i][j] = [10, 10];
                    }
                }
            }
            var x = 0;
            var y = 0;
            var mapDataStr = map;
            var split_with_n = mapDataStr.split("\n"); // マップ文字列を行ごとに区切る
            for (var i = 0; i < split_with_n.length - 1; i++) {
                var split_with_comma = split_with_n[i].split(","); //カンマで区切り、各列の値を配列に
                for (var j = 0; j < split_with_comma.length; j++) {
                    var split_with_space = split_with_comma[j].split(" "); // データを「床の高さ」と「天井の高さ」にスプリットする。
                    var floorHeight = parseInt(split_with_space[0], 10); // 床の高さを取り出す
                    var ceilingHeight = parseInt(split_with_space[1], 10); // 床の高さを取り出す
                    y = i + 1;
                    x = j + 1;
                    if (doesThisTypeExist(this._typeMapData[y][x], 'W')) {
                        this._heightMapData[y][x] = [10, 10]; // 高さマップでも実質的な壁にする
                    }
                    else {
                        this._heightMapData[y][x] = [floorHeight, ceilingHeight];
                    }
                }
            }
            console.log("ハイトマップ：");
            // マップデータのデバッグ表示
            var mapDataValueStr = "";
            for (var i = 0; i < this.height + 2; i++) {
                for (var j = 0; j < this.width + 2; j++) {
                    mapDataValueStr += this._heightMapData[i][j][0] + " " + this._heightMapData[i][j][1] + ",";
                }
                mapDataValueStr += "\n";
            }
            console.log(mapDataValueStr);
        };
        Map.prototype.makeScriptMapData = function (map) {
            this._scriptMapData = new Array(this.height + 2); //マップデータ２次元配列を用意
            for (var i = 0; i < this.height + 2; i++) {
                this._scriptMapData[i] = new Array(this.width + 2); //２次元配列にする
                for (var j = 0; j < this.width + 2; j++) {
                    if (i === 0 || i === this.height + 1 || j === 0 || j === this.width + 1) {
                        this._scriptMapData[i][j] = '0';
                    }
                }
            }
            var x = 0;
            var y = 0;
            var mapDataStr = map;
            var split_with_n = mapDataStr.split("\n"); // マップ文字列を行ごとに区切る
            for (var i = 0; i < split_with_n.length - 1; i++) {
                var split_with_comma = split_with_n[i].split(","); //カンマで区切り、各列の値を配列に
                for (var j = 0; j < split_with_comma.length; j++) {
                    y = i + 1;
                    x = j + 1;
                    var value = split_with_comma[j];
                    this._scriptMapData[y][x] = value;
                }
            }
            console.log("スクリプトマップ：");
            // マップデータのデバッグ表示
            var mapDataValueStr = "";
            for (var i = 0; i < this.height + 2; i++) {
                for (var j = 0; j < this.width + 2; j++) {
                    mapDataValueStr += this._scriptMapData[i][j] + ",";
                }
                mapDataValueStr += "\n";
            }
            console.log(mapDataValueStr);
        };
        Map.prototype.isCouldPassAt = function (x, y, h, h_f) {
            var floorHeight = this.heightMapData[x][y][0];
            var ceilingHeight = this.heightMapData[x][y][1];
            if (h_f !== null) {
                // 浮動小数点を含む中途半端な高さだったら移動を許可しない
                if (h_f - Math.floor(h_f) > 0) {
                    return false;
                }
            }
            if (WrtGame.flyMode_f) {
                // 自分より下の高さのタイルに移動できる判定処理（空中浮遊モード時に使用）
                if (h >= floorHeight) {
                    if (h + 1 <= ceilingHeight) {
                        return true;
                    }
                }
            }
            else {
                // 自分と同じ高さの床にしか移動できない判定処理
                if (h == floorHeight) {
                    if (h + 1 <= ceilingHeight) {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * 稼働中のプラットフォームかどうか。指定されたマップチップの高さが浮動小数点値だったら、稼働中のプラットフォームと判断する
         */
        Map.prototype.isMovingPlatform = function (x, y) {
            var floorHeight = this.heightMapData[x][y][0];
            if (floorHeight - Math.floor(floorHeight) > 0) {
                return true;
            }
            else {
                return false;
            }
        };
        Map.prototype.isThereScriptAt = function (x, y) {
            var value = this.scriptMapData[x][y];
            if (value !== '0') {
                return true;
            }
            else {
                return false;
            }
        };
        Map.prototype.doScriptIfThereIsIt = function (x, y) {
            var value = this.scriptMapData[x][y];
            if (value !== '0') {
                var userFunctionsManager = WrtGame.UserFunctionsManager.getInstance();
                userFunctionsManager.execute(value, 'Map');
                return true;
            }
            else {
                return false;
            }
        };
        // オーバーライドされること前提
        Map.prototype.movePlatforms = function () {
        };
        Object.defineProperty(Map.prototype, "map", {
            set: function (map) {
                this._map = map;
                this.makeTexMapData(map.type_array);
                this.makeTypeMapData(map.type_array);
                this.makeHeightMapData(map.height_array);
                this.makeScriptMapData(map.script_array);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "title", {
            get: function () {
                return this._map.title;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "width", {
            get: function () {
                return this._map.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "height", {
            get: function () {
                return this._map.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "texMapData", {
            get: function () {
                return this._texMapData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "typeMapData", {
            get: function () {
                return this._typeMapData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "heightMapData", {
            get: function () {
                return this._heightMapData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "scriptMapData", {
            get: function () {
                return this._scriptMapData;
            },
            enumerable: true,
            configurable: true
        });
        return Map;
    }());
    WrtGame.Map = Map;
})(WrtGame || (WrtGame = {}));
/// <reference path="game__map.ts"/>
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var FlatMap = (function (_super) {
        __extends(FlatMap, _super);
        function FlatMap(_scene, map, textures) {
            _super.call(this, true);
            this._scene = _scene;
            this.chipMeshExArray = [];
            this.minFloorHeight = -10; // 床の最低の低さ
            this.maxCeilingHeight = 10; // 天井の最高の高さ
            this.texcoordOne = 1; // Y方向の壁テクスチャの高さ
            this._platforms = new Array();
            this.map = map;
            this.setupMesh(this.heightMapData, this.width, this.height, textures);
        }
        FlatMap.prototype.setupMesh = function (heightMapData, mapWidth, mapHeight, imageUrls) {
            //      this.mapObject3D = tm.three.Element();
            this.textureImageUrls = imageUrls;
            //      this.chipMeshExArray.push(null); // 0番目はnullをいれておく。
            var texMapData = this._texMapData;
            var typeMapData = this._typeMapData;
            var heightMapData = this._heightMapData;
            for (var i = 0; i < this.textureImageUrls.length; i++) {
                var ii = i + 1; // texMapData配列の中のテキスチャIDは1起算なので、それに合わせる
                var sprite = {};
                sprite.textureName = this.textureImageUrls[i].gametex_url;
                sprite.buffer = { positions: [], normals: [], texcoords: [], indices: [] };
                sprite.FaceN = 0;
                this.chipMeshExArray.push(sprite);
                //        this.setTextureToSprite3D(sprite, sprite.textureName);
                for (var y = 0; y < mapHeight + 2; y++) {
                    for (var x = 0; x < mapWidth + 2; x++) {
                        if (!WrtGame.doesThisTypeExist(typeMapData[y][x], 'P') && texMapData[y][x] === ii) {
                            /// 床
                            // 床の頂点データ作成
                            var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
                            var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
                            this.setupFloorVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][0]);
                            this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする
                            // 床の北向きの壁の頂点データ作成
                            var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
                            var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
                            this.setupFloorNorthWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][0]);
                            this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする
                            // 床の東向きの壁の頂点データ作成
                            var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
                            var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
                            this.setupFloorEastWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][0]);
                            this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする
                            // 床の南向きの壁の頂点データ作成
                            var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
                            var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
                            this.setupFloorSouthWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][0]);
                            this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする
                            // 床の西向きの壁の頂点データ作成
                            var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
                            var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
                            this.setupFloorWestWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][0]);
                            this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする
                            /// 天井
                            // 天井の頂点データ作成
                            var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
                            var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
                            this.setupCeilingVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][1]);
                            this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする
                            // 天井の北向きの壁の頂点データ作成
                            var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
                            var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
                            this.setupCeilingNorthWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][1]);
                            this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする
                            // 天井の東向きの壁の頂点データ作成
                            var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
                            var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
                            this.setupCeilingEastWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][1]);
                            this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする
                            // 天井の南向きの壁の頂点データ作成
                            var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
                            var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
                            this.setupCeilingSouthWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][1]);
                            this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする
                            // 天井の西向きの壁の頂点データ作成
                            var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
                            var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
                            this.setupCeilingWestWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][1]);
                            this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする
                        }
                        if (WrtGame.doesThisTypeExist(typeMapData[y][x], 'P')) {
                            var platform = new WrtGame.MapFlatPlatform(x, y, heightMapData, WrtGame.getTypeParameter(typeMapData[y][x], 'P'));
                            platform.setupMesh(this._scene, this._map.title + "_platform[" + x + "][" + y + "]", heightMapData[y][x][0], heightMapData[y][x][1], this.textureImageUrls[texMapData[y][x] - 1].gametex_url);
                            this._platforms.push(platform);
                        }
                    }
                }
                // Babylon.jsは左手系なので、z軸を反転する
                for (var j = 0; j < sprite.buffer.positions.length; j++) {
                    if (j % 3 === 2) {
                        sprite.buffer.positions[j] *= -1;
                        sprite.buffer.normals[j] *= -1;
                    }
                }
                if (this.chipMeshExArray[i].FaceN > 0) {
                    sprite.mesh = new BABYLON.Mesh(this._map.title + "_" + i, this._scene);
                    var updatable = true;
                    sprite.mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, sprite.buffer.positions, updatable);
                    sprite.mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, sprite.buffer.normals, updatable);
                    sprite.mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, sprite.buffer.texcoords, updatable);
                    sprite.mesh.setIndices(sprite.buffer.indices);
                    sprite.mesh.material = new BABYLON.StandardMaterial("map_texture_" + i, this._scene);
                    sprite.mesh.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
                    sprite.mesh.material.diffuseTexture = new BABYLON.Texture(sprite.textureName, this._scene);
                }
                else {
                    sprite.mesh = null;
                }
            }
        };
        // １つ分の床の面の頂点を作成
        FlatMap.prototype.setupFloorVertices = function (buffer, verticesStride, indicesStride, y, x, floorHeight) {
            // 1頂点目
            buffer.positions.push(x - 1, floorHeight, y - 1);
            buffer.normals.push(0, 1, 0);
            buffer.texcoords.push(0, 0);
            // 2頂点目
            buffer.positions.push(x - 1, floorHeight, y);
            buffer.normals.push(0, 1, 0);
            buffer.texcoords.push(0, 1);
            // 3頂点目
            buffer.positions.push(x, floorHeight, y);
            buffer.normals.push(0, 1, 0);
            buffer.texcoords.push(0.25, 1);
            // 4頂点目
            buffer.positions.push(x, floorHeight, y - 1);
            buffer.normals.push(0, 1, 0);
            buffer.texcoords.push(0.25, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の床の北の壁の面の頂点を作成
        FlatMap.prototype.setupFloorNorthWallVertices = function (buffer, verticesStride, indicesStride, y, x, floorHeight) {
            // 1頂点目
            buffer.positions.push(x - 1, floorHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.25, 0);
            // 2頂点目
            buffer.positions.push(x - 1, this.minFloorHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 3頂点目
            buffer.positions.push(x, this.minFloorHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 4頂点目
            buffer.positions.push(x, floorHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.5, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の床の東の壁の面の頂点を作成
        FlatMap.prototype.setupFloorEastWallVertices = function (buffer, verticesStride, indicesStride, y, x, floorHeight) {
            // 1頂点目
            buffer.positions.push(x, floorHeight, y - 1);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.25, 0);
            // 2頂点目
            buffer.positions.push(x, this.minFloorHeight, y - 1);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 3頂点目
            buffer.positions.push(x, this.minFloorHeight, y);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 4頂点目
            buffer.positions.push(x, floorHeight, y);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.5, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の床の南の壁の面の頂点を作成
        FlatMap.prototype.setupFloorSouthWallVertices = function (buffer, verticesStride, indicesStride, y, x, floorHeight) {
            // 1頂点目
            buffer.positions.push(x, floorHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.25, 0);
            // 2頂点目
            buffer.positions.push(x, this.minFloorHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 3頂点目
            buffer.positions.push(x - 1, this.minFloorHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 4頂点目
            buffer.positions.push(x - 1, floorHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.5, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の床の西の壁の面の頂点を作成
        FlatMap.prototype.setupFloorWestWallVertices = function (buffer, verticesStride, indicesStride, y, x, floorHeight) {
            // 1頂点目
            buffer.positions.push(x - 1, floorHeight, y);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.25, 0);
            // 2頂点目
            buffer.positions.push(x - 1, this.minFloorHeight, y);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 3頂点目
            buffer.positions.push(x - 1, this.minFloorHeight, y - 1);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 4頂点目
            buffer.positions.push(x - 1, floorHeight, y - 1);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.5, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の天井の面の頂点を作成
        FlatMap.prototype.setupCeilingVertices = function (buffer, verticesStride, indicesStride, y, x, ceilingHeight) {
            // 1頂点目
            buffer.positions.push(x, ceilingHeight, y - 1);
            buffer.normals.push(0, -1, 0);
            buffer.texcoords.push(0.75, 0);
            // 2頂点目
            buffer.positions.push(x, ceilingHeight, y);
            buffer.normals.push(0, -1, 0);
            buffer.texcoords.push(0.75, 1);
            // 3頂点目
            buffer.positions.push(x - 1, ceilingHeight, y);
            buffer.normals.push(0, -1, 0);
            buffer.texcoords.push(0.5, 1);
            // 4頂点目
            buffer.positions.push(x - 1, ceilingHeight, y - 1);
            buffer.normals.push(0, -1, 0);
            buffer.texcoords.push(0.5, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の天井の北の壁の面の頂点を作成
        FlatMap.prototype.setupCeilingNorthWallVertices = function (buffer, verticesStride, indicesStride, y, x, ceilingHeight) {
            // 1頂点目
            buffer.positions.push(x - 1, this.maxCeilingHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.75, 0);
            // 2頂点目
            buffer.positions.push(x - 1, ceilingHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 3頂点目
            buffer.positions.push(x, ceilingHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 4頂点目
            buffer.positions.push(x, this.maxCeilingHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(1, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の天井の東の壁の面の頂点を作成
        FlatMap.prototype.setupCeilingEastWallVertices = function (buffer, verticesStride, indicesStride, y, x, ceilingHeight) {
            // 1頂点目
            buffer.positions.push(x, this.maxCeilingHeight, y - 1);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.75, 0);
            // 2頂点目
            buffer.positions.push(x, ceilingHeight, y - 1);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 3頂点目
            buffer.positions.push(x, ceilingHeight, y);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 4頂点目
            buffer.positions.push(x, this.maxCeilingHeight, y);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(1, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の天井の南の壁の面の頂点を作成
        FlatMap.prototype.setupCeilingSouthWallVertices = function (buffer, verticesStride, indicesStride, y, x, ceilingHeight) {
            // 1頂点目
            buffer.positions.push(x, this.maxCeilingHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.75, 0);
            // 2頂点目
            buffer.positions.push(x, ceilingHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 3頂点目
            buffer.positions.push(x - 1, ceilingHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 4頂点目
            buffer.positions.push(x - 1, this.maxCeilingHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(1, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の天井の西の壁の面の頂点を作成
        FlatMap.prototype.setupCeilingWestWallVertices = function (buffer, verticesStride, indicesStride, y, x, ceilingHeight) {
            // 1頂点目
            buffer.positions.push(x - 1, this.maxCeilingHeight, y);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.75, 0);
            // 2頂点目
            buffer.positions.push(x - 1, ceilingHeight, y);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 3頂点目
            buffer.positions.push(x - 1, ceilingHeight, y - 1);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 4頂点目
            buffer.positions.push(x - 1, this.maxCeilingHeight, y - 1);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(1, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        FlatMap.prototype.movePlatforms = function () {
            var isPlayerOnAnyPlatform = false;
            for (var i = 0; i < this._platforms.length; i++) {
                this._platforms[i].move();
                isPlayerOnAnyPlatform = isPlayerOnAnyPlatform || this._platforms[i].isPlayerOnThisPlatform();
            }
            var mapMovement = WrtGame.MapMovement.getInstance();
            if (isPlayerOnAnyPlatform) {
                mapMovement.onPlatformNow = true;
            }
            else {
                mapMovement.onPlatformNow = false;
            }
        };
        return FlatMap;
    }(WrtGame.Map));
    WrtGame.FlatMap = FlatMap;
})(WrtGame || (WrtGame = {}));
//window.WrtGame = WrtGame;
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var GameLogic = (function () {
        function GameLogic() {
            this._logicalEvent = [];
        }
        GameLogic.getInstance = function () {
            if (GameLogic._instance == null) {
                GameLogic._instance = new GameLogic();
            }
            return GameLogic._instance;
        };
        GameLogic.prototype.onMoveOnMapCallback = function () {
            // TODO: Use Bacon.js. add an 'Encount' Logical event to the EventStream.
            if (Math.random() < 0.10) {
                //        if(Math.random()<1) {
                console.log("エンカウント！！" + WrtGame.LG_ENCOUNTER);
                //            if ($("#checkbox_encounter").attr("checked") === "checked") {
                this._logicalEvent.push(WrtGame.LG_ENCOUNTER);
                return true;
            }
            else {
                return false;
            }
        };
        GameLogic.prototype.getGameLogicalEvent = function () {
            return this._logicalEvent.shift();
        };
        return GameLogic;
    }());
    WrtGame.GameLogic = GameLogic;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var PolygonMap = (function (_super) {
        __extends(PolygonMap, _super);
        function PolygonMap(_scene, map, textures) {
            _super.call(this, true);
            this._scene = _scene;
            this._platforms = new Array();
            this.map = map;
            this.setupMesh(this.heightMapData, this.width, this.height, textures);
        }
        PolygonMap.prototype.setupMesh = function (heightMapData_, mapWidth, mapHeight, textures) {
            this.textures = textures;
            var texMapData = this._texMapData;
            var typeMapData = this._typeMapData;
            function arrayClone(arr) {
                if (_.isArray(arr)) {
                    return _.map(arr, arrayClone);
                }
                else if (typeof arr === 'object') {
                    throw 'Cannot clone array containing an object!';
                }
                else {
                    return arr;
                }
            }
            var heightMapData = arrayClone(heightMapData_);
            var sprite = {};
            sprite.buffer = { positions: [], normals: [], texcoords: [], indices: [] };
            sprite.FaceN = 0;
            var rootMesh = new BABYLON.Mesh("PolygonMap_RootMesh", this._scene);
            var that = this;
            this.textures.forEach(function (texture, texIndex) {
                var texMesh = new BABYLON.Mesh("PolygonMap_Mesh_" + texture.game_model_url.split('/').last, that._scene);
                texMesh.parent = rootMesh;
                BABYLON.SceneLoader.ImportMesh("", "https://www.emastation.com/wrt/material/tile3d/", texture.game_model_url.split('/').last, that._scene, function (newMeshes) {
                    for (var i = 0; i < newMeshes.length; i++) {
                        var mesh = newMeshes[i];
                        mesh.isVisible = false;
                        for (var y = 1; y < mapHeight + 1; y++) {
                            for (var x = 1; x < mapWidth + 1; x++) {
                                if (texMapData[y][x] === texIndex + 1) {
                                    var cellMesh = new BABYLON.Mesh("Cell_mesh_[" + i + "]:" + x + ":" + y, that._scene);
                                    cellMesh.position = new BABYLON.Vector3(y, 0, x);
                                    cellMesh.parent = texMesh;
                                    if (i == 0) {
                                        if (!WrtGame.doesThisTypeExist(typeMapData[y][x], 'P') && !WrtGame.doesThisTypeExist(typeMapData[y][x], 'W')) {
                                            var newInstance = mesh.createInstance("Cristal_mesh_[" + i + "]:" + x + ":" + y);
                                            newInstance.position = new BABYLON.Vector3(0, heightMapData[y][x][0], 0);
                                            newInstance.isVisible = true;
                                            newInstance.parent = cellMesh;
                                        }
                                    }
                                    else if (i == 2) {
                                        if (!WrtGame.doesThisTypeExist(typeMapData[y][x], 'P') && !WrtGame.doesThisTypeExist(typeMapData[y][x], 'W')) {
                                            var newInstance = mesh.createInstance("Cristal_mesh_[" + i + "]:" + x + ":" + y);
                                            newInstance.position = new BABYLON.Vector3(0, heightMapData[y][x][1] - 1, 0); // ポリゴンモデルの時点で床より１ユニット高いため、-1している
                                            newInstance.isVisible = true;
                                            newInstance.parent = cellMesh;
                                        }
                                    }
                                    else {
                                        // 東の壁
                                        var wallMeshEast = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                                        wallMeshEast.parent = cellMesh;
                                        for (var j = heightMapData[y][x][0]; j < heightMapData[y][x][1]; j++) {
                                            if (!WrtGame.doesThisTypeExist(typeMapData[y][x + 1], 'W')) {
                                                if (WrtGame.doesThisTypeExist(typeMapData[y][x + 1], 'P') || heightMapData[y][x + 1][0] <= j && j < (heightMapData[y][x + 1][1])) {
                                                    continue;
                                                }
                                            }
                                            var newInstanceEast = mesh.createInstance("wall_mesh_[" + i + "][E]:" + x + ":" + y);
                                            newInstanceEast.position = new BABYLON.Vector3(0, j, 0);
                                            newInstanceEast.isVisible = true;
                                            newInstanceEast.parent = wallMeshEast;
                                        }
                                        // 南の壁
                                        var wallMeshSouth = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                                        wallMeshSouth.parent = cellMesh;
                                        wallMeshSouth.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
                                        wallMeshSouth.position = new BABYLON.Vector3(1, 0, 0);
                                        for (var j = heightMapData[y][x][0]; j < heightMapData[y][x][1]; j++) {
                                            if (!WrtGame.doesThisTypeExist(typeMapData[y + 1][x], 'W')) {
                                                if (WrtGame.doesThisTypeExist(typeMapData[y + 1][x], 'P') || heightMapData[y + 1][x][0] <= j && j < (heightMapData[y + 1][x][1])) {
                                                    continue;
                                                }
                                            }
                                            var newInstanceSouth = mesh.createInstance("wall_mesh_[" + i + "][S]:" + x + ":" + y);
                                            newInstanceSouth.position = new BABYLON.Vector3(0, j, 0);
                                            newInstanceSouth.isVisible = true;
                                            newInstanceSouth.parent = wallMeshSouth;
                                        }
                                        // 西の壁
                                        var wallMeshWEST = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                                        wallMeshWEST.parent = cellMesh;
                                        wallMeshWEST.rotation = new BABYLON.Vector3(0, Math.PI, 0);
                                        wallMeshWEST.position = new BABYLON.Vector3(1, 0, -1);
                                        for (var j = heightMapData[y][x][0]; j < heightMapData[y][x][1]; j++) {
                                            if (!WrtGame.doesThisTypeExist(typeMapData[y][x - 1], 'W')) {
                                                if (WrtGame.doesThisTypeExist(typeMapData[y][x - 1], 'P') || heightMapData[y][x - 1][0] <= j && j < (heightMapData[y][x - 1][1])) {
                                                    continue;
                                                }
                                            }
                                            var newInstanceWEST = mesh.createInstance("wall_mesh_[" + i + "][W]:" + x + ":" + y);
                                            newInstanceWEST.position = new BABYLON.Vector3(0, j, 0);
                                            newInstanceWEST.isVisible = true;
                                            newInstanceWEST.parent = wallMeshWEST;
                                        }
                                        // 北の壁
                                        var wallMeshNORTH = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                                        wallMeshNORTH.parent = cellMesh;
                                        wallMeshNORTH.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
                                        wallMeshNORTH.position = new BABYLON.Vector3(0, 0, -1);
                                        for (var j = heightMapData[y][x][0]; j < heightMapData[y][x][1]; j++) {
                                            if (!WrtGame.doesThisTypeExist(typeMapData[y - 1][x], 'W')) {
                                                if (WrtGame.doesThisTypeExist(typeMapData[y - 1][x], 'P') || heightMapData[y - 1][x][0] <= j && j < (heightMapData[y - 1][x][1])) {
                                                    continue;
                                                }
                                            }
                                            var newInstanceNORTH = mesh.createInstance("wall_mesh_[" + i + "][N]:" + x + ":" + y);
                                            newInstanceNORTH.position = new BABYLON.Vector3(0, j, 0);
                                            newInstanceNORTH.isVisible = true;
                                            newInstanceNORTH.parent = wallMeshNORTH;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            });
            for (var y = 0; y < mapHeight + 2; y++) {
                for (var x = 0; x < mapWidth + 2; x++) {
                    if (WrtGame.doesThisTypeExist(typeMapData[y][x], 'P')) {
                        var platform = new WrtGame.MapPolygonPlatform(x, y, heightMapData_, WrtGame.getTypeParameter(typeMapData[y][x], 'P'));
                        platform.setupMesh(this._scene, this._map.title + "_platform[" + x + "][" + y + "]", heightMapData[y][x][0], heightMapData[y][x][1], this.textures[texMapData[y][x] - 1].game_model_url);
                        this._platforms.push(platform);
                    }
                }
            }
            rootMesh.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
            rootMesh.position = new BABYLON.Vector3(0, 0, 1);
        };
        PolygonMap.prototype.movePlatforms = function () {
            var isPlayerOnAnyPlatform = false;
            for (var i = 0; i < this._platforms.length; i++) {
                this._platforms[i].move();
                isPlayerOnAnyPlatform = isPlayerOnAnyPlatform || this._platforms[i].isPlayerOnThisPlatform();
            }
            var mapMovement = WrtGame.MapMovement.getInstance();
            if (isPlayerOnAnyPlatform) {
                mapMovement.onPlatformNow = true;
            }
            else {
                mapMovement.onPlatformNow = false;
            }
        };
        return PolygonMap;
    }(WrtGame.Map));
    WrtGame.PolygonMap = PolygonMap;
})(WrtGame || (WrtGame = {}));
//window.WrtGame = WrtGame;
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var PolygonMapGLBoost = (function (_super) {
        __extends(PolygonMapGLBoost, _super);
        function PolygonMapGLBoost(_scene, map, textures, canvasId) {
            _super.call(this, true);
            this._scene = _scene;
            this._platforms = new Array();
            this.map = map;
            this.setupMesh(this.heightMapData, this.width, this.height, textures, canvasId);
        }
        PolygonMapGLBoost.prototype.setupMesh = function (heightMapData_, mapWidth, mapHeight, textures, canvasId) {
            var _this = this;
            this.textures = textures;
            var texMapData = this._texMapData;
            var typeMapData = this._typeMapData;
            function arrayClone(arr) {
                if (_.isArray(arr)) {
                    return _.map(arr, arrayClone);
                }
                else if (typeof arr === 'object') {
                    throw 'Cannot clone array containing an object!';
                }
                else {
                    return arr;
                }
            }
            var objLoader = GLBoost.ObjLoader.getInstance();
            var heightMapData = arrayClone(heightMapData_);
            var defers_floor = new Array(this.textures.length);
            var defers_ceiling = new Array(this.textures.length);
            var defers_wall = new Array(this.textures.length);
            var basePath = 'https://www.emastation.com/wrt/material/tile3d/';
            var rootGroup = new GLBoost.Group();
            rootGroup.translate = new GLBoost.Vector3(-1, 0, -1);
            this.textures.forEach(function (texture, texIndex) {
                defers_floor[texIndex] = $.Deferred();
                defers_ceiling[texIndex] = $.Deferred();
                defers_wall[texIndex] = $.Deferred();
                var texGroup = new GLBoost.Group();
                rootGroup.addChild(texGroup);
                var texName = texture.game_model_url.split('/').last.split('.').first;
                // Floor
                var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_floor.obj');
                promise.then((function (deferIndex) {
                    return function (mesh) {
                        console.log(mesh);
                        var mergedMesh = new GLBoost.Mesh(mesh.geometry, null);
                        mergedMesh.translate = new GLBoost.Vector3(0, -1000, 0);
                        var meshes = [];
                        for (var y_1 = 1; y_1 < mapHeight + 1; y_1++) {
                            for (var x_1 = 1; x_1 < mapWidth + 1; x_1++) {
                                if (texMapData[y_1][x_1] === texIndex + 1) {
                                    var cellGroup = new GLBoost.Group();
                                    cellGroup.translate = new GLBoost.Vector3(x_1, 0, y_1);
                                    //texGroup.addChild(cellGroup);
                                    if (!WrtGame.doesThisTypeExist(typeMapData[y_1][x_1], 'P') && !WrtGame.doesThisTypeExist(typeMapData[y_1][x_1], 'W')) {
                                        var geom = lodash.cloneDeep(mesh.geometry);
                                        geom._instanceName + '_' + y_1 + '_' + x_1;
                                        var newInstance = new GLBoost.Mesh(geom, null, canvasId);
                                        newInstance.translate = new GLBoost.Vector3(0, heightMapData[y_1][x_1][0], 0);
                                        cellGroup.addChild(newInstance);
                                        meshes.push(newInstance);
                                    }
                                }
                            }
                        }
                        mergedMesh.mergeHarder(meshes);
                        texGroup.addChild(mergedMesh);
                        //          self.prepareForRender();
                        defers_floor[deferIndex].resolve();
                    };
                })(texIndex));
                // Ceiling
                var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_ceiling.obj');
                promise.then((function (deferIndex) {
                    return function (mesh) {
                        console.log(mesh);
                        var mergedMesh = new GLBoost.Mesh(mesh.geometry, null);
                        mergedMesh.translate = new GLBoost.Vector3(0, -1000, 0);
                        var meshes = [];
                        for (var y_2 = 1; y_2 < mapHeight + 1; y_2++) {
                            for (var x_2 = 1; x_2 < mapWidth + 1; x_2++) {
                                if (texMapData[y_2][x_2] === texIndex + 1) {
                                    var cellGroup = new GLBoost.Group();
                                    cellGroup.translate = new GLBoost.Vector3(x_2, 0, y_2);
                                    //texGroup.addChild(cellGroup);
                                    if (!WrtGame.doesThisTypeExist(typeMapData[y_2][x_2], 'P') && !WrtGame.doesThisTypeExist(typeMapData[y_2][x_2], 'W')) {
                                        var geom = lodash.cloneDeep(mesh.geometry);
                                        geom._instanceName + '_' + y_2 + '_' + x_2;
                                        var newInstance = new GLBoost.Mesh(geom, null, canvasId);
                                        newInstance.translate = new GLBoost.Vector3(0, heightMapData[y_2][x_2][1] - 1, 0); // ポリゴンモデルの時点で床より１ユニット高いため、-1している
                                        cellGroup.addChild(newInstance);
                                        meshes.push(newInstance);
                                    }
                                }
                            }
                        }
                        mergedMesh.mergeHarder(meshes);
                        texGroup.addChild(mergedMesh);
                        //          self.prepareForRender();
                        defers_ceiling[deferIndex].resolve();
                    };
                })(texIndex));
                // Wall
                var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_wall.obj');
                promise.then((function (deferIndex) {
                    return function (mesh) {
                        console.log(mesh);
                        // if there is zero normal (0,0,0), overwrite with (1,0,0).
                        for (var i = 0; i < mesh.geometry._vertices.normal.length; i++) {
                            var vec = mesh.geometry._vertices.normal[i];
                            if (vec.x === 0 && vec.y === 0 && vec.z === 0) {
                                mesh.geometry._vertices.normal[i] = new GLBoost.Vector3(1, 0, 0);
                            }
                        }
                        var mergedMesh = new GLBoost.Mesh(mesh.geometry, null);
                        mergedMesh.translate = new GLBoost.Vector3(0, -1000, 0);
                        var meshes = [];
                        for (var y_3 = 1; y_3 < mapHeight + 1; y_3++) {
                            for (var x_3 = 1; x_3 < mapWidth + 1; x_3++) {
                                if (texMapData[y_3][x_3] === texIndex + 1) {
                                    var cellGroup = new GLBoost.Group();
                                    cellGroup.translate = new GLBoost.Vector3(x_3, 0, y_3);
                                    //texGroup.addChild(cellGroup);
                                    // 東の壁
                                    var wallGroupEast = new GLBoost.Group();
                                    wallGroupEast.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(-Math.PI / 2), 0);
                                    wallGroupEast.translate = new GLBoost.Vector3(1, 0, 0);
                                    cellGroup.addChild(wallGroupEast);
                                    for (var j = heightMapData[y_3][x_3][0]; j < heightMapData[y_3][x_3][1]; j++) {
                                        if (!WrtGame.doesThisTypeExist(typeMapData[y_3][x_3 + 1], 'W')) {
                                            if (WrtGame.doesThisTypeExist(typeMapData[y_3][x_3 + 1], 'P') || heightMapData[y_3][x_3 + 1][0] <= j && j < (heightMapData[y_3][x_3 + 1][1])) {
                                                continue;
                                            }
                                        }
                                        var geom = lodash.cloneDeep(mesh.geometry);
                                        geom._instanceName + '_' + y_3 + '_' + x_3 + 'East';
                                        //var newInstanceEast = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                                        var newInstanceEast = new GLBoost.Mesh(geom, null, canvasId);
                                        newInstanceEast.translate = new GLBoost.Vector3(0, j, 0);
                                        wallGroupEast.addChild(newInstanceEast);
                                        meshes.push(newInstanceEast);
                                    }
                                    // 南の壁
                                    var wallGroupSouth = new GLBoost.Group();
                                    cellGroup.addChild(wallGroupSouth);
                                    wallGroupSouth.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI), 0);
                                    wallGroupSouth.translate = new GLBoost.Vector3(1, 0, 1);
                                    for (var j = heightMapData[y_3][x_3][0]; j < heightMapData[y_3][x_3][1]; j++) {
                                        if (!WrtGame.doesThisTypeExist(typeMapData[y_3 + 1][x_3], 'W')) {
                                            if (WrtGame.doesThisTypeExist(typeMapData[y_3 + 1][x_3], 'P') || heightMapData[y_3 + 1][x_3][0] <= j && j < (heightMapData[y_3 + 1][x_3][1])) {
                                                continue;
                                            }
                                        }
                                        var geom = lodash.cloneDeep(mesh.geometry);
                                        geom._instanceName + '_' + y_3 + '_' + x_3 + 'South';
                                        //var newInstanceSouth = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                                        var newInstanceSouth = new GLBoost.Mesh(geom, null, canvasId);
                                        newInstanceSouth.translate = new GLBoost.Vector3(0, j, 0);
                                        wallGroupSouth.addChild(newInstanceSouth);
                                        meshes.push(newInstanceSouth);
                                    }
                                    // 西の壁
                                    var wallGroupWest = new GLBoost.Group();
                                    cellGroup.addChild(wallGroupWest);
                                    wallGroupWest.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI / 2), 0);
                                    wallGroupWest.translate = new GLBoost.Vector3(0, 0, 1);
                                    for (var j = heightMapData[y_3][x_3][0]; j < heightMapData[y_3][x_3][1]; j++) {
                                        if (!WrtGame.doesThisTypeExist(typeMapData[y_3][x_3 - 1], 'W')) {
                                            if (WrtGame.doesThisTypeExist(typeMapData[y_3][x_3 - 1], 'P') || heightMapData[y_3][x_3 - 1][0] <= j && j < (heightMapData[y_3][x_3 - 1][1])) {
                                                continue;
                                            }
                                        }
                                        var geom = lodash.cloneDeep(mesh.geometry);
                                        geom._instanceName + '_' + y_3 + '_' + x_3 + 'West';
                                        //var newInstanceWEST = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                                        var newInstanceWEST = new GLBoost.Mesh(geom, null, canvasId);
                                        newInstanceWEST.translate = new GLBoost.Vector3(0, j, 0);
                                        wallGroupWest.addChild(newInstanceWEST);
                                        meshes.push(newInstanceWEST);
                                    }
                                    // 北の壁
                                    var wallGroupNorth = new GLBoost.Group();
                                    cellGroup.addChild(wallGroupNorth);
                                    for (var j = heightMapData[y_3][x_3][0]; j < heightMapData[y_3][x_3][1]; j++) {
                                        if (!WrtGame.doesThisTypeExist(typeMapData[y_3 - 1][x_3], 'W')) {
                                            if (WrtGame.doesThisTypeExist(typeMapData[y_3 - 1][x_3], 'P') || heightMapData[y_3 - 1][x_3][0] <= j && j < (heightMapData[y_3 - 1][x_3][1])) {
                                                continue;
                                            }
                                        }
                                        var geom = lodash.cloneDeep(mesh.geometry);
                                        geom._instanceName + '_' + y_3 + '_' + x_3 + 'North';
                                        //var newInstanceNORTH = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                                        var newInstanceNORTH = new GLBoost.Mesh(geom, null, canvasId);
                                        newInstanceNORTH.translate = new GLBoost.Vector3(0, j, 0);
                                        wallGroupNorth.addChild(newInstanceNORTH);
                                        meshes.push(newInstanceNORTH);
                                    }
                                }
                            }
                        }
                        mergedMesh.mergeHarder(meshes);
                        texGroup.addChild(mergedMesh);
                        //          self.prepareForRender();
                        defers_wall[deferIndex].resolve();
                    };
                })(texIndex));
            });
            var deferPromises = [];
            defers_floor.forEach(function (defer) {
                deferPromises.push(defer.promise());
            });
            defers_ceiling.forEach(function (defer) {
                deferPromises.push(defer.promise());
            });
            defers_wall.forEach(function (defer) {
                deferPromises.push(defer.promise());
            });
            for (var y = 0; y < mapHeight + 2; y++) {
                for (var x = 0; x < mapWidth + 2; x++) {
                    if (WrtGame.doesThisTypeExist(typeMapData[y][x], 'P')) {
                        var platform = new WrtGame.MapPolygonPlatformGLBoost(x, y, heightMapData_, WrtGame.getTypeParameter(typeMapData[y][x], 'P'));
                        var dp = platform.setupMesh(this._scene, basePath, heightMapData[y][x][0], heightMapData[y][x][1], this.textures[texMapData[y][x] - 1].game_model_url, typeMapData, canvasId);
                        this._platforms.push(platform);
                        deferPromises.concat(dp);
                    }
                }
            }
            $.when.apply($.when, deferPromises).done(function () {
                _this._scene.add(rootGroup);
                _this._scene.prepareForRender();
            });
        };
        PolygonMapGLBoost.prototype.movePlatforms = function () {
            var isPlayerOnAnyPlatform = false;
            for (var i = 0; i < this._platforms.length; i++) {
                this._platforms[i].move();
                isPlayerOnAnyPlatform = isPlayerOnAnyPlatform || this._platforms[i].isPlayerOnThisPlatform();
            }
            var mapMovement = WrtGame.MapMovement.getInstance();
            if (isPlayerOnAnyPlatform) {
                mapMovement.onPlatformNow = true;
            }
            else {
                mapMovement.onPlatformNow = false;
            }
        };
        return PolygonMapGLBoost;
    }(WrtGame.Map));
    WrtGame.PolygonMapGLBoost = PolygonMapGLBoost;
})(WrtGame || (WrtGame = {}));
//window.WrtGame = WrtGame;
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    WrtGame.KEY_CODE_W = 87;
    WrtGame.KEY_CODE_A = 65;
    WrtGame.KEY_CODE_S = 83;
    WrtGame.KEY_CODE_D = 68;
    WrtGame.KEY_CODE_Q = 81;
    WrtGame.KEY_CODE_E = 69;
    WrtGame.KEY_CODE_X = 88;
    WrtGame.KEY_CODE_T = 84;
    WrtGame.KEY_CODE_G = 71;
    WrtGame.KEY_CODE_R = 82;
    WrtGame.KEY_CODE_F = 70;
    WrtGame.KEY_CODE_ARROW_LEFT = 37;
    WrtGame.KEY_CODE_ARROW_UP = 38;
    WrtGame.KEY_CODE_ARROW_RIGHT = 39;
    WrtGame.KEY_CODE_ARROW_DOWN = 40;
    WrtGame.KEY_CODE_ENTER = 13;
    WrtGame.KEY_CODE_RIGHT_SQUARE_BRACKET = 221;
    WrtGame.KEY_INFO_W = [WrtGame.KEY_CODE_W, "KEY_W"];
    WrtGame.KEY_INFO_A = [WrtGame.KEY_CODE_A, "KEY_A"];
    WrtGame.KEY_INFO_S = [WrtGame.KEY_CODE_S, "KEY_S"];
    WrtGame.KEY_INFO_D = [WrtGame.KEY_CODE_D, "KEY_D"];
    WrtGame.KEY_INFO_Q = [WrtGame.KEY_CODE_Q, "KEY_Q"];
    WrtGame.KEY_INFO_E = [WrtGame.KEY_CODE_E, "KEY_E"];
    WrtGame.KEY_INFO_X = [WrtGame.KEY_CODE_X, "KEY_X"];
    WrtGame.KEY_INFO_T = [WrtGame.KEY_CODE_T, "KEY_T"];
    WrtGame.KEY_INFO_G = [WrtGame.KEY_CODE_G, "KEY_G"];
    WrtGame.KEY_INFO_R = [WrtGame.KEY_CODE_R, "KEY_R"];
    WrtGame.KEY_INFO_F = [WrtGame.KEY_CODE_F, "KEY_F"];
    WrtGame.KEY_INFO_ARROW_LEFT = [WrtGame.KEY_CODE_ARROW_LEFT, "KEY_ARROW_LEFT"];
    WrtGame.KEY_INFO_ARROW_UP = [WrtGame.KEY_CODE_ARROW_UP, "KEY_ARROW_UP"];
    WrtGame.KEY_INFO_ARROW_RIGHT = [WrtGame.KEY_CODE_ARROW_RIGHT, "KEY_ARROW_RIGHT"];
    WrtGame.KEY_INFO_ARROW_DOWN = [WrtGame.KEY_CODE_ARROW_DOWN, "KEY_ARROW_DOWN"];
    WrtGame.KEY_INFO_ENTER = [WrtGame.KEY_CODE_ENTER, "KEY_ENTER"];
    WrtGame.KEY_INFO_RIGHT_SQUARE_BRACKET = [WrtGame.KEY_CODE_RIGHT_SQUARE_BRACKET, "KEY_RIGHT_SQUARE_BRACKET"];
    WrtGame.L_NO_MOVE = "L_NO_MOVE";
    WrtGame.L_MOVE_FORWARD = "L_MOVE_FORWARD";
    WrtGame.L_TURN_LEFT = "L_TURN_LEFT";
    WrtGame.L_TURN_BACK = "L_TURN_BACK";
    WrtGame.L_TURN_RIGHT = "L_TURN_RIGHT";
    WrtGame.L_MOVE_LEFT = "L_MOVE_LEFT";
    WrtGame.L_MOVE_RIGHT = "L_MOVE_RIGHT";
    WrtGame.L_MOVE_BACKWARD = "L_MOVE_BACKWARD";
    WrtGame.L_MOVE_UPPER = "L_MOVE_UPPER";
    WrtGame.L_MOVE_LOWER = "L_MOVE_LOWER";
    WrtGame.L_FACE_UP = "L_FACE_UP";
    WrtGame.L_FACE_LOW = "L_FACE_LOW";
    WrtGame.L_UI_NO_MOVE = "L_UI_NO_MOVE";
    WrtGame.L_UI_MOVE_LEFT = "L_UI_MOVE_LEFT";
    WrtGame.L_UI_MOVE_UPPER = "L_UI_MOVE_UPPER";
    WrtGame.L_UI_MOVE_RIGHT = "L_UI_MOVE_RIGHT";
    WrtGame.L_UI_MOVE_LOWER = "L_UI_MOVE_LOWER";
    WrtGame.L_UI_PUSH_OK = "L_UI_PUSH_OK";
    WrtGame.L_UI_PUSH_CANCEL = "L_UI_PUSH_CANCEL";
    WrtGame.L_NORTH = "L_NORTH";
    WrtGame.L_WEST = "L_WEST";
    WrtGame.L_EAST = "L_EAST";
    WrtGame.L_SOUTH = "L_SOUTH";
    WrtGame.L_UPPER = "L_UPPER";
    WrtGame.L_LOWER = "L_LOWER";
    WrtGame.flyMode_f = true;
    WrtGame.LG_ENCOUNTER = "LG_ENCOUNTER";
    /**
     *  ゲームの状態を保持するクラス
     */
    var GameState = (function () {
        function GameState() {
            this._allowedStateKeyInfo = [WrtGame.KEY_INFO_W, WrtGame.KEY_INFO_A, WrtGame.KEY_INFO_S, WrtGame.KEY_INFO_D, WrtGame.KEY_INFO_Q, WrtGame.KEY_INFO_E, WrtGame.KEY_INFO_X, WrtGame.KEY_INFO_T, WrtGame.KEY_INFO_G, WrtGame.KEY_INFO_R, WrtGame.KEY_INFO_F];
            this._logicalMovementCommand = [WrtGame.L_MOVE_FORWARD, WrtGame.L_TURN_LEFT, WrtGame.L_TURN_BACK, WrtGame.L_TURN_RIGHT, WrtGame.L_MOVE_LEFT, WrtGame.L_MOVE_RIGHT, WrtGame.L_MOVE_BACKWARD, WrtGame.L_MOVE_UPPER, WrtGame.L_MOVE_LOWER, WrtGame.L_FACE_UP, WrtGame.L_FACE_LOW];
            this._allowedUiKeyInfo = [WrtGame.KEY_INFO_ARROW_LEFT, WrtGame.KEY_INFO_ARROW_UP, WrtGame.KEY_INFO_ARROW_RIGHT, WrtGame.KEY_INFO_ARROW_DOWN, WrtGame.KEY_INFO_ENTER, WrtGame.KEY_INFO_RIGHT_SQUARE_BRACKET];
            this._logicalUiCommand = [WrtGame.L_UI_MOVE_LEFT, WrtGame.L_UI_MOVE_UPPER, WrtGame.L_UI_MOVE_RIGHT, WrtGame.L_UI_MOVE_LOWER, WrtGame.L_UI_PUSH_OK, WrtGame.L_UI_PUSH_CANCEL];
            this._allowedStateKeyCodes = this.createKeyCodesFromKeyInfo(this._allowedStateKeyInfo);
            this._allowedUiKeyCodes = this.createKeyCodesFromKeyInfo(this._allowedUiKeyInfo);
        }
        GameState.getInstance = function () {
            if (GameState._instance == null) {
                GameState._instance = new GameState();
            }
            return GameState._instance;
        };
        /**
         * 物理イベントのBaconJSプロパティから移動命令を生成するBaconJSプロパティに変換する
         * @param property
         */
        GameState.prototype.mapPhysicalEventPropertyToLogicalMovementCommandProperty = function (phisicalEventProperty) {
            var _this = this;
            var logicalMovementCommandProperty = phisicalEventProperty.flatMap(this.getFunctionLogicalMovementCommand());
            logicalMovementCommandProperty.onValue(function (value) {
                _this.registerLogicalMovementState(value);
            });
            return logicalMovementCommandProperty;
        };
        /**
         * 物理イベントのBaconJSプロパティからUI命令を生成するBaconJSプロパティに変換する
         * @param property
         */
        GameState.prototype.mapPhysicalEventPropertyToLogicalUiCommandProperty = function (phisicalEventProperty) {
            var _this = this;
            var logicalUiCommandProperty = phisicalEventProperty.flatMap(this.getFunctionLogicalUiCommand());
            logicalUiCommandProperty.onValue(function (value) {
                _this.registerLogicalUiOperationState(value);
            });
            return logicalUiCommandProperty;
        };
        /**
         * KEY_INFO_* の配列から KEY_CODE_* の配列を作る
         * @returns {Array}
         */
        GameState.prototype.createKeyCodesFromKeyInfo = function (infoArray) {
            var allowedStateKeyCodes = [];
            infoArray.forEach(function (element, index, array) {
                allowedStateKeyCodes.push(element[0]);
            });
            return allowedStateKeyCodes;
        };
        Object.defineProperty(GameState.prototype, "allowedStateKeyCodes", {
            /**
             * 連打できない扱いの移動操作キー（例：前進キーなど）のリストを返す。
             * @returns {string}
             */
            get: function () {
                return this._allowedStateKeyCodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameState.prototype, "allowedUiKeyCodes", {
            /**
             * 連打できない扱いのUiキー（例：←など）のリストを返す。
             * @returns {string}
             */
            get: function () {
                return this._allowedUiKeyCodes;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Bacon.jsのキーイベントプロパティのflatMapに渡す関数を返す（移動操作キー用）
         * @returns {any}
         */
        GameState.prototype.getFunctionLogicalMovementCommand = function () {
            return function (value) {
                var index = this.getIndexOfKeyState(value);
                if (value[1] === WrtGame.KEY_UP) {
                    return WrtGame.L_NO_MOVE;
                }
                else {
                    return this._logicalMovementCommand[index];
                }
            }.bind(this);
        };
        /**
         * Bacon.jsのキーイベントプロパティのflatMapに渡す関数を返す（UI操作キー用）
         * @returns {any}
         */
        GameState.prototype.getFunctionLogicalUiCommand = function () {
            return function (value) {
                var index = this.getIndexOfUiKey(value);
                if (value[1] === WrtGame.KEY_UP) {
                    return WrtGame.L_UI_NO_MOVE;
                }
                else {
                    return this._logicalUiCommand[index];
                }
            }.bind(this);
        };
        /**
         * キーコード配列のインデックスを返す（移動操作キー用）
         * @param value
         * @returns {number}
         */
        GameState.prototype.getIndexOfKeyState = function (value) {
            var index = this.allowedStateKeyCodes.indexOf(value[0]);
            // Debug output
            var keyName = this._allowedStateKeyInfo[index][1];
            console.debug("KeyStateChanged: " + keyName + " is " + value[1]);
            return index;
        };
        /**
         * キーコード配列のインデックスを返す（Ui操作キー用）
         * @param value
         * @returns {number}
         */
        GameState.prototype.getIndexOfUiKey = function (value) {
            var index = this._allowedUiKeyCodes.indexOf(value[0]);
            // Debug output
            var keyName = this._allowedUiKeyInfo[index][1];
            console.debug("UiKeyChanged: " + keyName + " is " + value[1]);
            return index;
        };
        /**
         * 論理移動命令ステートを記憶する
         * @param value
         */
        GameState.prototype.registerLogicalMovementState = function (value) {
            this._logicalMovementState = value;
            console.debug("LogicalMovementState: " + value);
        };
        Object.defineProperty(GameState.prototype, "logicalMovementState", {
            get: function () {
                return this._logicalMovementState;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 論理移動命令ステートを記憶する
         * @param value
         */
        GameState.prototype.registerLogicalUiOperationState = function (value) {
            this._logicalUiOperationState = value;
            console.debug("LogicalUiOperationState: " + value);
        };
        Object.defineProperty(GameState.prototype, "logicalUiOperationState", {
            get: function () {
                return this._logicalUiOperationState;
            },
            enumerable: true,
            configurable: true
        });
        return GameState;
    }());
    WrtGame.GameState = GameState;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var GLBoostContext = (function () {
        function GLBoostContext() {
            this._renderer = null;
            this._canvas = null;
            this._canvasId = null;
        }
        GLBoostContext.getInstance = function () {
            if (GLBoostContext._instance == null) {
                GLBoostContext._instance = new GLBoostContext();
            }
            return GLBoostContext._instance;
        };
        GLBoostContext.prototype.init = function (canvasId) {
            this._canvasId = canvasId;
            this._canvas = document.querySelector(canvasId);
            this._renderer = new GLBoost.Renderer({ canvas: this._canvas, clearColor: { red: 0.0, green: 0.0, blue: 0.0, alpha: 1 } });
        };
        GLBoostContext.prototype.getRenderer = function () {
            return this._renderer;
        };
        GLBoostContext.prototype.getCanvas = function () {
            return this._canvas;
        };
        GLBoostContext.prototype.getCanvasId = function () {
            return this._canvasId;
        };
        return GLBoostContext;
    }());
    WrtGame.GLBoostContext = GLBoostContext;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    WrtGame.KEY_DOWN = "KEY_DOWN";
    WrtGame.KEY_UP = "KEY_UP";
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var MapPlatform = (function () {
        // コンストラクタの宣言
        function MapPlatform(x, y, heightMap, parameter) {
            this._floorSprite3D = {};
            this._ceilingSprite3D = {};
            this._loopN = 0; // プラットフォームの上下の動きの繰り返し数。0なら片道。1なら往復。
            this._timeLeft = 0; // プラットフォームを動かし始めてからの経過時間
            this._direction = 1; // プラットフォームが動く上下の方向
            this._remainLoopN = 0; // プラットフォームの残り繰り返し数
            this._fired = false; // プラットフォームが起動されるとtrueになる。
            this.heightMap = heightMap;
            this.x_onMap = x;
            this.y_onMap = y;
            this.platformMode = parameter.split('|')[0];
            var levelParameters = parameter.split('|')[1];
            this.levels = levelParameters.split('~');
            for (var i = 0; i < this.levels.length; i++) {
                this.levels[i] = parseInt(this.levels[i], 10);
            }
            this._loopN = parseInt(parameter.split('|')[2]);
            //            console.log("パラメータ:", this.levels);
            this.currentLevel = this.heightMap[this.y_onMap][this.x_onMap][0]; //this.levels[0];
            if (this.levels[0] > this.levels[1]) {
                var tmpLevel = this.levels[0];
                this.levels[0] = this.levels[1];
                this.levels[1] = tmpLevel;
            }
            this.initDirection();
        }
        MapPlatform.prototype.initDirection = function () {
            if (this.currentLevel === this.levels[0]) {
                this._direction = 1; // プラットフォームは上に動かす
            }
            else {
                this._direction = -1; // そうでなければ、下に動かす
            }
        };
        MapPlatform.prototype.move = function () {
            // プラットフォームの稼働アニメーション
            var span = Math.abs(this.levels[1] - this.levels[0]);
            var time = 5;
            var delta = 1 / 60 * span / time; //60は仮定するFPS値
            var breakTime = 1;
            if (this.platformMode === 'A') {
                this._remainLoopN = -1;
                this.moveInner(delta, time, breakTime, this._floorSprite3D.mesh, 60);
            }
            else if (this.platformMode === 'M') {
                // もし、プレーヤーがこのプラットフォームに乗っているなら
                var mapMovement = WrtGame.MapMovement.getInstance();
                if (mapMovement.playerXInteger === this.x_onMap && mapMovement.playerYInteger === this.y_onMap) {
                    if (!mapMovement.onPlatformNow) {
                        this._fired = true;
                    }
                    if (this._direction > 0) {
                        this._remainLoopN = this._loopN;
                    }
                    else {
                        this._remainLoopN = 0;
                    }
                }
                if (this._fired) {
                    this.moveInner(delta, time, breakTime, this._floorSprite3D.mesh, 60);
                }
            }
        };
        MapPlatform.prototype.isPlayerOnThisPlatform = function () {
            var mapMovement = WrtGame.MapMovement.getInstance();
            if (mapMovement.playerXInteger === this.x_onMap && mapMovement.playerYInteger === this.y_onMap) {
                return true;
            }
            else {
                return false;
            }
        };
        MapPlatform.prototype.moveInner = function (delta, time, breakTime, sprite, fps) {
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
            var mapMovement = WrtGame.MapMovement.getInstance();
            if (mapMovement.playerXInteger === this.x_onMap && mapMovement.playerYInteger === this.y_onMap) {
                if (WrtGame.flyMode_f) {
                    if (newHeight > mapMovement.playerH) {
                        mapMovement.playerH = newHeight;
                    }
                }
                else {
                    mapMovement.playerH = newHeight;
                }
            }
            //this.heightMap[this.y_onMap][this.x_onMap][0] = sprite.position.y;
            this.heightMap[this.y_onMap][this.x_onMap][0] = sprite.translate.y;
            if (this._timeLeft > time + breakTime) {
                if (this._remainLoopN !== 0) {
                    this._timeLeft = 0;
                    this._direction *= -1;
                    this._remainLoopN -= 1;
                }
                else {
                    this._fired = false;
                    this._timeLeft = 0;
                    this.initDirection();
                }
            }
        };
        MapPlatform.prototype.setupMesh = function (scene, mapPlatformTitle, floorHeight, ceilingHeight, imageUrl, typeMapData, canvasId) {
        };
        return MapPlatform;
    }());
    WrtGame.MapPlatform = MapPlatform;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var MapFlatPlatform = (function (_super) {
        __extends(MapFlatPlatform, _super);
        // コンストラクタの宣言
        function MapFlatPlatform(x, y, heightMap, parameter) {
            _super.call(this, x, y, heightMap, parameter);
            this.texcoordOne = 1; // Y方向の壁の高さ
            this.minFloorHeight = -20; // 床の最低の低さ
            this.maxCeilingHeight = 20; // 天井の最高の高さ
        }
        MapFlatPlatform.prototype.setupMesh = function (scene, mapPlatformTitle, floorHeight, ceilingHeight, imageUrl) {
            var x = this.x_onMap;
            var y = this.y_onMap;
            this._floorSprite3D.buffer = { positions: [], normals: [], texcoords: [], indices: [] };
            this._floorSprite3D.FaceN = 0;
            this._ceilingSprite3D.buffer = { positions: [], normals: [], texcoords: [], indices: [] };
            this._ceilingSprite3D.FaceN = 0;
            /// 床
            // 床の頂点データ作成
            var verticesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
            var indicesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
            this.setupFloorVertices(this._floorSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
            this._floorSprite3D.FaceN++;
            // 床の北向きの壁の頂点データ作成
            verticesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
            indicesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
            this.setupFloorNorthWallVertices(this._floorSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
            this._floorSprite3D.FaceN++;
            // 床の東向きの壁の頂点データ作成
            verticesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
            indicesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
            this.setupFloorEastWallVertices(this._floorSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
            this._floorSprite3D.FaceN++;
            // 床の南向きの壁の頂点データ作成
            verticesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
            indicesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
            this.setupFloorSouthWallVertices(this._floorSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
            this._floorSprite3D.FaceN++;
            // 床の西向きの壁の頂点データ作成
            verticesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
            indicesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
            this.setupFloorWestWallVertices(this._floorSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
            this._floorSprite3D.FaceN++;
            /// 天井
            // 天井の頂点データ作成
            verticesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
            indicesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
            this.setupCeilingVertices(this._ceilingSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
            this._ceilingSprite3D.FaceN++;
            // 天井の北向きの壁の頂点データ作成
            verticesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
            indicesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
            this.setupCeilingNorthWallVertices(this._ceilingSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
            this._ceilingSprite3D.FaceN++;
            // 天井の東向きの壁の頂点データ作成
            verticesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
            indicesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
            this.setupCeilingEastWallVertices(this._ceilingSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
            this._ceilingSprite3D.FaceN++;
            // 天井の南向きの壁の頂点データ作成
            verticesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
            indicesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
            this.setupCeilingSouthWallVertices(this._ceilingSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
            this._ceilingSprite3D.FaceN++;
            // 天井の西向きの壁の頂点データ作成
            verticesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
            indicesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
            this.setupCeilingWestWallVertices(this._ceilingSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
            this._ceilingSprite3D.FaceN++;
            // Babylon.jsは左手系なので、z軸を反転する
            for (var j = 0; j < this._floorSprite3D.buffer.positions.length; j++) {
                if (j % 3 === 2) {
                    this._floorSprite3D.buffer.positions[j] *= -1;
                    this._floorSprite3D.buffer.normals[j] *= -1;
                }
            }
            for (var j = 0; j < this._ceilingSprite3D.buffer.positions.length; j++) {
                if (j % 3 === 2) {
                    this._ceilingSprite3D.buffer.positions[j] *= -1;
                    this._ceilingSprite3D.buffer.normals[j] *= -1;
                }
            }
            // Babylonメッシュの作成
            // マテリアル
            var material = new BABYLON.StandardMaterial(mapPlatformTitle + "_map_texture_", scene);
            var color = new BABYLON.Color3(1.0, 1.0, 1.0);
            var texture = new BABYLON.Texture(imageUrl, scene);
            // 床側
            this._floorSprite3D.mesh = new BABYLON.Mesh(mapPlatformTitle + "_" + "floor", scene);
            this._floorSprite3D.mesh.position = new BABYLON.Vector3(this._floorSprite3D.mesh.position.x, floorHeight, this._floorSprite3D.mesh.position.z);
            var updatable = true;
            this._floorSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, this._floorSprite3D.buffer.positions, updatable);
            this._floorSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, this._floorSprite3D.buffer.normals, updatable);
            this._floorSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, this._floorSprite3D.buffer.texcoords, updatable);
            this._floorSprite3D.mesh.setIndices(this._floorSprite3D.buffer.indices);
            this._floorSprite3D.mesh.material = material;
            this._floorSprite3D.mesh.material.diffuseColor = color;
            this._floorSprite3D.mesh.material.diffuseTexture = texture;
            // 天井側
            this._ceilingSprite3D.mesh = new BABYLON.Mesh(mapPlatformTitle + "_" + "ceiling", scene);
            this._ceilingSprite3D.mesh.position = new BABYLON.Vector3(this._floorSprite3D.mesh.position.x, ceilingHeight, this._floorSprite3D.mesh.position.z);
            var updatable = true;
            this._ceilingSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, this._ceilingSprite3D.buffer.positions, updatable);
            this._ceilingSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, this._ceilingSprite3D.buffer.normals, updatable);
            this._ceilingSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, this._ceilingSprite3D.buffer.texcoords, updatable);
            this._ceilingSprite3D.mesh.setIndices(this._ceilingSprite3D.buffer.indices);
            this._ceilingSprite3D.mesh.material = material;
            this._ceilingSprite3D.mesh.material.diffuseColor = color;
            this._ceilingSprite3D.mesh.material.diffuseTexture = texture;
        };
        // １つ分の床の面の頂点を作成
        MapFlatPlatform.prototype.setupFloorVertices = function (buffer, verticesStride, indicesStride, y, x, floorHeight) {
            // 1頂点目
            buffer.positions.push(x - 1, floorHeight, y - 1);
            buffer.normals.push(0, 1, 0);
            buffer.texcoords.push(0, 0);
            // 2頂点目
            buffer.positions.push(x - 1, floorHeight, y);
            buffer.normals.push(0, 1, 0);
            buffer.texcoords.push(0, 1);
            // 3頂点目
            buffer.positions.push(x, floorHeight, y);
            buffer.normals.push(0, 1, 0);
            buffer.texcoords.push(0.25, 1);
            // 4頂点目
            buffer.positions.push(x, floorHeight, y - 1);
            buffer.normals.push(0, 1, 0);
            buffer.texcoords.push(0.25, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の床の北の壁の面の頂点を作成
        MapFlatPlatform.prototype.setupFloorNorthWallVertices = function (buffer, verticesStride, indicesStride, y, x, floorHeight) {
            // 1頂点目
            buffer.positions.push(x - 1, floorHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.25, 0);
            // 2頂点目
            buffer.positions.push(x - 1, this.minFloorHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 3頂点目
            buffer.positions.push(x, this.minFloorHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 4頂点目
            buffer.positions.push(x, floorHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.5, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の床の東の壁の面の頂点を作成
        MapFlatPlatform.prototype.setupFloorEastWallVertices = function (buffer, verticesStride, indicesStride, y, x, floorHeight) {
            // 1頂点目
            buffer.positions.push(x, floorHeight, y - 1);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.25, 0);
            // 2頂点目
            buffer.positions.push(x, this.minFloorHeight, y - 1);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 3頂点目
            buffer.positions.push(x, this.minFloorHeight, y);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 4頂点目
            buffer.positions.push(x, floorHeight, y);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.5, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の床の南の壁の面の頂点を作成
        MapFlatPlatform.prototype.setupFloorSouthWallVertices = function (buffer, verticesStride, indicesStride, y, x, floorHeight) {
            // 1頂点目
            buffer.positions.push(x, floorHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.25, 0);
            // 2頂点目
            buffer.positions.push(x, this.minFloorHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 3頂点目
            buffer.positions.push(x - 1, this.minFloorHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 4頂点目
            buffer.positions.push(x - 1, floorHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.5, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の床の西の壁の面の頂点を作成
        MapFlatPlatform.prototype.setupFloorWestWallVertices = function (buffer, verticesStride, indicesStride, y, x, floorHeight) {
            // 1頂点目
            buffer.positions.push(x - 1, floorHeight, y);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.25, 0);
            // 2頂点目
            buffer.positions.push(x - 1, this.minFloorHeight, y);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 3頂点目
            buffer.positions.push(x - 1, this.minFloorHeight, y - 1);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));
            // 4頂点目
            buffer.positions.push(x - 1, floorHeight, y - 1);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.5, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の天井の面の頂点を作成
        MapFlatPlatform.prototype.setupCeilingVertices = function (buffer, verticesStride, indicesStride, y, x, ceilingHeight) {
            // 1頂点目
            buffer.positions.push(x, ceilingHeight, y - 1);
            buffer.normals.push(0, -1, 0);
            buffer.texcoords.push(0.75, 0);
            // 2頂点目
            buffer.positions.push(x, ceilingHeight, y);
            buffer.normals.push(0, -1, 0);
            buffer.texcoords.push(0.75, 1);
            // 3頂点目
            buffer.positions.push(x - 1, ceilingHeight, y);
            buffer.normals.push(0, -1, 0);
            buffer.texcoords.push(0.5, 1);
            // 4頂点目
            buffer.positions.push(x - 1, ceilingHeight, y - 1);
            buffer.normals.push(0, -1, 0);
            buffer.texcoords.push(0.5, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の天井の北の壁の面の頂点を作成
        MapFlatPlatform.prototype.setupCeilingNorthWallVertices = function (buffer, verticesStride, indicesStride, y, x, ceilingHeight) {
            // 1頂点目
            buffer.positions.push(x - 1, this.maxCeilingHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.75, 0);
            // 2頂点目
            buffer.positions.push(x - 1, ceilingHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 3頂点目
            buffer.positions.push(x, ceilingHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 4頂点目
            buffer.positions.push(x, this.maxCeilingHeight, y - 1);
            buffer.normals.push(0, 0, 1);
            buffer.texcoords.push(1, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の天井の東の壁の面の頂点を作成
        MapFlatPlatform.prototype.setupCeilingEastWallVertices = function (buffer, verticesStride, indicesStride, y, x, ceilingHeight) {
            // 1頂点目
            buffer.positions.push(x, this.maxCeilingHeight, y - 1);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.75, 0);
            // 2頂点目
            buffer.positions.push(x, ceilingHeight, y - 1);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 3頂点目
            buffer.positions.push(x, ceilingHeight, y);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 4頂点目
            buffer.positions.push(x, this.maxCeilingHeight, y);
            buffer.normals.push(-1, 0, 0);
            buffer.texcoords.push(1, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の天井の南の壁の面の頂点を作成
        MapFlatPlatform.prototype.setupCeilingSouthWallVertices = function (buffer, verticesStride, indicesStride, y, x, ceilingHeight) {
            // 1頂点目
            buffer.positions.push(x, this.maxCeilingHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.75, 0);
            // 2頂点目
            buffer.positions.push(x, ceilingHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 3頂点目
            buffer.positions.push(x - 1, ceilingHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 4頂点目
            buffer.positions.push(x - 1, this.maxCeilingHeight, y);
            buffer.normals.push(0, 0, -1);
            buffer.texcoords.push(1, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        // １つ分の天井の西の壁の面の頂点を作成
        MapFlatPlatform.prototype.setupCeilingWestWallVertices = function (buffer, verticesStride, indicesStride, y, x, ceilingHeight) {
            // 1頂点目
            buffer.positions.push(x - 1, this.maxCeilingHeight, y);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.75, 0);
            // 2頂点目
            buffer.positions.push(x - 1, ceilingHeight, y);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 3頂点目
            buffer.positions.push(x - 1, ceilingHeight, y - 1);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));
            // 4頂点目
            buffer.positions.push(x - 1, this.maxCeilingHeight, y - 1);
            buffer.normals.push(1, 0, 0);
            buffer.texcoords.push(1, 0);
            // 表三角形の１個目
            buffer.indices.push(verticesStride + 0, verticesStride + 1, verticesStride + 2);
            // 表三角形の２個目
            buffer.indices.push(verticesStride + 0, verticesStride + 2, verticesStride + 3);
            // 裏三角形の１個目
            buffer.indices.push(verticesStride + 2, verticesStride + 1, verticesStride + 0);
            // 裏三角形の２個目
            buffer.indices.push(verticesStride + 3, verticesStride + 2, verticesStride + 0);
        };
        return MapFlatPlatform;
    }(WrtGame.MapPlatform));
    WrtGame.MapFlatPlatform = MapFlatPlatform;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    /**
     *  マップ上の移動を処理するクラス
     */
    var WalkResult = (function () {
        function WalkResult(encounter, // エンカウントしたか
            player_moving_f, isFinishedMoveXYInstant, // X方向かY方向のいずれかに移動が完了した瞬間か
            playerIntX, playerIntY) {
            this.encounter = encounter;
            this.player_moving_f = player_moving_f;
            this.isFinishedMoveXYInstant = isFinishedMoveXYInstant;
            this.playerIntX = playerIntX;
            this.playerIntY = playerIntY;
        }
        return WalkResult;
    }());
    WrtGame.WalkResult = WalkResult;
    var MapMovement = (function () {
        function MapMovement() {
            this._player_direction = WrtGame.L_SOUTH; // プレーヤーが向いている方角
            this._player_x_int = 1; // プレーヤーの位置座標（整数）。セルの移動を開始するとすぐに値がインクリメント・デクリメントされる。
            this._player_y_int = 1; // プレーヤーの位置座標（整数）。セルの移動を開始するとすぐに値がインクリメント・デクリメントされる。
            this._player_h_int = 0; // プレーヤーの高さ座標（整数）。セルの移動を開始するとすぐに値がインクリメント・デクリメントされる。
            this._player_x_int_prev = 1; // プレーヤーの位置座標（整数）。前回のmove()での値。
            this._player_y_int_prev = 1; // プレーヤーの位置座標（整数）。前回のmove()での値。
            this._player_h_int_prev = 0; // プレーヤーの高さ座標（整数）。前回のmove()での値。
            this._player_x = 1; // プレーヤーの位置座標x（浮動小数点値）
            this._player_y = 1; // プレーヤーの位置座標y（浮動小数点値）
            this._player_h = 0; // プレーヤーの高さ座標（浮動小数点値）
            this._player_x_center_int = 1; // プレーヤーの位置座標（整数）。セルの移動を開始して、隣のセルの中央にまで来ると値がインクリメント・デクリメントされる。
            this._player_y_center_int = 1; // プレーヤーの位置座標（整数）。セルの移動を開始して、隣のセルの中央にまで来ると値がインクリメント・デクリメントされる。
            this._player_h_center_int = 0; // プレーヤーの高さ座標（整数）。セルの移動を開始して、隣のセルの中央にまで来ると値がインクリメント・デクリメントされる。
            this._player_angle = Math.PI; // プレーヤーの現在の向きの角度（ラジアン）
            this._player_angle_to_change = 0; // プレーヤーの回転処理で、何度回転すればよいかの角度
            this._player_remained_changing_angle = 0; // プレーヤーの回転処理中、あと何度回転すればよいかの角度残量
            this._elevationAngle = 0; // プレーヤーの迎角（見上げる、または見下ろす角度）
            this._directionToMove = null; // プレーヤーが動くべき方向（プレーヤーの向きではないことに注意）
            this._player_moving_f = false; // falseならプレーヤーの位置移動中でない。trueなら位置移動中。
            this._maxElevationAngle = Math.PI / 4.1;
            this._onPlatformNow = false;
            this._positionUpdatedOnMoveKeyDown = true; // 現在居るマスの位置が変更になったらtrueになる。次のmove()が呼ばれるとすぐにfalseになる。
            this._positionUpdatedOnMoveKeyUp = true; // 現在居るマスの位置が変更になったらtrueになる。次のmove()が呼ばれるとすぐにfalseになる。
            this._playerIsMovable = true; // プレーヤーが動けるかどうか
            this.converterJson = {
                L_TURN_LEFT: {
                    L_NORTH: [WrtGame.L_WEST, -Math.PI / 2],
                    L_EAST: [WrtGame.L_NORTH, -Math.PI / 2],
                    L_SOUTH: [WrtGame.L_EAST, -Math.PI / 2],
                    L_WEST: [WrtGame.L_SOUTH, -Math.PI / 2]
                },
                L_TURN_BACK: {
                    L_NORTH: [WrtGame.L_SOUTH, -Math.PI],
                    L_EAST: [WrtGame.L_WEST, -Math.PI],
                    L_SOUTH: [WrtGame.L_NORTH, -Math.PI],
                    L_WEST: [WrtGame.L_EAST, -Math.PI]
                },
                L_TURN_RIGHT: {
                    L_NORTH: [WrtGame.L_EAST, Math.PI / 2],
                    L_EAST: [WrtGame.L_SOUTH, Math.PI / 2],
                    L_SOUTH: [WrtGame.L_WEST, Math.PI / 2],
                    L_WEST: [WrtGame.L_NORTH, Math.PI / 2]
                }
            };
        }
        MapMovement.getInstance = function () {
            if (MapMovement._instance == null) {
                MapMovement._instance = new MapMovement();
            }
            return MapMovement._instance;
        };
        /**
         * プレーヤーが向いている方向を示すBaconJSプロパティを返す
         * @param logicalMovementCommandProperty
         */
        MapMovement.prototype.mapLogicalMovementCommandToPlayerDirectionProperty = function (logicalMovementCommandProperty) {
            var _this = this;
            var filterFunc = function (moveCommand) {
                return _.contains([WrtGame.L_TURN_LEFT, WrtGame.L_TURN_BACK, WrtGame.L_TURN_RIGHT], moveCommand);
            };
            var func = function (moveCommand) {
                return _this.converterJson[moveCommand][_this._player_direction];
            };
            return logicalMovementCommandProperty.filter(filterFunc).flatMap(func);
        };
        /**
         * 移動すべき方向を示すBaconJSプロパティを返す
         * @returns {any}
         */
        MapMovement.prototype.mapLogicalMovementCommandToMoveDirectionProperty = function (logicalMovementCommandProperty) {
            var _this = this;
            /**
             * 押した移動キーと現在プレイヤーが向いている方角に基づき、移動すべき方角を返す
             * @param moveCommand プレーヤーが押した移動キーのキーコード
             * @returns {string} 移動すべき方角
             */
            var currentResult = null;
            var func = function (moveCommand) {
                if (moveCommand === WrtGame.L_MOVE_FORWARD) {
                    currentResult = _this._player_direction;
                }
                else if (moveCommand === WrtGame.L_MOVE_LEFT) {
                    switch (_this._player_direction) {
                        case WrtGame.L_NORTH:
                            currentResult = WrtGame.L_WEST;
                            break;
                        case WrtGame.L_EAST:
                            currentResult = WrtGame.L_NORTH;
                            break;
                        case WrtGame.L_SOUTH:
                            currentResult = WrtGame.L_EAST;
                            break;
                        case WrtGame.L_WEST:
                            currentResult = WrtGame.L_SOUTH;
                            break;
                    }
                }
                else if (moveCommand === WrtGame.L_MOVE_RIGHT) {
                    switch (_this._player_direction) {
                        case WrtGame.L_NORTH:
                            currentResult = WrtGame.L_EAST;
                            break;
                        case WrtGame.L_EAST:
                            currentResult = WrtGame.L_SOUTH;
                            break;
                        case WrtGame.L_SOUTH:
                            currentResult = WrtGame.L_WEST;
                            break;
                        case WrtGame.L_WEST:
                            currentResult = WrtGame.L_NORTH;
                            break;
                    }
                }
                else if (moveCommand === WrtGame.L_MOVE_BACKWARD) {
                    switch (_this._player_direction) {
                        case WrtGame.L_NORTH:
                            currentResult = WrtGame.L_SOUTH;
                            break;
                        case WrtGame.L_EAST:
                            currentResult = WrtGame.L_WEST;
                            break;
                        case WrtGame.L_SOUTH:
                            currentResult = WrtGame.L_NORTH;
                            break;
                        case WrtGame.L_WEST:
                            currentResult = WrtGame.L_EAST;
                            break;
                    }
                }
                else if (moveCommand === WrtGame.L_MOVE_UPPER) {
                    currentResult = WrtGame.L_UPPER;
                }
                else if (moveCommand === WrtGame.L_MOVE_LOWER) {
                    currentResult = WrtGame.L_LOWER;
                }
                return currentResult;
            };
            return logicalMovementCommandProperty.flatMap(func);
        };
        MapMovement.prototype.init = function (logicalMovementCommandProperty) {
            var _this = this;
            var moveDirectionProperty = this.mapLogicalMovementCommandToMoveDirectionProperty(logicalMovementCommandProperty);
            moveDirectionProperty.onValue(function (value) {
                _this._directionToMove = value;
                console.debug("LogicalMovementDirection: " + value);
            });
            var playerDirectionProperty = this.mapLogicalMovementCommandToPlayerDirectionProperty(logicalMovementCommandProperty);
            playerDirectionProperty.onValue(function (value) {
                if (!_this._player_moving_f && Math.abs(_this._player_remained_changing_angle) === 0) {
                    _this._player_remained_changing_angle = value[1];
                    _this._player_angle_to_change = value[1];
                    _this._player_direction = value[0];
                }
                console.debug("Player's Direction was changed to : " + value[0] + " rotatoion:" + value[1]);
            });
        };
        /**
         * プレーヤーの向きを回転して変更する。毎フレーム呼ばれ、各フレームで少しずつ回転する。
         * @param moveDelta
         */
        MapMovement.prototype.rotate = function (rotationUnit) {
            var gameState = WrtGame.GameState.getInstance();
            if (this._player_remained_changing_angle === 0) {
                return;
            }
            var unitAngleDelta = this._player_angle_to_change / rotationUnit;
            this._player_angle += unitAngleDelta;
            this._player_remained_changing_angle -= unitAngleDelta;
            if (Math.abs(this._player_remained_changing_angle) < Math.abs(unitAngleDelta)) {
                this._player_angle += this._player_remained_changing_angle;
                this._player_remained_changing_angle = 0;
                // 回転が終わってもまだ、回転キーが押されている場合は、ひきつづき回転させる
                if (_.contains([WrtGame.L_TURN_LEFT, WrtGame.L_TURN_BACK, WrtGame.L_TURN_RIGHT], gameState.logicalMovementState)) {
                    var value = this.converterJson[gameState.logicalMovementState][this._player_direction];
                    this._player_remained_changing_angle = value[1];
                    this._player_angle_to_change = value[1];
                    this._player_direction = value[0];
                }
            }
        };
        MapMovement.prototype.detectIntegerPosition = function () {
            var directionToMove = this._directionToMove;
            var player_x_center_int = this._player_x;
            var player_y_center_int = this._player_y;
            var player_h_center_int = this._player_h;
            // （セルの移動を開始して、隣のセルの中央にまで来ると値が変化する）プレイヤーの位置座標（整数）を算出する
            if (directionToMove === WrtGame.L_EAST || directionToMove === WrtGame.L_SOUTH) {
                player_x_center_int = Math.floor(this._player_x);
                player_y_center_int = Math.floor(this._player_y);
            }
            else if (directionToMove === WrtGame.L_WEST || directionToMove === WrtGame.L_NORTH) {
                player_x_center_int = Math.ceil(this._player_x);
                player_y_center_int = Math.ceil(this._player_y);
            }
            else if (directionToMove === WrtGame.L_UPPER) {
                player_h_center_int = Math.floor(this._player_h);
            }
            else if (directionToMove === WrtGame.L_LOWER) {
                player_h_center_int = Math.ceil(this._player_h);
            }
            var encounter_f = false;
            var isFinishedMoveXYInstant = false;
            // プレイヤーのこの位置座標が、X方向Y方向いずれかに変化していた（セルを移動した）のであれば
            if (player_x_center_int !== this._player_x_center_int || player_y_center_int !== this._player_y_center_int
                || player_h_center_int !== this._player_h_center_int) {
                // エンカウント判定を行う
                var gameLogic = WrtGame.GameLogic.getInstance();
                encounter_f = gameLogic.onMoveOnMapCallback();
                if (encounter_f) {
                    //                this.move_key_downed_f = false;
                    // エンカウント処理した時点で、行き過ぎてしまった位置座標を、エンカウント時点での整数座標に戻す。
                    if (directionToMove === WrtGame.L_EAST || directionToMove === WrtGame.L_SOUTH) {
                        this._player_x = Math.floor(this._player_x);
                        this._player_y = Math.floor(this._player_y);
                    }
                    else if (directionToMove === WrtGame.L_WEST || directionToMove === WrtGame.L_NORTH) {
                        this._player_x = Math.ceil(this._player_x);
                        this._player_y = Math.ceil(this._player_y);
                    }
                    else if (directionToMove === WrtGame.L_UPPER) {
                        this._player_h = Math.floor(this._player_h);
                    }
                    else if (directionToMove === WrtGame.L_LOWER) {
                        this._player_h = Math.ceil(this._player_h);
                    }
                }
            }
            if (player_x_center_int !== this._player_x_center_int || player_y_center_int !== this._player_y_center_int) {
                isFinishedMoveXYInstant = true;
            }
            this._player_x_center_int = player_x_center_int;
            this._player_y_center_int = player_y_center_int;
            this._player_h_center_int = player_h_center_int;
            var walkResult = new WalkResult(encounter_f, false, // この段階では決まらないので、仮に適当にfalseとしておく。
            isFinishedMoveXYInstant, player_x_center_int, player_y_center_int);
            return walkResult;
        };
        /**
         * マップのセルを移動する。毎フレーム呼ばれ、各フレームで少しずつ移動する。
         * @param map マップデータ
         * @param moveDelta 移動する際の、この関数の１回実行分の座標移動値（非常に小さい浮動小数）
         */
        MapMovement.prototype.move = function (map, moveDelta) {
            if (this._player_remained_changing_angle !== 0) {
                return;
            }
            if (!this._player_moving_f && !this._playerIsMovable) {
                //      if (!this._playerIsMovable) {
                return;
            }
            var gameState = WrtGame.GameState.getInstance();
            // 移動キー（回転キーは除く）を押していた場合
            if (this._directionToMove !== null && this._playerIsMovable &&
                _.contains([WrtGame.L_MOVE_FORWARD, WrtGame.L_MOVE_BACKWARD, WrtGame.L_MOVE_LEFT, WrtGame.L_MOVE_RIGHT, WrtGame.L_MOVE_UPPER, WrtGame.L_MOVE_LOWER], gameState.logicalMovementState)) {
                switch (this._directionToMove) {
                    case WrtGame.L_NORTH:
                        this._player_y -= moveDelta; // 座標を変位させる
                        this._player_y_int = Math.floor(this._player_y) + 1; // 現在位置の整数を求める
                        //if (mapData[this._player_y_int-1][this._player_x_int] === 0) { // もし、次の移動先が壁だったら
                        if (!map.isCouldPassAt(this._player_y_int - 1, this._player_x_int, this._player_h_int, this._player_h)) {
                            this._player_y = this._player_y_int; // 座標値を整数値にする（止まる）
                            this._player_moving_f = false; // 止まる
                        }
                        else {
                            this._player_moving_f = true; // 動いたまま
                        }
                        if (map.isThereScriptAt(this._player_y_int - 1, this._player_x_int, this._player_h_int, this._player_h)) {
                            var userFunctionsManager = WrtGame.UserFunctionsManager.getInstance();
                            // スクリプトのあるマスに移動する瞬間を狙ってUIからスクリプトを実行して、マス上のスクリプトの実行を阻止してしまうことを防ぐためのフラグ設定
                            userFunctionsManager.acceptableFromUI = false;
                        }
                        break;
                    case WrtGame.L_EAST:
                        this._player_x += moveDelta;
                        this._player_x_int = Math.ceil(this._player_x) - 1;
                        //if (mapData[this._player_y_int][this._player_x_int+1] === 0) {
                        if (!map.isCouldPassAt(this._player_y_int, this._player_x_int + 1, this._player_h_int, this._player_h)) {
                            this._player_x = this._player_x_int;
                            this._player_moving_f = false;
                        }
                        else {
                            this._player_moving_f = true;
                        }
                        if (map.isThereScriptAt(this._player_y_int, this._player_x_int + 1, this._player_h_int, this._player_h)) {
                            var userFunctionsManager = WrtGame.UserFunctionsManager.getInstance();
                            // スクリプトのあるマスに移動する瞬間を狙ってUIからスクリプトを実行して、マス上のスクリプトの実行を阻止してしまうことを防ぐためのフラグ設定
                            userFunctionsManager.acceptableFromUI = false;
                        }
                        break;
                    case WrtGame.L_SOUTH:
                        this._player_y += moveDelta;
                        this._player_y_int = Math.ceil(this._player_y) - 1;
                        //if (mapData[this._player_y_int+1][this._player_x_int] === 0) {
                        if (!map.isCouldPassAt(this._player_y_int + 1, this._player_x_int, this._player_h_int, this._player_h)) {
                            this._player_y = this._player_y_int;
                            this._player_moving_f = false;
                        }
                        else {
                            this._player_moving_f = true;
                        }
                        if (map.isThereScriptAt(this._player_y_int + 1, this._player_x_int, this._player_h_int, this._player_h)) {
                            var userFunctionsManager = WrtGame.UserFunctionsManager.getInstance();
                            // スクリプトのあるマスに移動する瞬間を狙ってUIからスクリプトを実行して、マス上のスクリプトの実行を阻止してしまうことを防ぐためのフラグ設定
                            userFunctionsManager.acceptableFromUI = false;
                        }
                        break;
                    case WrtGame.L_WEST:
                        this._player_x -= moveDelta;
                        this._player_x_int = Math.floor(this._player_x) + 1;
                        //if (mapData[this._player_y_int][this._player_x_int-1] === 0) {
                        if (!map.isCouldPassAt(this._player_y_int, this._player_x_int - 1, this._player_h_int, this._player_h)) {
                            this._player_x = this._player_x_int;
                            this._player_moving_f = false;
                        }
                        else {
                            this._player_moving_f = true;
                        }
                        if (map.isThereScriptAt(this._player_y_int, this._player_x_int - 1, this._player_h_int, this._player_h)) {
                            var userFunctionsManager = WrtGame.UserFunctionsManager.getInstance();
                            // スクリプトのあるマスに移動する瞬間を狙ってUIからスクリプトを実行して、マス上のスクリプトの実行を阻止してしまうことを防ぐためのフラグ設定
                            userFunctionsManager.acceptableFromUI = false;
                        }
                        break;
                    case WrtGame.L_UPPER:
                        this._player_h += moveDelta;
                        this._player_h_int = Math.ceil(this._player_h) - 1;
                        if (!map.isCouldPassAt(this._player_y_int, this._player_x_int, this._player_h_int + 1, null)) {
                            this._player_h = this._player_h_int;
                            this._player_moving_f = false;
                        }
                        else {
                            this._player_moving_f = true;
                        }
                        break;
                    case WrtGame.L_LOWER:
                        this._player_h -= moveDelta;
                        this._player_h_int = Math.floor(this._player_h) + 1;
                        if (!map.isCouldPassAt(this._player_y_int, this._player_x_int, this._player_h_int - 1, null)) {
                            if (!map.isMovingPlatform(this._player_y_int, this._player_x_int)) {
                                this._player_h = this._player_h_int; // ここをコメントアウトすることで、空中浮遊モードの場合に、稼働中のプラットフォームの床に自然に接触できる
                            }
                            this._player_moving_f = false;
                        }
                        else {
                            this._player_moving_f = true;
                        }
                        break;
                }
                if (this._player_x_int_prev !== this._player_x_int || this._player_y_int_prev !== this._player_y_int) {
                    this._positionUpdatedOnMoveKeyDown = true;
                }
            }
            else {
                var dest = 0;
                switch (this._directionToMove) {
                    case WrtGame.L_NORTH:
                        dest = Math.floor(this._player_y);
                        this._player_y_int = dest;
                        this._player_y -= moveDelta;
                        if (this._player_y < dest) {
                            this._player_y = dest;
                            this._player_moving_f = false;
                        }
                        break;
                    case WrtGame.L_EAST:
                        dest = Math.ceil(this._player_x);
                        this._player_x_int = dest;
                        this._player_x += moveDelta;
                        if (this._player_x > dest) {
                            this._player_x = dest;
                            this._player_moving_f = false;
                        }
                        break;
                    case WrtGame.L_SOUTH:
                        dest = Math.ceil(this._player_y);
                        this._player_y_int = dest;
                        this._player_y += moveDelta;
                        if (this._player_y > dest) {
                            this._player_y = dest;
                            this._player_moving_f = false;
                        }
                        break;
                    case WrtGame.L_WEST:
                        dest = Math.floor(this._player_x);
                        this._player_x_int = dest;
                        this._player_x -= moveDelta;
                        if (this._player_x < dest) {
                            this._player_x = dest;
                            this._player_moving_f = false;
                        }
                        break;
                    case WrtGame.L_UPPER:
                        dest = Math.ceil(this._player_h);
                        this._player_h_int = dest;
                        this._player_h += moveDelta;
                        if (this._player_h > dest) {
                            this._player_h = dest;
                            this._player_moving_f = false;
                        }
                        break;
                    case WrtGame.L_LOWER:
                        dest = Math.floor(this._player_h);
                        this._player_h_int = dest;
                        this._player_h -= moveDelta;
                        if (this._player_h < dest) {
                            this._player_h = dest;
                            this._player_moving_f = false;
                        }
                        break;
                }
                if (this._player_x_int_prev !== this._player_x_int || this._player_y_int_prev !== this._player_y_int) {
                    this._positionUpdatedOnMoveKeyUp = true;
                }
            }
            if ((this._positionUpdatedOnMoveKeyDown || this._positionUpdatedOnMoveKeyUp) &&
                map.doScriptIfThereIsIt(this._player_y_int, this._player_x_int)) {
                console.log("スクリプト実行！");
                /*
                        console.log('_player_x:' + this._player_x + ' _player_y:' + this._player_y);
                        console.log('_player_x_int:' + this._player_x_int + ' _player_y_int:' + this._player_y_int);
                        console.log('this._directionToMove:' + this._directionToMove);
                        console.log('this._positionUpdatedOnMoveKeyDown:' + this._positionUpdatedOnMoveKeyDown);
                        console.log('this._positionUpdatedOnMoveKeyUp:' + this._positionUpdatedOnMoveKeyUp);
                */
                if (this._positionUpdatedOnMoveKeyDown) {
                    this._player_x = this._player_x_int; // スクリプト実行後、動けるようになった時に一歩余計に動いてしまわないように
                    this._player_y = this._player_y_int; // スクリプト実行後、動けるようになった時に一歩余計に動いてしまわないように
                }
            }
            this._player_x_int_prev = this._player_x_int;
            this._player_y_int_prev = this._player_y_int;
            this._player_h_int_prev = this._player_h_int;
            this._positionUpdatedOnMoveKeyDown = false;
            this._positionUpdatedOnMoveKeyUp = false;
            var walkResult = this.detectIntegerPosition(); // 現在のプレーヤーの整数位置を算出
        };
        /**
         * 見上げるか見下ろす
         * @param angleDelta
         */
        MapMovement.prototype.faceUpOrLow = function (angleDelta) {
            var gameState = WrtGame.GameState.getInstance();
            if (gameState.logicalMovementState === WrtGame.L_FACE_UP) {
                this._elevationAngle += angleDelta;
                if (this._elevationAngle > this._maxElevationAngle) {
                    this._elevationAngle = this._maxElevationAngle;
                }
            }
            else if (gameState.logicalMovementState === WrtGame.L_FACE_LOW) {
                this._elevationAngle -= angleDelta;
                if (this._elevationAngle < -1 * this._maxElevationAngle) {
                    this._elevationAngle = -1 * this._maxElevationAngle;
                }
            }
        };
        Object.defineProperty(MapMovement.prototype, "playerIsMovable", {
            set: function (flg) {
                this._playerIsMovable = flg;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapMovement.prototype, "playerX", {
            get: function () {
                return this._player_x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapMovement.prototype, "playerY", {
            get: function () {
                return this._player_y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapMovement.prototype, "playerH", {
            get: function () {
                return this._player_h;
            },
            set: function (height) {
                this._player_h = height;
                var floatingValue = height - Math.floor(height);
                if (floatingValue === 0) {
                    this._player_h_int = height;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapMovement.prototype, "playerAngle", {
            get: function () {
                return this._player_angle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapMovement.prototype, "playerElevationAngle", {
            get: function () {
                return this._elevationAngle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapMovement.prototype, "playerXInteger", {
            get: function () {
                return this._player_x_int;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapMovement.prototype, "playerYInteger", {
            get: function () {
                return this._player_y_int;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapMovement.prototype, "onPlatformNow", {
            get: function () {
                return this._onPlatformNow;
            },
            set: function (flg) {
                this._onPlatformNow = flg;
            },
            enumerable: true,
            configurable: true
        });
        return MapMovement;
    }());
    WrtGame.MapMovement = MapMovement;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var MapPolygonPlatform = (function (_super) {
        __extends(MapPolygonPlatform, _super);
        // コンストラクタの宣言
        function MapPolygonPlatform(x, y, heightMap, parameter) {
            _super.call(this, x, y, heightMap, parameter);
            this.minFloorHeight = -20; // 床の最低の低さ
            this.maxCeilingHeight = 20; // 天井の最高の高さ
        }
        MapPolygonPlatform.prototype.setupMesh = function (scene, mapPlatformTitle, floorHeight, ceilingHeight, imageUrl) {
            var x = this.x_onMap;
            var y = this.y_onMap;
            /// 床側
            var floorRootMesh = new BABYLON.Mesh("MapFlatPlatform_Floor_RootMesh[" + x + "][" + y + "]", scene);
            var that = this;
            var splitPath = imageUrl.split('/');
            var texModelFileName = splitPath[splitPath.length - 1];
            BABYLON.SceneLoader.ImportMesh("", "https://www.emastation.com/wrt/material/tile3d/", texModelFileName, scene, function (newMeshes) {
                for (var i = 0; i < newMeshes.length; i++) {
                    var mesh = newMeshes[i];
                    mesh.isVisible = false;
                    var cellMesh = new BABYLON.Mesh("MapFlatPlatform_Floor_Cell_mesh_[" + i + "]:" + x + ":" + y, scene);
                    cellMesh.position = new BABYLON.Vector3(y, 0, x);
                    cellMesh.parent = floorRootMesh;
                    if (i === 0) {
                        var newInstance = mesh.createInstance("MapFlatPlatform_Floor_Cristal_mesh_[" + i + "]:" + x + ":" + y);
                        newInstance.position = new BABYLON.Vector3(0, 0, 0);
                        newInstance.isVisible = true;
                        newInstance.parent = cellMesh;
                    }
                    else if (i === 1) {
                        // 東の壁
                        var wallMeshWEST = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
                        wallMeshWEST.parent = cellMesh;
                        wallMeshWEST.rotation = new BABYLON.Vector3(0, Math.PI, 0);
                        wallMeshWEST.position = new BABYLON.Vector3(1, 0, 0);
                        for (var j = that.minFloorHeight; j < 0; j++) {
                            var newInstanceWEST = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][W]:" + x + ":" + y);
                            newInstanceWEST.position = new BABYLON.Vector3(0, j, 0);
                            newInstanceWEST.isVisible = true;
                            newInstanceWEST.parent = wallMeshWEST;
                        }
                        // 南の壁
                        var wallMeshNORTH = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
                        wallMeshNORTH.parent = cellMesh;
                        wallMeshNORTH.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
                        wallMeshNORTH.position = new BABYLON.Vector3(1, 0, -1);
                        for (var j = that.minFloorHeight; j < 0; j++) {
                            var newInstanceNORTH = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][N]:" + x + ":" + y);
                            newInstanceNORTH.position = new BABYLON.Vector3(0, j, 0);
                            newInstanceNORTH.isVisible = true;
                            newInstanceNORTH.parent = wallMeshNORTH;
                        }
                        // 西の壁
                        var wallMeshEast = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
                        wallMeshEast.parent = cellMesh;
                        wallMeshEast.position = new BABYLON.Vector3(0, 0, -1);
                        for (var j = that.minFloorHeight; j < 0; j++) {
                            var newInstanceEast = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][E]:" + x + ":" + y);
                            newInstanceEast.position = new BABYLON.Vector3(0, j, 0);
                            newInstanceEast.isVisible = true;
                            newInstanceEast.parent = wallMeshEast;
                        }
                        // 北の壁
                        var wallMeshSouth = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
                        wallMeshSouth.parent = cellMesh;
                        wallMeshSouth.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
                        wallMeshSouth.position = new BABYLON.Vector3(0, 0, 0);
                        for (var j = that.minFloorHeight; j < 0; j++) {
                            var newInstanceSouth = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][S]:" + x + ":" + y);
                            newInstanceSouth.position = new BABYLON.Vector3(0, j, 0);
                            newInstanceSouth.isVisible = true;
                            newInstanceSouth.parent = wallMeshSouth;
                        }
                    }
                }
            });
            floorRootMesh.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
            floorRootMesh.position = new BABYLON.Vector3(0, floorHeight, 1);
            this._floorSprite3D.mesh = floorRootMesh;
            /// 天井側
            var ceilingRootMesh = new BABYLON.Mesh("MapFlatPlatform_Ceiling_RootMesh[" + x + "][" + y + "]", scene);
            var that = this;
            BABYLON.SceneLoader.ImportMesh("", "https://www.emastation.com/wrt/material/tile3d/", texModelFileName, scene, function (newMeshes) {
                for (var i = 0; i < newMeshes.length; i++) {
                    var mesh = newMeshes[i];
                    mesh.isVisible = false;
                    var cellMesh = new BABYLON.Mesh("MapFlatPlatform_Ceiling_Cell_mesh_[" + i + "]:" + x + ":" + y, scene);
                    cellMesh.position = new BABYLON.Vector3(y, 0, x);
                    cellMesh.parent = ceilingRootMesh;
                    if (i === 2) {
                        var newInstance = mesh.createInstance("MapFlatPlatform_Ceiling_Cristal_mesh_[" + i + "]:" + x + ":" + y);
                        newInstance.position = new BABYLON.Vector3(0, -1, 0); // ポリゴンモデルの時点で床より１ユニット高いため、-1している
                        newInstance.isVisible = true;
                        newInstance.parent = cellMesh;
                    }
                    else if (i === 1) {
                        // 東の壁
                        var wallMeshWEST = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
                        wallMeshWEST.parent = cellMesh;
                        wallMeshWEST.rotation = new BABYLON.Vector3(0, Math.PI, 0);
                        wallMeshWEST.position = new BABYLON.Vector3(1, 0, 0);
                        for (var j = 0; j < that.maxCeilingHeight; j++) {
                            var newInstanceWEST = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][W]:" + x + ":" + y);
                            newInstanceWEST.position = new BABYLON.Vector3(0, j, 0);
                            newInstanceWEST.isVisible = true;
                            newInstanceWEST.parent = wallMeshWEST;
                        }
                        // 南の壁
                        var wallMeshNORTH = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
                        wallMeshNORTH.parent = cellMesh;
                        wallMeshNORTH.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
                        wallMeshNORTH.position = new BABYLON.Vector3(1, 0, -1);
                        for (var j = 0; j < that.maxCeilingHeight; j++) {
                            var newInstanceNORTH = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][N]:" + x + ":" + y);
                            newInstanceNORTH.position = new BABYLON.Vector3(0, j, 0);
                            newInstanceNORTH.isVisible = true;
                            newInstanceNORTH.parent = wallMeshNORTH;
                        }
                        // 西の壁
                        var wallMeshEast = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
                        wallMeshEast.parent = cellMesh;
                        wallMeshEast.position = new BABYLON.Vector3(0, 0, -1);
                        for (var j = 0; j < that.maxCeilingHeight; j++) {
                            var newInstanceEast = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][E]:" + x + ":" + y);
                            newInstanceEast.position = new BABYLON.Vector3(0, j, 0);
                            newInstanceEast.isVisible = true;
                            newInstanceEast.parent = wallMeshEast;
                        }
                        // 北の壁
                        var wallMeshSouth = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
                        wallMeshSouth.parent = cellMesh;
                        wallMeshSouth.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
                        wallMeshSouth.position = new BABYLON.Vector3(0, 0, 0);
                        for (var j = 0; j < that.maxCeilingHeight; j++) {
                            var newInstanceSouth = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][S]:" + x + ":" + y);
                            newInstanceSouth.position = new BABYLON.Vector3(0, j, 0);
                            newInstanceSouth.isVisible = true;
                            newInstanceSouth.parent = wallMeshSouth;
                        }
                    }
                }
            });
            ceilingRootMesh.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
            ceilingRootMesh.position = new BABYLON.Vector3(0, ceilingHeight, 1);
            this._ceilingSprite3D.mesh = ceilingRootMesh;
        };
        return MapPolygonPlatform;
    }(WrtGame.MapPlatform));
    WrtGame.MapPolygonPlatform = MapPolygonPlatform;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var MapPolygonPlatformGLBoost = (function (_super) {
        __extends(MapPolygonPlatformGLBoost, _super);
        // コンストラクタの宣言
        function MapPolygonPlatformGLBoost(x, y, heightMap, parameter) {
            _super.call(this, x, y, heightMap, parameter);
            this.minFloorHeight = -20; // 床の最低の低さ
            this.maxCeilingHeight = 20; // 天井の最高の高さ
        }
        MapPolygonPlatformGLBoost.prototype.setupMesh = function (scene, basePath, floorHeight, ceilingHeight, imageUrl, typeMapData, canvasId) {
            var _this = this;
            var x = this.x_onMap;
            var y = this.y_onMap;
            var objLoader = GLBoost.ObjLoader.getInstance();
            var splitPath = imageUrl.split('/');
            var texName = splitPath.last.split('.').first;
            /// 床
            var defers_floor = $.Deferred();
            var floorRootGroup = new GLBoost.Group();
            var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_floor.obj');
            promise.then(function (mesh) {
                var cellGroup = new GLBoost.Group();
                cellGroup.translate = new BABYLON.Vector3(x, 0, y);
                floorRootGroup.addChild(cellGroup);
                var newInstance = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                cellGroup.addChild(newInstance);
                defers_floor.resolve();
            });
            floorRootGroup.translate = new GLBoost.Vector3(-1, floorHeight, -1);
            this._floorSprite3D.mesh = floorRootGroup;
            scene.add(floorRootGroup);
            /// 天井
            var defers_ceiling = $.Deferred();
            var ceilingRootGroup = new GLBoost.Group();
            var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_ceiling.obj');
            promise.then(function (mesh) {
                var cellGroup = new GLBoost.Group();
                cellGroup.translate = new BABYLON.Vector3(x, 0, y);
                ceilingRootGroup.addChild(cellGroup);
                var newInstance = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                newInstance.translate = new BABYLON.Vector3(0, -1, 0); // ポリゴンモデルの時点で床より１ユニット高いため、-1している
                cellGroup.addChild(newInstance);
                defers_ceiling.resolve();
            });
            ceilingRootGroup.translate = new GLBoost.Vector3(-1, ceilingHeight, -1);
            this._ceilingSprite3D.mesh = ceilingRootGroup;
            scene.add(ceilingRootGroup);
            /// 床側の壁
            var defers_floorWall = $.Deferred();
            var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_wall.obj');
            promise.then(function (mesh) {
                // if there is zero normal (0,0,0), overwrite with (1,0,0).
                for (var i = 0; i < mesh.geometry._vertices.normal.length; i++) {
                    var vec = mesh.geometry._vertices.normal[i];
                    if (vec.x === 0 && vec.y === 0 && vec.z === 0) {
                        mesh.geometry._vertices.normal[i] = new GLBoost.Vector3(1, 0, 0);
                    }
                }
                {
                    /// 床側の壁
                    var cellGroup = new GLBoost.Group();
                    cellGroup.translate = new GLBoost.Vector3(x, 0, y);
                    floorRootGroup.addChild(cellGroup);
                    var mergedMesh = new GLBoost.Mesh(mesh.geometry, null);
                    mergedMesh.translate = new GLBoost.Vector3(0, -1000, 0);
                    var meshes = [];
                    // 東向きの壁
                    var wallGroupEast = new GLBoost.Group();
                    wallGroupEast.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI / 2), 0);
                    wallGroupEast.translate = new GLBoost.Vector3(1, 0, 1);
                    for (var j = _this.minFloorHeight; j < 0; j++) {
                        var geom = lodash.cloneDeep(mesh.geometry);
                        geom._instanceName + '_' + y + '_' + x + '_platform_floor_East';
                        var newInstanceEast = new GLBoost.Mesh(geom, null, canvasId);
                        newInstanceEast.translate = new GLBoost.Vector3(0, j, 0);
                        wallGroupEast.addChild(newInstanceEast);
                        meshes.push(newInstanceEast);
                    }
                    // 南向きの壁
                    var wallGroupSouth = new GLBoost.Group();
                    wallGroupSouth.translate = new GLBoost.Vector3(0, 0, 1);
                    for (var j = _this.minFloorHeight; j < 0; j++) {
                        var geom = lodash.cloneDeep(mesh.geometry);
                        geom._instanceName + '_' + y + '_' + x + '_platform_floor_South';
                        var newInstanceSouth = new GLBoost.Mesh(geom, null, canvasId);
                        newInstanceSouth.translate = new GLBoost.Vector3(0, j, 0);
                        wallGroupSouth.addChild(newInstanceSouth);
                        meshes.push(newInstanceSouth);
                    }
                    // 西向きの壁
                    var wallGroupWest = new GLBoost.Group();
                    wallGroupWest.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(-Math.PI / 2), 0);
                    for (var j = _this.minFloorHeight; j < 0; j++) {
                        var geom = lodash.cloneDeep(mesh.geometry);
                        geom._instanceName + '_' + y + '_' + x + '_platform_floor_West';
                        var newInstanceWest = new GLBoost.Mesh(geom, null, canvasId);
                        newInstanceWest.translate = new GLBoost.Vector3(0, j, 0);
                        wallGroupWest.addChild(newInstanceWest);
                        meshes.push(newInstanceWest);
                    }
                    // 北向きの壁
                    var wallGroupNorth = new GLBoost.Group();
                    wallGroupNorth.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI), 0);
                    wallGroupNorth.translate = new GLBoost.Vector3(1, 0, 0);
                    for (var j = _this.minFloorHeight; j < 0; j++) {
                        var geom = lodash.cloneDeep(mesh.geometry);
                        geom._instanceName + '_' + y + '_' + x + '_platform_floor_North';
                        var newInstanceNorth = new GLBoost.Mesh(geom, null, canvasId);
                        newInstanceNorth.translate = new GLBoost.Vector3(0, j, 0);
                        wallGroupNorth.addChild(newInstanceNorth);
                        meshes.push(newInstanceNorth);
                    }
                    mergedMesh.mergeHarder(meshes);
                    cellGroup.addChild(mergedMesh);
                }
                defers_floorWall.resolve();
            });
            /// 天井側の壁
            var defers_ceilingWall = $.Deferred();
            var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_wall.obj');
            promise.then(function (mesh) {
                // if there is zero normal (0,0,0), overwrite with (1,0,0).
                for (var i = 0; i < mesh.geometry._vertices.normal.length; i++) {
                    var vec = mesh.geometry._vertices.normal[i];
                    if (vec.x === 0 && vec.y === 0 && vec.z === 0) {
                        mesh.geometry._vertices.normal[i] = new GLBoost.Vector3(1, 0, 0);
                    }
                }
                {
                    /// 天井側の壁
                    var cellGroup = new GLBoost.Group();
                    cellGroup.translate = new GLBoost.Vector3(x, 0, y);
                    ceilingRootGroup.addChild(cellGroup);
                    var mergedMesh = new GLBoost.Mesh(mesh.geometry, null);
                    mergedMesh.translate = new GLBoost.Vector3(0, -1000, 0);
                    var meshes = [];
                    // 東向きの壁
                    var wallGroupEast = new GLBoost.Group();
                    //cellGroup.addChild(wallGroupEast);
                    wallGroupEast.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI / 2), 0);
                    wallGroupEast.translate = new GLBoost.Vector3(1, 0, 1);
                    for (var j = 0; j < _this.maxCeilingHeight; j++) {
                        var geom = lodash.cloneDeep(mesh.geometry);
                        geom._instanceName + '_' + y + '_' + x + '_platform_ceiling_East';
                        var newInstanceEast = new GLBoost.Mesh(geom, null, canvasId);
                        newInstanceEast.translate = new GLBoost.Vector3(0, j, 0);
                        wallGroupEast.addChild(newInstanceEast);
                        meshes.push(newInstanceEast);
                    }
                    // 南向きの壁
                    var wallGroupSouth = new GLBoost.Group();
                    //cellGroup.addChild(wallGroupSouth);
                    wallGroupSouth.translate = new GLBoost.Vector3(0, 0, 1);
                    for (var j = 0; j < _this.maxCeilingHeight; j++) {
                        var geom = lodash.cloneDeep(mesh.geometry);
                        geom._instanceName + '_' + y + '_' + x + '_platform_ceiling_South';
                        var newInstanceSouth = new GLBoost.Mesh(geom, null, canvasId);
                        newInstanceSouth.translate = new GLBoost.Vector3(0, j, 0);
                        wallGroupSouth.addChild(newInstanceSouth);
                        meshes.push(newInstanceSouth);
                    }
                    // 西向きの壁
                    var wallGroupWest = new GLBoost.Group();
                    //cellGroup.addChild(wallGroupWest);
                    wallGroupWest.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(-Math.PI / 2), 0);
                    for (var j = 0; j < _this.maxCeilingHeight; j++) {
                        var geom = lodash.cloneDeep(mesh.geometry);
                        geom._instanceName + '_' + y + '_' + x + '_platform_ceiling_West';
                        var newInstanceWest = new GLBoost.Mesh(geom, null, canvasId);
                        newInstanceWest.translate = new GLBoost.Vector3(0, j, 0);
                        wallGroupWest.addChild(newInstanceWest);
                        meshes.push(newInstanceWest);
                    }
                    // 北向きの壁
                    var wallGroupNorth = new GLBoost.Group();
                    wallGroupNorth.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI), 0);
                    wallGroupNorth.translate = new GLBoost.Vector3(1, 0, 0);
                    //cellGroup.addChild(wallGroupNorth);
                    for (var j = 0; j < _this.maxCeilingHeight; j++) {
                        var geom = lodash.cloneDeep(mesh.geometry);
                        geom._instanceName + '_' + y + '_' + x + '_platform_ceiling_North';
                        var newInstanceNorth = new GLBoost.Mesh(geom, null, canvasId);
                        newInstanceNorth.translate = new GLBoost.Vector3(0, j, 0);
                        wallGroupNorth.addChild(newInstanceNorth);
                        meshes.push(newInstanceNorth);
                    }
                    mergedMesh.mergeHarder(meshes);
                    cellGroup.addChild(mergedMesh);
                }
                defers_ceilingWall.resolve();
            });
            // Internal Wall
            var heightMapData = lodash.cloneDeep(this.heightMap);
            var internalWallGroup = new GLBoost.Group();
            internalWallGroup.translate = new GLBoost.Vector3(-1, 0, -1);
            var defer_wall = $.Deferred();
            var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_wall.obj');
            promise.then(function (mesh) {
                console.log(mesh);
                // if there is zero normal (0,0,0), overwrite with (1,0,0).
                for (var i = 0; i < mesh.geometry._vertices.normal.length; i++) {
                    var vec = mesh.geometry._vertices.normal[i];
                    if (vec.x === 0 && vec.y === 0 && vec.z === 0) {
                        mesh.geometry._vertices.normal[i] = new GLBoost.Vector3(1, 0, 0);
                    }
                }
                var mergedMesh = new GLBoost.Mesh(mesh.geometry, null);
                mergedMesh.translate = new GLBoost.Vector3(0, -1000, 0);
                var meshes = [];
                var cellGroup = new GLBoost.Group();
                cellGroup.translate = new GLBoost.Vector3(x, 0, y);
                //texGroup.addChild(cellGroup);
                // 東の壁
                var wallGroupEast = new GLBoost.Group();
                wallGroupEast.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(-Math.PI / 2), 0);
                wallGroupEast.translate = new GLBoost.Vector3(1, 0, 0);
                cellGroup.addChild(wallGroupEast);
                for (var j = heightMapData[y][x][0]; j < heightMapData[y][x][1]; j++) {
                    if (!WrtGame.doesThisTypeExist(typeMapData[y][x + 1], 'W')) {
                        if (WrtGame.doesThisTypeExist(typeMapData[y][x + 1], 'P') || heightMapData[y][x + 1][0] <= j && j < (heightMapData[y][x + 1][1])) {
                            continue;
                        }
                    }
                    var geom = lodash.cloneDeep(mesh.geometry);
                    geom._instanceName + '_' + y + '_' + x + 'East';
                    //var newInstanceEast = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                    var newInstanceEast = new GLBoost.Mesh(geom, null, canvasId);
                    newInstanceEast.translate = new GLBoost.Vector3(0, j, 0);
                    wallGroupEast.addChild(newInstanceEast);
                    meshes.push(newInstanceEast);
                }
                // 南の壁
                var wallGroupSouth = new GLBoost.Group();
                cellGroup.addChild(wallGroupSouth);
                wallGroupSouth.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI), 0);
                wallGroupSouth.translate = new GLBoost.Vector3(1, 0, 1);
                for (var j = heightMapData[y][x][0]; j < heightMapData[y][x][1]; j++) {
                    if (!WrtGame.doesThisTypeExist(typeMapData[y + 1][x], 'W')) {
                        if (WrtGame.doesThisTypeExist(typeMapData[y + 1][x], 'P') || heightMapData[y + 1][x][0] <= j && j < (heightMapData[y + 1][x][1])) {
                            continue;
                        }
                    }
                    var geom = lodash.cloneDeep(mesh.geometry);
                    geom._instanceName + '_' + y + '_' + x + 'South';
                    //var newInstanceSouth = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                    var newInstanceSouth = new GLBoost.Mesh(geom, null, canvasId);
                    newInstanceSouth.translate = new GLBoost.Vector3(0, j, 0);
                    wallGroupSouth.addChild(newInstanceSouth);
                    meshes.push(newInstanceSouth);
                }
                // 西の壁
                var wallGroupWest = new GLBoost.Group();
                cellGroup.addChild(wallGroupWest);
                wallGroupWest.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI / 2), 0);
                wallGroupWest.translate = new GLBoost.Vector3(0, 0, 1);
                for (var j = heightMapData[y][x][0]; j < heightMapData[y][x][1]; j++) {
                    if (!WrtGame.doesThisTypeExist(typeMapData[y][x - 1], 'W')) {
                        if (WrtGame.doesThisTypeExist(typeMapData[y][x - 1], 'P') || heightMapData[y][x - 1][0] <= j && j < (heightMapData[y][x - 1][1])) {
                            continue;
                        }
                    }
                    var geom = lodash.cloneDeep(mesh.geometry);
                    geom._instanceName + '_' + y + '_' + x + 'West';
                    //var newInstanceWEST = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                    var newInstanceWEST = new GLBoost.Mesh(geom, null, canvasId);
                    newInstanceWEST.translate = new GLBoost.Vector3(0, j, 0);
                    wallGroupWest.addChild(newInstanceWEST);
                    meshes.push(newInstanceWEST);
                }
                // 北の壁
                var wallGroupNorth = new GLBoost.Group();
                cellGroup.addChild(wallGroupNorth);
                for (var j = heightMapData[y][x][0]; j < heightMapData[y][x][1]; j++) {
                    if (!WrtGame.doesThisTypeExist(typeMapData[y - 1][x], 'W')) {
                        if (WrtGame.doesThisTypeExist(typeMapData[y - 1][x], 'P') || heightMapData[y - 1][x][0] <= j && j < (heightMapData[y - 1][x][1])) {
                            continue;
                        }
                    }
                    var geom = lodash.cloneDeep(mesh.geometry);
                    geom._instanceName + '_' + y + '_' + x + 'North';
                    //var newInstanceNORTH = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                    var newInstanceNORTH = new GLBoost.Mesh(geom, null, canvasId);
                    newInstanceNORTH.translate = new GLBoost.Vector3(0, j, 0);
                    wallGroupNorth.addChild(newInstanceNORTH);
                    meshes.push(newInstanceNORTH);
                }
                mergedMesh.mergeHarder(meshes);
                internalWallGroup.addChild(mergedMesh);
                //          self.prepareForRender();
                defer_wall.resolve();
            });
            scene.add(internalWallGroup);
            return [defers_floor.promise(), defers_ceiling.promise(), defers_floorWall.promise(), defers_ceilingWall.promise(), defer_wall.promise()];
        };
        return MapPolygonPlatformGLBoost;
    }(WrtGame.MapPlatform));
    WrtGame.MapPolygonPlatformGLBoost = MapPolygonPlatformGLBoost;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var NovelPlayer = (function () {
        function NovelPlayer() {
            this._currentPlayingStoryName = null;
            this._isPlaying = false;
            this._novelWasFinished = true;
            this._bgmPlayer = null;
            this._nextSceneId = null;
            this._getJustNextOrderScene = false;
            this._scenes = null;
            this._isWaitingChoice = false;
        }
        NovelPlayer.getInstance = function () {
            if (NovelPlayer._instance == null) {
                NovelPlayer._instance = new NovelPlayer();
            }
            return NovelPlayer._instance;
        };
        NovelPlayer.prototype.init = function () {
            var novelPlayerThis = this;
            this._bgmPlayer = WrtGame.BgmPlayer.getInstance();
            this._bgmPlayer.preloadBGMs(null, null);
            // シーンを定義
            tm.define("MainScene", {
                superClass: "tm.app.Scene",
                init: function () {
                    var this_ = this;
                    this_.superInit();
                    novelPlayerThis._tmMainScene = this;
                    var canvas = tm.dom.Element("#tmlibCanvas");
                    // MessageWindow
                    var imgMessageWindow = tm.display.RoundRectangleShape(WrtGame.Game.SCREEN_WIDTH - 40, 250, {
                        fillStyle: "#333377",
                        strokeStyle: "#003300",
                        lineWidth: 3
                    });
                    imgMessageWindow.setPosition(imgMessageWindow.width / 2 + 20, WrtGame.Game.SCREEN_HEIGHT - imgMessageWindow.height / 2 - 20); //);
                    imgMessageWindow.alpha = 0.5;
                    imgMessageWindow.onclick = function (e) {
                        imgMessageWindow.visible = !imgMessageWindow.visible;
                    };
                    this.imgMessageWindow = imgMessageWindow;
                    // MessageArea in the MessageWindow
                    var lblMessage = tm.ui.LabelArea("").addChildTo(imgMessageWindow);
                    lblMessage.setPosition(20, 20);
                    lblMessage.setFillStyle("#ffffff");
                    lblMessage.fontSize = 48;
                    lblMessage.setWidth(imgMessageWindow.width - 10);
                    lblMessage.setHeight(imgMessageWindow.height - 10);
                    this.lblMessage = lblMessage;
                    this.storyItemIndex = 0;
                    var that = this;
                    canvas.event.pointstart(function (e) {
                        if (novelPlayerThis._isPlaying) {
                            novelPlayerThis.playNext();
                        }
                    });
                    this.characters = [];
                    this.imgMessageWindow.visible = false;
                    this.lblMessage.visible = false;
                },
                update: function (app) {
                    novelPlayerThis._bgmPlayer.loop();
                }
            });
        };
        NovelPlayer.prototype.clear = function () {
            var that = this._tmMainScene;
            that.removeChildren();
        };
        NovelPlayer.prototype.loadStory = function (StoryName, startSceneId) {
            if (!this._novelWasFinished) {
                return false;
            }
            var that = this._tmMainScene;
            that.storyItemIndex = 0;
            that.imgMessageWindow.visible = true;
            that.lblMessage.visible = true;
            that.lblMessage.text = '';
            this._currentPlayingStoryName = StoryName;
            var that = this._tmMainScene;
            var story = MongoCollections.Stories.find({ title: StoryName }).fetch();
            if (_.isUndefined(story[0])) {
                return false;
            }
            var scenes = MongoCollections.StoryScenes.find({ storyId: story[0]._id }, { sort: { order: 1 } }).fetch();
            for (var i = 0; i < scenes.length; i++) {
                var storyItems = MongoCollections.StoryItems.find({ sceneId: scenes[i]._id }, { sort: { order: 1 } }).fetch();
                for (var j = 0; j < storyItems.length; j++) {
                    if (storyItems[j].contentType === 'sentence') {
                        storyItems[j].content = MongoCollections.Sentences.findOne({ _id: storyItems[j].contentId });
                    }
                    else if (storyItems[j].contentType === 'background') {
                        storyItems[j].content = MongoCollections.Backgrounds.findOne({ _id: storyItems[j].contentId });
                    }
                    else if (storyItems[j].contentType === 'bgm') {
                        storyItems[j].content = MongoCollections.Bgms.findOne({ _id: storyItems[j].contentId });
                    }
                    else if (storyItems[j].contentType === 'soundEffect') {
                        storyItems[j].content = MongoCollections.SoundEffects.findOne({ _id: storyItems[j].contentId });
                    }
                }
                scenes[i].storyItems = storyItems;
            }
            this._scenes = scenes;
            if (startSceneId) {
                this._nextSceneId = startSceneId;
            }
            else {
                this._nextSceneId = scenes[0]._id;
            }
            this._getJustNextOrderScene = false;
            this._isPlaying = true;
            this._novelWasFinished = false;
            return true;
        };
        Object.defineProperty(NovelPlayer.prototype, "currentPlayingStoryName", {
            get: function () {
                return this._currentPlayingStoryName;
            },
            enumerable: true,
            configurable: true
        });
        NovelPlayer.prototype.offPlayer = function () {
            var that = this._tmMainScene;
            that.imgMessageWindow.visible = false;
            that.lblMessage.visible = false;
            this._isPlaying = false;
        };
        NovelPlayer.prototype.getCharacterHorizontalPosition = function (position) {
            switch (position) {
                case 'RightEdge': return WrtGame.Game.SCREEN_WIDTH * 4.5 / 5;
                case 'Right': return WrtGame.Game.SCREEN_WIDTH * 3.5 / 5;
                case 'Center': return WrtGame.Game.SCREEN_WIDTH * 2.5 / 5;
                case 'Left': return WrtGame.Game.SCREEN_WIDTH * 1.5 / 5;
                case 'LeftEdge': return WrtGame.Game.SCREEN_WIDTH * 0.5 / 5;
            }
        };
        NovelPlayer.prototype.getCharacterHorizontalFlip = function (position) {
            switch (position) {
                case 'RightEdge': return 1;
                case 'Right': return 1;
                case 'Center': return 1;
                case 'Left': return -1;
                case 'LeftEdge': return -1;
            }
        };
        NovelPlayer.prototype.getCharacterPositionIndex = function (position) {
            switch (position) {
                case 'RightEdge': return 0;
                case 'Right': return 1;
                case 'Center': return 2;
                case 'Left': return 3;
                case 'LeftEdge': return 4;
            }
        };
        NovelPlayer.prototype.nextSentence = function (currentStoryItem) {
            var that = this._tmMainScene;
            var characterImage = MongoCollections.CharacterImages.findOne({ _id: currentStoryItem.content.characterImageId });
            var sentence = currentStoryItem.content;
            var characterPosIndex = this.getCharacterPositionIndex(sentence.position);
            // if there is somebody at new character's position.
            if (!_.isUndefined(that.characters[characterPosIndex])) {
                that.characters[characterPosIndex].remove(); // remove that old character from the stage,
                delete that.characters[characterPosIndex]; // and delete that old character.
            }
            // for each character position, if there is the same character as the new character, remove and delete the same character.
            that.characters.forEach(function (character, index, characters) {
                if (_.isUndefined(characters[index])) {
                    return;
                }
                if (characters[index].characterId === sentence.characterId) {
                    characters[index].remove();
                    delete characters[index];
                }
            });
            // display the new character.
            if (characterImage.portraitImageUrl !== '') {
                that.characters[characterPosIndex] = tm.display.Sprite(characterImage.portraitImageUrl);
                that.characters[characterPosIndex].characterId = sentence.characterId;
                that.addChildAt(that.characters[characterPosIndex], 10);
                var characterScale = 1.15;
                var horizontalPosition = this.getCharacterHorizontalPosition(sentence.position);
                that.characters[characterPosIndex].setPosition(horizontalPosition, WrtGame.Game.SCREEN_HEIGHT - that.characters[characterPosIndex].height * characterScale / 2);
                that.characters[characterPosIndex].setScale(characterScale * this.getCharacterHorizontalFlip(sentence.position), characterScale);
            }
            // display the new sentence text
            that.lblMessage.text = sentence.text;
        };
        NovelPlayer.prototype.nextBackground = function (currentStoryItem) {
            var that = this._tmMainScene;
            var backgroundImage = MongoCollections.BackgroundImages.findOne({ _id: currentStoryItem.content.backgroundImageId });
            if (that.imgBackGround) {
                tm.anim.Tween().fromTo(that.imgBackGround, { alpha: 1.0 }, { alpha: 0.0 }, 500, null).on("finish", (function (self, background) {
                    return function (e) {
                        that.removeChild(background);
                        //                delete self.background;
                    };
                })(that, that.imgBackGround)).start();
            }
            that.imgBackGround = tm.display.Sprite(backgroundImage.imageUrl, WrtGame.Game.SCREEN_WIDTH, WrtGame.Game.SCREEN_HEIGHT);
            that.imgBackGround.setPosition(WrtGame.Game.SCREEN_WIDTH / 2, WrtGame.Game.SCREEN_HEIGHT / 2);
            that.addChildAt(that.imgBackGround, 0);
            tm.anim.Tween().fromTo(that.imgBackGround, { alpha: 0.0 }, { alpha: 1.0 }, 500, null).start();
        };
        NovelPlayer.prototype.nextBgm = function (currentStoryItem) {
            var that = this._tmMainScene;
            var bgmAudio = MongoCollections.BgmAudios.findOne({ _id: currentStoryItem.content.bgmAudioId });
            if (bgmAudio.identifier === 'none') {
                this._bgmPlayer.stop();
            }
            else {
                var transitionTime = (currentStoryItem.content.transition === 'crossfade') ? 3000 : 0;
                this._bgmPlayer.play(bgmAudio.identifier, currentStoryItem.content.volume, transitionTime);
            }
        };
        NovelPlayer.prototype.nextSoundEffect = function (currentStoryItem) {
            var that = this._tmMainScene;
            var soundEffectAudio = MongoCollections.SoundEffectAudios.findOne({ _id: currentStoryItem.content.soundEffectAudioId });
            var soundEffect = tm.asset.Manager.get(soundEffectAudio.identifier);
            soundEffect.stop();
            soundEffect.volume = currentStoryItem.content.volume;
            soundEffect.play();
        };
        NovelPlayer.prototype.nextScene = function () {
            var _this = this;
            var results = _.filter(this._scenes, function (scene) {
                return scene._id === _this._nextSceneId;
            });
            var matchedScene = results[0];
            if (this._getJustNextOrderScene) {
                var results_2 = _.filter(this._scenes, function (scene) {
                    return scene.order === matchedScene.order + 1;
                });
                return results_2[0];
            }
            else {
                return matchedScene;
            }
        };
        NovelPlayer.prototype.playNext = function () {
            var _this = this;
            if (this._isWaitingChoice) {
                return;
            }
            var that = this._tmMainScene;
            var currentScene = this.nextScene();
            if (!currentScene) {
                return;
            }
            var currentStoryItem = currentScene.storyItems[that.storyItemIndex];
            // すでにStoryが終了していた場合は、
            if (_.isUndefined(currentStoryItem)) {
                // もし、シーンに選択肢が１つもなければ
                if (currentScene.choices.length === 0) {
                    this._getJustNextOrderScene = true;
                    var nextScene = this.nextScene();
                    if (nextScene) {
                        that.storyItemIndex = 0;
                        this._nextSceneId = nextScene._id;
                        this._getJustNextOrderScene = false;
                        this.playNext(); // same as one more click screen.
                        return; // the story is not over yet.
                    }
                    // 後片付けしてreturnする
                    that.characters.forEach(function (character, index, characters) {
                        if (!_.isUndefined(characters[index])) {
                            characters[index].remove();
                            delete characters[index];
                        }
                    });
                    if (that.imgBackGround) {
                        that.imgBackGround.remove();
                        delete that.imgBackGround;
                    }
                    that.imgMessageWindow.visible = false;
                    this._novelWasFinished = true;
                    var mapMovement = WrtGame.MapMovement.getInstance();
                    mapMovement.playerIsMovable = true;
                    return;
                }
                else {
                    // シーンに選択肢が１つ以上あれば
                    if (this._isWaitingChoice) {
                        return;
                    }
                    that.choiceLabelButtons = [];
                    currentScene.choices.forEach(function (choice, i, choices) {
                        var choiceLabelButton = tm.ui.LabelButton(choice.sentence);
                        choiceLabelButton.setFontSize(48);
                        choiceLabelButton.setAlpha(1);
                        choiceLabelButton.setShadowColor('black');
                        choiceLabelButton.setShadowOffset(3, 3);
                        choiceLabelButton.setShadowBlur(5);
                        choiceLabelButton.x = WrtGame.Game.SCREEN_WIDTH / 2;
                        choiceLabelButton.y = WrtGame.Game.SCREEN_HEIGHT / 2 + ((i - (choices.length - 1) / 2) * 100);
                        choiceLabelButton.setInteractive(true);
                        choiceLabelButton.addEventListener("touchend", (function (index) {
                            return function (e) {
                                console.log("" + index + ": " + currentScene.choices[index].goTo);
                                _this._nextSceneId = currentScene.choices[index].goTo;
                                _this._isWaitingChoice = false;
                                that.storyItemIndex = 0;
                                setTimeout(function () {
                                    if (that.choiceLabelButtons) {
                                        that.choiceLabelButtons.forEach(function (choiceLabelButton) {
                                            choiceLabelButton.remove();
                                        });
                                    }
                                }, 0);
                            };
                        })(i));
                        that.addChildAt(choiceLabelButton, 30 + i);
                        that.choiceLabelButtons.push(choiceLabelButton);
                    });
                    this._isWaitingChoice = true;
                    return;
                }
            }
            if (that.storyItemIndex === 0 && currentScene.clear) {
                this.clearAllElements();
            }
            if (currentStoryItem.contentType === 'sentence') {
                this.nextSentence(currentStoryItem);
            }
            else if (currentStoryItem.contentType === 'background') {
                this.nextBackground(currentStoryItem);
            }
            else if (currentStoryItem.contentType === 'bgm') {
                this.nextBgm(currentStoryItem);
            }
            else if (currentStoryItem.contentType === 'soundEffect') {
                this.nextSoundEffect(currentStoryItem);
            }
            that.addChildAt(that.imgMessageWindow, 20);
            that.storyItemIndex++;
            if (!currentStoryItem.needClick) {
                this.playNext();
            }
        };
        NovelPlayer.prototype.clearAllElements = function () {
            var that = this._tmMainScene;
            // clear characters
            that.characters.forEach(function (character, index, characters) {
                if (_.isUndefined(characters[index])) {
                    return;
                }
                characters[index].remove();
                delete characters[index];
            });
            // clear background
            if (that.imgBackGround) {
                tm.anim.Tween().fromTo(that.imgBackGround, { alpha: 1.0 }, { alpha: 0.0 }, 500, null).on("finish", (function (self, background) {
                    return function (e) {
                        that.removeChild(background);
                        //                delete self.background;
                    };
                })(that, that.imgBackGround)).start();
            }
            // stop BGM
            this._bgmPlayer.stop();
            // clear message
            that.lblMessage.text = '';
        };
        return NovelPlayer;
    }());
    WrtGame.NovelPlayer = NovelPlayer;
})(WrtGame || (WrtGame = {}));
/**
 * 物理的なイベントを処理する関数群
 */
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    function whichDown() {
        return function (event) {
            return [event.keyCode, WrtGame.KEY_DOWN];
        };
    }
    function whichUp() {
        return function (event) {
            return [event.keyCode, WrtGame.KEY_UP];
        };
    }
    function keyCodeIs(keyCodes) {
        return function (event) {
            return _.contains(keyCodes, event.keyCode);
        };
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
    function initMapMovementEventHandler() {
        var gameState = WrtGame.GameState.getInstance();
        var allowedStateKeys = gameState.allowedStateKeyCodes;
        return keyStateProperty(allowedStateKeys);
    }
    WrtGame.initMapMovementEventHandler = initMapMovementEventHandler;
    function initUiEventHandler() {
        var gameState = WrtGame.GameState.getInstance();
        var allowedUiKeys = gameState.allowedUiKeyCodes;
        return keyProperty(allowedUiKeys);
    }
    WrtGame.initUiEventHandler = initUiEventHandler;
    function preventDefaultArrowKey() {
        document.onkeydown = function (e) {
            // 矢印キーが押されている場合は
            if (37 <= e.keyCode && e.keyCode <= 40) {
                // キーボード操作をキャンセルする
                if (e.preventDefault) {
                    // デフォルトの動作を無効化する
                    e.preventDefault();
                }
                else {
                    // デフォルトの動作を無効化する（アタッチイベント利用時や、InternetExplorer 8 以前の場合）
                    e.keyCode = 0;
                    return false;
                }
            }
        };
    }
    WrtGame.preventDefaultArrowKey = preventDefaultArrowKey;
    function enableDefaultArrowKey() {
        document.onkeydown = function (e) {
            return true;
        };
    }
    WrtGame.enableDefaultArrowKey = enableDefaultArrowKey;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    var SceneManager = (function () {
        function SceneManager() {
            this._scenes = {};
            this._currentSceneName = null;
        }
        SceneManager.getInstance = function () {
            if (SceneManager._instance == null) {
                SceneManager._instance = new SceneManager();
            }
            return SceneManager._instance;
        };
        SceneManager.prototype.addScene = function (key, scene, switchScene) {
            if (switchScene === void 0) { switchScene = true; }
            this._scenes[key] = scene;
            if (switchScene) {
                this._currentSceneName = key;
            }
        };
        SceneManager.prototype.getScene = function (key) {
            return this._scenes[key];
        };
        SceneManager.prototype.switchScene = function (key) {
            this._currentSceneName = key;
        };
        SceneManager.prototype.getCurrentScene = function () {
            return this._scenes[this._currentSceneName];
        };
        return SceneManager;
    }());
    WrtGame.SceneManager = SceneManager;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    /**
     *  UI Operation Class
     */
    var UiOperation = (function () {
        function UiOperation() {
        }
        UiOperation.getInstance = function () {
            if (UiOperation._instance == null) {
                UiOperation._instance = new UiOperation();
            }
            return UiOperation._instance;
        };
        UiOperation.prototype.init = function (logicalUiCommandProperty) {
            logicalUiCommandProperty.onValue(function (value) {
                var uiOperation = MongoCollections.UiOperations.findOne();
                if (value === WrtGame.L_UI_NO_MOVE || value === WrtGame.L_UI_PUSH_OK || value === WrtGame.L_UI_PUSH_CANCEL) {
                    var times = 0;
                }
                else {
                    var times = uiOperation.times + 1;
                }
                var attributes = {
                    operation: value,
                    times: times
                };
                MongoCollections.UiOperations.update(uiOperation._id, { $set: attributes }, function (error) {
                    if (error) {
                        // display the error to the user
                        alert(error.reason);
                    }
                });
            });
        };
        return UiOperation;
    }());
    WrtGame.UiOperation = UiOperation;
})(WrtGame || (WrtGame = {}));
var WrtGame;
(function (WrtGame) {
    eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
    /**
     *  マップ上の移動を処理するクラス
     */
    var UserFunctionsManager = (function () {
        function UserFunctionsManager() {
            this._acceptableFromUI = true;
        }
        UserFunctionsManager.getInstance = function () {
            if (UserFunctionsManager._instance == null) {
                UserFunctionsManager._instance = new UserFunctionsManager();
            }
            return UserFunctionsManager._instance;
        };
        /*
            private addScriptToPage(code:string) {
              var head = document.getElementsByTagName('head')[0];
              var script = document.createElement("script");
              script.setAttribute("type", "text/javascript");
              script.textContent = code;
              head.appendChild(script);
            }
        */
        UserFunctionsManager.prototype.loadSandboxCode = function (functionName) {
            var _this = this;
            var code = MongoCollections.Codes.findOne({ identifier: functionName });
            if (_.isUndefined(code)) {
                return;
            }
            /*
            window.WrtGame.UserFunctions = {};
      
            var newCode = 'window.WrtGame.UserFunctions.' + code.identifier + ' = ' + code.javascript;
            console.log(newCode);
      
            this.addScriptToPage(newCode);
            */
            var sandboxCode = "\n      // WebRPG\u30C4\u30FC\u30EB\u3078\u516C\u958B\u3059\u308BAPI\n      var api = {\n        doSandboxFunc: (value)=> {\n          gameLogic(value);\n        },\n        returnResult:(value)=> {\n          this.returnResult(value);\n        }\n      };\n      application.setInterface(api);\n\n      // \u975E\u540C\u671F\u51E6\u7406\u3092\u540C\u671F\u51E6\u7406\u306E\u3088\u3046\u306B\u66F8\u3051\u308B\u4ED5\u7D44\u307F\n      function async(genFunc) {\n        var gen = genFunc();\n\n        var result = gen.next();\n        chain(result);\n\n        function chain(result) {\n          if (result.done) {\n            return result.value;\n          }\n\n          var promise = result.value;\n          promise.then(function(val){\n            var result = gen.next(val);\n            chain(result);\n          }).catch(function(e){\n            var result = gen.throw(e);\n            return chain(result);\n          })\n        }\n      }\n      function callEngineMethod(methodName, value) {\n        var promise = new Promise((resolve, reject) => {\n          application.remote[methodName](value);\n          this.returnResult = function(value) {\n            resolve(value);\n          };\n        });\n\n        return promise;\n      }\n\n      // \u30E6\u30FC\u30B6\u30FC\u30B3\u30FC\u30C9\n      var gameLogic = (value)=> {\n        async(function*(){\n        ";
            sandboxCode += code.javascript;
            /*
                      var result = yield callEngineMethod('playNovelNext', value);
            //          application.remote.alert(result);
            //          var result = yield callEngineMethod('doEngineAPIFoo', result);
            //          application.remote.alert(result);
            */
            sandboxCode += "\n          callEngineMethod('tellPluginCodeFinished', true);\n        });\n      }\n      ";
            var that = this;
            var api = {
                alert: alert,
                playNovelNext: function (storyName) {
                    var novelPlayer = WrtGame.NovelPlayer.getInstance();
                    if (novelPlayer.loadStory(storyName, (void 0))) {
                        novelPlayer.playNext();
                    }
                    _this._jailedPlugin.remote.returnResult(0);
                },
                changePlayerIsMovable: function (value) {
                    var mapMovement = WrtGame.MapMovement.getInstance();
                    mapMovement.playerIsMovable = value;
                    _this._jailedPlugin.remote.returnResult(value);
                },
                tellPluginCodeFinished: function (value) {
                    that._acceptableFromUI = true;
                    _this._jailedPlugin.disconnect();
                },
                switchScene: function (value) {
                    var sm = WrtGame.SceneManager.getInstance();
                    if (value === 'dungeon') {
                        var dungeonScene = sm.getScene('dungeon');
                        sm.switchScene(value);
                        dungeonScene.fadeIn();
                        var mapMovement = WrtGame.MapMovement.getInstance();
                        mapMovement.playerIsMovable = true;
                    }
                    else {
                        sm.switchScene(value);
                    }
                }
            };
            this._jailedPlugin = new jailed.DynamicPlugin(sandboxCode, api);
        };
        UserFunctionsManager.prototype.execute = function (functionName, executor) {
            var _this = this;
            if (!this._acceptableFromUI && executor === 'UI') {
                return;
            }
            var mapMovement = WrtGame.MapMovement.getInstance();
            this.loadSandboxCode(functionName);
            this._jailedPlugin.whenConnected(function () {
                _this._jailedPlugin.remote.doSandboxFunc(1);
            });
        };
        Object.defineProperty(UserFunctionsManager.prototype, "acceptableFromUI", {
            set: function (flg) {
                this._acceptableFromUI = flg;
            },
            enumerable: true,
            configurable: true
        });
        return UserFunctionsManager;
    }());
    WrtGame.UserFunctionsManager = UserFunctionsManager;
})(WrtGame || (WrtGame = {}));

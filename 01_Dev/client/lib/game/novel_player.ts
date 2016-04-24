declare var WRT:any;
declare var tm:any;
declare var MongoCollections:any;
declare var RectangleShape:any;
declare var Label:any;
declare var LabelArea:any;
declare var Sprite:any;

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  export class NovelPlayer {
    private static _instance:NovelPlayer;
    private _phinaScene:any;
    private _currentPlayingStoryName:string = null;
    private _isPlaying:boolean = false;
    private _novelWasFinished = true;
    private _bgmPlayer:BgmPlayer = null;
    private _nextSceneId = null;
    private _getJustNextOrderScene = false;
    private _scenes:any = null;
    private _isWaitingChoice = false;
    public static getInstance():NovelPlayer
    {
      if(NovelPlayer._instance == null) {
        NovelPlayer._instance = new NovelPlayer();
      }
      return NovelPlayer._instance;
    }

    public init(callback:any) {
      var novelPlayerThis:NovelPlayer = this;

      this._bgmPlayer = BgmPlayer.getInstance();
      // シーンを定義
      phina.define("MainScene", {
        // 継承
        superClass: 'DisplayScene',

        init: function () {
          this.superInit({
            width: Game.SCREEN_WIDTH,  // 画面幅
            height: Game.SCREEN_HEIGHT,// 画面高さ
          });

          novelPlayerThis._phinaScene = this;

          // MessageWindow
          var imgMessageWindow = RectangleShape({
            fill: "#333377",
            stroke: "#003300",
            strokeWidth: 3,
            cornerRadius: 4
          }).addChildTo(this);
          imgMessageWindow.width = this.gridX.span(15);
          imgMessageWindow.height = this.gridY.span(6);
          //imgMessageWindow.setPosition(imgMessageWindow.width/2 + 20, Game.SCREEN_HEIGHT - imgMessageWindow.height/2 - 20);//);
          imgMessageWindow.setPosition(this.gridX.center(), this.gridY.span(12));
          imgMessageWindow.alpha = 0.5;

          imgMessageWindow.onclick = function(e){
            imgMessageWindow.visible = !imgMessageWindow.visible;
          };
          this.imgMessageWindow = imgMessageWindow;

          // MessageArea in the MessageWindow
          var lblMessage = LabelArea( "" ).addChildTo(imgMessageWindow);
          lblMessage.setPosition(0, 0);
          lblMessage.fill = "#ffffff";
          lblMessage.fontSize = 48;
          lblMessage.width = imgMessageWindow.width - 20;
          lblMessage.height = imgMessageWindow.height - 20;

          this.lblMessage = lblMessage;


          this.storyItemIndex = 0;
          var that = this;

          this.on('pointend', function(e) {
            if (novelPlayerThis._isPlaying) {
              novelPlayerThis.playNext();
            }
          });

          this.characters = [];

//          this.imgMessageWindow.visible = false;
//          this.lblMessage.visible = false;

          callback();
        },

        update: function (app) {
        //  novelPlayerThis._bgmPlayer.loop();
        }

      });
    }

    public clear() {
      var that = this._phinaScene;
      that.removeChildren();
    }

    public loadStory(StoryName, startSceneId) {
      if (!this._novelWasFinished) {
        return false;
      }

      var that = this._phinaScene;
      if(typeof that !== 'undefined') {
        that.storyItemIndex = 0;
        that.imgMessageWindow.visible = true;
        that.lblMessage.visible = true;
        that.lblMessage.text = '';
      }

      this._currentPlayingStoryName = StoryName;
      var that = this._phinaScene;
      var story = MongoCollections.Stories.find({title: StoryName}).fetch();

      if (_.isUndefined(story[0])) {
        return false;
      }

      var scenes = MongoCollections.StoryScenes.find({storyId: story[0]._id}, {sort: { order: 1 }}).fetch();
      for (var i=0; i<scenes.length; i++) {
        var storyItems = MongoCollections.StoryItems.find({sceneId: scenes[i]._id}, {sort: { order: 1 }}).fetch();
        for (var j=0; j<storyItems.length; j++) {
          if (storyItems[j].contentType === 'sentence') {
            storyItems[j].content = MongoCollections.Sentences.findOne({_id: storyItems[j].contentId});
          } else if (storyItems[j].contentType === 'background') {
            storyItems[j].content = MongoCollections.Backgrounds.findOne({_id: storyItems[j].contentId});
          } else if (storyItems[j].contentType === 'bgm') {
            storyItems[j].content = MongoCollections.Bgms.findOne({_id: storyItems[j].contentId});
          } else if (storyItems[j].contentType === 'soundEffect') {
            storyItems[j].content = MongoCollections.SoundEffects.findOne({_id: storyItems[j].contentId});
          }
        }
        scenes[i].storyItems = storyItems;
      }
      this._scenes = scenes;

      if (startSceneId) {
        this._nextSceneId = startSceneId;
      } else {
        this._nextSceneId = scenes[0]._id;
      }
      this._getJustNextOrderScene = false;

      this._isPlaying = true;
      this._novelWasFinished = false;

      return true;
    }

    public get currentPlayingStoryName() {
      return this._currentPlayingStoryName;
    }

    public offPlayer() {
      var that = this._phinaScene;
      that.imgMessageWindow.visible = false;
      that.lblMessage.visible = false;
      this._isPlaying = false;
    }

    private getCharacterHorizontalPosition(position) {
      switch(position) {
        case 'RightEdge': return Game.SCREEN_WIDTH * 4.5/5;
        case 'Right': return Game.SCREEN_WIDTH * 3.5/5;
        case 'Center': return Game.SCREEN_WIDTH * 2.5/5;
        case 'Left': return Game.SCREEN_WIDTH * 1.5/5;
        case 'LeftEdge': return Game.SCREEN_WIDTH * 0.5/5;
      }
    }

    private getCharacterHorizontalFlip(position) {
      switch(position) {
        case 'RightEdge': return 1;
        case 'Right': return 1;
        case 'Center': return 1;
        case 'Left': return -1;
        case 'LeftEdge': return -1;
      }
    }

    private getCharacterPositionIndex(position) {
      switch(position) {
        case 'RightEdge': return 0;
        case 'Right': return 1;
        case 'Center': return 2;
        case 'Left': return 3;
        case 'LeftEdge': return 4;
      }
    }


    private nextSentence(currentStoryItem) {
      var that = this._phinaScene;

      var characterImage = MongoCollections.CharacterImages.findOne({_id: currentStoryItem.content.characterImageId});
      var sentence = currentStoryItem.content;
      var characterPosIndex = this.getCharacterPositionIndex(sentence.position);

      // if there is somebody at new character's position.
      if(!_.isUndefined(that.characters[characterPosIndex])) {
        that.characters[characterPosIndex].remove(); // remove that old character from the stage,
        delete that.characters[characterPosIndex]; // and delete that old character.
      }

      // for each character position, if there is the same character as the new character, remove and delete the same character.
      that.characters.forEach(function(character, index, characters){
        if(_.isUndefined(characters[index])) {
          return;
        }
        if(characters[index].characterId === sentence.characterId) {
          characters[index].remove();
          delete characters[index];
        }
      });

      // display the new character.
      if(characterImage.portraitImageUrl !== '') {
        that.characters[characterPosIndex] = Sprite(characterImage.portraitImageUrl);
        that.characters[characterPosIndex].characterId = sentence.characterId;
        that.addChildAt(that.characters[characterPosIndex], 10);
        var characterScale = 1.15;
        var horizontalPosition = this.getCharacterHorizontalPosition(sentence.position);
        that.characters[characterPosIndex].setPosition(horizontalPosition, Game.SCREEN_HEIGHT-that.characters[characterPosIndex].height*characterScale/2);
        that.characters[characterPosIndex].setScale(characterScale * this.getCharacterHorizontalFlip(sentence.position),
            characterScale);
      }

      // display the new sentence text
      that.lblMessage.text = sentence.text;
    }

    private nextBackground(currentStoryItem) {
      var that = this._phinaScene;

      var backgroundImage = MongoCollections.BackgroundImages.findOne({_id: currentStoryItem.content.backgroundImageId});

      if(that.imgBackGround) {
        tm.anim.Tween().fromTo(that.imgBackGround, {alpha: 1.0}, {alpha: 0.0}, 500, null).on("finish",
          (function(self, background){
            return function (e) {
              that.removeChild(background)
//                delete self.background;
            };
          })(that, that.imgBackGround)
        ).start();
      }

      that.imgBackGround = Sprite(backgroundImage.imageUrl, Game.SCREEN_WIDTH, Game.SCREEN_HEIGHT);
      that.imgBackGround.setPosition(Game.SCREEN_WIDTH/2, Game.SCREEN_HEIGHT/2);
      that.addChildAt(that.imgBackGround, 0);
      tm.anim.Tween().fromTo(that.imgBackGround, {alpha: 0.0}, {alpha: 1.0}, 500, null).start();

    }

    private nextBgm(currentStoryItem) {
      var that = this._phinaScene;

      var bgmAudio = MongoCollections.BgmAudios.findOne({_id: currentStoryItem.content.bgmAudioId});

      if (bgmAudio.identifier === 'none') {
        this._bgmPlayer.stop();
      } else {
        var transitionTime = (currentStoryItem.content.transition === 'crossfade') ? 3000 : 0;
        this._bgmPlayer.play(bgmAudio.identifier, currentStoryItem.content.volume, transitionTime);
      }
    }

    private nextSoundEffect(currentStoryItem) {
      var that = this._phinaScene;

      var soundEffectAudio = MongoCollections.SoundEffectAudios.findOne({_id: currentStoryItem.content.soundEffectAudioId});

      var soundEffect = phina.asset.AssetManager.get("sound", soundEffectAudio.identifier);
      soundEffect.stop();
      soundEffect.volume = currentStoryItem.content.volume;
      soundEffect.play();
    }


    private nextScene() {
      var results = _.filter(this._scenes, (scene:any)=>{
        return scene._id === this._nextSceneId;
      });

      var matchedScene = results[0];

      if (this._getJustNextOrderScene) {
        var results_2 = _.filter(this._scenes, (scene:any)=>{
          return scene.order === matchedScene.order + 1;
        });

        return results_2[0];
      } else {
        return matchedScene;
      }
    }

    public playNext() {
      if (this._isWaitingChoice) {
        return;
      }

      var that = this._phinaScene;


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
          if (nextScene) { // if there is next scene
            that.storyItemIndex = 0;
            this._nextSceneId = nextScene._id
            this._getJustNextOrderScene = false;
            this.playNext(); // same as one more click screen.
            return; // the story is not over yet.
          }

          // 後片付けしてreturnする
          that.characters.forEach(function(character, index, characters){
            if(!_.isUndefined(characters[index])) {
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
          var mapMovement = MapMovement.getInstance();
          mapMovement.playerIsMovable = true;

          return;
        } else {
          // シーンに選択肢が１つ以上あれば
          if (this._isWaitingChoice) {
            return;
          }

          that.choiceLabelButtons = [];
          currentScene.choices.forEach((choice, i, choices)=>{
            var choiceLabelButton = Label( choice.sentence );
            choiceLabelButton.fill = 'white';
            choiceLabelButton.stroke = 'black';
            choiceLabelButton.fontSize = 48;
            choiceLabelButton.alpha = 1;
            choiceLabelButton.x = that.gridX.center();
            choiceLabelButton.y = that.gridY.center() + ((i-(choices.length-1)/2) * 100);
            choiceLabelButton.setInteractive(true);
            choiceLabelButton.on("pointend", ((index)=>{
              return (e)=> {
                console.log(""+index + ": " + currentScene.choices[index].goTo);
                this._nextSceneId = currentScene.choices[index].goTo;
                this._isWaitingChoice = false;
                that.storyItemIndex = 0;

                setTimeout(()=>{
                  if (that.choiceLabelButtons) {
                    that.choiceLabelButtons.forEach((choiceLabelButton)=>{
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


      if (that.storyItemIndex === 0 && currentScene.clear) { // when at the start point of the scene
        this.clearAllElements();
      }

      if (currentStoryItem.contentType === 'sentence') {
        this.nextSentence(currentStoryItem);
      } else if (currentStoryItem.contentType === 'background') {
        this.nextBackground(currentStoryItem);
      } else if (currentStoryItem.contentType === 'bgm') {
        this.nextBgm(currentStoryItem);
      } else if (currentStoryItem.contentType === 'soundEffect') {
        this.nextSoundEffect(currentStoryItem);
      }

      that.addChildAt(that.imgMessageWindow, 20);

      that.storyItemIndex++;

      if (!currentStoryItem.needClick) {
        this.playNext();
      }
    }

    private clearAllElements() {
      var that = this._phinaScene;

      // clear characters
      that.characters.forEach(function(character, index, characters){
        if(_.isUndefined(characters[index])) {
          return;
        }
        characters[index].remove();
        delete characters[index];
      });

      // clear background
      if(that.imgBackGround) {
        that.imgBackGround.tweener.set({
          alpha:1
        }).to({alpha: 0.0}, 500, 'linear').call(
          (function(self, background){
            return function (e) {
              that.removeChild(background)
//                delete self.background;
            };
          })(that, that.imgBackGround)
        ).start();
      }

      // stop BGM
      this._bgmPlayer.stop();

      // clear message
      that.lblMessage.text = '';
    }
  }
}

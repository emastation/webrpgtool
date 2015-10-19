declare var WRT:any;
declare var tm:any;
declare var MongoCollections:any;

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  export class NovelPlayer {
    private static _instance:NovelPlayer;
    private _tmMainScene:any;
    private _currentPlayingStoryName:string = null;
    private _isPlaying:boolean = false;
    private _novelWasFinished = true;
    public static getInstance():NovelPlayer
    {
      if(NovelPlayer._instance == null) {
        NovelPlayer._instance = new NovelPlayer();
      }
      return NovelPlayer._instance;
    }

    public init() {
      var novelPlayerThis:NovelPlayer = this;
      // シーンを定義
      tm.define("MainScene", {
        superClass: "tm.app.Scene",

        init: function () {
          var this_:any = this;
          this_.superInit();
          novelPlayerThis._tmMainScene = this;

          var canvas = tm.dom.Element("#tmlibCanvas");

          // MessageWindow
          var imgMessageWindow = tm.display.RoundRectangleShape(Game.SCREEN_WIDTH - 40, 250, {
            fillStyle: "#333377",
            strokeStyle: "#003300",
            lineWidth: 3
          });
          imgMessageWindow.setPosition(imgMessageWindow.width/2 + 20, Game.SCREEN_HEIGHT - imgMessageWindow.height/2 - 20);//);
          imgMessageWindow.alpha= 0.5;

          imgMessageWindow.onclick = function(e){
            imgMessageWindow.visible = !imgMessageWindow.visible;
          };
          this.imgMessageWindow = imgMessageWindow;

          // MessageArea in the MessageWindow
          var lblMessage = tm.ui.LabelArea( "" ).addChildTo(imgMessageWindow);
          lblMessage.setPosition(20, 20);
          lblMessage.setFillStyle("#ffffff");
          lblMessage.fontSize = 48;
          lblMessage.setWidth( imgMessageWindow.width - 10 );
          lblMessage.setHeight( imgMessageWindow.height - 10 );

          this.lblMessage = lblMessage;


          this.storyItemIndex = 0;
          var that = this;

          canvas.event.pointstart(function(e) {
            if (novelPlayerThis._isPlaying) {
              novelPlayerThis.playNext();
            }
          });

          this.characters = [];

          this.imgMessageWindow.visible = false;
          this.lblMessage.visible = false;

        },

        update: function (app) {

        }

      });
    }

    public clear() {
      var that = this._tmMainScene;
      that.removeChildren();
    }

    public loadStory(StoryName) {
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
      var story = MongoCollections.Stories.find({title: StoryName}).fetch();

      if (_.isUndefined(story[0])) {
        return false;
      }

      var scene = MongoCollections.StoryScenes.find({storyId: story[0]._id}).fetch();
      var storyItems = MongoCollections.StoryItems.find({sceneId: scene[0]._id}, {sort: { order: 1 }}).fetch();
      for (var i=0; i<storyItems.length; i++) {
        if (storyItems[i].contentType === 'sentence') {
          storyItems[i].content = MongoCollections.Sentences.findOne({_id: storyItems[i].contentId});
        } else if (storyItems[i].contentType === 'background') {
          storyItems[i].content = MongoCollections.Backgrounds.findOne({_id: storyItems[i].contentId});
        }
      }
      that.storyItems = storyItems;

      this._isPlaying = true;
      this._novelWasFinished = false;

      return true;
    }

    public get currentPlayingStoryName() {
      return this._currentPlayingStoryName;
    }

    public offPlayer() {
      var that = this._tmMainScene;
      that.imgMessageWindow.visible = false;
      that.lblMessage.visible = false;
      this._isPlaying = false;
    }

    private getCharacterHorizontalPosition(position) {
      switch(position) {
        case 'RightEdge': return Game.SCREEN_WIDTH * 4.5/5; break;
        case 'Right': return Game.SCREEN_WIDTH * 3.5/5; break;
        case 'Center': return Game.SCREEN_WIDTH * 2.5/5; break;
        case 'Left': return Game.SCREEN_WIDTH * 1.5/5; break;
        case 'LeftEdge': return Game.SCREEN_WIDTH * 0.5/5; break;
      }
    }

    private getCharacterHorizontalFlip(position) {
      switch(position) {
        case 'RightEdge': return 1; break;
        case 'Right': return 1; break;
        case 'Center': return 1; break;
        case 'Left': return -1; break;
        case 'LeftEdge': return -1; break;
      }
    }

    private getCharacterPositionIndex(position) {
      switch(position) {
        case 'RightEdge': return 0; break;
        case 'Right': return 1; break;
        case 'Center': return 2; break;
        case 'Left': return 3; break;
        case 'LeftEdge': return 4; break;
      }
    }

    public playNext() {
      var that = this._tmMainScene;

      // すでにStoryが終了していた場合は、後片付けしてreturnする
      if (_.isUndefined(that.storyItems[that.storyItemIndex])) {

        that.characters.forEach(function(character, index, characters){
          if(!_.isUndefined(characters[index])) {
            characters[index].remove();
            delete characters[index];
          }
        });
        that.imgMessageWindow.visible = false;
        this._novelWasFinished = true;
        var mapMovement = MapMovement.getInstance();
        mapMovement.playerIsMovable = true;

        return;
      }
      var currentStoryItem = that.storyItems[that.storyItemIndex];
      if (currentStoryItem.contentType === 'sentence') {
        var characterImage = MongoCollections.CharacterImages.findOne({_id: currentStoryItem.content.characterImageId});
        var sentence = that.storyItems[that.storyItemIndex].content;
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
          that.characters[characterPosIndex] = tm.display.Sprite(characterImage.portraitImageUrl);
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
      } else if (currentStoryItem.contentType === 'background') {
        // Background
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

        that.imgBackGround = tm.display.Sprite(backgroundImage.imageUrl, Game.SCREEN_WIDTH, Game.SCREEN_HEIGHT);
        that.imgBackGround.setPosition(Game.SCREEN_WIDTH/2, Game.SCREEN_HEIGHT/2);
        that.addChildAt(that.imgBackGround, 0);
        tm.anim.Tween().fromTo(that.imgBackGround, {alpha: 0.0}, {alpha: 1.0}, 500, null).start();
//        that.imgBackGroundOld = that.imgBackGround;
      }

      that.addChildAt(that.imgMessageWindow, 20);

      that.storyItemIndex++;
    }
  }
}

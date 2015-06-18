declare var WRT:any;
declare var tm:any;
declare var _:any;
declare var $:any;
declare var MongoCollections:any;
declare var CharacterImages:any;

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  export class NovelPlayer {
    private static _instance:NovelPlayer;
    public static getInstance():NovelPlayer
    {
      if(NovelPlayer._instance == null) {
        NovelPlayer._instance = new NovelPlayer();
      }
      return NovelPlayer._instance;
    }

    public init() {
      // シーンを定義
      tm.define("MainScene", {
        superClass: "tm.app.Scene",

        init: function () {
          var this_:any = this;
          this_.superInit();

          var story = MongoCollections.Stories.find({title: 'Game_1'}).fetch();

          if (_.isUndefined(story[0])) {
            return;
          }

          var scene = MongoCollections.StoryScenes.find({storyId: story[0]._id}).fetch();
          var storyItems = MongoCollections.StoryItems.find({sceneId: scene[0]._id}).fetch();
          this.sentences = [];
          for (var i=0; i<storyItems.length; i++) {
            this.sentences.push(MongoCollections.Sentences.find({_id: storyItems[i].contentId}).fetch()[0]);
          }



          var canvas = tm.dom.Element("#tmlibCanvas");


          //メッセージウィンドウ
          var imgMessageWindow = tm.display.RoundRectangleShape(Game.SCREEN_WIDTH - 40, 250, {
            fillStyle: "#333377",
            strokeStyle: "#003300",
            lineWidth: 3
          }).addChildTo(this);
          imgMessageWindow.setPosition(imgMessageWindow.width/2 + 20, Game.SCREEN_HEIGHT - imgMessageWindow.height/2 - 20);//);
          imgMessageWindow.alpha= 0.5;

          imgMessageWindow.onclick = function(e){
            imgMessageWindow.visible = !imgMessageWindow.visible;
          };

          //メッセージ
          var lblMessage = tm.display.Label( "" ).addChildTo(imgMessageWindow);
          lblMessage.setPosition(-imgMessageWindow.width/2 + 20, -imgMessageWindow.height/2 + 20);
          lblMessage.setAlign("left").setBaseline("top");
          lblMessage.setFillStyle("#ffffff");
          lblMessage.setFontSize(48);


          var sentenceIndex = 0;
          var that = this;

          canvas.event.pointstart(function(e) {
            if (_.isUndefined(that.sentences[sentenceIndex])) {
              if(!_.isUndefined(this.character)) {
                this.character.remove();
              }
              imgMessageWindow.visible = false;
              return;
            }

            var characterImage = CharacterImages.find({_id: that.sentences[sentenceIndex].characterImageId}).fetch()[0];

            if(!_.isUndefined(this.character)) {
              this.character.remove();
            }
            if(characterImage.portraitImageUrl === '') {
              return;
            }
            this.character = tm.display.Sprite(characterImage.portraitImageUrl);
            that.addChildAt(this.character, 0);
            var characterScale = 1.15;
            this.character.setPosition(1000, Game.SCREEN_HEIGHT-this.character.height*characterScale/2);
            this.character.setScale(characterScale, characterScale);

            lblMessage.text = that.sentences[sentenceIndex].text;

            ++sentenceIndex;
          });

        },

        update: function (app) {

        }


      });
    }
  }
}
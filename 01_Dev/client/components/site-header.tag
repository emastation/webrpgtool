<site-header>
  <div class="ui six item menu">
    <a if={!gameId} class={item: true, active: isTop} id="header-navlink-top" href="#">WebRPGTool</a>
    <a if={gameId} class={item: true, active: isTop} id="header-navlink-top" href="#game/{gameId}">{game.title}</a>
    <a class={item: true, active: isMaps, disable-link:!gameId} id="header-navlink-maps" href="#game/{gameId}/maps">マップ</a>
    <a class={item: true, active: isCodes, disable-link:!gameId} id="header-navlink-scripts" href="#game/{gameId}/codes">スクリプト</a>
    <a class={item: true, active: isStories, disable-link:!gameId} id="header-navlink-stories" href="#game/{gameId}/stories">ストーリー</a>
    <a class={item: true, active: isObjects, disable-link:!gameId} id="header-navlink-stories" href="#game/{gameId}/schemata">オブジェクト</a>
    <div class="item" id="loginButtonsDiv"></div>
  </div>

  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    this.isTop = opts.page === 'top';
    this.isMaps = opts.page === 'maps';
    this.isCodes = opts.page === 'codes';
    this.isStories = opts.page === 'stories';
    this.isObjects = opts.page === 'objects';

    this.on('mount', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;

      var loginButtons = window.document.getElementById('loginButtonsDiv');
      if(loginButtons) {
        Blaze.render(Template.loginButtons, loginButtons);
      }
      Meteor.subscribe('games', {
        onReady: ()=>{
          this.getGame();
        }
      });
    });

    this.on('update', ()=> {
      this.getGame();
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
    });

    getGame() {
      this.game = MongoCollections.Games.findOne(this.gameId);
      this.update();
    }

    Meteor.autorun(()=> {
      this.getGame();
    });

  </script>

  <style scoped>
    #login-dropdown-list {
      right: 0px !important;
      left :auto;
    }
    .disable-link {
       pointer-events: none;
       color: lightgray !important;
    }
  </style>
</site-header>

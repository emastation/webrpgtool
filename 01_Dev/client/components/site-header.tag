<site-header>
  <div class="ui six item menu">
    <a class={item: true, active: isTop} id="header-navlink-top" href="#">WebRPGTool</a>
    <a class={item: true, active: isMaps, disable-link:!gameId} id="header-navlink-maps" href="#maps">マップ</a>
    <a class={item: true, active: isCodes, disable-link:!gameId} id="header-navlink-scripts" href="#game/{gameId}/codes">スクリプト</a>
    <a class={item: true, active: isStories, disable-link:!gameId} id="header-navlink-stories" href="#stories">ストーリー</a>
    <a class={item: true, active: isObjects, disable-link:!gameId} id="header-navlink-stories" href="#schemata">オブジェクト</a>
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
      var loginButtons = window.document.getElementById('loginButtonsDiv');
      if(loginButtons) {
        Blaze.render(Template.loginButtons, loginButtons);
      }
    });

    this.on('update', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
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

<site-top>
  <div if={!!gameId} class="ui segment"><a href="#">▲ WebRPGToolトップへ戻る</a></div>
  <game-submit if={isLogin}></game-submit>
  <games-list is_login={isLogin}></games-list>

  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false;
      this.update();
    });

    this.on('mount', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
      this.update();
    });

    this.on('update', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
      this.update();
    });
  </script>
</site-top>

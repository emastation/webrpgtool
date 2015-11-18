<maps-top>
  <map-submit if={isLogin} game_id={gameId}></map-submit>
  <maps-list game_id={gameId}></maps-list>
  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    Meteor.autorun(()=> {
      self.isLogin = Meteor.user();
      this.update();
    });

    this.on('update', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
    });

  </script>
</maps-top>

<objects-page>
  <object-submit if={isLogin} schema_id={opts.schema_id} game_id={gameId} />
  <objects-list schema_id={opts.schema_id} is_login={isLogin} game_id={gameId} />
  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false;
      this.update();
    });

    this.on('mount', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
    });

    this.on('update', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
    });
  </script>
</objects-page>

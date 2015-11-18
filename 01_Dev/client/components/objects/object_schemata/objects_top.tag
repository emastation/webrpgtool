<objects-top>
  <object-schema-submit if={isLogin} game_id={gameId} />
  <object-schemata-list game_id={gameId} />
  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    Meteor.autorun(()=> {
      self.isLogin = Meteor.user();
      this.update();
    });

    this.on('mount', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
    });

    this.on('update', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
    });
  </script>
</objects-top>

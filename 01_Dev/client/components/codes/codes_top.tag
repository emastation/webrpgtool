<codes-top>
  <div class="ui segment">
    <a href="#game/{gameId}/code/new" class="ui button">新規投稿</a>
  </div>
  <codes-list game_id={gameId}/>

  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES
    this.on('update', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
    });
  </script>
</codes-top>

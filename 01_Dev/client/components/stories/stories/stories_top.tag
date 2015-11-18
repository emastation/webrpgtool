<stories-top>
  <story-submit game_id={gameId} />
  <stories-list game_id={gameId} />
  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    this.on('mount', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
      this.update();
    });

    this.on('update', ()=> {
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
      this.update();
    });
  </script>
</stories-top>

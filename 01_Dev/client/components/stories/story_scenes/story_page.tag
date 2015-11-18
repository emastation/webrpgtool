<story-page>
  <story-scene-submit story_id={opts.story_id} game_id={gameId} />
  <story-scenes-list story_id={opts.story_id} game_id={gameId} />
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
</story-page>

<games-list>
  <game-item each={games} game={this}></game-item>

  <script>
    this.on('mount', ()=>{
      Meteor.subscribe('games');
    });

    Meteor.autorun(()=> {
      this.games = MongoCollections.Games.find().fetch();
      this.update();
    });
  </script>
</games-list>

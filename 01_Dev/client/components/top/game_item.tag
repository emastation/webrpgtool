<game-item>
  <div class="ui grid segment">
    <div class="fifteen wide column">
      <p>{opts.game.title}　（識別子：{opts.game.identifier}）created by {opts.game.author}</p>
    </div>
    <div class="one wide column">
      <button if={opts.is_login} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteThisGame}>
        <i class="remove icon"></i>
      </button>
    </div>
  </div>

  <script>
    deleteThisGame() {
      Meteor.call('deleteGame', opts.game._id, function(error, result) { 
        if (error) {
          return alert(error.reason);
        }

        if (result.wrongUser) {
          alert('違う人のゲームは削除できません。');
        } else if (result.wrongUser) {
          alert('違う人のゲームは削除できません。');
        }
      });
    }
  </script>
</game-item>

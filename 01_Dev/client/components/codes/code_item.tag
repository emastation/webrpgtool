<code-item>
  <div class="ui segment">
    <p>{opts.code.name}　（識別子：{opts.code.identifier}）</p>
    <p>JavaScript</p>
    <p class="ui segment">{opts.code.javascript}</p>
    <p><a href="#game/{opts.game_id}/code/{opts.code._id}/edit" class="ui button">編集</a>
      <a href="#" class="ui button" onclick={deleteCode.bind(this, opts.code._id)}>削除</a></p>
  </div>

  <script>
    deleteCode(id) {
      if (confirm("Delete this code?")) {
        Meteor.call('deleteCode', id);
      }
    }
  </script>
</code-item>

<map-item>
  <div class="ui segment">
    <h3>{opts.map.title}</h3>
    <p>
      横幅：{opts.map.width}　高さ：{opts.map.height}
    </p>
    <h4>タイルタイプ文字列</h4>
    <p>
      {opts.map.type_array}
    </p>
    <h4>タイル高さ文字列</h4>
    <p>
      {opts.map.height_array}
    </p>
    <h4>スクリプト文字列</h4>
    <p>
      {opts.map.script_array}
    </p>
    <p><br />
      submitted by {opts.map.author}&nbsp;
      <a href="javascript:void(0)" onclick={goToGamePage.bind(opts.map._id)}>ゲームプレイ</a>&nbsp;
      <a href="#map/{opts.map._id}/edit" if={isLogin} onclick={goToMapEdit}>編集&nbsp;</a>
      <a href="#map/{opts.map._id}" onclick={goToMapPage(opts.map._id)} class="discuss btn btn-default">詳細</a>
    </p>
  </div>

  <script>
    Meteor.autorun(()=> {
      self.isLogin = Meteor.user();
      this.update();
    });
  </script>

  <style scoped>
    :scope>div {
      margin: 10px !important;
    }
  </style>
</map-item>

<code-item>
  <div class="ui segment">
    <p>{opts.code.name}　（識別子：{opts.code.identifier}）</p>
    <p>JavaScript</p>
    <p class="ui segment">{opts.code.javascript}</p>
    <p><a href="#" class="ui button" onclick={this.goToEditPage.bind(this, this.props.code._id)}>編集</a>
      <a href="#" class="ui button" onclick={this.deleteCode.bind(this, this.props.code._id)}>削除</a></p>
  </div>
</code-item>

<object-schema-item>
  <div class="ui segment">
    <h3>{opts.object_schema.name} ({opts.object_schema.identifier})</h3>
    <h4>継承</h4>
    <p>
      {opts.object_schema.extend}
    </p>
    <h4>アトリビュート</h4>
    <div each={opts.object_schema.attributes} class="ui segment">
      {this.name}
    </div>
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
</object-schema-item>

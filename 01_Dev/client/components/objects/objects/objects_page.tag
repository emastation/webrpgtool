<objects-page>
  <object-submit if={isLogin} schema_id={opts.schema_id}></object-submit>
  <objects-list schema_id={opts.schema_id}></objects-list>
  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    Meteor.autorun(()=> {
      self.isLogin = Meteor.user();
      this.update();
    });
  </script>
</objects-page>

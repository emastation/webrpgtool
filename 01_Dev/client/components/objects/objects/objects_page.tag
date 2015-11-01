<objects-page>
  <object-submit if={isLogin} schema_id={opts.schema_id}></object-submit>
  <objects-list schema_id={opts.schema_id} is_login={isLogin}></objects-list>
  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false;
      this.update();
    });
  </script>
</objects-page>

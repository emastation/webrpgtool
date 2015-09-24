<site-header>
  <div class="ui five item menu">
    <a class={item: true, active: isTop} id="header-navlink-top" href="#">WebRPGTool</a>
    <a class={item: true, active: isMaps} id="header-navlink-maps" href="#maps">マップ</a>
    <a class={item: true, active: isScripts} id="header-navlink-scripts" href="#">スクリプト</a>
    <a class={item: true, active: isStories} id="header-navlink-stories" href="#">ストーリー</a>
    <a class="item"></a>
  </div>

  <script>
    this.isTop = opts.page === 'top';
    this.isMaps = opts.page === 'maps';
    this.isScripts = opts.page === 'scripts';
    this.isStories = opts.page === 'stories';

  </script>
</site-header>

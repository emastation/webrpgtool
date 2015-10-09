<submit-master>
  <div id="submit-master-inner">
    <div class="ui top attached tabular menu">
      <a class={item:true, active: currentTabName === 'sentence' } onclick={switchTab.bind(this, 'sentence')}>
        セリフ
      </a>
      <a class={item:true, active: currentTabName === 'background' } onclick={switchTab.bind(this, 'background')}>
        背景
      </a>
      <a class={item:true, active: currentTabName === 'bgm' } onclick={switchTab.bind(this, 'bgm')}>
        BGM
      </a>
    </div>
    <div class="ui bottom attached segment">
      <sentence-submit if={currentTabName === 'sentence'} scene_id={opts.scene_id} />
      <background-submit if={currentTabName === 'background'} scene_id={opts.scene_id} />
    </div>
  </div>

  <script>
    this.currentTabName = 'sentence';

    switchTab(tabName) {
      this.currentTabName = tabName;
    }
  </script>

  <style scoped>
    #submit-master-inner {
      margin-top: 5px;
      margin-left: 5px;
      margin-right: 5px;
    }
  </style>
</submit-master>

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
      <a class={item:true, active: currentTabName === 'soundEffect' } onclick={switchTab.bind(this, 'soundEffect')}>
        サウンドエフェクト
      </a>
    </div>
    <div class="ui bottom attached segment">
      <sentence-submit if={currentTabName === 'sentence'} scene_id={opts.scene_id} />
      <background-submit if={currentTabName === 'background'} scene_id={opts.scene_id} />
      <bgm-submit if={currentTabName === 'bgm'} scene_id={opts.scene_id} />
      <sound-effect-submit if={currentTabName === 'soundEffect'} scene_id={opts.scene_id} />
    </div>
  </div>

  <script>
    this.currentTabName = 'sentence';
    window.wrtSubmitMasterRiotComponent = this;

    switchTab(tabName) {
      this.currentTabName = tabName;
    }

    var _capitalize = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    this.on('insertStoryItem', (order)=>{
      var capitalizedTabName = _capitalize(this.currentTabName);
      window['wrt' + capitalizedTabName + 'SubmitRiotComponent'].trigger('insert' + capitalizedTabName, order);
    });
  </script>

  <style scoped>
    #submit-master-inner {
      margin-top: 5px;
      margin-left: 5px;
      margin-right: 5px;
    }
  </style>
</submit-master>

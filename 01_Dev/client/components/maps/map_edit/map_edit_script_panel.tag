<map-edit-script-panel>
  <div class="eight wide column">
    <div class="fields">
      <div class="clearfix">
        <div class="field" style="float: left;">
          <label>スクリプト</label>
          <select class="ui search dropdown">
            <option each={opts.codes} value={identifier}>{identifier} (name)</option>
          </select>
        </div>
        <div class="field">
          <a id="script_0" href="javascript:void(0)">
            <div data-id="0" class="control-tile" style="background-image: url(/material/typeTypeImage/scriptTile.png); marginLeft: 10px" onclick={onScriptButtonClick}></div>
          </a>
          <a id="script_1" href="javascript:void(0)">
            <div data-id="1" class="control-tile" style="background-image: url(/material/typeTypeImage/scriptTile.png); marginLeft: 10px; background-position: -64px 0px" onclick={onScriptButtonClick}></div>
          </a>
        </div>
      </div>
      <div class="field">
        <label>JavaScript</label>
        <div class="ui segment">
          <p>{selectedCode.javascript}</p>
        </div>
      </div>
    </div>
  </div>

  <script>

  this.setCurrentTileScriptName = (scriptFlg, scriptName)=> {
    WRT.map.mapManager.setCurrentTileScriptName((scriptFlg === 1 & scriptName !== null) ? scriptName : '0');
  },

  this.scriptSelectChange = (value, text)=> {
    console.log(value);
    this.selectedScriptIdentifier = value;

    var hitCodes = _.filter(opts.codes, (code)=>{
      return code.identifier === value;
    });

    if (typeof hitCodes[0] !== "undefined") {
      this.selectedCode = hitCodes[0];
    }
    this.update();

    this.setCurrentTileScriptName(this.scriptFlg, value);
  }

  onScriptButtonClick(e) {
    e.preventDefault();

    WRT.map.mapManager.switchMapLayer(4);
    var scriptFlg = $(e.target).data('id');
    WRT.map.mapManager.setCurrentTileIndex(scriptFlg);
    this.setCurrentTileScriptName(scriptFlg, this.selectedScriptIdentifier);

    this.scriptFlg = scriptFlg;
    this.update();

    mapEditUpdateSelectedClass(e.target);
  }

  this.on('mount', ()=>{

    $('.ui.dropdown').dropdown({
      onChange: this.scriptSelectChange
    });

    this.selectedScriptIdentifier = (opts.codes.length > 0) ? opts.codes[0].identifier : null;
    this.scriptFlg = 0; // 0: no script is selected    1: a script is selected
  });

  this.on('updated', ()=>{
    "use strict"

    // select the first option at first
    if (typeof opts.codes !== "undefined" && opts.codes.length !== 0 && !_.isUndefined($('.ui.dropdown').dropdown)) {
      let currentVal = $('.ui.dropdown').dropdown('get value');
      if (_.isNull(currentVal) || currentVal === opts.codes[0].identifier) {
        setTimeout(()=>{
          $('.ui.dropdown').dropdown('set selected', opts.codes[0].identifier)
        }, 0);
        this.selectedCode = opts.codes[0];
        this.selectedScriptIdentifier = opts.codes[0].identifier;
        this.update();
      }
    }

  });
  </script>

  <style scoped>
    .control-tile {
      float: left;
      width: 64px;
      height: 64px;
    }

    .control-tile.selected {
      border: solid 2px red;
    }
  </style>
</map-edit-script-panel>

var UiScreens = MongoCollections.UiScreens;
if (UiScreens.find().count() === 0) {
  UiScreens.insert({
    identifier: 'system',
    uiTables: ['system-command', 'system-status', 'system-characters', 'system-magic'],
    firstUiTable: 'system-command',
    otherVisibleUiTables: ['system-status']
  });
  UiScreens.insert({
    identifier: 'help',
    uiTables: ['help-main'],
    firstUiTable: 'help-main',
    otherVisibleUiTables: []
  });
}

var UiTables = MongoCollections.UiTables;
if (UiTables.find().count() === 0) {
  UiTables.insert({
    identifier: 'system-status',
    title: 'ステータス',
    records: [
      {
        columns:[
          {
            title: '主人公'
          },
          {
            title: 'ヒーラー'
          },
          {
            title: 'アタッカー'
          }
        ]
      },
      {
        columns:[
          {
            title: '30',
            backUiTable: true
          },
          {
            title: '40'
          },
          {
            title: '50'
          }
        ]
      }
    ]
  });

  UiTables.insert({
    identifier: 'system-command',
    title: 'システムコマンド',
    records: [
      {
        columns:[
          {
            title: 'ノベルを進める',
            functionName: 'play_story2_next'
          }
        ]
      },
      {
        columns:[
          {
            title: 'ステータスをみる',
            nextUiTable: 'system-characters'
          }
        ]
      },
      {
        columns:[
          {
            title: '魔法をみる',
            nextUiTable: 'system-magic'
          }
        ]
      },
      {
        columns:[
          {
            title: 'ヘルプへ',
            goToUiScreen: 'help'
          }
        ]
      }
    ]
  });

  UiTables.insert({
    identifier: 'system-characters',
    title: 'キャラクター',
    records: [
      {
        columns:[
          {
            title: '魔法へ',
            nextUiTable: 'system-magic'
          },
          {
            title: 'その他'
          },
          {
            title: 'その他'
          }
        ]
      },
      {
        columns:[
          {
            title: '戻る',
            backUiTable: true
          },
          {
            title: 'その他'
          },
          {
            title: 'その他'
          }
        ]
      }
    ]
  });

  UiTables.insert({
    identifier: 'system-magic',
    title: '魔法',
    records: [
      {
        columns:[
          {
            title: '本当のステータスをみる',
            nextUiTable: 'system-status'
          }
        ]
      },
      {
        columns:[
          {
            title: 'システムコマンドへ',
            nextUiTable: 'system-command'
          }
        ]
      },
      {
        columns:[
          {
            title: '戻る',
            backUiTable: true
          }
        ]
      },
      {
        columns:[
          {
            title: 'ヘルプへ',
            goToUiScreen: 'help'
          }
        ]
      }
    ]
  });

  UiTables.insert({
    identifier: 'help-main',
    title: 'ヘルプ',
    records: [
      {
        columns:[
          {
            title: '初めての方へ'
          }
        ]
      },
      {
        columns:[
          {
            title: 'システムへ',
            goToUiScreen: 'system'
          }
        ]
      }
    ]
  });
}

wrt_fixtureLoadedCount = (typeof wrt_fixtureLoadedCount !== "undefined") ? wrt_fixtureLoadedCount++ : 0;

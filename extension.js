const vscode = require('vscode')

const keymapsId = 'banjiao.keymaps'
const switchId = 'banjiao.switch'
let config, keymapsConfig, switchConfig

function transformHalfChar (char) {
  for (let index = 0; index < keymapsConfig.length; index++) {
    if (keymapsConfig[index].full === char) {
      return keymapsConfig[index].half
    }
  }

  return char
}

function replaceChar (event) {
  if (vscode.window.activeTextEditor === undefined) return

  let charRange

  vscode.window.activeTextEditor.edit(
    editBuilder => {
      event.contentChanges.forEach(content => {
        const char = content.text
        let halfChar, prevChar

        if (content.range.start.character > 0) {
          prevChar = event.document.getText(new vscode.Range(content.range.start.translate(0, -1), content.range.start))
        }

        // ^ 全角 …… 会触发两次change事件
        if (char === '…' && char === prevChar) {
          halfChar = transformHalfChar('…')
          charRange = new vscode.Range(content.range.start.translate(0, -1), content.range.end.translate(0, 1))
          editBuilder.replace(charRange, halfChar)
        }

        // _ 全角 —— 会触发两次change事件
        if (char === '—' && char === prevChar) {
          halfChar = transformHalfChar('—')
          charRange = new vscode.Range(content.range.start.translate(0, -1), content.range.end.translate(0, 1))
          editBuilder.replace(charRange, halfChar)
        }

        // 其他全角字符
        if (char !== '…' && char !== '—') {
          halfChar = transformHalfChar(char)

          if (halfChar !== char) {
            charRange = new vscode.Range(content.range.start, content.range.end.translate(0, 1))
            editBuilder.replace(charRange, halfChar)
          }
        }
      })
    },
    { undoStopBefore: false }
  ).then(fulfilled => {
    if (fulfilled === false) {
      replaceChar(event)
    }
  })
}

function getStatusBarItemLabel () {
  return switchConfig ? '半角' : '全角'
}

function getStatusBarItemTooltip () {
  return new vscode.MarkdownString(switchConfig ? '点击关半角 `Alt+B`' : '点击开半角 `Alt+B`')
}

function activate ({ subscriptions }) {
  config = vscode.workspace.getConfiguration()
  keymapsConfig = config.get(keymapsId)
  switchConfig = config.get(switchId)

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBarItem.command = switchId
  statusBarItem.text = getStatusBarItemLabel()
  statusBarItem.tooltip = getStatusBarItemTooltip()
  statusBarItem.show()
  subscriptions.push(statusBarItem)

  const switchCommand = vscode.commands.registerCommand(switchId, () => {
    const triggerSwitch = !switchConfig
    config.update(switchId, triggerSwitch, vscode.ConfigurationTarget.Global)
  })
  subscriptions.push(switchCommand)

  vscode.workspace.onDidChangeTextDocument(event => {
    if (switchConfig) {
      replaceChar(event)
    }
  })

  vscode.workspace.onDidChangeConfiguration(() => {
    config = vscode.workspace.getConfiguration()
    keymapsConfig = config.get(keymapsId)
    switchConfig = config.get(switchId)

    statusBarItem.text = getStatusBarItemLabel()
    statusBarItem.tooltip = getStatusBarItemTooltip()
  })

  console.info('activate banjiao.')
}

function deactivate () {}

module.exports = {
  activate,
  deactivate
}

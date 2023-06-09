const vscode = require('vscode')

const keymapsId = 'banjiao.keymaps'
const switchId = 'banjiao.switch'
let config, keymapsConfig, switchConfig

function getHalfWidthChar (char) {
  for (let i = 0; i < keymapsConfig.length; i++) {
    if (keymapsConfig[i].full === char) {
      return keymapsConfig[i].half
    }
  }

  return char
}

function convertToHalfWidthChar (event) {
  if (vscode.window.activeTextEditor === undefined) return

  let charRange

  vscode.window.activeTextEditor.edit(
    editBuilder => {
      event.contentChanges.forEach(content => {
        // 只处理单符号
        if (content.text.length === 1) {
          const char = content.text
          let halfChar, prevChar

          if (content.range.start.character > 0) {
            prevChar = event.document.getText(new vscode.Range(content.range.start.translate(0, -1), content.range.start))
          }

          // ^ 全角 …… 会触发两次change事件
          if (char === '…' && char === prevChar) {
            halfChar = getHalfWidthChar(char)
            charRange = new vscode.Range(content.range.start.translate(0, -1), content.range.end.translate(0, 1))
            editBuilder.replace(charRange, halfChar)
          }

          // _ 全角 —— 会触发两次change事件
          if (char === '—' && char === prevChar) {
            halfChar = getHalfWidthChar(char)
            charRange = new vscode.Range(content.range.start.translate(0, -1), content.range.end.translate(0, 1))
            editBuilder.replace(charRange, halfChar)
          }

          // 其他全角字符
          if (char !== '…' && char !== '—') {
            halfChar = getHalfWidthChar(char)

            if (halfChar !== char) {
              charRange = new vscode.Range(content.range.start, content.range.end.translate(0, 1))
              editBuilder.replace(charRange, halfChar)
            }
          }
        }
      })
    },
    {
      undoStopAfter: false,
      undoStopBefore: false
    }
  ).then(fulfilled => {
    if (fulfilled === false) {
      convertToHalfWidthChar(event)
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

  const switchCommand = vscode.commands.registerCommand(switchId, () => {
    const triggerSwitch = !switchConfig
    config.update(switchId, triggerSwitch, vscode.ConfigurationTarget.Global)
  })
  subscriptions.push(switchCommand)

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBarItem.command = switchId
  statusBarItem.text = getStatusBarItemLabel()
  statusBarItem.tooltip = getStatusBarItemTooltip()
  subscriptions.push(statusBarItem)

  if (vscode.workspace.textDocuments.length > 0) {
    statusBarItem.show()
  }

  vscode.window.onDidChangeActiveTextEditor(textEditor => {
    if (textEditor) {
      statusBarItem.show()
    } else {
      statusBarItem.hide()
    }
  })

  vscode.workspace.onDidChangeConfiguration(() => {
    config = vscode.workspace.getConfiguration()
    keymapsConfig = config.get(keymapsId)
    switchConfig = config.get(switchId)

    statusBarItem.text = getStatusBarItemLabel()
    statusBarItem.tooltip = getStatusBarItemTooltip()
  })

  vscode.workspace.onDidChangeTextDocument(event => {
    if (switchConfig) {
      convertToHalfWidthChar(event)
    }
  })

  console.info('已激活半角插件')
}

function deactivate () {}

module.exports = {
  activate,
  deactivate
}

const vscode = require('vscode')

function transformHalfChar (char) {
  const keymaps = vscode.workspace.getConfiguration().get('banjiao.keymaps')

  for (let index = 0; index < keymaps.length; index++) {
    if (keymaps[index].full === char) {
      return keymaps[index].half
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

function activate ({ subscriptions }) {
  const getStatusBarItemLabel = (switchConfig) => switchConfig ? '半角' : '全角'
  const getStatusBarItemTooltip = (switchConfig) => new vscode.MarkdownString(switchConfig ? '点击关半角 `Alt+B`' : '点击开半角 `Alt+B`')

  const switchNamespace = 'banjiao.switch'
  let config = vscode.workspace.getConfiguration()
  let switchConfig = config.get(switchNamespace)

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBarItem.command = switchNamespace
  statusBarItem.text = getStatusBarItemLabel(switchConfig)
  statusBarItem.tooltip = getStatusBarItemTooltip(switchConfig)
  statusBarItem.show()
  subscriptions.push(statusBarItem)

  const switchCommand = vscode.commands.registerCommand(switchNamespace, () => {
    const triggerSwitch = !switchConfig
    config.update(switchNamespace, triggerSwitch, vscode.ConfigurationTarget.Global)
  })
  subscriptions.push(switchCommand)

  vscode.workspace.onDidChangeTextDocument(event => {
    if (switchConfig) {
      replaceChar(event)
    }
  })

  vscode.workspace.onDidChangeConfiguration(() => {
    config = vscode.workspace.getConfiguration()
    switchConfig = config.get(switchNamespace)
    statusBarItem.text = getStatusBarItemLabel(switchConfig)
    statusBarItem.tooltip = getStatusBarItemTooltip(switchConfig)
  })

  console.info('activate banjiao.')
}

function deactivate () {}

module.exports = {
  activate,
  deactivate
}

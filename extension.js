const vscode = require('vscode')

const keymapsId = 'banjiao.keymaps'
const switchId = 'banjiao.switch'
let config, keymapsConfig, switchConfig

function convertToHalfWidthChar (text) {
  if (text.length === 1) {
    for (let i = 0; i < keymapsConfig.length; i++) {
      if (keymapsConfig[i].full === text) {
        return keymapsConfig[i].half
      }
    }

    return text
  } else {
    let newText = ''

    for (let i = 0; i < text.length; i++) {
      newText += convertToHalfWidthChar(text[i])
    }

    return newText
  }
}

function textEditorEdit (event) {
  if (vscode.window.activeTextEditor === undefined) return

  let charRange

  vscode.window.activeTextEditor.edit(
    editBuilder => {
      event.contentChanges.forEach(content => {
        if (content.text.length === 1) {
          const char = content.text
          let halfChar, prevChar

          if (content.range.start.character > 0) {
            prevChar = event.document.getText(new vscode.Range(content.range.start.translate(0, -1), content.range.start))
          }

          // ^ 全角 …… 会触发两次change事件
          if (char === '…' && char === prevChar) {
            halfChar = convertToHalfWidthChar(char)
            charRange = new vscode.Range(content.range.start.translate(0, -1), content.range.end.translate(0, 1))
            editBuilder.replace(charRange, halfChar)
          }

          // _ 全角 —— 会触发两次change事件
          if (char === '—' && char === prevChar) {
            halfChar = convertToHalfWidthChar(char)
            charRange = new vscode.Range(content.range.start.translate(0, -1), content.range.end.translate(0, 1))
            editBuilder.replace(charRange, halfChar)
          }

          // 其他全角字符
          if (char !== '…' && char !== '—') {
            halfChar = convertToHalfWidthChar(char)

            if (halfChar !== char) {
              charRange = new vscode.Range(content.range.start, content.range.end.translate(0, 1))
              editBuilder.replace(charRange, halfChar)
            }
          }
        } else if (!/\r|\n/.test(content.text)) {
          // onDidChangeTextDocument 与 [compositionstart](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/compositionstart_event)
          // 性质一样, 中文输入法每按下一个子母都会触发, 所以会出现 content.text 是多个字符情况
          const text = content.text
          const newText = text.replaceAll('……', '…')
          const textWithHalfChar = convertToHalfWidthChar(newText)

          if (textWithHalfChar !== newText) {
            charRange = new vscode.Range(content.range.start, content.range.end.translate(0, 1 + text.length - newText.length))
            editBuilder.replace(charRange, textWithHalfChar)
          }
        }
      })
    },
    { undoStopBefore: false }
  ).then(fulfilled => {
    if (fulfilled === false) {
      textEditorEdit(event)
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
      textEditorEdit(event)
    }
  })

  vscode.workspace.onDidChangeConfiguration(() => {
    config = vscode.workspace.getConfiguration()
    keymapsConfig = config.get(keymapsId)
    switchConfig = config.get(switchId)

    statusBarItem.text = getStatusBarItemLabel()
    statusBarItem.tooltip = getStatusBarItemTooltip()
  })

  console.info('已激活半角插件')
}

function deactivate () {}

module.exports = {
  activate,
  deactivate
}

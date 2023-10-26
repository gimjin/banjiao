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

  vscode.window.activeTextEditor.edit(
    editBuilder => {
      event.contentChanges.forEach(content => {
        const currentPosition = content.range.start
        const contentText = content.text
        let contentTextRange

        if (contentText.length === 1) {
          // 只处理单符号
          let halfChar, prevChar

          if (currentPosition.character > 0) {
            prevChar = event.document.getText(new vscode.Range(currentPosition.translate(0, -1), currentPosition))
          }

          // ^ 全角 …… 会触发两次change事件
          if (contentText === '…' && contentText === prevChar) {
            halfChar = getHalfWidthChar(contentText)
            contentTextRange = new vscode.Range(currentPosition.translate(0, -1), currentPosition.translate(0, 1))
            editBuilder.replace(contentTextRange, halfChar)
          }

          // _ 全角 —— 会触发两次change事件
          if (contentText === '—' && contentText === prevChar) {
            halfChar = getHalfWidthChar(contentText)
            contentTextRange = new vscode.Range(currentPosition.translate(0, -1), currentPosition.translate(0, 1))
            editBuilder.replace(contentTextRange, halfChar)
          }

          // 其他全角字符
          if (contentText !== '…' && contentText !== '—') {
            halfChar = getHalfWidthChar(contentText)

            if (halfChar !== contentText) {
              contentTextRange = new vscode.Range(currentPosition, currentPosition.translate(0, 1))
              editBuilder.replace(contentTextRange, halfChar)
            }
          }
        } else if (contentText.length > 1) {
          // 处理粘贴长文本
          const replacedText = contentText.split('').reduce(
            (previousChar, currentChar) => {
              return previousChar + getHalfWidthChar(currentChar)
            },
            ''
          )

          if (contentText !== replacedText) {
            if (contentText.includes('\n')) { // 多行文本
              const lines = contentText.split('\n')
              const endLineNumber = currentPosition.line + lines.length - 1
              const endLineText = lines[lines.length - 1]
              const endLineDocumentText = vscode.window.activeTextEditor.document.lineAt(endLineNumber).text
              const endLineCharacter = endLineDocumentText.indexOf(endLineText) + endLineText.length
              const endPosition = new vscode.Position(endLineNumber, endLineCharacter)
              contentTextRange = new vscode.Range(currentPosition, endPosition)
            } else if (currentPosition.character === 0) { // 单行第一个位置
              const lineText = vscode.window.activeTextEditor.document.lineAt(currentPosition.line).text
              const startPosition = new vscode.Position(currentPosition.line, lineText.indexOf(contentText))
              const endPosition = new vscode.Position(currentPosition.line, lineText.indexOf(contentText) + contentText.length)
              contentTextRange = new vscode.Range(startPosition, endPosition)
            } else { // 单行其他位置
              const endPosition = new vscode.Position(currentPosition.line, currentPosition.character + content.text.length)
              contentTextRange = new vscode.Range(currentPosition, endPosition)
            }

            editBuilder.replace(contentTextRange, replacedText)
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
    // [undo 和 redo 时忽略转换](https://code.visualstudio.com/api/references/vscode-api#TextDocumentChangeReason)
    if (event.reason === 1 || event.reason === 2) return

    // 只处理代码文件修改
    // 如 event.document.uri.scheme === 'vscode-scm' 是 vscode git 客户端 commit-msg 输入框会被禁止
    if (switchConfig && event.document.uri.scheme === 'file') {
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

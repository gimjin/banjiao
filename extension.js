const vscode = require('vscode')

function transformHalfChar (char) {
  const keymaps = vscode.workspace.getConfiguration().get('keymaps')

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

function activate () {
  vscode.workspace.onDidChangeTextDocument(event => {
    replaceChar(event)
  })

  console.info('activate banjiao.')
}

function deactivate () {}

module.exports = {
  activate,
  deactivate
}

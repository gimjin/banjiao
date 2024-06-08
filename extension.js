const vscode = require('vscode')
const axios = require('axios').default
const md5 = require('md5')
const { Case } = require('change-case-all')

const switchId = 'banjiao.switch'
const batchId = 'banjiao.batch'
const keymapsId = 'banjiao.keymaps'
const setNameId = 'banjiao.setName'
const translateAppidId = 'banjiao.translateAppid'
const translateSecretId = 'banjiao.translateSecret'

let switchConfig
let batchConfig
let keymapsConfig
let translateAppidConfig
let translateSecretConfig

function setConfig () {
  const config = vscode.workspace.getConfiguration()
  switchConfig = config.get(switchId)
  batchConfig = config.get(batchId)
  keymapsConfig = config.get(keymapsId)
  translateAppidConfig = config.get(translateAppidId)
  translateSecretConfig = config.get(translateSecretId)
}

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
        } else if (batchConfig && contentText.length > 1) {
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

async function fetchTranslateResult (originText, from, to) {
  const domain = 'it'
  const salt = Math.random()

  try {
    const response = await axios({
      method: 'get',
      url: 'https://fanyi-api.baidu.com/api/trans/vip/fieldtranslate',
      params: {
        q: originText,
        from,
        to,
        appid: translateAppidConfig,
        salt,
        domain,
        sign: md5(translateAppidConfig + originText + salt + domain + translateSecretConfig)
      }
    })

    if (response.data.error_code) {
      throw new Error(response.data.error_msg)
    } else {
      return {
        translatedText: response.data.trans_result[0].dst
      }
    }
  } catch (error) {
    return {
      errorMessage: error.message
    }
  }
}

function activate ({ subscriptions }) {
  setConfig()

  const switchCommand = vscode.commands.registerCommand(switchId, () => {
    const config = vscode.workspace.getConfiguration()
    const triggerSwitch = !switchConfig
    config.update(switchId, triggerSwitch, vscode.ConfigurationTarget.Global)
  })
  subscriptions.push(switchCommand)

  const setNameCommand = vscode.commands.registerCommand(setNameId, (name, currentSelection) => {
    const editor = vscode.window.activeTextEditor

    if (editor) {
      let selection = vscode.window.activeTextEditor.selection

      if (selection.isEmpty) {
        selection = new vscode.Selection(currentSelection.start, currentSelection.end)
        editor.selection = selection
      }

      editor.edit(editBuilder => {
        editBuilder.replace(selection, name)
      })
    }
  })
  subscriptions.push(setNameCommand)

  const hoverProvider = vscode.languages.registerHoverProvider('*', {
    async provideHover (document, position) {
      if (
        vscode.window.activeTextEditor === undefined ||
        !(switchConfig && translateAppidConfig && translateSecretConfig)
      ) return

      const selection = vscode.window.activeTextEditor.selection
      let currentText, currentSelection

      // 优先处理已选择文字
      if (selection.contains(position) && !selection.isEmpty) {
        currentText = document.getText(selection)
        currentSelection = selection
      } else {
        const range = document.getWordRangeAtPosition(position)

        if (!range) return

        currentText = document.getText(range)
        currentSelection = new vscode.Selection(range.start, range.end)
      }

      const containsChinese = /[\u4e00-\u9fa5]/.test(currentText)
      const sourceText = containsChinese ? currentText : Case.capital(currentText)

      if (!sourceText || sourceText.length > 64) return

      const sourceLanguage = containsChinese ? 'zh' : 'en'
      const targetLanguage = containsChinese ? 'en' : 'zh'
      const { translatedText, errorMessage } = await fetchTranslateResult(sourceText, sourceLanguage, targetLanguage)

      if (errorMessage) {
        vscode.window.showErrorMessage(errorMessage)
        return
      }

      const capitalText = Case.capital(containsChinese ? translatedText : currentText)
      const cleanedText = capitalText.replace(/The\s*|\s+/g, '') // 使用正则表达式删除所有的 The 和空格
      const camelString = Case.camel(cleanedText)
      const pascalString = Case.pascal(cleanedText)
      const kebabString = Case.kebab(cleanedText)
      const snakeString = Case.snake(cleanedText)
      const constantString = Case.constant(cleanedText)
      const camelCommand = vscode.Uri.parse(`command:banjiao.setName?${encodeURIComponent(JSON.stringify([camelString, currentSelection]))}`)
      const pascalCommand = vscode.Uri.parse(`command:banjiao.setName?${encodeURIComponent(JSON.stringify([pascalString, currentSelection]))}`)
      const kebabCommand = vscode.Uri.parse(`command:banjiao.setName?${encodeURIComponent(JSON.stringify([kebabString, currentSelection]))}`)
      const snakeCommand = vscode.Uri.parse(`command:banjiao.setName?${encodeURIComponent(JSON.stringify([snakeString, currentSelection]))}`)
      const constantCommand = vscode.Uri.parse(`command:banjiao.setName?${encodeURIComponent(JSON.stringify([constantString, currentSelection]))}`)

      const MarkdownString = new vscode.MarkdownString()
      MarkdownString.isTrusted = true
      MarkdownString.appendMarkdown(translatedText + '\n\n')
      MarkdownString.appendMarkdown(`[camelCase](${camelCommand} "camelCase") | `)
      MarkdownString.appendMarkdown(`[PascalCase](${pascalCommand} "PascalCase") | `)
      MarkdownString.appendMarkdown(`[kebab-case](${kebabCommand} "kebab-case") | `)
      MarkdownString.appendMarkdown(`[snake_case](${snakeCommand} "snake_case") | `)
      MarkdownString.appendMarkdown(`[CONSTANT_CASE](${constantCommand} "CONSTANT_CASE")`)

      return new vscode.Hover(MarkdownString)
    }
  })
  subscriptions.push(hoverProvider)

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
    setConfig()

    statusBarItem.text = getStatusBarItemLabel()
    statusBarItem.tooltip = getStatusBarItemTooltip()
  })

  vscode.workspace.onDidChangeTextDocument(event => {
    // [undo 和 redo 时忽略转换](https://code.visualstudio.com/api/references/vscode-api#TextDocumentChangeReason)
    if (event.reason === 1 || event.reason === 2) return

    // 只处理代码文件修改
    // 如 event.document.uri.scheme === 'vscode-scm' 是 vscode git 客户端 commit-msg 输入框会被禁止
    if (switchConfig && event.document.uri.scheme !== 'vscode-scm') {
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

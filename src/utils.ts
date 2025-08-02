import * as vscode from 'vscode'

/**
 * 检查文件是否应该被排除处理
 */
export function shouldExcludeFile(
  document: vscode.TextDocument,
  excludeExtensions: string[] = []
): boolean {
  if (!excludeExtensions || excludeExtensions.length === 0) {
    return false
  }

  const fileName = document.fileName
  const fileExtension = fileName.split('.').pop()?.toLowerCase()

  if (!fileExtension) {
    return false
  }

  return excludeExtensions.some(
    (ext: string) => ext.toLowerCase() === fileExtension
  )
}

/**
 * 检查是否在字符串内
 */
export function isInString(
  textOrDocument: string | vscode.TextDocument,
  posOrPosition: number | vscode.Position
): boolean {
  let text: string
  let pos: number

  // 处理不同类型的参数
  if (typeof textOrDocument === 'string') {
    text = textOrDocument
    pos = posOrPosition as number
  } else {
    // textOrDocument 是 vscode.TextDocument 类型
    const document = textOrDocument
    const position = posOrPosition as vscode.Position
    text = document.lineAt(position.line).text
    pos = position.character
  }

  let inSingleQuote = false
  let inDoubleQuote = false
  let inTemplate = false

  // 只检查当前位置之前的字符
  for (let i = 0; i < pos; i++) {
    const char = text[i]

    // 处理转义字符
    if (char === '\\' && i + 1 < pos) {
      i++
      continue
    }

    // 检查引号
    if (char === "'" && !inDoubleQuote && !inTemplate) {
      inSingleQuote = !inSingleQuote
    } else if (char === '"' && !inSingleQuote && !inTemplate) {
      inDoubleQuote = !inDoubleQuote
    } else if (char === '`' && !inSingleQuote && !inDoubleQuote) {
      inTemplate = !inTemplate
    }
  }

  return inSingleQuote || inDoubleQuote || inTemplate
}

/**
 * 根据文件扩展名获取相应的单行注释前缀
 */
function getCommentPrefixesByExtension(extension: string): string[] {
  switch (extension) {
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'c':
    case 'cpp':
    case 'cs':
    case 'java':
    case 'go':
    case 'swift':
    case 'rust':
    case 'php':
    case 'scss':
    case 'less':
    case 'styl':
      return ['//', '/*']
    case 'css':
      return ['/*']

    case 'py':
    case 'yml':
    case 'yaml':
    case 'sh':
    case 'bash':
    case 'zsh':
    case 'rb':
      return ['#']

    case 'sql':
    case 'lua':
    case 'hql':
      return ['--']

    case 'html':
    case 'xml':
    case 'vue':
      return ['//', '/*', '<!--']

    case 'txt':
    case 'md':
      return []

    default:
      // 通用情况，返回所有可能的单行注释前缀
      return ['//', '#', '--', '<!--', '/*']
  }
}

/**
 * 检测指定位置是否在单行注释中
 */
export function isInComment(
  document: vscode.TextDocument,
  position: vscode.Position
): boolean {
  // 如果在字符串中，则不在注释中
  if (isInString(document, position)) {
    return false
  }

  const lineText = document.lineAt(position.line).text
  const charPosition = position.character
  const fileName = document.fileName
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || ''

  // 获取并检查单行注释前缀
  const commentPrefixes = getCommentPrefixesByExtension(fileExtension)

  // 如果没有找到适用的注释前缀，直接返回 false
  if (commentPrefixes.length === 0) {
    return false
  }

  // 检查是否在注释中
  for (const commentPrefix of commentPrefixes) {
    // 处理块注释
    if (commentPrefix === '/*') {
      let startIndex = lineText.indexOf('/*')
      while (startIndex !== -1) {
        if (!isInString(lineText, startIndex)) {
          const endIndex = lineText.indexOf('*/', startIndex + 2)
          if (endIndex !== -1) {
            // 检查是否在块注释内部（不包括开始和结束标记）
            if (charPosition > startIndex + 1 && charPosition < endIndex) {
              return true
            }
          }
          // 注意：如果没有找到结束标记，不应该认为在注释中
          // 因为可能用户正在输入注释的开始部分
        }
        startIndex = lineText.indexOf('/*', startIndex + 1)
      }
    }
    // 处理HTML注释
    else if (commentPrefix === '<!--') {
      let startIndex = lineText.indexOf('<!--')
      while (startIndex !== -1) {
        if (!isInString(lineText, startIndex)) {
          const endIndex = lineText.indexOf('-->', startIndex + 4)
          if (endIndex !== -1) {
            // 检查是否在HTML注释内部（不包括开始和结束标记）
            if (charPosition > startIndex + 3 && charPosition < endIndex) {
              return true
            }
          }
          // 注意：如果没有找到结束标记，不应该认为在注释中
          // 因为可能用户正在输入注释的开始部分
        }
        startIndex = lineText.indexOf('<!--', startIndex + 1)
      }
    }
    // 处理单行注释（// # --）
    else {
      let commentIndex = lineText.indexOf(commentPrefix)
      while (commentIndex !== -1) {
        // 确保注释前缀不在字符串内，且当前位置在注释起始位置之后
        if (
          !isInString(lineText, commentIndex) &&
          charPosition > commentIndex + commentPrefix.length - 1
        ) {
          return true
        }
        // 继续查找下一个可能的注释
        commentIndex = lineText.indexOf(commentPrefix, commentIndex + 1)
      }
    }
  }

  return false
}

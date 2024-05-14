# 【中文，符号】自动转 [英文,符号]

- 即时转换英文符号
- 粘贴代码批量转换
- 快速转换英文名
- 快速查看中文名

![例子-输入](https://github.com/gimjin/banjiao/blob/main/images/example-input.gif?raw=true)

![例子-命名](https://github.com/gimjin/banjiao/blob/main/images/example-set-name.gif?raw=true)

![例子-查看](https://github.com/gimjin/banjiao/blob/main/images/example-view.gif?raw=true)

### 符号映射

```JSON
[
  { "full": "。", "half": "." },
  { "full": "，", "half": "," },
  { "full": "：", "half": ":" },
  { "full": "；", "half": ";" },
  { "full": "、", "half": "/" },
  { "full": "“", "half": "\"" },
  { "full": "”", "half": "\"" },
  { "full": "‘", "half": "'" },
  { "full": "’", "half": "'" },
  { "full": "（", "half": "(" },
  { "full": "）", "half": ")" },
  { "full": "【", "half": "[" },
  { "full": "】", "half": "]" },
  { "full": "｛", "half": "{" },
  { "full": "｝", "half": "}" },
  { "full": "《", "half": "<" },
  { "full": "》", "half": ">" },
  { "full": "·", "half": "`" },
  { "full": "…", "half": "^" },
  { "full": "￥", "half": "$" },
  { "full": "¥", "half": "$" },
  { "full": "？", "half": "?" },
  { "full": "！", "half": "!" },
  { "full": "—", "half": "_" },
  { "full": "「", "half": "'" },
  { "full": "」", "half": "'" },
  { "full": "『", "half": "\"" },
  { "full": "』", "half": "\"" }
]
```

### 翻译设置

**快速转换英文名** 和 **快速查看中文名** 功能需要您自行 [申请](https://fanyi-api.baidu.com/product/12) 百度领域翻译, 然后 [获取](https://fanyi-api.baidu.com/manage/developer) 您的 appid 和 secret 到半角设置中输入. 百度领域翻译享每月50万免费字符.

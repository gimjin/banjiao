### 【中文，符号】自动转 [英文,符号]

![例子](https://gimjin.github.io/banjiao-cdn/example.gif)

- 中文注释时再也不会出现 、、
- 声明数组时也不会出现 【】
- 粘贴文本时半角自动替换全角
- 规则如下

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
  { "full": "？", "half": "?" },
  { "full": "！", "half": "!" },
  { "full": "—", "half": "_" },
  { "full": "「", "half": "'" },
  { "full": "」", "half": "'" },
  { "full": "『", "half": "\"" },
  { "full": "』", "half": "\"" }
]
```

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.4.0](https://github.com/gimjin/banjiao/compare/v1.3.8...v1.4.0) (2024-06-06)


### Features

* 变量名和方法名的中英文对照 ([4984517](https://github.com/gimjin/banjiao/commit/49845173b89066e74239bada0c54ef1d8c6b5d29))

### [1.3.8](https://github.com/gimjin/banjiao/compare/v1.3.7...v1.3.8) (2024-06-05)

### [1.3.7](https://github.com/gimjin/banjiao/compare/v1.3.6...v1.3.7) (2024-06-05)


### Bug Fixes

* 在中国无法正常访问github上的gif图片缺陷，用 https://sm.ms/ 图床替代 ([b8c82b6](https://github.com/gimjin/banjiao/commit/b8c82b6ed898ca18e855dbb043ad878ea15a524a))

### [1.3.6](https://github.com/gimjin/banjiao/compare/v1.3.5...v1.3.6) (2024-06-05)


### Bug Fixes

* 英文变量名无法互相转换4种变量名类型缺陷 ([1215a78](https://github.com/gimjin/banjiao/commit/1215a78481cfabc951cf018eacc0ac649a105a16))
* 选择非常多的文字时浪费翻译字符缺陷，当前64个字符内正常翻译且转换变量名 ([46846cc](https://github.com/gimjin/banjiao/commit/46846cc0868b76f714e816e9023d59e250496e01))

### [1.3.5](https://github.com/gimjin/banjiao/compare/v1.3.4...v1.3.5) (2024-05-17)


### Bug Fixes

* 无法正确处理当前选择文本的转换 ([f2d68ae](https://github.com/gimjin/banjiao/commit/f2d68aead8dd7f27c5bcbf51161079effdfea909))

### [1.3.4](https://github.com/gimjin/banjiao/compare/v1.3.3...v1.3.4) (2024-05-16)


### Bug Fixes

* 快捷转换中英字符，选择文字操作用户体验差 ([e25f80f](https://github.com/gimjin/banjiao/commit/e25f80f5301fc85e842b7294e0b57c998e7df17f))

### [1.3.3](https://github.com/gimjin/banjiao/compare/v1.3.2...v1.3.3) (2024-05-15)

### [1.3.2](https://github.com/gimjin/banjiao/compare/v1.3.1...v1.3.2) (2024-05-15)

### [1.3.1](https://github.com/gimjin/banjiao/compare/v1.3.0...v1.3.1) (2024-05-14)


### Bug Fixes

* 运行包未安装在 dependencies 导致运行时无法找到包报错 ([304e2ab](https://github.com/gimjin/banjiao/commit/304e2ab279558517acd3b4fa560c88656e00fb21))

## [1.3.0](https://github.com/gimjin/banjiao/compare/v1.2.10...v1.3.0) (2024-05-14)


### Features

* 快速转换英文名 和 快速查看中文名 ([42519ba](https://github.com/gimjin/banjiao/commit/42519ba28a13c4ff9e6efe551ca4a7c7250f1684))

### [1.2.10](https://github.com/gimjin/banjiao/compare/v1.2.9...v1.2.10) (2024-04-25)


### Bug Fixes

* [#4](https://github.com/gimjin/banjiao/issues/4) 支持 Jupyter Notebooke .ipynb 文件 ([8a9489f](https://github.com/gimjin/banjiao/commit/8a9489fcc4e92de598140f5898271882dfe0f774))
* bugs in converting RMB symbol of macOS. ([589ebb6](https://github.com/gimjin/banjiao/commit/589ebb6f2991468b5cb40f67ab196063b10f6412))

### [1.2.9](https://github.com/gimjin/banjiao/compare/v1.2.8...v1.2.9) (2024-01-17)


### Bug Fixes

* 无法正常显示 gif 例子图片 ([5959d00](https://github.com/gimjin/banjiao/commit/5959d00d995547b7acacd03a50293ec99acc30e8))

### [1.2.8](https://github.com/gimjin/banjiao/compare/v1.2.7...v1.2.8) (2024-01-17)


### Bug Fixes

* 无法正常显示 gif 例子图片 ([cb5cbb1](https://github.com/gimjin/banjiao/commit/cb5cbb197fd1bc51bb5ca41fefffd34de58039ec))

### [1.2.7](https://github.com/gimjin/banjiao/compare/v1.2.6...v1.2.7) (2024-01-17)


### Bug Fixes

* 新增粘贴代码批处理开关，防止误操作 ([2cebf23](https://github.com/gimjin/banjiao/commit/2cebf2330b80f81c5466cf227d7819717f7bd4af))

### [1.2.6](https://github.com/gimjin/banjiao/compare/v1.2.5...v1.2.6) (2023-10-26)


### Bug Fixes

* 一行文本中已存在一个或多个粘贴文本时只替换第一个文本 ([8a1b13c](https://github.com/gimjin/banjiao/commit/8a1b13cbca8123a3aef85b18f4933c05afee11f2))

### [1.2.5](https://github.com/gimjin/banjiao/compare/v1.2.4...v1.2.5) (2023-10-25)


### Bug Fixes

* 一段应该缩进的代码行中，强行不缩进把【】粘贴在第一个字符位置时替换错乱 ([f1d3596](https://github.com/gimjin/banjiao/commit/f1d3596d36fe39599b0e92b748967838c7b14b56))

### [1.2.4](https://github.com/gimjin/banjiao/compare/v1.2.3...v1.2.4) (2023-10-25)


### Bug Fixes

* undo 和 redo 时忽略转换 ([98cd115](https://github.com/gimjin/banjiao/commit/98cd115e901708e5e5dcba351fd2077de4d3378d))

### [1.2.3](https://github.com/gimjin/banjiao/compare/v1.2.2...v1.2.3) (2023-10-25)


### Bug Fixes

* ctrl+z 回退操作无限重复无法回退缺陷 ([18ce9fc](https://github.com/gimjin/banjiao/commit/18ce9fc5faed56aa614dabd94e0e07f00feb83b1))

### [1.2.2](https://github.com/gimjin/banjiao/compare/v1.2.1...v1.2.2) (2023-10-13)


### Bug Fixes

* 多行文本粘贴时最后一行字符串position错误缺陷。优化代码结构。 ([0b8c449](https://github.com/gimjin/banjiao/commit/0b8c449f72e35e08f61c367c082fa32d6fb53704))

### [1.2.1](https://github.com/gimjin/banjiao/compare/v1.2.0...v1.2.1) (2023-10-12)


### Bug Fixes

* 粘贴多行文本时异常处理不足导致最后一行覆盖粘贴前文本缺陷 ([8f3b462](https://github.com/gimjin/banjiao/commit/8f3b462f6fc5017463a9817dea42349ed13c9586))

## [1.2.0](https://github.com/gimjin/banjiao/compare/v1.1.9...v1.2.0) (2023-10-12)


### Features

* 粘贴文本时半角自动替换全角 ([9b30794](https://github.com/gimjin/banjiao/commit/9b30794252497804569f38d94af3b000da6b43d0))


### Bug Fixes

* vscode git 客户端输入 commit-msg 时触发替换操作缺陷 ([806ac99](https://github.com/gimjin/banjiao/commit/806ac9933f54cfe1c56fd67a8f9fb0b9253fff3b))

### [1.1.9](https://github.com/gimjin/banjiao/compare/v1.1.8...v1.1.9) (2023-05-22)


### Bug Fixes

* 添加直角引号『』「」到半角西文引号的映射 ([b4cb7fc](https://github.com/gimjin/banjiao/commit/b4cb7fc202e9f68693d26eee30f2f10c0e1ec8de))

### [1.1.8](https://github.com/gimjin/banjiao/compare/v1.1.7...v1.1.8) (2023-05-19)


### Bug Fixes

* 文档未打开时一直显示状态栏按钮缺陷 ([28126d5](https://github.com/gimjin/banjiao/commit/28126d57134f168f8b52288d03d464bf7440ce34))

### [1.1.7](https://github.com/gimjin/banjiao/compare/v1.1.6...v1.1.7) (2023-05-12)


### Bug Fixes

* 单行多字符粘贴时被批量替换缺陷 ([b508653](https://github.com/gimjin/banjiao/commit/b5086538b289dc59c1074261629317dd167d9d98))

### [1.1.6](https://github.com/gimjin/banjiao/compare/v1.1.5...v1.1.6) (2023-05-11)


### Bug Fixes

* 单行多符号粘贴时，未覆盖粘贴内容缺陷 ([4767593](https://github.com/gimjin/banjiao/commit/47675939cf50d8c7e5c08647a35156493fc126df))

### [1.1.5](https://github.com/gimjin/banjiao/compare/v1.1.4...v1.1.5) (2023-05-11)

### [1.1.4](https://github.com/gimjin/banjiao/compare/v1.1.3...v1.1.4) (2023-05-11)


### Bug Fixes

* 多行文本粘贴时未正确处理，已禁用多行粘贴场景 ([4413fa4](https://github.com/gimjin/banjiao/commit/4413fa4544403d9027b409bdea37d165203ddb85))

### [1.1.3](https://github.com/gimjin/banjiao/compare/v1.1.2...v1.1.3) (2023-05-10)


### Bug Fixes

* 增加全角花括号，优化搜索关键字 ([1baee14](https://github.com/gimjin/banjiao/commit/1baee141e4f98bc9062cb938ac68ba8657255366))

### [1.1.2](https://github.com/gimjin/banjiao/compare/v1.1.1...v1.1.2) (2023-05-10)


### Bug Fixes

* 类似compositionstart事件中，单次可输入多个字符时无法转换缺陷 ([889ccd8](https://github.com/gimjin/banjiao/commit/889ccd8a99b1693a928e5382b67defd0f511985b))

### [1.1.1](https://github.com/gimjin/banjiao/compare/v1.1.0...v1.1.1) (2023-05-09)

## 1.1.0 (2023-05-09)


### Features

* 开关设置、快捷键、状态栏按钮 ([5005800](https://github.com/gimjin/banjiao/commit/50058008f41600e2a22471156ae780eb6efaf3a2))


### Bug Fixes

* 显示例子gif图片 ([d0a7ea0](https://github.com/gimjin/banjiao/commit/d0a7ea01710da6cd97e52fb9794bce0eee7da6ec))

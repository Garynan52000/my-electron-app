# 拼写检查器

自 Electron 8 以来已内置支持 Chromium 拼写检查器。 在 Windows 和 Linux 上，它由 Hunspell 词典提供支持，而在 macOS 上，它使用本机拼写检查器 API。

## 如何启用拼写检查器?

对于 Electron 9 及以上，默认启用拼写检查器。 或 Electron 8，您需要在 `webPreferences` 中启用它。

<br>

```
const myWindow = new BrowserWindow({
  webPreferences: {
    spellcheck: true
  }
})
```

## 如何设置拼写检查器使用的语言？

在 macOS 上，由于我们使用本机 API，因此无法设置拼写检查器使用的语言。默认情况下，macOS 本机拼写检查器会自动检测您使用的语言。

<br>

```
// 设置拼写检查器以检查美国英语和法语
myWindow.session.webContents.setSpellCheckerLanguages(['en-US', 'fr'])

// 所有可用语言代码的数组
const possibleLanguages = myWindow.webContents.session.availableSpellCheckerLanguages
```

## 如何将拼写检查的结果放入上下文菜单中？

生成上下文菜单所需的所有信息都在每个 `webContents` 实例的 `context-menu` 事件中提供。下面提供了一个小的示例，如何用此信息制作上下文菜单。

<br>

```
const { Menu, MenuItem } = require('electron')

myWindow.webContents.on('context-menu', (event, params) => {
  const menu = new Menu()

  // Add each spelling suggestion
  for (const suggestion of params.dictionarySuggestions) {
    menu.append(new MenuItem({
      label: suggestion,
      click: () => mainWindow.webContents.replaceMisspelling(suggestion)
    }))
  }

  // Allow users to add the misspelled word to the dictionary
  if (params.misspelledWord) {
    menu.append(
      new MenuItem({
        label: 'Add to dictionary',
        click: () => mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
      })
    )
  }

  menu.popup()
})
```

## 拼写检查器是否使用任何 Google 服务？

虽然拼写检查器本身没有发送任何输入， 单词或用户输入到谷歌服务中，hunspell 字典文件默认从谷歌 CDN 下载。 如果你想要避免这种情况，你可以提供一个替代 URL 来下载字典。

<br>

```
myWindow.session.setSpellCheckerDictionaryDownloadURL('https://example.com/dictionaries/')
```

<br>

(`session.setSpellCheckerDictionaryDownloadURL`)[https://www.electronjs.org/zh/docs/latest/api/session#sessetspellcheckerdictionarydownloadurlurl] 的文档，了解有关从何处获取字典文件以及如何托管它们的更多信息。

<br>

查看 `apps/00002/00018/`

```
npm start -- -p apps/00002/00018/main.js
```

<br>
const { app, BrowserWindow, Menu, MenuItem } = require("electron");

!async function() {
    await app.whenReady();

    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // 对于 Electron 8，您需要在 webPreferences 中启用它。
            spellcheck: true
        }
    });

    mainWindow.loadFile('index.html');

    // An array of all available language codes
    const { availableSpellCheckerLanguages } = mainWindow.webContents.session;
    console.log('====== availableSpellCheckerLanguages: ======');
    console.log(availableSpellCheckerLanguages);
    console.log('====== availableSpellCheckerLanguages: ======');

    mainWindow.webContents.session.setSpellCheckerLanguages(['en-US']);

    mainWindow.webContents.on('context-menu', (event, params) => {
        console.log('====== context-menu event params: ======');
        console.log(params);
        console.log('====== context-menu event params: ======');

        const menu = new Menu();

        if (params.dictionarySuggestions && params.dictionarySuggestions.length > 0) {
            // Add each spelling suggestion
            for (const suggestion of params.dictionarySuggestions) {
                menu.append(new MenuItem({
                    label: suggestion,
                    click: () => mainWindow.webContents.replaceMisspelling(suggestion)
                }));
            }
        } else {
            menu.append(
                new MenuItem({
                    label: 'nothing to do',
                    click: () => console.log('nothing to do')
                })
            );
        }

        // Allow users to add the misspelled word to the dictionary
        if (params.misspelledWord) {
            menu.append(
                new MenuItem({
                    label: 'Add to dictionary',
                    click: () => mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
                })
            );
        }

        menu.popup();
    });
}();

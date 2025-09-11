const defaultSettings = {
    difficulty: true,
    timer: true,
    codeEditor: true
};

const settingsContainer = document.getElementById('settings-container');

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get({ settings: defaultSettings }, (data) => {
        const { settings } = data;
        document.querySelectorAll('#settings-container input[type="checkbox"]').forEach(checkbox => {
            const key = checkbox.dataset.key;
            checkbox.checked = !!settings[key];
        });
    });
});

settingsContainer.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        const key = event.target.dataset.key;
        const isEnabled = event.target.checked;

        chrome.storage.sync.get({ settings: defaultSettings }, (data) => {
            const newSettings = { ...data.settings, [key]: isEnabled };
            chrome.storage.sync.set({ settings: newSettings });

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { command: "update" });
            });
        });
    }
});
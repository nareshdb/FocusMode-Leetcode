chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Show concise onboarding on first install
        chrome.tabs.create({
            url: chrome.runtime.getURL('onboarding.html')
        });
        
        // Set default settings
        chrome.storage.sync.set({
            settings: {
                difficulty: true,
                timer: true,
                codeEditor: true
            }
        });
    }
});
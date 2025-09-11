const selectors = {
    timer: '[data-cy="timer"]',
    difficulty: [
      '[class*="text-difficulty-"]',
      'p.text-lc-green-60',
      'p.text-lc-yellow-60',
      'p.text-lc-red-60',
      'p.text-sd-easy',
      'p.text-sd-medium',
      'p.text-sd-hard'
    ].join(', '),
    codeEditor: '.monaco-editor'
  };

const defaultSettings = {
    difficulty: true,
    timer: true,
    codeEditor: true
};

let hidingStyleRemoved = false;

function applyOverlaysFromSettings() {
    if (!hidingStyleRemoved) {
        const hidingStyle = document.getElementById('leetcode-focus-hiding-style');
        if (hidingStyle) {
            hidingStyle.remove();
            hidingStyleRemoved = true;
        }
    }

    if (!chrome.runtime?.id) return;

    chrome.storage.sync.get({ settings: defaultSettings }, (data) => {
        if (!chrome.runtime?.id) return;

        const { settings } = data;
        for (const key in selectors) {
            const elements = document.querySelectorAll(selectors[key]);
            elements.forEach(element => {
                if (key === 'difficulty') {
                    element.classList.add('generic-difficulty-tag');
                }
                if (settings[key]) {
                    element.classList.add('blurred');
                } else {
                    element.classList.remove('blurred', 'revealed');
                }
            });
        }
    });
}

document.addEventListener('dblclick', (event) => {
    for (const key in selectors) {
        const clickedTarget = event.target.closest(selectors[key]);
        if (clickedTarget) {
            clickedTarget.classList.add('revealed');
            return;
        }
    }
});

const observer = new MutationObserver(applyOverlaysFromSettings);
observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((request) => {
    if (request.command === "update") {
        applyOverlaysFromSettings();
    }
    return true;
});
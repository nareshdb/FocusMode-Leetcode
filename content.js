const selectors = {
    timer: [
        '#ide-top-btns .text-sd-blue-400',
        '#ide-top-btns [aria-label*=":"]',
        '#ide-top-btns [aria-label="Reset"]',
        '#ide-top-btns [aria-label="Pause"]',
        'nav .text-sd-blue-400',
        'nav [aria-label*=":"]',
        'nav [aria-label="Reset"]',
        'nav [aria-label="Pause"]'
    ].join(', '),
    difficulty: [
        '[class*="text-difficulty-"]',
        'p.text-lc-green-60',
        'p.text-lc-yellow-60',
        'p.text-lc-red-60',
        'p.text-sd-easy',
        'p.text-sd-medium',
        'p.text-sd-hard'
    ].join(', '),
    codeEditor: '.monaco-editor',
    problemTitle: '.text-title-large a[href^="/problems/"]'
};

const defaultSettings = {
    difficulty: true,
    timer: true,
    codeEditor: true,
    problemTitle: true
};

let hidingStyleRemoved = false;
let originalTitle = document.title;
const FOCUS_TITLE = "LeetCode - FocusMode";

function findTimerElementsFallback() {
    const roots = [document.getElementById('ide-top-btns'), document.querySelector('nav')].filter(Boolean);
    const elements = [];
    const timeRe = /^\d{2}:\d{2}:\d{2}$/;

    for (const root of roots) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
            const text = (node.nodeValue || '').trim();
            if (timeRe.test(text)) {
                const el = node.parentElement?.closest('[aria-label]') ||
                    node.parentElement?.closest('button') ||
                    node.parentElement;
                if (el) elements.push(el);
            }
            node = walker.nextNode();
        }
    }

    return elements;
}

let manuallyRevealedKeys = new Set();

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
            let elements = Array.from(document.querySelectorAll(selectors[key]));

            if (key === 'timer') {
                const fallbackTimerEls = findTimerElementsFallback();
                if (fallbackTimerEls.length > 0) {
                    const merged = new Set([...elements, ...fallbackTimerEls]);
                    elements = Array.from(merged);
                }
            }

            elements.forEach((element) => {
                if (key === 'difficulty') {
                    element.classList.add('generic-difficulty-tag');
                }
                if (settings[key]) {
                    element.classList.add('blurred');
                    if (manuallyRevealedKeys.has(key)) {
                        element.classList.add('revealed');
                    } else {
                        element.classList.remove('revealed');
                    }
                } else {
                    element.classList.remove('blurred', 'revealed');
                }
            });
        }

        // Handle browser tab title
        if (settings.problemTitle && !manuallyRevealedKeys.has('problemTitle')) {
            if (document.title !== FOCUS_TITLE) {
                originalTitle = document.title;
                document.title = FOCUS_TITLE;
            }
        } else if (document.title === FOCUS_TITLE) {
            document.title = originalTitle;
        }
    });
}

document.addEventListener('dblclick', (event) => {
    for (const key in selectors) {
        const clickedTarget = event.target.closest(selectors[key]);
        if (clickedTarget && clickedTarget.classList.contains('blurred')) {
            if (!manuallyRevealedKeys.has(key)) {
                manuallyRevealedKeys.add(key);
                clickedTarget.classList.add('revealed');
                applyOverlaysFromSettings();
            }
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

// Observe title changes to prevent LeetCode from overriding our focus title
const titleElement = document.querySelector('title');
if (titleElement) {
    const titleObserver = new MutationObserver(() => {
        if (document.title !== FOCUS_TITLE) {
            applyOverlaysFromSettings();
        }
    });
    titleObserver.observe(titleElement, { childList: true });
}
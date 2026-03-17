const selectorsToHide = {
    timer: [
      '#ide-top-btns .text-sd-blue-400',
      // In the latest UI the *visible* timer pill uses aria-label like "00:26:55"
      '#ide-top-btns [aria-label*=":"]',
      '#ide-top-btns [aria-label="Reset"]',
      '#ide-top-btns [aria-label="Pause"]'
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

const style = document.createElement('style');

style.id = 'leetcode-focus-hiding-style';

style.textContent = `
    ${selectorsToHide.timer},
    ${selectorsToHide.difficulty},
    ${selectorsToHide.codeEditor},
    ${selectorsToHide.problemTitle} {
        visibility: hidden !important;
    }`;

document.documentElement.appendChild(style);
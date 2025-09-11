const selectorsToHide = {
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

const style = document.createElement('style');

style.id = 'leetcode-focus-hiding-style';

style.textContent = `
    ${selectorsToHide.timer},
    ${selectorsToHide.difficulty},
    ${selectorsToHide.codeEditor} {
        visibility: hidden !important;
    }`;

document.documentElement.appendChild(style);
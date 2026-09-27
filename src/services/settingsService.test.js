import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateSmartPalette
} from './settingsService.js';

test('generated palettes include a readable title bar foreground', () => {
  const light = generateSmartPalette(
    '#06152b',
    'light'
  );
  const dark = generateSmartPalette(
    '#06152b',
    'dark'
  );

  assert.equal(
    light.topbarText,
    '#102033'
  );
  assert.equal(
    dark.topbarText,
    '#ffffff'
  );
});

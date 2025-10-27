import { THEME_ROTATION } from './constants.js';
export function themeForWave(wave){
  const idx = Math.max(0, wave-1) % THEME_ROTATION.length;
  return THEME_ROTATION[idx];
}

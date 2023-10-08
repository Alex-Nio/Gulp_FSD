// Libs
import chroma from 'chroma-js';
// Functions
import { setTextColor } from '../functions/setTextColor';
import { updateColorsHash } from '../functions/updateColorsHash';
import { getColorsFromHash } from '../functions/getColorsFromHash';
// Vars
const cols = document.querySelectorAll('.col');

export const setRandomColors = (isInitial) => {
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock');
    const text = col.querySelector('h2');
    const button = col.querySelector('button');

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random();

    if (!isInitial) {
      colors.push(color);
    }

    text.textContent = color;
    col.style.background = color;

    setTextColor(text, color);
    setTextColor(button, color);
  });

  updateColorsHash(colors);
};

setRandomColors(true);

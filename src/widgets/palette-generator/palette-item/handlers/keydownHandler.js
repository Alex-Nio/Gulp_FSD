import { setRandomColors } from './../functions/setRandomColors';

const keydownHandler = (e) => {
  e.preventDefault();
  if (e.code.toLowerCase() === 'space') {
    setRandomColors();
  }
};

document.addEventListener('keydown', (e) => {
  keydownHandler(e);
});

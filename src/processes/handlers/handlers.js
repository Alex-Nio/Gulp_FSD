// Global handlers (глобальные обработчики событий)
import { fn } from './../../app/core/exports.js';
const { getElementHeight } = fn;

const handlers = () => {
  const header = document.querySelector('.header');
  const pageWrapper = document.querySelector('.page');
  let headerHeight = getElementHeight(header);
  pageWrapper.style.marginTop = headerHeight + 'px';
};

handlers();

export { handlers };

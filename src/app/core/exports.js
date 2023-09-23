// Экспортируемые функции
export const fn = {
  toggle(element, selector) {
    element.classList.toggle(selector);
  },
  addActiveSelector(element, selector) {
    element.classList.add(selector);
  },
  removeActiveSelector(element, selector) {
    element.classList.remove(selector);
  },
  setValue(placeholder, newValue) {
    placeholder.value = newValue;
  },
  getElementHeight(element) {
    return element.offsetHeight;
  },
};

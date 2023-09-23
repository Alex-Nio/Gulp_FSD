const increaseButton = document.querySelector('.increase');
increaseButton.addEventListener('click', () => {
  const counterInput = document.getElementById('counter-input');
  counterInput.value++;
});
export { increaseButton };

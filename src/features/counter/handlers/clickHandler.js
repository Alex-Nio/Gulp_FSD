const decreaseButton = document.querySelector('.decrease');
const increaseButton = document.querySelector('.increase');

decreaseButton.addEventListener('click', () => {
  const counterInput = document.getElementById('counter-input');
  counterInput.value--;
});

increaseButton.addEventListener('click', () => {
  const counterInput = document.getElementById('counter-input');
  counterInput.value++;
});

export { increaseButton, decreaseButton };

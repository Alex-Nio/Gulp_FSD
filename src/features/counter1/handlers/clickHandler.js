const counterInput = document.getElementById('counter-input');
const decreaseButton = document.querySelector('.decrease');
const increaseButton = document.querySelector('.increase');

decreaseButton.addEventListener('click', () => {
  counterInput.value--;
});

increaseButton.addEventListener('click', () => {
  counterInput.value++;
});

counterInput.value = 0;

export { increaseButton, decreaseButton };

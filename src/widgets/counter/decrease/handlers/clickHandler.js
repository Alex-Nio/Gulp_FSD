const decreaseButton = document.querySelector('.decrease');
decreaseButton.addEventListener('click', () => {
  const counterInput = document.getElementById('counter-input');
  counterInput.value--;
});
export { decreaseButton };

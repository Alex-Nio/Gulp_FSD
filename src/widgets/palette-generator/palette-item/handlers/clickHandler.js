import { copyToClickBoard } from '../functions/copyToClickBoard';

const clickHandler = (e) => {
  const type = e.target.dataset.type;

  if (type === 'lock') {
    const node =
      e.target.tagName.toLowerCase() === 'i' ? e.target : e.target.children[0];

    node.classList.toggle('fa-lock');
    node.classList.toggle('fa-unlock');
  } else if (type === 'copy') {
    copyToClickBoard(e.target.textContent);
  }
};

document.addEventListener('click', (e) => {
  clickHandler(e);
});

const vars = {
  body: document.body,
  paddingOffset: window.innerWidth - document.body.offsetWidth + 'px',
};

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return (
      navigator.userAgent.match(/IEMobile/i) ||
      navigator.userAgent.match(/WPDesktop/i)
    );
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

/*
*.**************************************************************.*
? Входные параметры:
  openButtonSelector: селектор кнопки или кнопок, которые открывают всплывающее окно.
  closeButtonSelector: селектор кнопки закрытия всплывающего окна.
  activeSelector: класс, который указывает на активное состояние всплывающего окна.

*.**************************************************************.*
? Описание:
  Корректное использование класса "Popup" предполагает, что атрибут "data-popup-content" должен быть обязательно прописан на содержимом всплывающего окна. Это позволяет классу правильно обрабатывать события клика за пределами контента всплывающего окна и выполнять соответствующие действия, такие как закрытие окна.
  Так же необходимо, чтобы все кнопки, открывающие всплывающие окна, имели класс "popup-trigger" и атрибут "data-popup", внутри которого указан селектор всплывающего окна.
  Класс "Popup" содержит метод "toggleBrowserScroll", который управляет прокруткой браузера. Элементы с классом "fixed" остаются на своих местах, что приводит к отсутствию "прыжков" при открытии и закрытии popup. При открытии popup данный метод применяет класс "lock" к элементу "body" и устанавливает отступ справа для фиксированных элементов. Это предотвращает "прыжки" содержимого страницы при открытии popup.

*.**************************************************************.*
? Пример использования html:
  <button class="popup-trigger" data-popup="popup1">Открыть модальное окно/Popup 1</button>
  <button class="popup-trigger" data-popup="popup2">Открыть модальное окно/Popup 2</button>

  <div class="popup popup1">
  <!-- Контент первого всплывающего окна -->
  </div>

  <div class="popup popup2">
  <!-- Контент второго всплывающего окна -->
  </div>
? Пример использования js:
  import { Popup } from '../../../../../styles/js/libs/popups';

  const remindPopup = new Popup('.popup-trigger', '.popup-close', 'active');
  remindPopup.init();
*.**************************************************************.*

*/

// Popups constructor
export class Popup {
  constructor(openButtonSelector, closeButtonSelector, activeSelector) {
    this.btns = document.querySelectorAll(openButtonSelector);
    this.closeButtonSelector = closeButtonSelector;
    this.activeClass = activeSelector;
    this.triggerButton = null;
    this.popup = null;
    this.closeButtons = null;
    this.events = this.dispatcher();
  }

  // Returns custom events obj
  dispatcher() {
    return {
      open: new Event('popupOpened'),
      close: new Event('popupClosed'),
    };
  }

  // Get popup selector from button's dataset
  getPopupSelector(btn) {
    return `.${btn.dataset.popup}`;
  }

  // Toggle active selector of an element
  toggleActiveSelector(element) {
    element.classList.toggle(this.activeClass);

    if (element.classList.contains(this.activeClass)) {
      window.dispatchEvent(this.events.open);
    } else {
      window.dispatchEvent(this.events.close);
    }
  }

  // Close the popup if a click occurs outside the popup content
  handleOutsideClick = (e) => {
    const isOutsidePopupContent = !e.target.closest('[data-popup-content]');
    if (isOutsidePopupContent && window.innerWidth > 768) {
      this.closePopup();
    }
  };

  // Same for mobile devices
  handleOutsideTouch = (e) => {
    const isOutsidePopupContent = !e.target.closest('[data-popup-content]');
    if (isOutsidePopupContent) {
      this.closePopup();
    }
  };

  // Event handler for close button click
  handleCloseButtonClick = (e) => {
    e.preventDefault();
    this.closePopup();
  };

  // Toggle browser scrolling and fix positioning of fixed elements
  toggleBrowserScroll(action, fixedClass) {
    const allFixedElements = document.querySelectorAll(fixedClass);
    const paddingRight = action === 'enable' ? vars.paddingOffset : '0px';

    vars.body.style.paddingRight = paddingRight;
    vars.body.classList.toggle('lock', action === 'enable');

    this.popup.classList.toggle('scroll-disabled', action === 'enable');

    if (!isMobile.any()) {
      allFixedElements.forEach((fixedElement) => {
        fixedElement.style.paddingRight = paddingRight;
      });
    }
  }

  // Close popup
  closePopup() {
    this.toggleActiveSelector(this.popup);
    this.toggleBrowserScroll('disable', '.fixed');
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  // Toggle popup visibility
  togglePopup() {
    if (this.popup.classList.contains(this.activeClass)) return;

    this.toggleActiveSelector(this.popup);
    const action = this.popup.classList.contains(this.activeClass)
      ? 'enable'
      : 'disable';
    this.toggleBrowserScroll(action, '.fixed');

    // Remove or add event listener for outside click to close the popup
    if (action === 'enable') {
      document.addEventListener('mousedown', this.handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', this.handleOutsideClick);
    }
  }

  // Initialize popups
  init() {
    this.btns.forEach((btn) => {
      // Desktop devices
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        this.triggerButton = btn;
        this.popupSelector = this.getPopupSelector(this.triggerButton);
        this.popup = document.querySelector(this.popupSelector);
        this.togglePopup(this.triggerButton);

        this.closeButtons = this.popup.querySelectorAll(
          this.closeButtonSelector
        );

        // Remove previous event listener for close button click
        this.closeButtons.forEach((button) => {
          button.removeEventListener('click', this.handleCloseButtonClick);
        });

        // Add new event listener for close button click
        this.closeButtons.forEach((button) => {
          button.addEventListener('click', this.handleCloseButtonClick);
        });
      });
    });
  }
}

/*
██████╗░██████╗░███████╗░█████╗░███╗░░░███╗ ████████╗███████╗░█████╗░███╗░░░███╗
██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗░████║ ╚══██╔══╝██╔════╝██╔══██╗████╗░████║
██║░░██║██████╔╝█████╗░░███████║██╔████╔██║ ░░░██║░░░█████╗░░███████║██╔████╔██║
██║░░██║██╔══██╗██╔══╝░░██╔══██║██║╚██╔╝██║ ░░░██║░░░██╔══╝░░██╔══██║██║╚██╔╝██║
██████╔╝██║░░██║███████╗██║░░██║██║░╚═╝░██║ ░░░██║░░░███████╗██║░░██║██║░╚═╝░██║
╚═════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝╚═╝░░░░░╚═╝ ░░░╚═╝░░░╚══════╝╚═╝░░╚═╝╚═╝░░░░░╚═╝

██╗░░░██╗░█████╗░██╗░░░░░██╗██████╗░░█████╗░████████╗██╗░█████╗░███╗░░██╗
██║░░░██║██╔══██╗██║░░░░░██║██╔══██╗██╔══██╗╚══██╔══╝██║██╔══██╗████╗░██║
╚██╗░██╔╝███████║██║░░░░░██║██║░░██║███████║░░░██║░░░██║██║░░██║██╔██╗██║
░╚████╔╝░██╔══██║██║░░░░░██║██║░░██║██╔══██║░░░██║░░░██║██║░░██║██║╚████║
░░╚██╔╝░░██║░░██║███████╗██║██████╔╝██║░░██║░░░██║░░░██║╚█████╔╝██║░╚███║
░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚═╝╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═╝░╚════╝░╚═╝░░╚══╝
*/

/*
	*enctype - это атрибут формы (form attribute),
	который указывает тип кодирования данных, используемых для отправки формы на сервер.
	Этот атрибут имеет значение только для методов POST и PUT.

	Значение enctype может быть одним из трех типов:

	*1. application/x-www-form-urlencoded (по умолчанию) - используется для обычных форм,
	где данные отправляются в виде строк URL-параметров, которые кодируются в ASCII символы.

	*2. multipart/form-data - используется, когда форма включает бинарные данные,
	такие как файлы изображений или звуковые файлы. Данные кодируются в формате multipart/form-data.

	*3. text/plain - используется, когда данные формы отправляются в виде обычного текста без какой-либо кодировки.

	?Примечание:
	В большинстве случаев, вы можете оставить значение enctype равным application/x-www-form-urlencoded,
	если вам не нужно отправлять файлы.

	Если вы планируете отправлять файлы, то нужно использовать значение multipart/form-data.
*/

/*

! Структура массива полей формы:

  {
    * id для back-end
    "id": "12345",
    * id по которому будем находить поле в html брать оттуда значение и выполнять проверку
    "inputId": "inputName",
    * Types: "text", "number", "tel", "email", "password", "url", "file", "date", "datetime-local", "time"
    "inputType": "text",
    * Строка или Число (Пока не понятно нужно ли это)
    "valueType": "string|number",
    * "Обязательность" проверки
    "isRequired": true,
    * Значение из базы по умолчанию или пустое значение
    "default": "Hello world",
    * Регулярное выражение если оно есть
    "regex": "^[a-zA-Z ]*$",
    * Минимальное/Максимальное количество символов
    "minLength": 3,
    "maxLength": 6,
    * Кнопка submit с дата-атрибутом
    "submitButtonData": "contact-form1"
    * Текст сообщения об ошибке
    "errorMessage": "Текст ошибки который показываем в результате выполнения слушателя на input"
    * Селектор успешной валидации
    "successSelector": "success"
  }

*/

/*

? "text": "^[A-Za-zА-Яа-я]+$"
Регулярное выражение проверяет, что поле содержит только буквы (большие и маленькие).
Символы "А-Яа-я" представляют русский алфавит.

? "number": "^\d+$"
Регулярное выражение проверяет, что поле содержит только цифры (от 0 до 9).

? "tel": "^\d{10}$"
Регулярное выражение проверяет, что поле содержит ровно 10 цифр,
соответствующих номеру телефона.

? "email": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
Регулярное выражение проверяет, что поле содержит правильный формат электронной почты.
Оно проверяет наличие локальной части, символа @ и доменной части, а также требует,
чтобы доменная часть состояла из не менее чем двух символов.

? "password": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
Регулярное выражение проверяет, что поле содержит пароль,
удовлетворяющий следующим требованиям: минимум 8 символов, как минимум одна заглавная и одна строчная буква, и как минимум одна цифра.

? "url": "^(https?://)?([\w-]+.)+[\w-]+(/[\w- ./?%&=]*)?$"
Регулярное выражение проверяет, что поле содержит правильный формат URL.
Оно может начинаться с "http://" или "https://",
за которыми следует доменное имя и дополнительный путь (если есть).

? "file": ".+.(jpg|jpeg|png|gif)$"
Регулярное выражение проверяет,
что поле содержит файл с расширением .jpg, .jpeg, .png или .gif.
Оно ищет один или более любых символов, за которыми следует точка и расширение файла.

? "date": "^\d{4}-\d{2}-\d{2}$"
Регулярное выражение проверяет,
что поле содержит дату в формате ГГГГ-ММ-ДД, где ГГГГ - год, ММ - месяц и ДД - день.

*/

// FormValidator Class
export class FormValidator {
  constructor() {
    this.data = null;
    this.initiated = false;
    this.isValid = false;

    // checks type of data and data length
    this.checkData = (data) => {
      if (data) {
        const isNotArray = !Array.isArray(data);
        const isObject = typeof data === 'object';
        const hasLength = Object.keys(data).length > 0;

        if (isObject && isNotArray && hasLength) return true;
        if (data === 'test') return true;
        this.LOGGER.onDataError();
        return false;
      }
    };

    // LOGGER
    this.LOGGER = {
      currentMode(mode) {
        mode === 'dev'
          ? console.log('Validator: Тестовый режим')
          : console.log('Validator: Production режим');
      },
      onTypeError() {
        console.error('Validator Error: Проверьте тип данных');
      },
      onDataError() {
        console.error('Validator Error: Проверьте наличие данных');
      },
      onInitHandleError() {
        console.error('Validator: this.data is not defined');
      },
      onBxUndefinedError() {
        console.error('BX is not defined for validator');
      },
    };
  }

  // Creates Error div container and adds error text to it
  createErrorDiv(errorMessage) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = errorMessage;
    return errorDiv;
  }

  // Inputs validation method
  validateField(input, inputType, currentValue, regex, errorMessage) {
    const errorDiv = input.parentNode.querySelector('.error');
    let isValid;

    if (inputType === 'checkbox' && !input.checked) {
      isValid = false;
    } else if (inputType === 'checkbox' && input.checked) {
      isValid = true;
    } else {
      isValid = regex.test(currentValue);
    }

    if (isValid) {
      if (errorDiv) {
        input.parentElement.classList.remove('input-error');
        errorDiv.parentNode.removeChild(errorDiv);
      }
      return true;
    } else if (currentValue === '') {
      if (errorDiv) {
        input.parentElement.classList.remove('input-error');
        errorDiv.parentNode.removeChild(errorDiv);
      }
      return false;
    } else {
      if (errorDiv) {
        errorDiv.textContent = errorMessage;
      } else {
        const errorDiv = this.createErrorDiv(errorMessage);
        input.parentElement.classList.add('input-error');
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
      }
      return false;
    }
  }

  // Get's the validation result
  getValidationResult(validationResult) {
    if (validationResult) {
      return true;
    } else {
      return false;
    }
  }

  // Fetch
  onFetchData() {
    return fetch('./forms.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((testData) => {
        this.data = testData;
        return testData;
      })
      .catch((error) => {
        throw new Error('Ошибка загрузки тестового JSON: ' + error);
      });
  }

  // Gets data from test file or back-end
  getData(data) {
    let isObject = this.checkData(data);

    if (data === 'test') {
      this.LOGGER.currentMode('dev');
      return this.onFetchData();
    }

    if (isObject) {
      this.LOGGER.currentMode('production');
      return data;
    }
  }

  // Reinitialize method
  reinitialize() {
    this.isValid = false;
  }

  // Main initialization method
  async init(data) {
    this.data = await this.getData(data);

    if (this.data === undefined) {
      this.LOGGER.onInitHandleError();
      return;
    }

    if (this.data && this.data.forms) {
      for (let i = 0; i < this.data.forms.length; i++) {
        let form = this.data.forms[i];
        let buttonDataSet = `[data-submit="${form.submitDatasetId}"]`;

        const validationResults = [];
        const inputs = form.fields;
        const submitBtn = document.querySelector(buttonDataSet);

        // If no submit button - continue iteration
        if (!submitBtn) {
          continue;
        }

        // Fields check main functions
        for (const [index, item] of inputs.entries()) {
          const {
            isRequired,
            inputId,
            inputType,
            defaultValue,
            regex,
            errorMessage,
          } = item;
          const input = document.getElementById(inputId);

          if (!isRequired || !input) continue;

          if (defaultValue !== '') {
            input.value += defaultValue;
            input.disabled = true;
          }

          input.required = isRequired;

          if (inputType === 'checkbox') {
            const isValid = this.validateField(
              input,
              inputType,
              '',
              new RegExp(regex),
              errorMessage
            );

            validationResults[index] = isValid;
            this.getValidationResult(isValid);
          }

          if (!defaultValue) {
            // Обработчик события во время ввода
            const handleCheckOnInput = (e) => {
              const isValid = this.validateField(
                input,
                inputType,
                e.target.value,
                new RegExp(regex),
                errorMessage
              );

              validationResults[index] = isValid;
              this.getValidationResult(isValid);
            };

            // Обработчик изменения значения поля ввода
            const handleInputChange = (e) => {
              const isValid = this.validateField(
                input,
                inputType,
                e.target.value,
                new RegExp(regex),
                errorMessage
              );

              validationResults[index] = isValid;
              this.getValidationResult(isValid);
            };

            // Обработчик события потери фокуса поля ввода
            const handleInputBlur = () => {
              if (input.value === '') {
                const errorDiv = input.parentNode.querySelector('.error');
                if (errorDiv) {
                  input.parentElement.classList.remove('input-error');
                  errorDiv.parentNode.removeChild(errorDiv);
                }
                validationResults[index] = false;
              }

              // if input has error and was on blur
              input.addEventListener('input', handleCheckOnInput);
            };

            input.addEventListener('change', handleInputChange);
            input.addEventListener('blur', handleInputBlur);
          }
        }

        // Submit button handler
        const handleSubmit = (e) => {
          e.preventDefault();

          this.isValid = true; // Изначально считаем форму валидной

          for (const [index, item] of inputs.entries()) {
            const input = document.getElementById(item.inputId);

            if (!item.isRequired || !input || item.defaultValue) continue;

            const errorDiv = input.parentNode.querySelector('.error');
            const fieldValue = input.value;
            const regex = new RegExp(item.regex);
            const isCheckbox = item.inputType === 'checkbox';
            let fieldIsValid = regex.test(fieldValue); // Проверяем поле на валидность

            if (isCheckbox && !input.checked) {
              fieldIsValid = false;
              input.parentElement.classList.add('input-error');
            } else if (isCheckbox && input.checked) {
              input.parentElement.classList.remove('input-error');
            }

            if (!fieldIsValid && !isCheckbox) {
              this.isValid = false; // Если хотя бы одно поле не прошло валидацию, считаем всю форму невалидной

              if (!errorDiv) {
                const newErrorDiv = this.createErrorDiv(item.errorMessage);
                input.parentElement.classList.add('input-error');
                input.parentNode.insertBefore(newErrorDiv, input.nextSibling);
              }
            } else if (errorDiv) {
              input.parentElement.classList.remove('input-error');
              errorDiv.parentNode.removeChild(errorDiv);
            }

            validationResults[index] = fieldIsValid;
          }

          const result = this.getValidationResult(this.isValid);

          let arr = [];
          arr.push(result);

          try {
            /*eslint no-undef: "off"*/
            BX.onCustomEvent('formValidation', arr);
          } catch {
            this.LOGGER.onBxUndefinedError();
          }
        };

        submitBtn.addEventListener('click', handleSubmit);
      }
    }
  }
}

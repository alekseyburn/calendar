'use strict';

let activeDays = document.querySelectorAll('.table__day--active');
let info = activeDays.forEach(item => {
  console.log(`day: ${item.innerText} + month: ${item.offsetParent.caption.textContent}`);
});

console.log(activeDays);

// Объект для хранения информации о датах
let dateInfo = {
  January: {
    day9: {
      date: "9 Января",
      text: "something text there",
      link: "https://demo.com",
    }
  },
  February: {
    day3: {
      date: "3 Февраля",
      text: "osofew foweofwefo ofweofow ofwoeofowfo fow",
      link: "https://test.com",
    }
  }
};


let calendar = document.querySelector('.calendar');

calendar.onclick = function (event) {
  // Возвращаем ближайшего предка, соответствующего селектору td
  let td = event.target.closest('td');
  // Если event.target не содержится внутри td, то возвращаем null
  if (!td) return;
  //выполняем функцию
  console.log(`${td.textContent} ${td.offsetParent.caption.dataset.month}`);
  if (td.classList.contains('table__day--active')) {
    renderDateInfo(td);
  } else {
    renderForm(td);
  }
};


function renderDateInfo(date) {
  removeBlock();

  // Берём заранее подготовленный шаблон из разметки и делаем его копию
  let template = document.querySelector('#date-info-template').content.querySelector('.date-info');
  let dateInfoElement = template.cloneNode(true);

  // Записываем в переменные месяц и день из ячейки таблицы, по которой произошел клик
  let month = `${date.offsetParent.caption.dataset.month}`;
  let day = `day${date.textContent}`;

  // Если на выбранной дате присутствует информация, то выводим её в конце таблицы
  if (dateInfo[month][day]) {
    dateInfoElement.querySelector('.date-info__title').textContent = dateInfo[month][day].date;
    dateInfoElement.querySelector('.date-info__text').textContent = dateInfo[month][day].text;
    dateInfoElement.querySelector('.date-info__link').href = dateInfo[month][day].link;

    calendar.appendChild(dateInfoElement);
  }
}

function renderForm(td) {
  removeBlock();

  // Берём заранее подготовленный шаблон из разметки и делаем его копию
  let template = document.querySelector('#form-template').content.querySelector('.form');
  let formElement = template.cloneNode(true);

  let month = td.offsetParent.caption.textContent;
  let day = td.textContent;

  day = (/\*/i.test(day)) ? day.slice(0, day.length-1) : day;
  month = month.replace(/[а-я]$/, (match) => {
    return (match == 'т') ? 'та' : 'я';
  });

  formElement.querySelector('.form__label').textContent = `${day} ${month}`;

  calendar.appendChild(formElement);
}

function removeBlock() {
  // Если уже существует блок с формой на странице, то удаляем его
  if (calendar.querySelector('.form')) {
    calendar.querySelector('.form').remove();
  }

  // Если уже существует блок с информацией на странице, то удаляем его
  if (calendar.querySelector('.date-info')) {
    calendar.querySelector('.date-info').remove();
  }
}

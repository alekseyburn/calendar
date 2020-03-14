'use strict';

let calendar = document.querySelector('.calendar');
let inactiveDays = calendar.querySelectorAll('.table__day--off');
let saveButton = document.querySelector('.calendar__link');


// Объект для хранения информации о датах
let dateInfo = {
  April: {
    day2: {
      date: "2 Апреля",
      text: "Подать сведения по форме № 3-Ф за март",
    },
    day8: {
      date: "8 Апреля",
      text: "Подать отчет № П-4 (НЗ)",
    },
    day15: {
      date: "15 Апреля",
      text: "Подать отчет № П-4 за март или за I квартал, СЗВ-ТД и СЗВ-М за март \nПеречислить взносы за март",
    },
    day20: {
      date: "20 Апреля",
      text: "Сдать 4-ФСС за  I квартал на бумаге. \nПредставить ДСВ-3 за I квартал, отчет об использовании взносов на меры по сокращению производственного травматизма и профзаболеваний",
    },
    day27: {
      date: "27 Апреля",
      text: "Подать 4-ФСС за  I квартал в электронном виде,  отчет об использовании взносов на меры по сокращению производственного травматизма и профзаболеваний",
    },
    day30: {
      date: "30 Апреля",
      text: "Подать РСВ за I квартал \nПеречислить НДФЛ с больничных и отпускных, выданных в апреле",
    },
  },
  May: {
    day6: {
      date: "6 Мая",
      text: "Подать сведения по форме № 3-Ф за апрель",
    },
    day8: {
      date: "8 Мая",
      text: "Выплатить отпускные работникам \nСоставить записку-расчет об исчислении среднего заработка при предоставлении отпуска",
    },
    day15: {
      date: "15 Мая",
      text: "Подать отчеты по формам № П-4, СЗВ-ТД и СЗВ-М за апрель \nПеречислить взносы за апрель",
    },
  },
  June: {
    day1: {
      date: "1 Июня",
      text: "Перечислить НДФЛ с больничных и отпускных, выданных в мае",
    },
    day2: {
      date: "2 Июня",
      text: "Подать сведения по форме № 3-Ф за май",
    },
    day15: {
      date: "15 Июня",
      text: "Подать отчеты по формам № П-4, СЗВ-ТД и  СЗВ-М за май \nПеречислить взносы за май",
    },
    day30: {
      date: "30 Июня",
      text: "Перечислить НДФЛ с больничных и отпускных, выданных в июне",
    },
  },
};

//блокируем пустые td
function blockEmptyTd() {
  inactiveDays.forEach(item => {
    item.querySelector('a').tabIndex = -1;
  });
}

blockEmptyTd();

calendar.onclick = (event) => {
  // Возвращаем ближайшего предка, соответствующего селектору td
  let td = event.target.closest('td');
  // Если event.target не содержится внутри td, то возвращаем null
  if (!td) return;

  if (td.classList.contains('table__day--active')) {
    renderDateInfo(td);
  } else if (!td.textContent) {
    return;
  } else {
    renderForm(td);
  }
};


// При нажатии на активную дату выводим под календарь информацию о дате
function renderDateInfo(date) {
  removeBlock();

  // Берём заранее подготовленный шаблон из разметки и делаем его копию
  let template = document.querySelector('#date-info-template').content.querySelector('.date-info');
  let dateInfoElement = template.cloneNode(true);

  // Записываем в переменные месяц и день из ячейки таблицы, по которой произошел клик
  let month = `${date.offsetParent.caption.dataset.month}`;
  let day = `day${(/\*/i.test(date.textContent)) ? date.textContent.slice(0, date.textContent.length-1) : date.textContent}`;

  // Если на выбранной дате присутствует информация, то выводим её в конце таблицы
  if (dateInfo[month][day]) {
    dateInfoElement.querySelector('.date-info__title').textContent = dateInfo[month][day].date;
    dateInfoElement.querySelector('.date-info__text').textContent = dateInfo[month][day].text;
    dateInfoElement.querySelector('.date-info__text').style.whiteSpace = 'pre-line';
    if (dateInfo[month][day].link) {
      dateInfoElement.querySelector('.date-info__link').href = dateInfo[month][day].link;
    } else {
      dateInfoElement.querySelector('.date-info__link').remove();
    }

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

  // Избавляемся от звёздочки, заменяем окончание у месяцев
  day = (/\*/i.test(day)) ? day.slice(0, day.length-1) : day;
  month = month.replace(/[а-я]$/, (match) => {
    return (match === 'т') ? 'та' : 'я';
  });

  // Заполняяем день и месяц
  formElement.querySelector('.form__label').textContent = `${day} ${month}`;

  // Добавляем форму на страницу
  calendar.appendChild(formElement);

  let form = document.querySelector("form");
  form.addEventListener("submit", fillForm);

  function fillForm(event) {
    event.preventDefault();

    let month = td.offsetParent.caption.dataset.month;
    let day = `day${form.querySelector('.form__label').textContent.replace(/\D/g, '')}`;

    dateInfo[month][day] = {
      date: form.querySelector('.form__label').textContent,
      text: form.textarea.value,
    };

    form.remove();
    renderCalendar();
    form.removeEventListener("submit", fillForm);
  }
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

function renderCalendar() {
  for (let month in dateInfo) {
    for (let day in dateInfo[month]) {
      day = day.replace(/\D/g, '');

      let all = calendar.querySelectorAll('.table td');
      all.forEach(item => {
        let holiday = (/\*/i.test(item.textContent)) ? item.textContent.slice(0, item.textContent.length-1) : item.textContent;
        if (holiday == day && item.offsetParent.caption.dataset.month == month) {
          item.classList.add("table__day--active");
        }
      })
    }
  }
}

renderCalendar();


saveButton.addEventListener("click", (event) => {
  event.preventDefault();
  renderDates();
  location.href = 'dates.html';
});

function renderDates() {
  let fragment = document.createDocumentFragment();
  let activeDates = calendar.querySelectorAll('.table__day--active');


  activeDates.forEach(item => {
    // Берём заранее подготовленный шаблон из разметки и делаем его копию
    let template = document.querySelector('#date-info-template').content.querySelector('.date-info');
    let dateInfoElement = template.cloneNode(true);
    dateInfoElement.classList.remove('calendar__info');
    dateInfoElement.classList.add('dates__item');


    // Записываем в переменные месяц и день из ячейки таблицы, по которой произошел клик
    let month = `${item.offsetParent.caption.dataset.month}`;
    let day = `day${(/\*/i.test(item.textContent)) ? item.textContent.slice(0, item.textContent.length-1) : item.textContent}`;

    // Создаём 1 экземпляр и заполняем его
    if (dateInfo[month][day]) {
      dateInfoElement.querySelector('.date-info__title').textContent = dateInfo[month][day].date;
      dateInfoElement.querySelector('.date-info__text').textContent = dateInfo[month][day].text;
      dateInfoElement.querySelector('.date-info__link').remove();

      fragment.appendChild(dateInfoElement);
    }
  });

  let div = document.createElement('div');
  div.appendChild(fragment);
  let selectedText = div.innerHTML;
  localStorage.fragment = JSON.stringify(selectedText);
}

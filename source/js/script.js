'use strict';

let calendar = document.querySelector('.calendar');
let activeDays = calendar.querySelectorAll('.table__day--active');
let inactiveDays = calendar.querySelectorAll('.table__day--off');

// Объект для хранения информации о датах
let dateInfo = {
  January: {
    day9: {
      date: "9 Января",
      text: "something text there",
      link: "https://demo.com",
    },
  },
  February: {
    day3: {
      date: "3 Февраля",
      text: "osofew foweofwefo ofweofow ofwoeofowfo fow",
      link: "https://test.com",
    },
    day17: {
      date: "17 Февраля",
    }
  },
  March: {
    day2: {
      date: "2 Марта",
    },
    day30: {
      date: "30 Марта",
    },
  },
  April: {
    day1: {
      date: "1 Апреля",
    },
    day15: {
      date: "15 Апреля",
    },
    day30: {
      date: "30 Апреля",
    },
  },
  May: {
    day12: {
      date: "12 Мая",
    },
    day15: {
      date: "15 Мая",
    },
  },
  June: {
    day1: {
      date: "1 Июня",
    },
    day29: {
      date: "29 Июня",
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

  day = (/\*/i.test(day)) ? day.slice(0, day.length-1) : day;
  month = month.replace(/[а-я]$/, (match) => {
    return (match === 'т') ? 'та' : 'я';
  });

  formElement.querySelector('.form__label').textContent = `${day} ${month}`;

  calendar.appendChild(formElement);

  let form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let month = td.offsetParent.caption.dataset.month;
    let day = `day${form.querySelector('.form__label').textContent.replace(/\D/g, '')}`;
    dateInfo[month][day] = {
      date: form.querySelector('.form__label').textContent,
      text: form.textarea.value,
    };
    form.remove();
    renderCalendar();
  });
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
      console.log(`месяц ${month} день ${day}`);
      day = day.replace(/\D/g, '');
      let all = calendar.querySelectorAll('.table td');
      all.forEach(item => {
        if (item.textContent == day && item.offsetParent.caption.dataset.month == month) {
          item.classList.add("table__day--active");
        }
      })
    }
  }
}

renderCalendar();

let saveButton = document.querySelector('.calendar__link');

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
    let day = `day${item.textContent}`;
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

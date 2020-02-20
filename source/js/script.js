'use strict';

console.log("success");

let activeDays = document.querySelectorAll('.table__day--active');
let info = activeDays.forEach(item => {
  console.log(`day: ${item.innerText} + month: ${item.offsetParent.caption.textContent}`);
});

console.log(activeDays);

let dateInfo = {
  January: {
    day09: {
      date: "9 Января",
      text: "something text there",
      link: "https://demo.com",
    }
  },
  February: {
    day03: {
      date: "3 Февраля",
      text: "osofew foweofwefo ofweofow ofwoeofowfo fow",
      link: "https://test.com",
    }
  }
};

let calendar = document.querySelector('.calendar');
let selectedTd;

calendar.onclick = function(event) {
  let td = event.target.closest('td');

  if (!td) return;

  if (!calendar.contains(td)) return;

  highlight(td);
};

function highlight(td) {
  // if (selectedTd) { // убрать существующую подсветку, если есть
  //   selectedTd.classList.remove('highlight');
  // }
  // selectedTd = td;
  // selectedTd.classList.toggle('highlight'); // подсветить новый td

  renderDateInfo();
}

function renderDateInfo() {
    if (calendar.querySelector('.date-info')) {
      calendar.querySelector('.date-info').remove();
    }
    let template = document.querySelector('#date-info-template').content.querySelector('.date-info');
    let dateInfoElement = template.cloneNode(true);

    dateInfoElement.querySelector('.date-info__title').textContent = dateInfo.January.day09.date;
    dateInfoElement.querySelector('.date-info__text').textContent = dateInfo.January.day09.text;
    dateInfoElement.querySelector('.date-info__link').href = dateInfo.January.day09.link;

    calendar.appendChild(dateInfoElement);
}


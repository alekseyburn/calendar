# Календарь дел

## Структура главного объекта
В файле `script.js (script.min.js)` находится объект **dateInfo**.

Его структура:
* Месяц (January, etc.)
    * День (day9, etc.)
        * Дата (9 Января, etc.)
        * Текст (Необходимый текст, etc.)  
        * Ссылка (Если есть, то заполняется, создать поле `link` по аналогии с `date` и `text`. Пример: `link: "https://.www.link.com"`)

Пример:
```
January: {
    day1: {
        date: "1 Января",
        text: "Здесь ваш текст",
        link: "https://www.link.com"
    },
    day2: {
        date: "2 Января",
        text: "Здесь ваш текст"
        },
}
```

## Принцип работы

**Готовая сборка лежит в папке `build`.**

Активные даты генерируются из объекта  `dateInfo` и подсвечиваются в календаре.

При нажатии на дату под календарём появляется **информация о дате** - *Дата, текст, ссылка (если есть)*.Если информации о дате нету в объекте, то под календарём открывается форма для заполнения.

При нажатии на кнопку `Сохранить` дата подсвечивается в календаре и сохраняется в объект.

При нажатии на кнопку `Сохранить дела` данные сохраняются в localStorage и передаются на страницу `dates.html`, где форматируются для печати и выводятся друг под другом.


## Заполнение объекта dateInfo

Объект может заполняться вручную в файле `script.js` или через форму, появляющуюся под календарём при нажатии на пустую дату.

Необходимые даты записываем в объект *dateInfo* в файле `script.min.js` из папки `build/js`.

Пример записи для Апреля. Запишем данные для 2 апреля:

```
April: {
    day2: {
      date: "2 Апреля",
      text: "Подать сведения по форме № 3-Ф за март. \nПример текста на другой строке"
    },
}
```

Для переноса строки в поле `text` используем `\n` как в примере выше.

## Создание нового месяца

Копируем разметку начиная с `<li class="calendar__item">` и заканчивая `</li>` и вставляем перед `</ul>`.

Меняем в `<caption>` атрибут `data-month` на нужный месяц на английском языке.

Заполняем `<td>` по необходимому календарному месяцу на примере предыдущих месяцев.

Если дня нету, то добавляем в class этого дня `table__day--off`.

Создаем в `dateInfo` необходимый месяц и заполняем активные даты по примеру из пункта **Заполнение объекта dateInfo**.


## Для разработчиков

вся минификация в `gulpfile.js` отключена. При необходимости разкомментировать.

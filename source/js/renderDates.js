'use strict';

/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */

let stringToHTML = function (str) {
  let dom = document.createElement('section');
  dom.classList.add('dates');
  dom.innerHTML = str;
  return dom;
};

let main = document.querySelector('main');
let info = stringToHTML(JSON.parse(localStorage.fragment));
main.appendChild(info);

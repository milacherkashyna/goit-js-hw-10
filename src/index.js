import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 600;
const inputRef = document.querySelector('input#search-box');
const countriesRef = document.querySelector('.country-list');
const countryRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
function onInput(event) {
  countriesRef.innerHTML = '';
  countryRef.innerHTML = '';
  const name = event.target.value.trim();
  if (!name) {
    return;
  }
  fetchCountries(name)
    .then(result => {
      if (result.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (result.length > 1) {
        renderCountriesList(result);
      } else {
        renderCountryInfo(result[0]);
      }
    })

    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
function renderCountriesList(array) {
  const markup = array
    .map(
      element =>
        `<li class="country__item"><img src="${element.flags.svg}" width="80" heigth="60"/><h2>${element.name.official}</h2></li>`
    )
    .join('');
  countriesRef.innerHTML = markup;
}
function renderCountryInfo(object) {
  const markup = `<img src="${object.flags.svg}" width="80" heigth="60"/><h2>${
    object.name.official
  }</h2><p>capital: ${object.capital}</p><p>population: ${normalizePopulation(
    object.population
  )}</p><p>languages:${normalizeLanguages(object.languages)}</p>`;
  countryRef.innerHTML = markup;
}
function normalizeLanguages(object) {
  const languages = Object.values(object);
  return languages.map(element => ' '.concat(element));
}
function normalizePopulation(string) {
  let normalizeString = String(string).split('').reverse();

  const length = normalizeString.length;
  if (length <= 3) {
    return normalizeString.reverse().join('');
  }
  if (length <= 6) {
    normalizeString.splice(3, 0, ',');
    return normalizeString.reverse().join('');
  }
  if (length <= 9) {
    normalizeString.splice(3, 0, ',');
    normalizeString.splice(7, 0, ',');

    return normalizeString.reverse().join('');
  }
  normalizeString.splice(3, 0, ',');
  normalizeString.splice(7, 0, ',');
  normalizeString.splice(10, 0, ',');

  return normalizeString.reverse().join('');
}

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
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
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}
function renderCountriesList(array) {
  const markup = array
    .map(
      element =>
        `<li class="country__item"><img src="${element.flags.svg}" width="80" higth="60"><h2>${element.name.official}<\h2><\li>`
    )
    .join('');
  countriesRef.innerHTML = markup;
}
// input#search-box

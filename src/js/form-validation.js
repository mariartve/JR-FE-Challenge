import { populateResultsData } from './results';

function showResultsSection() {
  const mainFormSection = document.getElementById('main-form');
  const searchAgainSection = document.getElementById('search-again');
  const featuresSection = document.getElementById('features');
  const resultsSection = document.getElementById('results');

  populateResultsData();

  mainFormSection.classList.add('d-none');
  featuresSection.classList.add('d-none');
  searchAgainSection.classList.remove('d-none');
  resultsSection.classList.remove('d-none');
}

function initInputValidation() {
  document.querySelectorAll('input[type="text"]').forEach(function (input) {
    input.addEventListener('keypress', function (event) {
      const email = input.value.toLowerCase();
      const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (email.match(regEx)) {
        var x = true;
        input.parentNode.classList.remove('error');
      } else {
        var x = false;
      }
      const keycode = event.keyCode ? event.keyCode : event.which;
      if (keycode == '13') {
        event.preventDefault();
        localStorage.clear();

        if (x === true) {
          const proxyurl = '';
          const url = 'https://ltvdataapi.devltv.co/api/v1/records?email=' + email;
          fetch(proxyurl + url)
            .then(function (response) {
              return response.text();
            })
            .then(function (contents) {
              localStorage.setItem('userObject', contents);
              showResultsSection();
            })
            .catch(function (e) {
              console.log(e);
            });
        } else if (x !== true) {
          input.parentNode.classList.add('error');
        }
      }
    });
  });
}

function initSearchButton() {
  document.querySelectorAll('.js-btn-search').forEach(function (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.clear(); // Clears storage for next request
      const selector = e.currentTarget.dataset.form;
      const emailInput = document.getElementById(`email-${selector}-input`);
      const email = emailInput.value.toLowerCase();

      let x;
      const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (email.match(regEx)) {
        x = true;
      } else {
        x = false;
      }

      if (x === true) {
        emailInput.parentNode.classList.remove('error');
        const proxyurl = '';
        const url = 'https://ltvdataapi.devltv.co/api/v1/records?email=' + email;
        fetch(proxyurl + url)
          .then(function (response) {
            return response.text();
          })
          .then(function (contents) {
            localStorage.setItem('userObject', contents);
            showResultsSection();
          })
          .catch(function (e) {
            console.log(e);
          });
      } else if (x !== true) {
        emailInput.parentNode.classList.add('error');
      }
    });
  });
}

export { initInputValidation, initSearchButton };

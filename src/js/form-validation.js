import { populateResultsData } from './results';

/* Created functions to show/hide the loading screen accordingly */
function showLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.remove('d-none');
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.add('d-none');
}

function showResultsSection() {
  const mainFormSection = document.getElementById('main-form');
  const searchAgainSection = document.getElementById('search-again');
  const featuresSection = document.getElementById('features');
  const resultsSection = document.getElementById('results');

  populateResultsData();
  
  /* Hide any of this sections that could be displayed on screen before showing the loading screen */
  mainFormSection.classList.add('d-none');
  featuresSection.classList.add('d-none');
  searchAgainSection.classList.add('d-none');
  resultsSection.classList.add('d-none');
 
  /* Display the loading screen for an extra 0.5 seconds so it is more visible, then hide it and show the results */
  setTimeout(function() {
    hideLoadingScreen();
    searchAgainSection.classList.remove('d-none');
    resultsSection.classList.remove('d-none');
  }, 3000);
}

const emailSearchButton = document.getElementById('email-btn-search');
const phoneSearchButton = document.getElementById('phone-btn-search');
const emailInput = document.getElementById('email-search-input');
const errorMsg = document.getElementById('error-msg-s');

emailSearchButton.addEventListener('click', function (e) {
  e.preventDefault();
  phoneSearchButton.classList.remove('active');
  emailSearchButton.classList.add('active');
  emailInput.placeholder = "Enter an email address";
  errorMsg.innerText = "Please enter a valid email address";
});

phoneSearchButton.addEventListener('click', function (e) {
  e.preventDefault();
  emailSearchButton.classList.remove('active');
  phoneSearchButton.classList.add('active');
  emailInput.placeholder = "Enter a phone number"; 
  errorMsg.innerText = "Please enter a valid phone number";
});

const emailSearchButtonSA = document.getElementById('email-btn-search-again');
const phoneSearchButtonSA = document.getElementById('phone-btn-search-again');
const emailInputSA = document.getElementById('email-search-again-input');
const errorMsgSA = document.getElementById('error-msg-sa');

emailSearchButtonSA.addEventListener('click', function (e) {
  e.preventDefault();
  phoneSearchButtonSA.classList.remove('active');
  emailSearchButtonSA.classList.add('active');
  emailInputSA.placeholder = "Enter an email address";
  errorMsgSA.innerText = "Please enter a valid email address";
});

phoneSearchButtonSA.addEventListener('click', function (e) {
  e.preventDefault();
  emailSearchButtonSA.classList.remove('active');
  phoneSearchButtonSA.classList.add('active');
  emailInputSA.placeholder = "Enter a phone number"; 
  errorMsgSA.innerText = "Please enter a valid phone number";
});

emailInput.addEventListener('click', function() {
  emailInput.parentNode.classList.remove('error');
})

emailInputSA.addEventListener('click', function() {
  emailInputSA.parentNode.classList.remove('error');
})

function initInputValidation() {
  document.querySelectorAll('input[type="text"]').forEach(function (input) {
    input.addEventListener('keypress', function (event) {
      const searchValue = input.value.toLowerCase();
      let isValid = false;
      let apiUrl = '';
      let localEmailSearchButton = null, localPhoneSearchButton = null;
      
      if (input.id === emailInput.id) {
        localEmailSearchButton = emailSearchButton;
        localPhoneSearchButton = phoneSearchButton;
      } else if (input.id === emailInputSA.id){
        localEmailSearchButton = emailSearchButtonSA;
        localPhoneSearchButton = phoneSearchButtonSA;
      }

      if (localEmailSearchButton.classList.contains('active')) {
          isValid = validateEmail(searchValue);
          apiUrl = 'https://ltvdataapi.devltv.co/api/v1/records?email=';
      } else if (localPhoneSearchButton.classList.contains('active')) {
          isValid = validatePhoneNumber(searchValue);
          apiUrl = 'https://ltvdataapi.devltv.co/api/v1/records?phone='
      }

      const keycode = event.keyCode ? event.keyCode : event.which;
      if (keycode == '13') {
        event.preventDefault();
        localStorage.clear();

        if (isValid) {
          const proxyurl = '';
          const url = apiUrl + searchValue;
          showLoadingScreen(); // Show loading screen before fetch
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
        } else {
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
      const searchValue = emailInput.value.toLowerCase();
      const emailSearchButton = document.getElementById(`email-btn-${selector}`);
      const phoneSearchButton = document.getElementById(`phone-btn-${selector}`);
     
      let isValid = false;
      let apiUrl = '';

      if (emailSearchButton.classList.contains('active')) {
        isValid = validateEmail(searchValue);
        apiUrl = 'https://ltvdataapi.devltv.co/api/v1/records?email=';
      } else if (phoneSearchButton.classList.contains('active')) {
          isValid = validatePhoneNumber(searchValue);
          apiUrl = 'https://ltvdataapi.devltv.co/api/v1/records?phone='
      }

      if (isValid) {
        emailInput.parentNode.classList.remove('error');
        const proxyurl = '';
        const url = apiUrl + searchValue;
        showLoadingScreen(); 
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
      } else {
        emailInput.parentNode.classList.add('error');
      }
    });
  });
}

function validateEmail(email) {
  const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regEx.test(email);
}


function validatePhoneNumber(phoneNumber) {
  const regEx = /^\d{10}$/; 
  return regEx.test(phoneNumber);
}

export { initInputValidation, initSearchButton };

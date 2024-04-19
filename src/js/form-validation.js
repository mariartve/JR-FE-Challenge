import { populateResultsData } from './results';

/* Declared the API request fields to avoid repetitive code */
const API_BASE_URL = 'https://ltvdataapi.devltv.co/api/v1/records?';
const PROXY_URL = ''; 

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
  }, 500);
}

/* Improved the change between search modes making it more dynamic and generic, reducing repetitive code*/
function initSearchSection(containerName, emailBtnName, phoneBtnName, emailInputName, errorMsgName) {
  const container = document.getElementById(containerName);
  const emailSearchButton = container.querySelector(`#${emailBtnName}`);
  const phoneSearchButton = container.querySelector(`#${phoneBtnName}`);
  const emailInput = container.querySelector(`#${emailInputName}`);
  const errorMsg = container.querySelector(`#${errorMsgName}`);

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
}

// Apply the above function to both forms
initSearchSection('search-again', 'email-btn-search-again', 'phone-btn-search-again', 'email-search-again-input', 'error-msg-sa');
initSearchSection('main-form', 'email-btn-search', 'phone-btn-search', 'email-search-input', 'error-msg-s');


function initInputValidation() {
  document.querySelectorAll('input[type="text"]').forEach(function (input) {
    input.addEventListener('keypress', function (event) {
      const searchValue = input.value.toLowerCase();
      let isValid = false;
      let apiUrl = '';
      let emailSearchButton, phoneSearchButton;

      /* Reviewed the management of the needed elements making it simpler */
      if (input.id === "email-search-input") {
        emailSearchButton = document.getElementById('email-btn-search');
        phoneSearchButton = document.getElementById('phone-btn-search');
      } else if (input.id === "email-search-again-input") {
        emailSearchButton = document.getElementById('email-btn-search-again');
        phoneSearchButton = document.getElementById('phone-btn-search-again');
      }
      else {
        return;
      }

      if (emailSearchButton.classList.contains('active')) {
        isValid = validateEmail(searchValue);
        apiUrl = `${API_BASE_URL}email=`;
      } else if (phoneSearchButton.classList.contains('active')) {
        isValid = validatePhoneNumber(searchValue);
        apiUrl = `${API_BASE_URL}phone=`;
      }

      const keycode = event.keyCode ? event.keyCode : event.which;
      if (keycode == '13') {
        event.preventDefault();
        localStorage.clear();
        if (isValid) {
          const url = apiUrl + searchValue;
          showLoadingScreen(); // Show loading screen before fetch
          fetch(PROXY_URL + url)
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
        apiUrl = `${API_BASE_URL}email=`;
      } else if (phoneSearchButton.classList.contains('active')) {
          isValid = validatePhoneNumber(searchValue);
          apiUrl = `${API_BASE_URL}phone=`;
      }

      if (isValid) {
        emailInput.parentNode.classList.remove('error');
        const url = apiUrl + searchValue;
        showLoadingScreen(); 
        fetch(PROXY_URL + url)
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

/* Added validation functions so they can be used when and wherever needed */
function validateEmail(email) {
  const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regEx.test(email);
}

function validatePhoneNumber(phoneNumber) {
  const regEx = /^\d{10}$/; 
  return regEx.test(phoneNumber);
}

const emailInput = document.getElementById('email-search-input');
const emailInputSA = document.getElementById('email-search-again-input');

/* Click event listeners to hide the error message when clicking the input again */
function handleInputClick(event) {
  event.target.parentNode.classList.remove('error');
}

emailInput.addEventListener('click', handleInputClick);
emailInputSA.addEventListener('click', handleInputClick);


export { initInputValidation, initSearchButton };

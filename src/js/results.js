function populateResultsData() {
  if (window.localStorage) {
    if (localStorage.userObject) {
      const user_object = localStorage.getItem('userObject');
      let testVar;
      const retreivedObject = JSON.parse(user_object); //parses the retrieved object into an JSON object
      if (JSON.stringify(retreivedObject) == '[]') {
        document.getElementById('result-count').textContent = '0 Results';
        document.querySelector('.result-desc').textContent = 'Try starting a new search below';
        document.querySelector('.js-result-wrap').classList.add('d-none');
      } else {
        document.getElementById('result-count').textContent = '1 Result';
        document.getElementById('result-subtext').innerHTML =
          'Look at the result below to see the details of the person you’re searched for.';
        document.querySelector('.name').innerHTML =
          retreivedObject.first_name + ' ' + retreivedObject.last_name;
        document.querySelector('.user-description').innerHTML = retreivedObject.description;
        document.getElementById('address').innerHTML = '<p>' + retreivedObject.address + '</p>';
        document.querySelector('.email').innerHTML = '<p>' + retreivedObject.email + '</p>';

        document.querySelector('.phone-num').innerHTML = '';
        document.querySelector('.relatives').innerHTML = '';
        for (const phone_number in retreivedObject.phone_numbers) {
          const phone = retreivedObject.phone_numbers[phone_number];
          const formatted_phone =
            '(' +
            phone.substring(0, 3) +
            ') ' +
            phone.substring(3, 6) +
            '-' +
            phone.substring(6, 10);

          document.querySelector('.phone-num').innerHTML +=
            "<a href='tel:" +
            phone +
            "' style='display: block;color: #004A80;'>" +
            formatted_phone +
            '</a>';
        }

        for (const relative in retreivedObject.relatives) {
          document.querySelector('.relatives').innerHTML +=
            "<p style='margin-bottom: 0'>" + retreivedObject.relatives[relative] + '</p>';
        }

        document.querySelector('.js-result-wrap').classList.remove('d-none');
      }
    }
  }
}

export { populateResultsData };

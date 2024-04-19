import 'bootstrap/dist/css/bootstrap.css';
import './src/styles/main.scss';
import { initInputValidation, initSearchButton } from './src/js/form-validation';

(function init() {
  initInputValidation();
  initSearchButton();
})();

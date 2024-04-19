import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';
import { initInputValidation, initSearchButton } from './js/form-validation';

(function init() {
  initInputValidation();
  initSearchButton();
})();

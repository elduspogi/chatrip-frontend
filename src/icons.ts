import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faArrowUp, faBars, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

function bootFontLibrary() {
  library.add(faCircleExclamation, faXmark, faArrowLeft, faArrowUp, faBars);
}

export default bootFontLibrary;

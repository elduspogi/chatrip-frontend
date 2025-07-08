import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faArrowUp, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

function bootFontLibrary() {
  library.add(faCircleExclamation, faXmark, faArrowLeft, faArrowUp);
}

export default bootFontLibrary;

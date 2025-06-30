import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

function bootFontLibrary() {
  library.add(faCircleExclamation, faXmark, faArrowLeft);
}

export default bootFontLibrary;

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

function bootFontLibrary() {
  library.add(faCircleExclamation, faXmark);
}

export default bootFontLibrary;

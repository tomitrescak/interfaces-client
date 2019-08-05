import { EditorComponentCatalogue } from '@toryjs/form';

import { DetailEditor } from './detail_link';
import { BrowseDataEditor } from './browse_data';

export const catalogueEditor: EditorComponentCatalogue = {
  components: {
    DetailLink: DetailEditor,
    BrowseData: BrowseDataEditor
  },
  cssClass: ''
};

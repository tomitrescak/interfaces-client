import { DetailLink } from './detail_link';

import { FormComponentCatalogue } from '@toryjs/form';
import { BrowseDataView } from './browse_data';

export const catalogue: FormComponentCatalogue = {
  components: {
    DetailLink: DetailLink,
    BrowseData: BrowseDataView
  },
  cssClass: ''
};

import { merge } from '@toryjs/ui';

import { catalogueEditor as appc } from '../components/catalogue_editor';
import { catalogueEditor as vc } from '@toryjs/components-vanilla';
import { catalogueEditor as ac } from '@toryjs/components-apollo';
import { catalogueEditor as rc } from '@toryjs/components-react-alert';
import { catalogueEditor as rrc } from '@toryjs/components-react-router';
import { catalogueEditor as sc } from '@toryjs/components-semantic-ui';
import { catalogueEditor as authc } from '@toryjs/components-auth-graphql-react-router';
import { catalogueEditor as tc } from '@toryjs/components-toryjs';

export const editorCatalogue = merge(vc, ac, rc, rrc, sc, appc, authc, tc);

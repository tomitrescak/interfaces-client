import { catalogue as appc } from '../components/catalogue';
import { catalogue as vc } from '@toryjs/components-vanilla';
import { catalogue as ac } from '@toryjs/components-apollo';
import { catalogue as rc } from '@toryjs/components-react-alert';
import { catalogue as rrc } from '@toryjs/components-react-router';
import { catalogue as sc } from '@toryjs/components-semantic-ui';
import { catalogue as authc } from '@toryjs/components-auth-graphql-react-router';
import { catalogue as tc } from '@toryjs/components-toryjs';

import { merge } from '@toryjs/ui';

export const componentCatalogue = merge(appc, vc, ac, rc, sc, rrc, authc, tc);

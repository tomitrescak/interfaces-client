import { ApolloQueryView, ApolloQueryEditor } from '@toryjs/components-apollo';
import { propGroup, boundProp, prop, handlerProp, dataProp } from '@toryjs/ui';
import {} from '@toryjs/ui/dist/cjs/common';

export const BrowseDataView = ApolloQueryView;

export const BrowseDataEditor = { ...ApolloQueryEditor };

BrowseDataEditor.control = 'BrowseData';
BrowseDataEditor.title = 'Browse Data';
BrowseDataEditor.defaultProps = {
  query: `query Find($searchString: String, $name: String!, $limit: Int) {
    find(searchString: $searchString, name: $name, limit: $limit)
  }`,
  onSubmit: `getBrowseProperties`,
  limit: 1000
};
BrowseDataEditor.props = {
  ...propGroup('Browse', {
    searchString: boundProp(),
    name: prop(),
    limit: prop({ type: 'integer' }),
    target: dataProp({
      documentation:
        'Target dataset field, where you can (but do not have to) store the query result',
      label: 'Target'
    })
  }),
  ...propGroup('Static', {
    query: prop({
      label: 'Query',
      documentation: 'GraphQL query, e.g. <pre>query People { name, sex }</pre>',
      control: 'Code',
      props: {
        display: 'topLabel',
        language: 'graphql'
      },
      type: 'string'
    }),
    onSubmit: handlerProp()
  })
};

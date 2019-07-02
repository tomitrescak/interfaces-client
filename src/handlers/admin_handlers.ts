import { DataSet, Handler } from '@tomino/dynamic-form';
import { formDatasetToJS } from '@tomino/dynamic-form-semantic-ui';
import { buildDataSet } from '@tomino/dynamic-form';
import { toJS, observable, action } from 'mobx';
import gql from 'graphql-tag';

type Data = {
  newTable: string;
};

const empty = [{ text: 'None', value: '' }];
const emptySchema = JSON.stringify({ type: 'object', properties: {} });

type ModalProps = {
  title?: string;
  text?: string;
  confirmText?: string;
  callBack?: Function;
};

export const modalConfig = observable({
  isOpen: false,
  title: 'Please confirm your action',
  text: '',
  confirmText: 'Delete',
  callBack: null
});

export const confirmAction = action((props: ModalProps) => {
  if (props.text) {
    modalConfig.text = props.text;
  }
  if (props.title) {
    modalConfig.title = props.title;
  }
  if (props.confirmText) {
    modalConfig.confirmText = props.confirmText;
  }
  if (props.callBack) {
    modalConfig.callBack = props.callBack;
  }
  modalConfig.isOpen = true;
});

export const parseConfig: Handler = ({ owner, args }) => {
  const client = JSON.parse(args.config.config);
  const users = args.config.users;

  owner.setValue('config', client);
  owner.setValue('config.users', users);
};

export const addTable: Handler = ({ owner }) => {
  if (owner.validateField('newTable')) {
    return;
  }
  owner.addRow('config.tables', { tableName: owner.getValue('newTable'), schema: emptySchema });
};

export const addQuery: Handler = ({ owner }) => {
  if (owner.validateField('newQuery')) {
    return;
  }
  owner.addRow('config.queries', { name: owner.getValue('newQuery') });
};

export const addView: Handler = ({ owner }) => {
  if (owner.validateField('newView')) {
    return;
  }
  owner.addRow('config.views', { title: owner.getValue('newView') });
};

export const addLookup: Handler = ({ owner }) => {
  if (owner.validateField('newLookup')) {
    return;
  }
  owner.addRow('config.lookups', { name: owner.getValue('newLookup') });
};

export const removeTable: Handler = ({ owner, context }) => {
  confirmAction({
    text: 'Do you wish to delete this table?',
    callBack: () => owner.parent.removeRowData('tables', owner)
  });
};

export const removeQuery: Handler = ({ owner }) => {
  confirmAction({
    text: 'Do you wish to delete this query?',
    callBack: () => owner.parent.removeRowData('queries', owner)
  });
};

export const removeView: Handler = ({ owner }) => {
  confirmAction({
    text: 'Do you wish to delete this view?',
    callBack: () => owner.parent.removeRowData('views', owner)
  });
};

export const removeLookup: Handler = ({ owner }) => {
  confirmAction({
    text: 'Do you wish to delete this lookup?',
    callBack: () => owner.parent.removeRowData('lookups', owner)
  });
};

export const parseSaveConfigVariables: Handler = ({ owner }) => {
  const config = formDatasetToJS(owner.getValue('config'));
  const users = config.users;
  delete config.users;
  return {
    config: JSON.stringify(config),
    users
  };
};

export const tableList: Handler = ({ owner }) => {
  const tables = owner.getValue('/config.tables');
  return empty.concat(tables.map((t: any) => ({ text: t.tableName, value: t.tableName })));
};

export const queryList: Handler = ({ owner }) => {
  const queries = owner.getValue('/config.queries');
  return empty.concat(queries.map((t: any) => ({ text: t.name, value: t.name })));
};

export const queryByView: Handler = ({ owner }) => {
  const views: any = owner.getValue('/config.views');
  const selectedViewName = owner.getValue('/view');
  const view = views.find((v: any) => v.title.toLowerCase() === selectedViewName);
  if (view) {
    return { name: view.searchName };
  }
  return {};
};

export const tableByView: Handler = ({ owner, props, context }) => {
  const views: any = owner.getValue('/config.views');
  const selectedViewName = owner.getValue('/view');
  const view = views.find((v: any) => v.title.toLowerCase() === selectedViewName);
  if (view) {
    let table = findTable(owner, view.searchName);
    return { table: table.tableName };
  }
  return {};
};

export const listDefinitionByView: Handler = ({ owner }) => {
  const { view } = findTableByView(owner);
  if (view) {
    const definition = JSON.parse(view.form || '{}');
    return {
      formElement: definition.elements ? definition.elements[0] : {},
      owner
    };
  }
  return {};
};

export const isAdd: Handler = ({ owner, args }) => {
  return Object.keys(owner).indexOf('newView') === -1;
};

export const detailDefinitionByView: Handler = ({ owner, props }) => {
  const { table, view } = findTableByView(owner);
  if (view) {
    const definition = JSON.parse(view.form || '{}');
    const formElement = (definition.pages && definition.pages[0]) || {};

    // append elements if there are any
    if (props.formElement.elements && props.formElement.elements.length) {
      formElement.elements = [...(formElement.elements || []), ...toJS(props.formElement.elements)];
    }

    const data = props.dataProps && props.dataProps.data ? props.dataProps.data.data : {};
    const schema = JSON.parse(table.schema);
    const dataSet = buildDataSet(schema, data);

    return {
      formElement,
      owner: dataSet,
      extra: {
        table,
        view
      }
    };
  }
  return {};
};

function columns(owner: DataSet, table: string) {
  if (!table) {
    return [];
  }
  try {
    const tables = owner.getValue('/config.tables');
    const current = tables.find((t: any) => t.tableName === table);
    if (current.schema) {
      const schema = JSON.parse(current.schema);
      return empty.concat(Object.keys(schema.properties).map((t: any) => ({ text: t, value: t })));
    }
  } catch (ex) {
    return { text: ex.message, value: '' };
  }
  return [];
}

export const columnList: Handler = ({ props }) => {
  // const cols = props.dataProps.getValue('/tableColumns');
  // if (cols.length > 0) {
  //   return cols;
  // }
  return columns(props.dataProps, props.dataProps.getValue('table'));
  // try {
  //   const table = extra.getValue('table');
  //   const tables = extra.getValue('/config.tables');
  //   if (table) {
  //     const current = tables.find((t: any) => t.tableName === table);
  //     if (current.schema) {
  //       const schema = JSON.parse(current.schema);
  //       return Object.keys(schema.properties).map((t: any) => ({ text: t, value: t }));
  //     }
  //   }
  // } catch (ex) {
  //   return { text: ex.message, value: '' };
  // }
  // return [];
};

export const lookupColumnList: Handler = ({ owner, props }) => {
  let extra = props.dataProps;
  let table = owner.getValue('table');
  if (!table && extra) {
    table = extra.getValue('table');
    owner = extra;
  }
  return columns(owner, owner.getValue('table'));
};

export const setColumns: Handler = ({ owner, props }) => {
  let c = columns(owner, owner.getValue('table'));
  owner.setValue('/tableColumns', c);
};

function findTableByView(owner: DataSet) {
  const views: any = owner.getValue('/config.views');
  const selectedViewName = owner.getValue('/view');
  const view = views.find((v: any) => v.title.toLowerCase() === selectedViewName);
  return { view, table: findTable(owner, view.searchName) };
}

function findTable(owner: DataSet, queryName: string) {
  if (queryName) {
    const queries = owner.getValue('/config.queries');
    const query = queries.find((t: any) => t.name === queryName);
    if (query) {
      const tables = owner.getValue('/config.tables');
      const current = tables.find((t: any) => t.tableName === query.table);
      return current;
    }
  }
  return null;
}

const defaultForm = {
  control: 'Form',
  elements: [
    {
      control: 'Table',
      elements: [{ props: {} }],
      props: { control: 'Table', locked: true }
    }
  ],
  pages: [{ control: 'Form', props: { locked: true, editorLabel: 'Detail' } }],

  props: { editorLabel: 'List' }
};

const defaultFormString = JSON.stringify(defaultForm);

export const getForm: Handler = ({ owner }) => {
  let current = owner.getValue('form');
  if (!current) {
    current = defaultFormString;
  }
  return current;
};

export const saveForm: Handler = ({ owner, args }) => {
  owner.setValue('form', args.form);
};

export const getViewSchema: Handler = ({ owner }) => {
  const current = findTable(owner, owner.getValue('searchName'));
  if (current && current.schema) {
    return current.schema;
  }
  return null;
};

export const saveViewSchema: Handler = ({ owner, args }) => {
  const current = findTable(owner, owner.getValue('searchName'));
  current.setValue('schema', args.schema);
};

export const viewColumnList: Handler = ({ args: { extra } }) => {
  try {
    const queryName = extra.getValue('searchName');
    if (queryName) {
      const queries = extra.getValue('/config.queries');
      const query = queries.find((t: any) => t.name === queryName);
      if (query) {
        const tables = extra.getValue('/config.tables');
        const current = tables.find((t: any) => t.tableName === query.table);
        if (current.schema) {
          const schema = JSON.parse(current.schema);
          return Object.keys(schema.properties).map((t: any) => ({ text: t, value: t }));
        }
      }
    }
  } catch (ex) {
    return { text: ex.message, value: '' };
  }
  return [];
};

export const formMaximise: Handler = ({ args: { e } }) => {
  (global as any).formMaximise();

  if (e.currentTarget.style.position === 'fixed') {
    e.currentTarget.style.position = 'inherit';
    e.currentTarget.style.zIndex = '0';
    e.currentTarget.innerHTML = '<i aria-hidden="true" class="eye icon"></i> Zoom';
  } else {
    e.currentTarget.style.position = 'fixed';
    e.currentTarget.style.top = '10px';
    e.currentTarget.style.right = '10px';
    e.currentTarget.style.zIndex = '10000000';
    e.currentTarget.innerHTML = '<i class="icon close"></i> Close';
  }
};

export const resetData: Handler = ({ owner }) => {
  owner.reset();
};

export const undo: Handler = ({ context }) => {
  context.undoManager.undo();
};

export const redo: Handler = ({ context }) => {
  context.undoManager.redo();
};

export const saveData: Handler = ({ owner, props }) => {
  const errorMessage = owner.validateDataset(true);
  if (errorMessage) {
    return null;
  }

  const { table } = props.extra;
  const data: any = toJS(owner);
  delete data.history;
  delete data.errors;

  return {
    table: table.tableName,
    data
  };
};

export const deleteTable: Handler = ({ owner, args, context }) => {
  const view = owner.view;
  const data = toJS(args.data);
  const client = context.app.client;
  const alert = context.alert;
  const { table } = findTableByView(owner);
  const id = data[args.index][table.idName];

  if (window.confirm('Do you wish to delete this record?')) {
    client
      .mutate({
        mutation: gql(`mutation Delete($table: String!, $id: String!) {
      delete(table: $table, id: $id)
    }`),
        variables: {
          table: table.tableName,
          id
        }
      })
      .then(() => {
        alert.info('Deleted');
        client.resetStore();
      })
      .catch((ex: any) => {
        alert.error('Error: ' + ex.message);
      });
  }
};

export const saveTable: Handler = ({ owner, props, args, context }) => {
  // const errorMessage = args.data.validateDataset(true);
  // if (errorMessage) {
  //   return null;
  // }

  const view = owner.view;
  const data = toJS(args.data);
  const client = context.app.client;
  const alert = context.alert;
  const { table } = findTableByView(owner);

  delete data.history;
  delete data.errors;

  client
    .mutate({
      mutation: gql(`mutation SaveData($table: String!, $data: JSON) {
      save(table: $table, data: $data) {
        id
        table
        key
        data
      }
    }`),
      variables: {
        table: table.tableName,
        data
      }
    })
    .then(() => {
      alert.info('Saved');
      client.resetStore();
    })
    .catch((ex: any) => {
      alert.error('Error: ' + ex.message);
    });

  return [];
  // const { table } = props.extra;
  // const data: any = toJS(args.data);
  // delete data.history;
  // delete data.errors;

  // return {
  //   table: table.tableName,
  //   data
  // };
};

const searchQuery = gql`
  query Search($searchString: String!, $searchName: String, $limit: Int, $searchByValue: Boolean) {
    search(
      searchString: $searchString
      name: $searchName
      limit: $limit
      searchByValue: $searchByValue
    ) {
      key
      value
      title
      titles
      description
    }
  }
`;

export const logout: Handler = ({ context }) => {
  context.auth.logout();
};

export const lookup: Handler = async ({ owner, args }) => {
  const { value, lookup, single, limit, context, searchByValue } = args;
  const result = await context.app.client.query({
    query: searchQuery,
    variables: {
      searchName: lookup,
      searchString: (value || '').toString(),
      searchByValue,
      limit: single ? 1 : limit || 10
    }
  });
  return result.data.search || {};
};

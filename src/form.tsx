import React from 'react';

import { Modal, Header, Icon, Button } from 'semantic-ui-react';

import { modalConfig } from './handlers/admin_handlers';

import { observer } from 'mobx-react';

import { ToryForm, EditorContext, Context } from '@toryjs/ui';
import { componentCatalogue } from './config/component_catalogue';
import { editorCatalogue } from './config/editor_catalogue';
import { handlers } from './config/handlers';
import { storage } from './config/storage';
// import { catalogue } from './config/component_catalogue';
// import { catalogueEditor } from './components/catalogue_editor';
import { themes } from '@toryjs/editor';

const Confirm: React.FC = observer(() => {
  const onClose = React.useCallback(() => (modalConfig.isOpen = false), []);
  return (
    <Modal open={modalConfig.isOpen} onClose={onClose} size="small">
      <Header icon="warning" content="Please confirm your action" />
      <Modal.Content>
        <h3>{modalConfig.text}</h3>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="red"
          onClick={() => {
            modalConfig.callBack();
            onClose();
          }}
        >
          <Icon name="checkmark" /> {modalConfig.confirmText}
        </Button>
        <Button onClick={onClose}>
          <Icon name="ban" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

// const context = new ContextType();

const Form: React.FC = props => {
  const context = React.useContext(Context);
  context.editor = new EditorContext(
    componentCatalogue,
    editorCatalogue,
    handlers,
    [],
    themes.light
  );

  return (
    <>
      <Confirm />
      <ToryForm
        catalogue={componentCatalogue}
        project={
          process.env.NODE_ENV === 'production' ? require('./app/default/website.json') : undefined
        }
        storage={process.env.NODE_ENV === 'development' ? storage : undefined}
        handlers={handlers as any}
        context={context}
      />
    </>
  );
};

export default Form;

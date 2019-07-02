import React, { Suspense } from 'react';

import { Modal, Header, Icon } from 'semantic-ui-react';

import * as adminHandlers from './handlers/admin_handlers';
import { modalConfig } from './handlers/admin_handlers';

import { Button } from 'semantic-ui-react';
import { Observer, observer } from 'mobx-react';

import { FormView, merge, Context, ContextType, context } from '@tomino/dynamic-form-semantic-ui';

import { combinedCatalogue } from '@tomino/dynamic-form-semantic-ui';

import { vanillaCatalogue } from '@tomino/dynamic-form-semantic-ui';
import { vanillaEditorCatalogue } from '@tomino/dynamic-form-semantic-ui';

import { semanticCatalogue } from '@tomino/dynamic-form-semantic-ui';
import { semanticEditorCatalogue } from '@tomino/dynamic-form-semantic-ui';

import { routerCatalogue } from '@tomino/dynamic-form-semantic-ui';
import { routerEditorCatalogue } from '@tomino/dynamic-form-semantic-ui';

import { catalogue as app } from './components/catalogue';
import { catalogue as appEditor } from './components/catalogue_editor';

import { editorCatalogue } from '@tomino/dynamic-form-semantic-ui';

import { FormModel, initUndoManager } from '@tomino/dynamic-form';
import { css } from 'emotion';
import {
  ServerStorage,
  IProject,
  EditorState,
  EditorContext
} from '@tomino/dynamic-form-semantic-ui';
import { observable } from 'mobx';

const editButton = css`
  position: fixed;
  right: 12px;
  bottom: 12px;
`;

type Props = {
  allowEdit: boolean;
};

const Editor: any = React.lazy(() => import('./web_editor'));
const storage = new ServerStorage(
  process.env.NODE_ENV !== 'development' ? '/api/website' : 'http://localhost:4000/api/website',
  'jwtToken'
);

window.addEventListener('error', function(e) {
  const { error } = e;
  if (!error.captured) {
    error.captured = true;
    e.stopImmediatePropagation();
    e.preventDefault();
    // Revisit this error after the error boundary element processed it
    setTimeout(() => {
      // can be set by the error boundary error handler
      if (!error.shouldIgnore) {
        // but if it wasn't caught by a boundary, release it back to the wild
        throw error;
      }
    });
  }
});

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

const App: React.FC = () => {
  const [isEditing, setEdit] = React.useState(window.location.href.indexOf('?editor') > 0);
  const [project, setProject] = React.useState<IProject>({});

  const onClose = React.useCallback(() => setEdit(false), []);
  const onOpen = React.useCallback(() => setEdit(true), []);

  const setDefault = () =>
    setProject({
      id: '0',
      form: {},
      schema: {}
    });

  if (!project.id) {
    storage
      .loadProject()
      .then(current => {
        if (current && current.id) {
          setProject(current);
        } else {
          setDefault();
        }
      })
      .catch(error => {
        console.error(error);
        setDefault();
      });
    return <div />;
  }

  const formModel = isEditing ? null : new FormModel(project.form!, project.schema!, {}, true);

  const handlers = {
    ...adminHandlers
  };

  // catalogues for viewers
  // const componentCatalogue = merge(catalogue, editorCatalogue);

  // catalogues for app editor
  const editorEditorCatalogue = merge(
    vanillaEditorCatalogue,
    semanticEditorCatalogue,
    routerEditorCatalogue,
    appEditor
  );
  const editorComponentCatalogue = merge(vanillaCatalogue, semanticCatalogue, routerCatalogue, app);
  const appCatalogue = merge(combinedCatalogue, editorCatalogue, app);

  const editorContext = new EditorState(editorComponentCatalogue, editorEditorCatalogue, handlers);
  const appContext: ContextType = context;

  (appContext as any).undoManager = initUndoManager(formModel ? formModel.dataSet : ({} as any));

  return (
    <Context.Provider value={appContext}>
      <Confirm />
      <Suspense fallback={<div>Loading Editor ...</div>}>
        {isEditing ? (
          <Editor project={project} storage={storage} />
        ) : (
          <EditorContext.Provider value={editorContext}>
            <FormView
              formElement={formModel!.formDefinition}
              owner={formModel!.dataSet}
              catalogue={appCatalogue}
              handlers={handlers}
            />
          </EditorContext.Provider>
        )}

        <Observer>
          {() => (
            <>
              {appContext.auth.user &&
                appContext.auth.user.roles!.indexOf('admin') >= 0 &&
                (isEditing ? (
                  <Button
                    size="tiny"
                    compact
                    icon="close"
                    primary
                    onClick={onClose}
                    className={editButton}
                  />
                ) : (
                  <Button
                    size="tiny"
                    compact
                    content="Open Editor"
                    onClick={onOpen}
                    className={editButton}
                  />
                ))}
            </>
          )}
        </Observer>
      </Suspense>
    </Context.Provider>
  );
};

export default App;

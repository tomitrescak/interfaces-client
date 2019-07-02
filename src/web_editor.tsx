import React from 'react';

import * as handlers from './handlers/admin_handlers';

import {
  merge,
  combinedCatalogue,
  FormEditor,
  EditorState,
  combinedEditorCatalogue,
  editorCatalogue,
  editorEditorCatalogue,
  IProject,
  IStorage,
  Context
} from '@tomino/dynamic-form-semantic-ui';
import { initUndoManager } from '@tomino/dynamic-form';

const componentCatalogue = merge(combinedCatalogue, editorCatalogue);
const componentEditorCatalogue = merge(combinedEditorCatalogue, editorEditorCatalogue);

type Props = {
  project: IProject;
  storage: IStorage;
};

const Editor: React.FC<Props> = ({ project, storage }) => {
  const context = new EditorState(
    componentCatalogue,
    componentEditorCatalogue,
    handlers,
    [],
    storage
  );

  if (!context.project) {
    context.load(project);
    context.undoManager = initUndoManager(context.project);
  }
  return (
    <FormEditor context={context} showTopMenu={true} allowSave={true} fileOperations={false} />
  );
};

export default Editor;

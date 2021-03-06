import * as React from 'react';
import { ToryEditor, themes } from '@toryjs/editor';
import { componentCatalogue } from './config/component_catalogue';
import { editorCatalogue } from './config/editor_catalogue';
import { handlers } from './config/handlers';
import { storage } from './config/storage';

const Editor: React.FC = props => (
  <ToryEditor
    componentCatalogue={componentCatalogue}
    editorCatalogue={editorCatalogue}
    storage={storage}
    loadStyles={false}
    handlers={handlers as any}
    theme={themes.dark}
  />
);

export default Editor;

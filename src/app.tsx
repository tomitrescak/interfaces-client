import React from 'react';

import { ToryEditableForm } from '@toryjs/editor';
import { Context } from '@toryjs/ui';
import { observer } from 'mobx-react';

const Editor = React.lazy(() => import('./editor'));
const Form = React.lazy(() => import('./form'));

export const App: React.FC = observer(() => {
  const context = React.useContext(Context);
  return (
    <React.Suspense fallback={<div>Loading Form ...</div>}>
      <ToryEditableForm
        Editor={Editor}
        Form={Form}
        canEdit={
          context.auth.user &&
          context.auth.user.roles &&
          context.auth.user.roles.indexOf('admin') >= 0
        }
      />
    </React.Suspense>
  );
});

export default App;

// window.addEventListener('error', function(e) {
//   const { error } = e;
//   if (!error.captured) {
//     error.captured = true;
//     e.stopImmediatePropagation();
//     e.preventDefault();
//     // Revisit this error after the error boundary element processed it
//     setTimeout(() => {
//       // can be set by the error boundary error handler
//       if (!error.shouldIgnore) {
//         // but if it wasn't caught by a boundary, release it back to the wild
//         throw error;
//       }
//     });
//   }
// });

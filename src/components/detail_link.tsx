import React from 'react';
import { FormComponentProps, EditorComponent } from '@toryjs/form';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { valueSource, getValue, Context, DynamicComponent, propGroup, boundProp } from '@toryjs/ui';

type DetailProps = {
  value: string;
};

export const DetailLink: React.FC<FormComponentProps<DetailProps>> = props => {
  const context = React.useContext(Context);
  const value = getValue(props, context);

  if (!valueSource(props.formElement)) {
    return <DynamicComponent {...props}>Component must be bound!</DynamicComponent>;
  }

  return (
    <DynamicComponent
      {...props}
      control={Link}
      to={`/editor/${props.dataProps && props.dataProps.view}/${value}`}
    >
      {value || <span>⚓️ Link</span>}
    </DynamicComponent>
  );
};

export const DetailEditor: EditorComponent<DetailProps> = {
  Component: observer(DetailLink),
  title: 'Detail Link',
  control: 'DetailLink',
  icon: 'anchor',
  bound: true,
  props: propGroup('Link', {
    value: boundProp()
  })
};

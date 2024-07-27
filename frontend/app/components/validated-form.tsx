import {
  Button,
  ButtonProps,
  Checkbox,
  CheckboxProps,
  PolymorphicComponentProps,
  Select,
  SelectProps,
  TextInput,
  TextInputProps,
  Textarea,
  TextareaProps,
} from '@mantine/core';
import { useField, useIsSubmitting, useIsValid } from 'remix-validated-form';

type ValidatedTextInputProps = {
  name: string;
} & TextInputProps;

export function ValidatedTextInput({
  name,
  error: errorFromParent,
  ...restProps
}: ValidatedTextInputProps) {
  const { error, getInputProps } = useFieldDefault(name);
  return (
    <TextInput
      name={name}
      error={error ?? errorFromParent}
      {...getInputProps({ id: name })}
      {...restProps}
    />
  );
}

type ValidatedSelectProps = {
  name: string;
} & SelectProps;

export function ValidatedSelect({
  name,
  error: errorFromParent,
  ...restProps
}: ValidatedSelectProps) {
  const { error, getInputProps } = useFieldDefault(name);
  return (
    <Select
      name={name}
      error={error ?? errorFromParent}
      {...getInputProps({ id: name })}
      {...restProps}
    />
  );
}

type ValidatedTextareaProps = {
  name: string;
} & TextareaProps;

export function ValidatedTextarea({
  name,
  error: errorFromParent,
  ...restProps
}: ValidatedTextareaProps) {
  const { error, getInputProps } = useFieldDefault(name);
  return (
    <Textarea
      name={name}
      error={error ?? errorFromParent}
      {...getInputProps({ id: name })}
      {...restProps}
    />
  );
}

type ValidatedCheckbox = {
  name: string;
} & CheckboxProps;

export function ValidatedCheckbox({
  name,
  error: errorFromParent,
  ...restProps
}: ValidatedCheckbox) {
  const { error, getInputProps } = useFieldDefault(name);
  return (
    <Checkbox
      name={name}
      error={error ?? errorFromParent}
      {...getInputProps({ id: name })}
      {...restProps}
    />
  );
}

type ValidatedButtonProps = {} & PolymorphicComponentProps<'button', ButtonProps>;

export function ValidatedButton({ children, ...restProps }: ValidatedButtonProps) {
  const isSubmitting = useIsSubmitting();
  const isValid = useIsValid();
  return (
    <Button loading={isSubmitting} disabled={isSubmitting} {...restProps}>
      {children}
    </Button>
  );
}

function useFieldDefault(name: string) {
  const props = useField(name, {
    validationBehavior: {
      initial: 'onSubmit',
      whenTouched: 'onSubmit',
      whenSubmitted: 'onBlur',
    },
  });
  return props;
}

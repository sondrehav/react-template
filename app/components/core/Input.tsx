import classNames from 'classnames';
import { ComponentProps, forwardRef } from 'react';

import ErrorMessage, { ErrorMessageProps } from '@/components/core/ErrorMessage';

export type InputProps = ComponentProps<'input'> & {
  label?: string;
  wrapperClassName?: string;
  'data-testid'?: string;
} & ErrorMessageProps;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      wrapperClassName,
      'data-testid': testId,
      errorMessage,
      errorId,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className={classNames('flex flex-col', wrapperClassName)} data-testid={testId}>
        {label && (
          <label className={'text-primary-dark mb-2'} htmlFor={rest.id}>
            {label}
          </label>
        )}
        <input
          className={classNames(
            'rounded-xl bg-gray-200 px-6 py-3 text-base placeholder:text-gray-600 transition-all border-gray-400 border-2 hover:border-gray-400 focus:border-primary',
            { 'border-alert': !!errorId },
            className,
          )}
          {...rest}
          ref={ref}
        />
        <ErrorMessage errorMessage={errorMessage} errorId={errorId} />
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;

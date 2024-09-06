import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

import { expandAnimation } from '@/animations';

export type ErrorMessageProps = {
  errorMessage?: string;
  errorId?: string;
};

const ErrorMessage = ({
  errorMessage: initialErrorMessage,
  errorId,
}: ErrorMessageProps) => {
  const errorMessage = useMemo(() => {
    return initialErrorMessage;
  }, [errorId]);

  return (
    <AnimatePresence>
      {errorId && (
        <motion.span
          key={errorId}
          className={'relative text-alert font-normal text-sm'}
          variants={expandAnimation}
          initial={'hidden'}
          exit={'hidden'}
          animate={'visible'}
          layout
        >
          {errorMessage ?? ''}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default ErrorMessage;

import { Transition } from 'framer-motion';

export const cardAnimation = {
  hidden: { opacity: 0, left: -20 } satisfies Transition,
  exit: { opacity: 0, left: 20, scale: [0, 1.02, 1] } satisfies Transition,
  visible: {
    scale: [0, 1.05, 1],
    opacity: 1,
    left: 0,
  } satisfies Transition,
};

export const fadeFromLeftAnimation = {
  hidden: { opacity: 0, left: -10 } satisfies Transition,
  visible: {
    opacity: 1,
    left: 0,
  } satisfies Transition,
};

export const expandAnimation = {
  hidden: { opacity: 0, height: 0, left: -10 } satisfies Transition,
  visible: {
    opacity: 1,
    left: 0,
    height: 'auto',
  } satisfies Transition,
};

export const containerWithStaggeredChildrenAnimation = {
  hidden: {
    opacity: 0,
    left: -10,
  } satisfies Transition,
  visible: {
    opacity: 1,
    left: 0,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.1,
    },
  } satisfies Transition,
};

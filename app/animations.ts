import { Transition } from 'framer-motion';

export const cardAnimation = {
  hidden: { opacity: 0, left: -20 } satisfies Transition,
  exit: { opacity: 0, left: 20, rotate: [0, -4, 0] } satisfies Transition,
  visible: {
    rotate: [0, -4, 0],
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
      staggerChildren: 0.2,
    },
  } satisfies Transition,
};

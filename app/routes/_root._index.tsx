import { motion } from 'framer-motion';

import { fadeFromLeftAnimation } from '@/animations';

export default function Index() {
  return (
    <motion.main
      className={'flex h-full relative'}
      initial={'hidden'}
      animate={'visible'}
      variants={fadeFromLeftAnimation}
    >
      🥝🥝🥝
    </motion.main>
  );
}

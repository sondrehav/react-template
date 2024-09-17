import { LoaderFunctionArgs } from '@remix-run/node';
import { motion } from 'framer-motion';

import { fadeFromLeftAnimation } from '@/animations';
import { authenticator } from '@/services/auth.server';

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

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
}

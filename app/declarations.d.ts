declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps>;
  export default content;
}

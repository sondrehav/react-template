import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
} from '@remix-run/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { cloneElement, ReactElement, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import {
  cardAnimation,
  containerWithStaggeredChildrenAnimation,
  fadeFromLeftAnimation,
} from '@/animations';
import BugSm from '@/components/icons/Bug.svg';
import ChevronDownSm from '@/components/icons/ChevronDown.svg';
import EditSm from '@/components/icons/Edit.svg';
import HomeSm from '@/components/icons/Home.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { projectIdBySlug, projectList, projects } from '../../data';

export const loader = async ({}: LoaderFunctionArgs) => {
  return json({ projects: projectList.map((id) => projects[id]) });
};

const NavLinkItem = ({
  to,
  name,
  icon = <BugSm />,
  exact,
}: {
  to: string;
  name: string;
  icon?: ReactElement;
  exact?: boolean;
}) => (
  <motion.li className={'relative'} variants={cardAnimation}>
    <NavLink
      end={exact}
      to={to}
      className={({ isActive }) =>
        classNames(
          'relative py-2 mb-2 text-sm rounded px-4 origin-top-right flex items-center gap-2 transition-colors group hover:text-primary-dark focus:text-primary-dark',
          {
            'bg-gray-50 shadow-subtle text-primary-dark font-semibold': isActive,
            'text-gray-700': !isActive,
          },
        )
      }
    >
      {cloneElement(icon, {
        ...icon.props,
        className: classNames(icon.props.className, 'size-6 fill-current'),
      })}
      <span className={'flex-1 truncate overflow-hidden'}>{name}</span>
    </NavLink>
  </motion.li>
);

const useProject = () => {
  const current = useParams<{ projectSlug: string }>().projectSlug;
  const projects = useLoaderData<typeof loader>().projects;
  return projects.find((s) => s.slug === current);
};

const PageList = () => {
  const projectSlug = useProject()?.slug;
  return (
    <AnimatePresence mode={'wait'}>
      {projectSlug && (
        <motion.ul
          key={projectSlug}
          className={'relative flex flex-col w-full'}
          animate={!projectSlug ? 'hidden' : 'visible'}
          initial={'hidden'}
          exit={'hidden'}
          variants={containerWithStaggeredChildrenAnimation}
        >
          <NavLinkItem
            exact={true}
            to={`/projects/${projectSlug}`}
            name={'Dashboard'}
            icon={<HomeSm />}
          />
          <NavLinkItem
            to={`/projects/${projectSlug}/logs`}
            name={'Logs'}
            icon={<BugSm />}
          />
          <NavLinkItem
            to={`/projects/${projectSlug}/settings`}
            name={'Settings'}
            icon={<EditSm />}
          />
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

const ProjectDropdown = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.clientWidth);
  }, []);
  const nav = useNavigate();
  const project = useProject();
  //if (!project) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        ref={ref}
        className={
          'py-2 mb-6 rounded px-4 origin-top-right flex items-center gap-2 transition-colors group hover:text-primary-dark focus:text-primary-dark text-primary-dark font-medium'
        }
      >
        <span
          className={classNames('flex-1 truncate overflow-hidden text-left', {
            'text-gray-700': !project,
          })}
        >
          {project?.name ?? 'Select project'}
        </span>
        <ChevronDownSm
          className={'size-4 fill-current opacity-50 group-hover:opacity-100'}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ width: width ?? 0 }} align={'start'}>
        {projectList
          .map((id) => projects[id])
          .map(({ id, logoUrl, name, slug }) => (
            <DropdownMenuItem
              className={'cursor-pointer'}
              onClick={() => nav(`/projects/${slug}`)}
              key={id}
            >
              {name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = () => {
  return (
    <nav className={'flex flex-col min-h-full sidebar-nav overflow-auto p-6'}>
      <ProjectDropdown />
      <PageList />
    </nav>
  );
};

export default function RootLayout() {
  const outlet = useOutlet();
  return (
    <motion.div
      className={'flex h-full'}
      initial={'hidden'}
      animate={'visible'}
      exit={'hidden'}
      variants={fadeFromLeftAnimation}
    >
      <Navbar />
      <AnimatePresence mode={'wait'}>
        <motion.main
          className={'flex h-full pr-4 py-4 w-full relative overflow-auto'}
          initial={'hidden'}
          exit={'hidden'}
          animate={'visible'}
          variants={fadeFromLeftAnimation}
          key={useLocation().pathname}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
    </motion.div>
  );
}

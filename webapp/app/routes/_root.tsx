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
import { eq } from 'drizzle-orm';
import { AnimatePresence, motion } from 'framer-motion';
import React, { cloneElement, ReactElement, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  cardAnimation,
  containerWithStaggeredChildrenAnimation,
  fadeFromLeftAnimation,
} from '@/animations';
import BugSm from '@/components/icons/Bug.svg';
import ChevronDownSm from '@/components/icons/ChevronDown.svg';
import EditSm from '@/components/icons/Edit.svg';
import HomeSm from '@/components/icons/Home.svg';
import NotificationSm from '@/components/icons/Notification.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { organizationsTable, projectsTable } from '@/db';
import getDBConnection from '@/db/connection';
import { authenticator } from '@/services/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const conn = await getDBConnection;

  return json({
    projects: user.organizationId
      ? await conn
          .select()
          .from(projectsTable)
          .where(eq(projectsTable.organizationId, user.organizationId))
      : null,
    user,
    organization: user.organizationId
      ? (
          await conn
            .select()
            .from(organizationsTable)
            .where(eq(organizationsTable.organizationId, user.organizationId))
        )?.[0]
      : null,
  });
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
  return projects?.find((s) => s.slug === current);
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
  const projects = useLoaderData<typeof loader>().projects;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          ref={ref}
          className={
            'py-2 px-0 mb-6 rounded origin-top-right flex items-center gap-2 transition-colors group hover:text-primary-dark focus:text-primary-dark text-primary-dark font-medium'
          }
        >
          {project && project.logoUrl && (
            <img
              className={'size-8 rounded -my-1 p-1 ring-gray-200 ring-2'}
              src={project.logoUrl}
              alt={`${project.name} logo`}
            />
          )}
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
          {projects?.map(({ projectId, name, slug, logoUrl }) => (
            <DropdownMenuItem
              className={'cursor-pointer flex items-center gap-2'}
              onClick={() => nav(`/projects/${slug}`)}
              key={projectId}
            >
              {logoUrl && (
                <img
                  className={'size-6 rounded -my-1 p-1 ring-gray-200 ring-2'}
                  src={logoUrl}
                  alt={`${name} logo`}
                />
              )}
              <span>{name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const UserInfo = () => {
  const { organization, user } = useLoaderData<typeof loader>();
  return (
    <>
      <hr className={'mt-auto'} />
      <div className={'flex gap-4 items-center'}>
        <img
          className={
            'size-10 rounded-full border-primary-200 border-2 flex-grow-0 flex-shrink-0 shadow-subtle'
          }
          src={user.profileUrl}
          alt={`${user.name}`}
        />
        <div className={'flex flex-col gap-0 w-full flex-1'}>
          <h5>{user.name}</h5>
          {organization && <h6 className={'text-gray-700'}>{organization.name}</h6>}
        </div>
        <button className={'size-8  flex-grow-0 flex-shrink-0'}>
          <NotificationSm></NotificationSm>
        </button>
      </div>
    </>
  );
};

const Navbar = () => {
  return (
    <nav className={'flex flex-col min-h-full sidebar-nav overflow-auto p-6'}>
      <ProjectDropdown />
      <PageList />
      <UserInfo />
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

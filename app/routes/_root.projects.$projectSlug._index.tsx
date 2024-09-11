import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useParams, useSearchParams } from '@remix-run/react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, {
  cloneElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useState,
} from 'react';
import invariant from 'tiny-invariant';

import { cardAnimation, containerWithStaggeredChildrenAnimation } from '@/animations';
import ChevronDownIcon from '@/components/icons/ChevronDown.svg';
import ChevronUpIcon from '@/components/icons/ChevronUp.svg';
import CircleIcon from '@/components/icons/Circle.svg';
import CollapseIcon from '@/components/icons/Collapse.svg';
import GlobeIcon from '@/components/icons/Globe.svg';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { projectIdBySlug, projects } from '../../data';

const hasProject = (
  params: LoaderFunctionArgs['params'],
): params is { projectSlug: keyof typeof projectIdBySlug } =>
  typeof params.projectSlug === 'string' && params.projectSlug in projectIdBySlug;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!hasProject(params))
    throw json(`Project with slug '${params.projectSlug}' not found`, {
      status: 404,
    });

  return json({
    project: projects[projectIdBySlug[params.projectSlug]],
  });
};

const Indicator = ({
  value,
  previousValue,
}: {
  value: number;
  previousValue?: number;
}) => {
  if (typeof previousValue !== 'number') return null;

  const el =
    value === previousValue ? (
      <CollapseIcon />
    ) : value > previousValue ? (
      <ChevronUpIcon />
    ) : (
      <ChevronDownIcon />
    );

  return cloneElement(el, {
    className: classNames('size-4', {
      'text-success': value > previousValue,
      'text-gray-700': value === previousValue,
      'text-alert': value < previousValue,
    }),
  });
};

const KeyNumber = ({
  label,
  value,
  previousValue,
  icon = <GlobeIcon />,
}: {
  label: string;
  value: number;
  previousValue?: number;
  icon?: ReactElement<SVGSVGElement>;
}) => (
  <div className={'flex items-center gap-2 min-w-60'}>
    <div className={'rounded-xl bg-primary p-4 shadow-subtle'}>
      {cloneElement(icon, {
        ...icon.props,
        className: classNames(icon.props.className, 'size-6 fill-primary-light'),
      })}
    </div>
    <div className={'flex flex-col'}>
      <dt className={'text-gray-800 text-sm'}>{label}</dt>
      <dd className={'flex gap-1 items-center'}>
        <span>{value}</span>
        {typeof previousValue === 'number' && (
          <>
            <Indicator value={value} previousValue={previousValue} />
            <span className={'text-gray-800'}>{Math.abs(value - previousValue)}</span>
          </>
        )}
      </dd>
    </div>
  </div>
);

const Container = ({
  children,
  className,
  header,
}: PropsWithChildren<{ className?: string; header?: ReactNode }>) => {
  return (
    <motion.div
      variants={cardAnimation}
      className={classNames(
        'flex flex-col rounded bg-gray-50 shadow-subtle text-primary-dark min-h-64',
        className,
      )}
    >
      {header && (
        <>
          <div className={'py-2 px-4 text-gray-800 flex items-center w-full'}>
            {header}
          </div>
          <hr />
        </>
      )}
      <div className={'py-2 px-4'}>{children}</div>
    </motion.div>
  );
};

const StatRanges = ['day', 'week', 'month', 'year'] as const;
const isStatRange = (value: unknown): value is (typeof StatRanges)[number] =>
  !!StatRanges.find((v) => v === value);

export default function Project() {
  const slug = useParams<{ projectSlug: string }>().projectSlug;
  const [search, setSearch] = useSearchParams({ range: 'day' });

  invariant(slug, "'projectSlug' was not defined.");

  const currentRange = search.get('range');

  return (
    <div className={'flex flex-col gap-4 w-full'}>
      <div className={'flex justify-between items-center gap-4'}>
        <dl className={'flex gap-4 items-center'}>
          <KeyNumber label={'Antall besøkende'} value={32} previousValue={28} />
          <KeyNumber label={'Unike besøkende'} value={20} previousValue={22} />
          <KeyNumber label={'Gjennomsnittlig besøkstid'} value={10} previousValue={10} />
        </dl>
        <div className={'flex items-center gap-4'}>
          <ToggleGroup
            type={'single'}
            size={'lg'}
            value={isStatRange(currentRange) ? currentRange : 'day'}
          >
            <ToggleGroupItem
              onClick={() =>
                setSearch((s) => {
                  s.set('range', 'day');
                  return s;
                })
              }
              value={'day'}
            >
              Day
            </ToggleGroupItem>
            <ToggleGroupItem
              onClick={() =>
                setSearch((s) => {
                  s.set('range', 'week');
                  return s;
                })
              }
              value={'week'}
            >
              Week
            </ToggleGroupItem>
            <ToggleGroupItem
              onClick={() =>
                setSearch((s) => {
                  s.set('range', 'month');
                  return s;
                })
              }
              value={'month'}
            >
              Month
            </ToggleGroupItem>
            <ToggleGroupItem
              onClick={() =>
                setSearch((s) => {
                  s.set('range', 'year');
                  return s;
                })
              }
              value={'year'}
            >
              Year
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <motion.div
        animate={'visible'}
        initial={'hidden'}
        exit={'hidden'}
        variants={containerWithStaggeredChildrenAnimation}
        className={'flex gap-4'}
      >
        <div className={'flex flex-col gap-4 grow-[2] shrink-[2]'}>
          <Container header={<h4>Visitors</h4>}>a</Container>
          <Container
            header={
              <>
                <h4>Geographical distribution</h4>
                <div className={'flex gap-1 items-center ml-auto'}>
                  <CircleIcon className={'size-6 fill-secondary'} />
                  <span>{32} countries</span>
                </div>
              </>
            }
            className={'grow-[2]'}
          >
            a
          </Container>
        </div>

        <div className={' grow-[1] shrink-[1] flex flex-col gap-4'}>
          <Container header={<h4>Sources</h4>}>a</Container>
          <Container header={<h4>Pages</h4>}>a</Container>
          <Container header={<h4>Logs</h4>}>a</Container>
        </div>
      </motion.div>
    </div>
  );
}

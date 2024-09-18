import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useParams, useSearchParams } from '@remix-run/react';
import classNames from 'classnames';
import { addDays, startOfDay } from 'date-fns';
import { eq } from 'drizzle-orm';
import { motion } from 'framer-motion';
import React, { cloneElement, ReactElement } from 'react';
import invariant from 'tiny-invariant';

import { containerWithStaggeredChildrenAnimation } from '@/animations';
import BarChart from '@/components/BarChart';
import DatePicker from '@/components/DatePicker';
import ChevronDownIcon from '@/components/icons/ChevronDown.svg';
import ChevronUpIcon from '@/components/icons/ChevronUp.svg';
import CollapseIcon from '@/components/icons/Collapse.svg';
import GlobeIcon from '@/components/icons/Globe.svg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { projectsTable } from '@/db';
import getDBConnection from '@/db/connection';
import { selectEventCountByHourQuery } from '@/db/customSql';

export const loader = async ({ params, request: { url } }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(url);
  const query = searchParams.get('range');
  const range: (typeof StatRanges)[number] = isStatRange(query) ? query : 'day';
  const conn = await getDBConnection;
  const date = searchParams.get('date') ?? new Date().toISOString();

  const project = (
    await conn
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.slug, params.projectSlug as string))
      .limit(1)
  )?.[0];

  if (!project)
    throw new Response(`Project with slug '${params.projectSlug}' not found.`, {
      status: 404,
    });

  return json({
    project,
    date,
    entries: await conn
      .execute(
        selectEventCountByHourQuery({
          start: startOfDay(date).toISOString(),
          end: addDays(startOfDay(date), 1).toISOString(),
          entryType: 'load',
          projectId: project.projectId,
        }),
      )
      .then((res) => res.rows as Array<{ starttime: string; views: number }>),
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

const StatRanges = ['day', 'week', 'month', 'year'] as const;
const isStatRange = (value: unknown): value is (typeof StatRanges)[number] =>
  !!StatRanges.find((v) => v === value);

export default function Project() {
  const slug = useParams<{ projectSlug: string }>().projectSlug;
  const data = useLoaderData<typeof loader>();
  const [search, setSearch] = useSearchParams({ range: 'day', date: data.date });

  invariant(slug, "'projectSlug' was not defined.");

  const currentRange = search.get('range');

  return (
    <div className={'flex flex-col gap-4 w-full'}>
      <div className={'flex items-center gap-4'}>
        <dl className={'flex gap-4 items-center mr-auto'}>
          <KeyNumber label={'Antall besøkende'} value={32} previousValue={28} />
          <KeyNumber label={'Unike besøkende'} value={20} previousValue={22} />
          <KeyNumber label={'Gjennomsnittlig besøkstid'} value={10} previousValue={10} />
        </dl>
        <DatePicker
          initialDate={data.date}
          onChange={(d) =>
            setSearch((s) => {
              if (d) {
                s.set('date', d);
              } else {
                s.delete('date');
              }
              return s;
            })
          }
        />
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
        <div className={'flex flex-col gap-4 grow-[2] shrink-[2] basis-0'}>
          <Card>
            <CardHeader>
              <CardTitle>Visitors</CardTitle>
            </CardHeader>
            <CardContent className={'relative'}>
              <BarChart data={data.entries} />
            </CardContent>
          </Card>
          <Card className={'grow-[2]  basis-0'}>
            <CardHeader>
              <CardTitle>Geographical distribution</CardTitle>
            </CardHeader>
            <CardContent>bananer</CardContent>
          </Card>
        </div>

        <div className={'grow-[1] shrink-[1] flex flex-col gap-4 basis-0'}>
          <Card>
            <CardHeader>
              <CardTitle>Sources</CardTitle>
            </CardHeader>
            <CardContent>bananer</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
            </CardHeader>
            <CardContent>bananer</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Logs</CardTitle>
            </CardHeader>
            <CardContent>bananer</CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

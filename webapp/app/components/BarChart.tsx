'use client';

import { formatDate } from 'date-fns';
import { nb } from 'date-fns/locale';
import * as React from 'react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  views: {
    label: 'Page loads',
    color: '#3f77e8',
  },
} satisfies ChartConfig;

const BarChart = ({ data }: { data: Array<{ starttime: string; views: number }> }) => {
  return (
    <ChartContainer config={chartConfig} className={'aspect-auto h-[250px] w-full'}>
      <RechartsBarChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={'starttime'}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            return formatDate(new Date(value + '+00:00'), 'HH:mm', { locale: nb });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className={'w-[150px]'}
              nameKey={'views'}
              labelFormatter={(value) => {
                return formatDate(new Date(value + '+00:00'), 'HH:mm dd MMM yyyy', {
                  locale: nb,
                });
              }}
            />
          }
        />
        <Bar dataKey={'views'} radius={2} fill={'var(--color-views)'} />
      </RechartsBarChart>
    </ChartContainer>
  );
};
export default BarChart;

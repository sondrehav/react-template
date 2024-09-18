import { sql } from 'drizzle-orm';

export const selectEventCountByHourQuery = ({
  start,
  end,
  projectId,
  entryType,
}: {
  start: string;
  end: string;
  projectId: string;
  entryType: string;
}) => sql`
    select startTime, coalesce(views, 0) as views from (
        select date_trunc('hour', "createdAt") as "startTime", count(*) views
        from entries
        where entries."createdAt" >= ${start}
          and entries."createdAt" < ${end}
          and "projectId"=${projectId}
          and "entryType"=${entryType}
        group by 1
    ) q1 full outer join  (
        select generate_series.generate_series as startTime
        from generate_series(${start}::timestamp, ${end}::timestamp, '1 hours')
        except select ${end} as startTime
    ) q2 on q1."startTime" = q2.startTime
    order by q2.startTime;
`;

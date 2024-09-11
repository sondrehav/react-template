export type ProjectType = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
};

export const projects: Record<string, ProjectType> = {
  '628546f8-3765-42e6-90c7-b09856e7b6bb': {
    id: '628546f8-3765-42e6-90c7-b09856e7b6bb',
    slug: 'coop',
    name: 'Coop gavekort',
    logoUrl: null,
  },
  '97651ef3-a2c5-416e-8a30-4a7a65b1459f': {
    id: '97651ef3-a2c5-416e-8a30-4a7a65b1459f',
    slug: 'tavler',
    name: 'Tavler Tavler Tavler Tavler',
    logoUrl: null,
  },
  '58c8e8da-83d9-4529-9f0d-6dab361dfb54': {
    id: '58c8e8da-83d9-4529-9f0d-6dab361dfb54',
    slug: 'europris',
    name: 'Europris',
    logoUrl: null,
  },
  'b1ceb21a-1fe4-4373-963a-1ce714388bbe': {
    id: 'b1ceb21a-1fe4-4373-963a-1ce714388bbe',
    slug: 'eplehuset',
    name: 'Eplehuset',
    logoUrl: null,
  },
  'df2cbd06-de31-4025-9fd5-b29787c4fee7': {
    id: 'df2cbd06-de31-4025-9fd5-b29787c4fee7',
    slug: 'goodtech',
    name: 'Goodtech',
    logoUrl: null,
  },
} as const;

export const projectList = [
  '628546f8-3765-42e6-90c7-b09856e7b6bb',
  '97651ef3-a2c5-416e-8a30-4a7a65b1459f',
  '58c8e8da-83d9-4529-9f0d-6dab361dfb54',
  'b1ceb21a-1fe4-4373-963a-1ce714388bbe',
  'df2cbd06-de31-4025-9fd5-b29787c4fee7',
] as const;

export const projectIdBySlug = {
  coop: '628546f8-3765-42e6-90c7-b09856e7b6bb',
  tavler: '97651ef3-a2c5-416e-8a30-4a7a65b1459f',
  europris: '58c8e8da-83d9-4529-9f0d-6dab361dfb54',
  eplehuset: 'b1ceb21a-1fe4-4373-963a-1ce714388bbe',
  goodtech: 'df2cbd06-de31-4025-9fd5-b29787c4fee7',
} as const;

export const projectData = {
  'df2cbd06-de31-4025-9fd5-b29787c4fee7': {
    numVisitors: {
      current: 32,
      previous: 24,
    },
  },
};

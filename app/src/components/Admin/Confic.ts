export const sectionEndpoints = {
  users: {
    fetch: "/auth/users",
    create: "/auth/register",
    update: "/auth/user",
  },
  roles: {
    fetch: "/roles",
    create: "/roles",
    update: "/roles",
  },
  groups: {
    fetch: "/groups",
    create: "/groups",
    update: "/groups",
  },
} as const;

export type SectionKey = keyof typeof sectionEndpoints;

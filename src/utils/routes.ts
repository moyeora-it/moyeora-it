export const routes = {
  // (auth)
  main: '/',
  findEmail: '/find-email',
  findPassword: '/find-password',
  login: '/login',
  register: '/register',
  // (user)
  userPage: (userId: string) => `/users/${userId}`,
  followers: (userId: string) => `/users/${userId}/social/followers`,
  followings: (userId: string) => `/users/${userId}/social/followings`,
  userCreatedGroups: (userId: string) => `/users/${userId}/groups/created`,
  userEndedGroups: (userId: string) => `/users/${userId}/groups/ended`,

  // bookmark
  bookmark: '/bookmark',

  // group
  groupDetail: (groupId: number) => `/groups/${groupId}`,

  // write
  write: '/write',
};

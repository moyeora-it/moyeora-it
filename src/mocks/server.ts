import { setupServer } from 'msw/node';
import { applicationsHandlers } from './handler/applications';
import { authenticationsHandlers } from './handler/authentications';
import { followHandlers } from './handler/follow';
import { groupsHandlers } from './handler/groups';
import { notificationsHandlers } from './handler/notifications';
import { ratingHandlers } from './handler/rating';
import { repliesHandlers } from './handler/replies';
import { userHandlers } from './handler/user';

export const server = setupServer(
  ...groupsHandlers,
  ...notificationsHandlers,
  ...followHandlers,
  ...authenticationsHandlers,
  ...repliesHandlers,
  ...userHandlers,
  ...ratingHandlers,
  ...applicationsHandlers,
);

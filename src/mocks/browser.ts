import { setupWorker } from 'msw/browser';
import { applicationsHandlers } from './handler/applications';
import { authenticationsHandlers } from './handler/authentications';
import { followHandlers } from './handler/follow';
import { groupsHandlers } from './handler/groups';
import { notificationsHandlers } from './handler/notifications';
import { ratingHandlers } from './handler/rating';
import { repliesHandlers } from './handler/replies';
import { userHandlers } from './handler/user';

export const worker = setupWorker(
  ...groupsHandlers,
  ...notificationsHandlers,
  ...followHandlers,
  ...authenticationsHandlers,
  ...repliesHandlers,
  ...ratingHandlers,
  ...userHandlers,
  ...applicationsHandlers,
);

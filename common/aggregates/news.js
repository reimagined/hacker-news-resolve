import Immutable from 'seamless-immutable';

import type {
    NewsCreated,
    NewsUpvoted,
    NewsUnvoted,
    NewsDeleted
} from '../events/news';
import events from '../events/news';
import { Event } from '../helpers';

const {
    NEWS_CREATED,
    NEWS_UPVOTED,
    NEWS_UNVOTED,
    NEWS_DELETED
} = events;

const commands = {
    createNews: (state: any, command: NewsCreated) => {
        const { title, link, userId } = command.payload;

        if (!title) {
            throw new Error('Title is required');
        }

        if (!userId) {
            throw new Error('UserId is required');
        }

        return new Event(NEWS_CREATED, {
            title,
            link,
            userId
        });
    },
    upvoteNews: (state: any, command: NewsUpvoted) => {
        const { userId } = command.payload;

        if (!userId) {
            throw new Error('UserId is required');
        }

        return new Event(NEWS_UPVOTED, {
            userId
        });
    },
    unvoteNews: (state: any, command: NewsUnvoted) => {
        const { userId } = command.payload;

        if (!userId) {
            throw new Error('UserId is required');
        }

        return new Event(NEWS_UNVOTED, {
            userId
        });
    },
    deleteNews: (state: any, command: NewsDeleted) =>
        new Event(NEWS_DELETED, {})
};

const eventHandlers = {
    [NEWS_CREATED]: (_, event) =>
        Immutable({
            aggregateId: event.aggregateId,
            title: event.payload.title,
            userId: event.payload.userId,
            link: event.payload.link,
            createDate: event.timestamp,
            comments: [],
            voted: []
        }),
    [NEWS_UPVOTED]: (state, event) =>
        state.updateIn(['voted'], list => list.concat(event.userId)),
    [NEWS_UNVOTED]: (state, event) =>
        state.updateIn(['voted'], list => list.filter(x => x !== event.userId))
};

export default {
    name: 'news',
    initialState: Immutable({}),
    eventHandlers,
    commands
};

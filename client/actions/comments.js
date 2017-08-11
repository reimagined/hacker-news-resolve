import { createActions } from 'resolve-redux';
import aggregate from '../../common/aggregates/comments';

export default createActions(aggregate);

import { createActions } from 'resolve-redux';
import aggregate from '../../common/aggregates/news';

export default createActions(aggregate);

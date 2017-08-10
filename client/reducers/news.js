import { createReducer } from 'resolve-redux';
import readModels from '../../common/read-models';

export default readModels.reduce(
    (result, readModel) => {
        result[readModel.name] = createReducer(readModel);
        return result;
    }
);

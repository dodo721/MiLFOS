import _ from 'lodash';

export const isThenable = (x) => {
    if (!x) return false;
    return _.isFunction(x.then);
}

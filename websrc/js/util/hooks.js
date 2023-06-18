import React, { useState, useEffect } from 'react';
import { isThenable } from './miscutil';
import _ from 'lodash';

export const usePromiseValue = (promiseOrValue) => {
    const [value, setVal] = useState();
    const [resolved, setResolved] = useState(false);
    const [error, setError] = useState();

    if (isThenable(promiseOrValue)) {
        promiseOrValue.then(res => {
            setVal(res);
            setResolved(true);
        }).catch(err => {
            setError(err);
            setResolved(true);
        });
    } else {
        setVal(promiseOrValue);
        setResolved(true);
    }
    return {resolved, value, error};
};

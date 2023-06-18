import { useEffect, useState } from 'react';
import $ from 'jquery';
import { usePromiseValue } from './hooks';

class DataCache {

    DATA_CACHE = {};

    cacheFetch = (url, value) => {
        this.DATA_CACHE[url] = value;
    }
    
    removeCache = (url) => {
        delete this.DATA_CACHE[url];
    }

    getCache = (url) => {
        return this.DATA_CACHE[url];
    }

}

const Cache = new DataCache();

/**
 * 
 * @param {String} url 
 * @param {Function} [process] a function to process the data, then stored to cache
 * @param {Object} [options]
 * @param {Number} [options.cachePeriod] timeout on cache (if falsy, cache is indefinite)
 * @param {Boolean} [options.noCache] don't store cache on this result
 * @param {Boolean} [options.hardReload] ignore cache when fetching
 */
export const useFetch = (url, process, options={}) => {
    
    const [request, setRequest] = useState({resolved:false});

    useEffect(() => {
        setRequest({resolved:false});

        const resolve = (value, error) => {
            setRequest({value, error, resolved:true});
        }

        if (!url) {
            resolve();
            return;
        }
        const cachedVal = Cache.getCache(url);
        if (cachedVal && !options.hardReload) {
            resolve(cachedVal);
            return;
        }
        $.get(url).done((res, status, xhr) => {
            const valProcessed = process ? process(res) : res;
            if (options.cachePeriod) {
                setTimeout(() => {
                    Cache.removeCache(url);
                }, options.cachePeriod);
            }
            if (!options.noCache) Cache.cacheFetch(url, valProcessed);
            resolve(valProcessed);
        }).fail((xhr, status, err) => {
            resolve(null, err);
        });
    }, [url]);

    return request;

}

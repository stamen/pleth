import { useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';

export const useURLState = (urlStateConfig, reducer) => {
  const { search } = useLocation();
  const { push } = useHistory();

  const query = queryString.parse(search);

  const urlState = Object.keys(urlStateConfig).reduce((accumulator, key) => {
    const { defaultValue, parse } = urlStateConfig[key];
    const value = query[key];
    return {
      ...accumulator,
      [key]: value === undefined ? defaultValue : parse(value),
    };
  }, {});

  const urlDispatch = useCallback(
    (action) =>
      push({
        search: queryString.stringify(reducer(urlState, action)),
      }),
    [push, urlState, reducer]
  );

  return [urlState, urlDispatch];
};

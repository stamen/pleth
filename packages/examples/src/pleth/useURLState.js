import { useReducer } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';

export const useURLState = (urlStateConfig, reducer) => {
  //const { search } = useLocation();
  //const history = useHistory();

  //const query = queryString.parse(search);

  //const urlState = Object.keys(query).reduce((accumulator, key) => {
  //  const { defaultValue, parse } = urlStateConfig[key];
  //  const value = query[key];
  //  return {
  //    ...accumulator,
  //    [key]: value === undefined ? defaultValue : parse(value),
  //  };
  //}, {});

  //const urlDispatch = history.push();

  //return [urlState, urlDispatch];

  // Initial state is default values.
  const initialState = Object.keys(urlStateConfig).reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: urlStateConfig[key].defaultValue,
    }),
    {}
  );

  // TODO build this out on react-router-dom and query-string.
  // TODO make this a Context.
  // Handle the case of a single action that sets multiple params (trickiest case, comes up in practice)
  return useReducer(reducer, initialState);
};

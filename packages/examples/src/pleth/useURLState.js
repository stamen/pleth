import { useReducer } from 'react';
export const useURLState = (urlStateConfig, reducer) => {
  // Initial state is default values.
  const initialState = Object.keys(urlStateConfig).reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: urlStateConfig[key].defaultValue,
    }),
    {}
  );

  // TODO build this out on react-router-dom and query-string.
  // Handle the case of a single action that sets multiple params (trickiest case, comes up in practice)
  const [urlState, urlDispatch] = useReducer(reducer, initialState);

  return [urlState, urlDispatch];
};

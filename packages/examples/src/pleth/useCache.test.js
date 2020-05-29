import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useCache } from './useCache';

test('Stores data in the cache.', async () => {
  let data;
  const Component = () => {
    const { get } = useCache();
    data = get({
      cacheKey: 'data',
      onCacheMiss: async () => 'foo',
    });
    return <div />;
  };

  act(() => {
    const div = document.createElement('div');
    ReactDOM.render(<Component />, div);
  });

  expect(data).toBeNull();

  // Let onCacheMiss resolve.
  await act(async () => {});

  expect(data).toBe('foo');
});

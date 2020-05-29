import React, { useState } from 'react';
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
    ReactDOM.render(<Component />, document.createElement('div'));
  });

  expect(data).toBeNull();

  // Let onCacheMiss resolve.
  await act(async () => {});

  expect(data).toBe('foo');
});

test('Only fetches once.', async () => {
  let data;
  let renderCount = 0;
  let fetchCount = 0;
  let setState;
  const Component = () => {
    renderCount++;
    const { get } = useCache();
    const [someState, setSomeState] = useState();
    setState = setSomeState;
    data = get({
      cacheKey: 'data',
      onCacheMiss: async () => {
        fetchCount++;
        return 'foo';
      },
    });
    return <div />;
  };

  act(() => {
    ReactDOM.render(<Component />, document.createElement('div'));
  });

  // 2 renders:
  //  * Initial render, then
  //  * setting cache value to pending.
  expect(renderCount).toBe(2);
  expect(data).toBeNull();

  // Let onCacheMiss resolve.
  await act(async () => {});

  expect(data).toBe('foo');
  expect(renderCount).toBe(3);
  expect(fetchCount).toBe(1);

  await act(async () => {
    setState('bar');
  });

  expect(renderCount).toBe(4);
  expect(fetchCount).toBe(1);

  // Let onCacheMiss resolve if it were erroneously triggered.
  await act(async () => {});

  expect(renderCount).toBe(4);
  expect(fetchCount).toBe(1);
});

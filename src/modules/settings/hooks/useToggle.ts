import { useCallback, useState } from 'react';

const useToggle = (initialState = false): [boolean, any] => {
  const [state, setState] = useState<boolean>(initialState);

  // Define and memorize an fc toggle value
  // setState doesn't necessary to define in dependencies
  const toggle = useCallback(() => setState((prev) => !prev), []);

  return [state, toggle];
};

export default useToggle;

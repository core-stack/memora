import { useContext } from 'react';

import { TreeSourceContext } from '../context';

export const useTreeSource = () => {
  return useContext(TreeSourceContext);
}
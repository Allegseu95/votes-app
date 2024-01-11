import React, { createContext, useContext, useState } from 'react';

import { Loader } from '@/components/Loader';

export const LoaderContext = createContext(null);

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const showLoader = () => setVisible(true);

  const hideLoader = () => setVisible(false);

  const data = {
    showLoader,
    hideLoader,
  };

  return (
    <LoaderContext.Provider value={data}>
      {visible && <Loader />}

      {children}
    </LoaderContext.Provider>
  );
};

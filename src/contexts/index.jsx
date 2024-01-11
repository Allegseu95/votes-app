import { AuthProvider } from './auth';
import { LoaderProvider } from './loader';

export const AppContext = ({ children }) => {
  return (
    <LoaderProvider>
      <AuthProvider>{children}</AuthProvider>
    </LoaderProvider>
  );
};

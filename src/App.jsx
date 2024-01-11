import { AppContext } from '@/contexts';
import { RouterManager } from '@/routes';

export const App = () => {
  return (
    <AppContext>
      <RouterManager />
    </AppContext>
  );
};

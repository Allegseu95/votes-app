import Lottie from 'lottie-react';

import loader from '@/assets/json/loader.json';

export const Loader = () => {
  return (
    <div className='w-full h-screen fixed flex items-center justify-center bg-gray-700 z-[1000]'>
      <Lottie
        width={300}
        style={{ maxWidth: 600, maxHeight: 600 }}
        height={300}
        animationData={loader}
      />
    </div>
  );
};

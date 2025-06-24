import { useEffect, useState } from 'react';

// 마운트 후에 클라이언트인지 확인하는 훅
const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

export default useIsClient;

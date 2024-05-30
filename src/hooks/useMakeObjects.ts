import { useMemo } from 'react';
import useOwnedObjects from './useOwnedObjects';
import useMultiGetObjects from './useMultiGetObjects';

export default function useMakeObjects(address: string) {
  const { data: ownedObjectsData } = useOwnedObjects(address);

  const objectAddresses = useMemo(() => {
    if (!ownedObjectsData) {
      return [];
    }

    return ownedObjectsData.map((v) => v.data?.objectId);
  }, [address, ownedObjectsData]);

  const { data: objects } = useMultiGetObjects(objectAddresses);

  return objects;
}

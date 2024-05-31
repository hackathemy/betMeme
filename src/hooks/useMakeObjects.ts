import { useEffect, useMemo } from 'react';
import useOwnedObjects from './useOwnedObjects';
import useMultiGetObjects from './useMultiGetObjects';

export default function useMakeObjects(address: string) {
  const { data: ownedObjectsData } = useOwnedObjects(address);

  const objectAddresses = useMemo(() => {
    if (!ownedObjectsData) {
      return [];
    }
    return ownedObjectsData.map((v) => v.data?.objectId);
  }, [ownedObjectsData]);

  const { data: objects, refetch } = useMultiGetObjects(objectAddresses);

  useEffect(() => {
    if (objectAddresses.length > 0) {
      refetch();
    }
  }, [objectAddresses, refetch]);

  const makeCoinAmount = useMemo(() => {
    if (!objects) {
      return [];
    }
    const tokens = objects.filter((object) => {
      return object.data?.content?.type.startsWith('0x2::coin::Coin') && object.data?.content?.type.indexOf('SUI') < 0;
    });
    return tokens;
  }, [objects]);

  return makeCoinAmount;
}

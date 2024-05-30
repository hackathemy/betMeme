import { useQuery } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

export default function useOwnedObjects(address: string) {
  return useQuery({
    queryKey: ['useOwnedObjects'],
    queryFn: async (): Promise<any[]> => {
      const event = [address, {}, null, null];

      const getValidators = {
        id: uuid(),
        jsonrpc: '2.0',
        method: 'suix_getOwnedObjects',
        params: event,
      };

      const response = await axios.post('https://fullnode.testnet.sui.io', getValidators);

      return response.data.result.data || [];
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

export default function useGetTransactionBlock(digest: string) {
  return useQuery({
    queryKey: ['getTransactionBlock'],
    queryFn: async (): Promise<any[]> => {
      const options = {
        showInput: true,
        showRawInput: false,
        showEffects: true,
        showEvents: true,
        showObjectChanges: false,
        showBalanceChanges: false,
      };

      const event = [digest, options];

      const getValidators = {
        id: uuid(),
        jsonrpc: '2.0',
        method: 'sui_getTransactionBlock',
        params: event,
      };

      const response = await axios.post('https://fullnode.testnet.sui.io', getValidators);

      return response.data.result.effects.created[0].reference.objectId || '';
    },
  });
}

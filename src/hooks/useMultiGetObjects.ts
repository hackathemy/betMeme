import { useQuery } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

export default function useMultiGetObjects(address: string[]) {
  return useQuery({
    queryKey: ['multiGetObjects'],
    queryFn: async (): Promise<any[]> => {
      const options = {
        showBcs: false,
        showContent: true,
        showDisplay: true,
        showOwner: true,
        showPreviousTransaction: true,
        showStorageRebate: true,
        showType: true,
      };

      console.log(address);
      const event = [address, options];

      const getValidators = {
        id: uuid(),
        jsonrpc: '2.0',
        method: 'sui_multiGetObjects',
        params: event,
      };

      const response = await axios.post('https://fullnode.testnet.sui.io', getValidators);

      return response.data.result || [];
    },
  });
}

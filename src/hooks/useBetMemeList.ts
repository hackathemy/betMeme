import pb from '@/api/pocketbase';
import { IBetMemesProps } from '@/types/betMemes';
import { useQuery } from '@tanstack/react-query';

export default function useBetMemeList() {
  return useQuery<IBetMemesProps[]>({
    queryKey: ['betmemes'],
    queryFn: async (): Promise<IBetMemesProps[]> => {
      const { items } = await pb.collection('betmemes').getList<IBetMemesProps>(1, 100, {
        sort: '-created',
      });

      return items;
    },
  });
}

'use client';

import Wrapper from '@/components/Wrapper';
import useOwnedObjects from '@/hooks/useOwnedObjects';
import { useCurrentAccount } from '@mysten/dapp-kit';

export default function Claim() {
  const currentAccount = useCurrentAccount();
  const { isLoading, data: objects } = useOwnedObjects(
    currentAccount?.address || '0x77feb32c1bc7d61693f0abffe643206efbda365378820e494403d1bdb3bbab61',
  );
  console.log(objects);

  return (
    <Wrapper>
      <div>claim page</div>
    </Wrapper>
  );
}

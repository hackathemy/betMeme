export interface IBetMemesProps {
  id: string;
  title: string;
  createdAt: string;
  denom: string;
  upAmount: string;
  downAmount: string;
  startPrice: string;
  endPrice: string;
  fees: string;
  burnAmount: string;
  isActive: boolean;
  isEnd: boolean;
  win?: string;
}

export interface IBetMemesProps {
  id: string;
  title: string;
  createdAt: string;
  denom1: string;
  denom2: string;
  denom1Amount: number;
  denom2Amount: number;
  denom1StartPrice: number;
  denom2StartPrice: number;
  denom1IncreasePercent: number;
  denom2IncreasePercent: number;
  isActive: boolean;
  isEnd: boolean;
  win?: string;
}

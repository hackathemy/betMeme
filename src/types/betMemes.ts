export interface IBetMemesProps {
  id: string;
  title: string;
  createdAt: string;
  denom1: string;
  denom2: string;
  denom1Amount: number;
  denom2Amount: number;
  isActive: boolean;
  isEnd: boolean;
  win?: string;
}

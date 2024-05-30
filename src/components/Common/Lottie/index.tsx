import Lottie, { Options } from 'react-lottie';

interface ILottieContainerProps {
  lottieData: unknown;
  className?: string;
}

const LottieContainer: React.FC<ILottieContainerProps> = ({ lottieData, className }) => {
  const lottieDefaultOptions: Options = {
    loop: 0,
    autoplay: true,
    animationData: lottieData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      className,
    },
  };

  return <Lottie isClickToPauseDisabled options={lottieDefaultOptions} />;
};

export default LottieContainer;

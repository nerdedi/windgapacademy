import React from "react";
import Lottie from "react-lottie-player";

export default function LottieAnimation({ src, loop = false, play = true, style = {}, className = "" }) {
  const [animationData, setAnimationData] = React.useState(null);

  React.useEffect(() => {
    fetch(src)
      .then((res) => res.json())
      .then(setAnimationData);
  }, [src]);

  if (!animationData) return null;
  return (
    <Lottie
      animationData={animationData}
      play={play}
      loop={loop}
      style={style}
      className={className}
    />
  );
}

/**
 * Loading spinner component for Unity educational experiences
 */
const LoadingSpinner = () => {
  return (
    <div className="unity-loader">
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="94.2477796077"
          strokeDashoffset="47.1238898038"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default LoadingSpinner;

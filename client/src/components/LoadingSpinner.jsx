import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'large', text = 'Loading...' }) => {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

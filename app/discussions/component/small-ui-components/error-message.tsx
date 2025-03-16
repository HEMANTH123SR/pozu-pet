interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="text-center p-4 text-red-500">
    {message}
    <button onClick={onRetry} className="ml-2 text-blue-500 hover:underline">
      Retry
    </button>
  </div>
);

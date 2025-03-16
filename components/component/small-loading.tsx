export const SmallLoading = () => {
  return (
    <div className="flex space-x-2">
      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-custom-bounce"></div>
      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-custom-bounce delay-200"></div>
      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-custom-bounce delay-500"></div>
    </div>
  );
};

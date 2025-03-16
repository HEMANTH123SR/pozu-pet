const DiscussionsLoading = () => (
    <div className="w-full flex flex-col space-y-4 p-4 animate-pulse">
        {[...Array(5)].map((_, index) => (
            <div
                key={index}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg h-24 w-full"
            ></div>
        ))}
    </div>
);

export default DiscussionsLoading;
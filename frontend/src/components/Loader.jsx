export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-5 animate-fade-up">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#FDF2E9] border-t-[#D35400] rounded-full animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-2xl animate-float">🙏</span>
      </div>
      <p className="text-[#5D6D7E] text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
}

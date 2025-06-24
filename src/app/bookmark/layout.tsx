export default function BookmarkLayouyt({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mt-8 mb-15">
      {children}
    </div>
  );
}

// app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 grid place-items-center">
      <div className="animate-spin size-10 rounded-full border-4 border-gray-200 border-t-gray-700" />
    </div>
  );
}

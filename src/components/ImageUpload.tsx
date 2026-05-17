export default function ImageUpload() {
  return (
    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center">
      <label className="cursor-pointer text-center">
        <input type="file" multiple className="hidden" accept="image/*" />
        <svg
          className="w-12 h-12 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 16v-2a2 2 0 012-2h2m4 0h2a2 2 0 012 2v2m-4-8V4a2 2 0 012-2h2m-8 0h2a2 2 0 012 2v2"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          Click or drag images to upload
        </p>
      </label>
    </div>
  );
}

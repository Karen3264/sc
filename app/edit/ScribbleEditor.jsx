export default function ScribbleEditor({
  text,
  onTextChange,
  onSave,
  onPublish,
  status,
}) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-black">Edit Scribble</h1>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        rows="10"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Write your scribble here..."
      ></textarea>
      <div className="flex justify-between">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Save as Draft
        </button>
        <button
          onClick={onPublish}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Publish
        </button>
      </div>
      {status && <p className="mt-4 text-green-500">{status}</p>}
    </div>
  );
}

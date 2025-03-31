export default function DraftsList({ drafts, onEdit }) {
  if (drafts.length === 0) {
    return <p>You have no drafts.</p>;
  }

  return (
    <div className="space-y-4">
      {drafts.map((draft) => (
        <div key={draft.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {draft.title || "Untitled"}
              </h3>
              <p className="text-gray-600">
                {draft.content ? draft.content.substring(0, 150) + "..." : "No content"}
              </p>
            </div>
            <button
              onClick={() => onEdit(draft.id)}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

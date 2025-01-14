export default function DraftsList({ drafts, onEdit }) {
  if (drafts.length === 0) {
    return <p>You have no drafts.</p>;
  }

  return (
    <ul className="list-disc pl-5">
      {drafts.map((draft) => (
        <li key={draft.id} className="mb-2">
          <div className="flex justify-between items-center">
            <span>{draft.content.substring(0, 100)}...</span>
            <button
              onClick={() => onEdit(draft.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

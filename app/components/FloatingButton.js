import { useRouter } from "next/navigation";
export default function FloatingButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/edit"); // Adjust the path to where your form for adding a scribble is located
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-2/3 transform -translate-x-1/2 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      +
    </button>
  );
}

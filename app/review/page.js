"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../context/storeContext";
import Conditional from "../../components/Conditional";
import { useAuth } from "../../context/authContext";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../context/firebase";

export default function ReviewScribble() {
  const { user, setAuthLoading, updateUser } = useAuth();
  const { getScribbleById, submitReview } = useStore();
  const [scribble, setScribble] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchScribble = async () => {
      try {
        setAuthLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        
        if (!id) {
          setError("No scribble ID provided");
          setLoading(false);
          return;
        }

        const scribbleData = await getScribbleById(id);
        if (!scribbleData) {
          setError("Scribble not found");
          setLoading(false);
          return;
        }

        setScribble(scribbleData);
      } catch (err) {
        console.error("Error fetching scribble:", err);
        setError("Failed to load scribble");
      } finally {
        setLoading(false);
        setAuthLoading(false);
      }
    };

    fetchScribble();
  }, []);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      setSubmitStatus("Please write a review before submitting");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("Submitting review...");

    try {
      // First, update the scribble directly in Firebase
      const scribbleRef = doc(db, "scribbles", scribble.id);
      
      // Update the scribble with the review
      await updateDoc(scribbleRef, {
        reviewed: true,
        reviewer: user.uid,
        reviewer_username: user.displayName,
        review: reviewText,
        rating: rating,
        reviewTimestamp: new Date(),
      });
      
      // Fetch the updated scribble to console log
      const updatedScribbleSnap = await getDoc(scribbleRef);
      const updatedScribble = { id: updatedScribbleSnap.id, ...updatedScribbleSnap.data() };
      console.log("Updated Scribble:", updatedScribble);
      
      // Update the user's reviewing status to false
      const userAssignedRef = doc(db, `users/${user.uid}/assignedScribble`, "status");
      await setDoc(userAssignedRef, {
        isReviewing: false,
        assignedScribble: null
      });
      
      console.log("User reviewing status updated: isReviewing = false");
      
      // Update the user object in the auth context to reflect the changes
      const updatedUser = {
        ...user,
        isReviewing: false,
        assignedScribble: null
      };
      updateUser(updatedUser);
      
      // Then call the submitReview function to handle the rest of the logic
      await submitReview(scribble.id, reviewText, rating);
      
      setSubmitStatus("Review submitted successfully!");
      setReviewText("");
      setRating(5);
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error("Error submitting review:", err);
      setSubmitStatus(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  // Check if this is the user's assigned scribble
  const isAssignedScribble = user.isReviewing && user.assignedScribble === scribble.id;

  return (
    <Conditional>
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{scribble.title}</h1>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{scribble.content}</p>
            </div>
          </div>
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Author:</span> {scribble.author_username}
              </div>
              <div>
                <span className="font-medium">Rating:</span> {scribble.rating}
              </div>
              <div>
                <span className="font-medium">Rank:</span> {scribble.rank}
              </div>
              {scribble.reviewer_username && (
                <div>
                  <span className="font-medium">Reviewed by:</span> {scribble.reviewer_username}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Form - Only show if this is the user's assigned scribble */}
        {isAssignedScribble && (
          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Write Your Review</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-10)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        rating === value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="6"
                  placeholder="Write your review here..."
                ></textarea>
              </div>
              
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
              
              {submitStatus && (
                <p className={`mt-4 text-center ${
                  submitStatus.includes("successfully") ? "text-green-600" : "text-red-600"
                }`}>
                  {submitStatus}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Conditional>
  );
} 
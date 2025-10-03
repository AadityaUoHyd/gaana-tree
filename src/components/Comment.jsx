import { useState, useEffect } from "react";
import { commentsAPI } from "../services/apiService.js";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import EmojiPicker from "emoji-picker-react"; // 👈 emoji picker

const Comment = ({ songId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

    // Emoji state
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [songId]);

    const fetchComments = async () => {
        try {
            const response = await commentsAPI.list(songId);
            // Ensure latest comments come first
            const sortedComments = (response.data || []).sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setComments(sortedComments);
            setCurrentPage(1); // reset to page 1 on new fetch
        } catch (error) {
            toast.error("Failed to load comments");
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated()) {
            toast.error("Please log in to comment");
            return;
        }
        if (!newComment.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }
        setLoading(true);
        try {
            await commentsAPI.add(songId, { commentText: newComment });
            setNewComment("");
            fetchComments();
            toast.success("Comment added!");
        } catch (error) {
            toast.error("Failed to add comment");
        } finally {
            setLoading(false);
        }
    };

    // Emoji handler
    const handleEmojiClick = (emojiObject) => {
        setNewComment((prev) => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    // Pagination calculations
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    return (
        <div className="max-w-3xl mx-auto mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                Loving this song? Share your thoughts!
            </h2>
            
            {isAuthenticated() && (
                <form onSubmit={handleAddComment} className="mt-6 relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type here your comment... 😍🔥🎶"
                        className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-400 focus:outline-none"
                        rows="3"
                    />

                    {/* Emoji toggle button */}
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="absolute bottom-16 right-4 text-xl"
                    >
                        😀
                    </button>

                    {showEmojiPicker && (
                        <div className="absolute bottom-24 right-4 z-10 bg-gray-900 rounded-lg shadow-lg">
                            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Adding..." : "Add Comment"}
                    </button>
                </form>
            )}

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mt-4">
                {comments.length > 0 ? (
                    <>
                        <ul className="space-y-4">
                            {currentComments.map((comment) => (
                                <li key={comment.id} className="border-b border-gray-700 pb-4">
                                    <p className="text-gray-300">{comment.commentText}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        By {comment.userEmail} on{" "}
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        {/* Pagination controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages)].map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx + 1)}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === idx + 1
                                                ? "bg-purple-500 text-white"
                                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-amber-200">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default Comment;

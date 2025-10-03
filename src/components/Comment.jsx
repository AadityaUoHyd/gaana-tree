import { useContext, useState, useEffect } from "react";
import { commentsAPI } from "../services/apiService.js";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Comment = ({ songId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchComments();
    }, [songId]);

    const fetchComments = async () => {
        try {
            const response = await commentsAPI.list(songId);
            setComments(response.data || []);
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

    return (
        <div className="max-w-3xl mx-auto mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Loving this song? Share your thoughts!</h2>
            
            {isAuthenticated() && (
                <form onSubmit={handleAddComment} className="mt-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type here your comment..."
                        className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-400 focus:outline-none"
                        rows="3"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Adding...' : 'Add Comment'}
                    </button>
                </form>
            )}

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mt-4">
                {comments.length > 0 ? (
                    <ul className="space-y-4">
                        {comments.map((comment) => (
                            <li key={comment.id} className="border-b border-gray-700 pb-4">
                                <p className="text-gray-300">{comment.commentText}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    By {comment.userEmail} on {new Date(comment.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-amber-200">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default Comment;
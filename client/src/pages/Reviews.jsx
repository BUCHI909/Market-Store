// src/pages/Reviews.jsx
import React, { useEffect, useState } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { getReviews } from "../utils/api"; // Make sure this function calls your backend /api/reviews
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await getReviews();
      setReviews(res.data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="py-4" style={{ background: "#f0f7ff", minHeight: "100vh" }}>
        <div className="container-fluid">
          <h2 className="mb-4 text-primary fw-bold">User Reviews</h2>

          {loading ? (
            <div className="text-center py-5">
              <span className="spinner-border text-primary"></span>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-muted text-center">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="card mb-3 shadow-sm"
                style={{ borderLeft: "4px solid #0d6efd" }}
              >
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <FaUserCircle size={50} className="text-primary" />
                    <div>
                      <h5 className="mb-1">{review.user_name || "Anonymous"}</h5>
                      <div className="d-flex align-items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={14}
                            color={i < review.rating ? "#0d6efd" : "#e4e5e9"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mb-0 text-muted">{review.comment || "No comment"}</p>

                  <small className="text-muted">{new Date(review.created_at).toLocaleDateString()}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Reviews;
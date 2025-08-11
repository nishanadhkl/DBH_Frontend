import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const [tempHover, setTempHover] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowRating, setShouldShowRating] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Main data fetching effect
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchBook();
        if (token && userId) {
          await checkSubscription();
          await fetchUserRating();
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, token, userId]);

  // Handle fromSubscription after book data is loaded
  useEffect(() => {
    if (!book || isLoading) return; // Wait for book data to load
    
    const urlParams = new URLSearchParams(window.location.search);
    const fromSubscription = urlParams.get('fromSubscription');
    
    if (fromSubscription === 'true') {
      // Clean up URL immediately
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Check if user actually has an active PDF reading session for this book
      const userId = localStorage.getItem("userId");
      if (userId) {
        const sessionId = `pdf-reading-${id}-${userId}`;
        try {
          const sessionData = JSON.parse(localStorage.getItem(sessionId) || '{}');
          // Only show rating if there was an active session that was just completed
          if (sessionData.active && sessionData.bookId === id) {
            // Mark session as completed
            sessionData.active = false;
            localStorage.setItem(sessionId, JSON.stringify(sessionData));
            
            // Set flag to show rating dialog
            setShouldShowRating(true);
            
            // Show rating dialog after ensuring everything is loaded
            setTimeout(() => {
              setShowRatingDialog(true);
            }, 2000); // Increased delay to ensure page is fully rendered
          }
        } catch (error) {
          // Session data check failed
        }
      }
    }
  }, [book, isLoading, id]); // Depend on book, loading state, and book ID

  // This useEffect is no longer needed since we handle PDF sessions in the fromSubscription useEffect above

  const fetchBook = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(res.data);
      
      // Calculate average rating and total ratings
      if (res.data.ratings && Array.isArray(res.data.ratings)) {
        const total = res.data.ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
        const avg = res.data.ratings.length > 0 ? total / res.data.ratings.length : 0;
        setAverageRating(Math.round(avg * 10) / 10);
        setTotalRatings(res.data.ratings.length);
      } else {
        setAverageRating(0);
        setTotalRatings(0);
      }
    } catch (error) {
      console.error("Failed to fetch book:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error("Failed to fetch book details. Please try again.");
      setBook(null);
      throw error; // Re-throw to be caught by the main loadData function
    }
  };

  const checkSubscription = async () => {
    if (!token || !userId) return;
    
    setCheckingSubscription(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/subscriptions/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSubscribed(res.data.subscribed);
    } catch (error) {
      console.error("Failed to check subscription:", error);
      setIsSubscribed(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const fetchUserRating = async () => {
    if (!token || !userId) return;
    
    try {
      const res = await axios.get(`http://localhost:5000/api/books/${id}/user-rating/${userId}`);
      if (res.data.hasRated) {
        setUserRating(res.data.rating);
      } else {
        setUserRating(0);
      }
    } catch (error) {
      console.error("Failed to fetch user rating:", error);
      setUserRating(0);
    }
  };

  const handleReadMore = () => {
    if (!token) {
      toast.info("You are not logged in. Please log in to read the full book.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else if (isSubscribed) {
      // User is already subscribed, redirect to PDF
      if (book && book.pdfPath) {
        toast.info("Redirecting to full PDF...", { autoClose: 1000 });
        
        // Set a flag in localStorage to track PDF reading session
        const sessionId = `pdf-reading-${id}-${userId}`;
        const sessionData = {
          bookId: id,
          userId: userId,
          startTime: Date.now(),
          active: true
        };
        localStorage.setItem(sessionId, JSON.stringify(sessionData));
        
        setTimeout(() => {
          // Add URL parameters to disable download functionality
          const pdfUrl = `http://localhost:5000${book.pdfPath}#toolbar=0&navpanes=0&scrollbar=0&download=0`;
          const pdfWindow = window.open(pdfUrl, '_blank');
          
          if (pdfWindow) {
            
            // Method 1: Monitor PDF window directly
            const checkClosed = setInterval(() => {
              try {
                if (pdfWindow.closed) {
                  clearInterval(checkClosed);
                  // Mark session as completed
                  try {
                    const sessionData = JSON.parse(localStorage.getItem(sessionId) || '{}');
                    sessionData.active = false;
                    sessionData.endTime = Date.now();
                    localStorage.setItem(sessionId, JSON.stringify(sessionData));
                  } catch (error) {
                    // Session update failed
                  }
                  // The rating dialog will be shown when user navigates back with fromSubscription=true
                }
              } catch (error) {
                clearInterval(checkClosed);
              }
            }, 500);
            
            // Method 2: Monitor page focus/blur events
            let hasShownRating = false;
            const handleFocus = () => {
              if (!hasShownRating) {
                setTimeout(() => {
                  try {
                    if (pdfWindow.closed) {
                      hasShownRating = true;
                      // Mark session as completed
                      try {
                        const sessionData = JSON.parse(localStorage.getItem(sessionId) || '{}');
                        sessionData.active = false;
                        sessionData.endTime = Date.now();
                        localStorage.setItem(sessionId, JSON.stringify(sessionData));
                      } catch (error) {
                        // Session update failed
                      }
                      // The rating dialog will be shown when user navigates back with fromSubscription=true
                    }
                  } catch (error) {
                    // PDF window check failed
                  }
                }, 1000);
              }
            };
            
            const handleBlur = () => {
              // Page lost focus
            };
            
            window.addEventListener('focus', handleFocus);
            window.addEventListener('blur', handleBlur);
            
            // Method 3: Monitor visibility changes
            const handleVisibilityChange = () => {
              if (!document.hidden && !hasShownRating) {
                setTimeout(() => {
                  try {
                    if (pdfWindow.closed) {
                      hasShownRating = true;
                      // Mark session as completed
                      try {
                        const sessionData = JSON.parse(localStorage.getItem(sessionId) || '{}');
                        sessionData.active = false;
                        sessionData.endTime = Date.now();
                        localStorage.setItem(sessionId, JSON.stringify(sessionData));
                      } catch (error) {
                        // Session update failed
                      }
                      // The rating dialog will be shown when user navigates back with fromSubscription=true
                    }
                  } catch (error) {
                    // PDF window check failed
                  }
                }, 1000);
              }
            };
            
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            // Cleanup function
            const cleanup = () => {
              clearInterval(checkClosed);
              window.removeEventListener('focus', handleFocus);
              window.removeEventListener('blur', handleBlur);
              document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
            
            // Cleanup after 10 minutes to prevent memory leaks
            setTimeout(cleanup, 600000);
          }
        }, 1000);
      }
    } else {
      // Redirect to subscription page
      navigate(`/subscribe?bookId=${id}`);
    }
  };

  // Function removed - no longer needed since rating dialog is handled through fromSubscription URL parameter

  const handleRatingDialogClose = () => {
    setShowRatingDialog(false);
    setTempRating(0);
    setTempHover(0);
    setShouldShowRating(false);
  };

  const handleRatingSubmit = async () => {
    if (tempRating === 0) {
      toast.warning("Please select a rating before submitting.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/books/${id}/rate`, {
        userId,
        rating: tempRating,
      });
      toast.success("Thank you for rating this book!");
      setUserRating(tempRating);
      handleRatingDialogClose();
      
      // Refresh both book data and user rating
      await fetchBook();
      await fetchUserRating();
    } catch (error) {
      console.error("Error rating book:", error);
      toast.error("Failed to save rating");
    }
  };

  // Show loading state while data is being fetched
  if (isLoading || !book) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading book details...</p>
          <p className="text-muted">Please wait while we fetch the book information.</p>
          {shouldShowRating && (
            <p className="text-info mt-2">Preparing rating dialog...</p>
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="shadow p-4">
        <div className="d-flex flex-column flex-md-row align-items-center">
          <img
            src={`http://localhost:5000${book.image}`}
            alt={book.title}
            style={{
              width: "250px",
              height: "350px",
              objectFit: "cover",
              marginRight: "30px",
            }}
            className="mb-3 mb-md-0"
          />
          <div>
            <h2>{book.title}</h2>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            <p>
              <strong>Genre:</strong> {book.genre}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {book.description || "No description available."}
            </p>
            {book.featured && <span className="badge bg-success">Featured</span>}
            
            {/* Subscription Status */}
            {token && (
              <div className="mt-3">
                {checkingSubscription ? (
                  <span className="text-muted">Checking subscription...</span>
                ) : isSubscribed ? (
                  <span className="badge bg-success">✅ Subscribed</span>
                ) : (
                  <span className="badge bg-warning">🔒 Not Subscribed</span>
                )}
              </div>
            )}

            {/* Rating Display */}
            <div className="mt-3">
              {/* User's Personal Rating */}
              <div className="mb-2">
                <h6 className="mb-1">Your Rating:</h6>
                <div className="d-flex align-items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        fontSize: "1.2rem",
                        color: userRating >= star ? "gold" : "gray",
                      }}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ms-2 text-muted">
                    {userRating > 0 ? `${userRating}/5` : "Not rated yet"}
                  </span>
                </div>
              </div>
              
              {/* Book's Average Rating */}
              <div>
                <h6 className="mb-1">Book Rating:</h6>
                <div className="d-flex align-items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        fontSize: "1.2rem",
                        color: averageRating >= star ? "gold" : "gray",
                      }}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ms-2 text-muted">
                    {averageRating > 0 ? `${averageRating}/5 (${totalRatings} rating${totalRatings !== 1 ? 's' : ''})` : "No ratings yet"}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="mt-4">
              <h5>Preview</h5>
              {book.previewPdfPath ? (
                <iframe
                  src={`http://localhost:5000${book.previewPdfPath}#page=1&toolbar=0&navpanes=0&scrollbar=0&download=0`}
                  width="100%"
                  height="400px"
                  title="PDF Preview"
                  style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                />
              ) : (
                <p>No preview available.</p>
              )}
            </div>

            {/* Full Book Section */}
            <div className="mt-4">
              <Button
                variant={isSubscribed ? "success" : "primary"}
                onClick={handleReadMore}
                className="me-2"
              >
                {isSubscribed ? "Read Full Book" : "Subscribe to Read Full Book"}
              </Button>
              
              <Link to="/books">
                <Button variant="secondary">Back to Books</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Rating Dialog Modal */}
      <Modal show={showRatingDialog} onHide={handleRatingDialogClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Rate This Book</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5 className="mb-3">How would you rate "{book?.title}"?</h5>
          <p className="text-muted mb-3">Your feedback helps other readers discover great books!</p>
          
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  fontSize: "2.5rem",
                  color: (tempHover || tempRating) >= star ? "gold" : "gray",
                  cursor: "pointer",
                  margin: "0 5px",
                  transition: "color 0.2s ease"
                }}
                onClick={() => setTempRating(star)}
                onMouseEnter={() => setTempHover(star)}
                onMouseLeave={() => setTempHover(tempRating)}
              >
                ★
              </span>
            ))}
          </div>
          
          <p className="text-muted">
            {tempRating > 0 ? `You selected: ${tempRating} star${tempRating > 1 ? 's' : ''}` : "Click on a star to rate"}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRatingDialogClose}>
            Skip Rating
          </Button>
          <Button variant="primary" onClick={handleRatingSubmit} disabled={tempRating === 0}>
            Submit Rating
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookDetails;

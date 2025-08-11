
import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Subscribe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bookId = params.get("bookId");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/books/${bookId}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Failed to fetch book:", err);
        toast.error("Failed to load book details");
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  const redirectToPdf = async () => {
    if (book && book.pdfPath) {
      try {
        // Show a toast before redirecting
        toast.info("Redirecting to full PDF...", { autoClose: 1000 });
        
        // Set a flag in localStorage to track PDF reading session
        const sessionId = `pdf-reading-${bookId}-${localStorage.getItem("userId")}`;
        const sessionData = {
          bookId: bookId,
          userId: localStorage.getItem("userId"),
          startTime: Date.now(),
          active: true
        };
        localStorage.setItem(sessionId, JSON.stringify(sessionData));
        
        // Small delay to show the toast
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
                  navigate(`/books/${bookId}?fromSubscription=true`);
                }
              } catch (error) {
                clearInterval(checkClosed);
              }
            }, 500);
            
            // Method 2: Monitor page focus/blur events
            let hasNavigated = false;
            const handleFocus = () => {
              if (!hasNavigated) {
                // Check if PDF window is closed when we regain focus
                setTimeout(() => {
                  try {
                    if (pdfWindow.closed) {
                      hasNavigated = true;
                      clearInterval(checkClosed);
                      navigate(`/books/${bookId}?fromSubscription=true`);
                    }
                  } catch (error) {
                    // PDF window check failed
                  }
                }, 1000);
              }
            };
            
            const handleBlur = () => {
              // User switched away from the page
            };
            
            window.addEventListener('focus', handleFocus);
            window.addEventListener('blur', handleBlur);
            
            // Method 3: Monitor visibility changes
            const handleVisibilityChange = () => {
              if (!document.hidden && !hasNavigated) {
                // Page became visible again, check if PDF is closed
                setTimeout(() => {
                  try {
                    if (pdfWindow.closed) {
                      hasNavigated = true;
                      clearInterval(checkClosed);
                      navigate(`/books/${bookId}?fromSubscription=true`);
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
        
        return true;
      } catch (error) {
        console.error("PDF redirect failed:", error);
        return false;
      }
    }
    return false;
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");



    if (!token || !userId) {
      toast.error("Please log in to subscribe.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    if (subscribing) return; // Prevent double clicks
    
    setSubscribing(true);

    try {

      
      const res = await fetch("http://localhost:5000/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });



      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        throw new Error("Invalid response from server");
      }

      if (res.ok) {
        // Show success toast
        toast.success("🎉 Subscription successful! Redirecting to full PDF...", {
          autoClose: 1000,
          position: "top-center"
        });
        
        // Redirect to PDF after toast
        setTimeout(async () => {
          const redirected = await redirectToPdf();
          if (!redirected) {
            toast.warning("PDF not available, redirecting to books page");
            navigate("/books");
          }
        }, 2000);
      } else {
        if (data.message && data.message.includes("Already subscribed")) {
          toast.info("You're already subscribed! Redirecting to full PDF...");
          setTimeout(async () => {
            const redirected = await redirectToPdf();
            if (!redirected) navigate("/books");
          }, 1500);
        } else {
          toast.error(data.message || "Failed to subscribe. Please try again.");
        }
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      toast.error("Subscription failed. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };



  if (loading) return (
    <Container className="mt-5">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading book details...</p>
      </div>
    </Container>
  );
  
  if (!book) return (
    <Container className="mt-5">
      <div className="text-center">
        <h3>Book not found</h3>
        <p>The book you're looking for doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate("/books")}>
          Back to Books
        </Button>
      </div>
    </Container>
  );

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow text-center">
        <h2>Subscribe to Read Full Book</h2>
        <p className="mt-3">
          <strong>{book.title}</strong> by {book.author}
        </p>
        <h4 className="mb-3">Price: <span className="text-success">Rs. {book.price}</span></h4>
        <div className="text-center mb-3">
          <img
            src="/khalti.png"
            alt="Khalti"
            style={{ width: "180px", borderRadius: "8px" }}
          />
        </div>
        

        
        <Button 
          variant="success" 
          onClick={handleSubscribe} 
          className="mt-3"
          disabled={subscribing}
          size="lg"
        >
          {subscribing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            "Subscribe Now"
          )}
        </Button>
        <p className="text-muted mt-2">
          After subscription, you'll be redirected to the full PDF automatically
        </p>
      </Card>
    </Container>
  );
};

export default Subscribe;

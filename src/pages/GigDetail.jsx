// src/pages/GigDetail.jsx
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Card, Button, Form, ListGroup, Spinner, Alert } from "react-bootstrap";

export default function GigDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch gig details
  const fetchGig = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/gigs/${id}`);
      setGig(res.data);
    } catch (err) {
      console.error("Error fetching gig:", err);
      setError(err.response?.data?.message || "Failed to load gig details");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch bids (owner only)
  const fetchBids = async () => {
  if (!gig) return; // only fetch if gig loaded
  try {
    // owner sees all bids
    if (user._id === gig.ownerId) {
      const res = await API.get(`/bids/${id}`);
      setBids(res.data);
    } else {
      setBids([]); // non-owner cannot see bids
    }
  } catch (err) {
    console.error("Error fetching bids:", err);
  }
};

  // ✅ Submit a bid (non-owner)
  const submitBid = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bids", { gigId: id, message, price });
      setMessage("");
      setPrice("");
      alert("Bid submitted!");
      fetchBids();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting bid");
    }
  };

  // ✅ Hire freelancer (owner only)
  const hireBid = async (bidId) => {
    try {
      await API.patch(`/bids/${bidId}/hire`);
      alert("Freelancer hired successfully!");
      fetchGig();
      fetchBids();
    } catch (err) {
      alert(err.response?.data?.message || "Error hiring freelancer");
    }
  };

  // ✅ Fetch gig and bids on mount
  useEffect(() => {
    fetchGig();
  }, [id]);

  useEffect(() => {
    fetchBids();
  }, [gig, user]);

  // ✅ Loading or error UI
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-2">Loading gig details...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="text-center mt-4">{error}</Alert>;
  }

  if (!gig) return null;

  return (
    <div className="container mt-4">
      {/* ✅ GIG INFO SECTION */}
      <Card>
        <Card.Body>
          <h4>{gig.title}</h4>
          <p>{gig.description}</p>
          <p>Budget: ${gig.budget}</p>
          <p>
            Status:{" "}
            {gig.status === "assigned" ? (
              <span className="text-success fw-bold">Assigned</span>
            ) : (
              <span className="text-secondary">Open</span>
            )}
          </p>
          {gig.status === "assigned" && gig.hiredFreelancer && (
            <p>
              Hired Freelancer: <strong>{gig.hiredFreelancer.name}</strong>
            </p>
          )}
        </Card.Body>
      </Card>

      {/* ✅ BID FORM OR OWNER VIEW */}
      {user && user._id !== gig.ownerId ? (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Submit Your Bid</Card.Title>
            <Form onSubmit={submitBid}>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  placeholder="Message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  placeholder="Your Price ($)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100">
                Submit Bid
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Bids for This Gig</Card.Title>
            {bids.length === 0 ? (
              <p className="text-muted">No bids yet.</p>
            ) : (
              <ListGroup>
                {bids.map((bid) => (
                  <ListGroup.Item key={bid._id}>
                    <p><strong>Message:</strong> {bid.message}</p>
                    <p><strong>Price:</strong> ${bid.price}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {bid.status === "hired" ? (
                        <span className="text-success fw-bold">Hired</span>
                      ) : bid.status === "rejected" ? (
                        <span className="text-danger">Rejected</span>
                      ) : (
                        "Pending"
                      )}
                    </p>
                    {bid.status === "pending" && gig.status === "open" && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => hireBid(bid._id)}
                      >
                        Hire
                      </Button>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import GigCard from "../components/GigCard";
import { Spinner, Row, Col } from "react-bootstrap";

export default function MyGigs() {
  const { user } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyGigs = async () => {
    try {
      setLoading(true);
      if (!user) return;

      if (user.role === "client") {
        const res = await API.get("/gigs");
        // ⚡ convert ObjectId to string for comparison
        setGigs(res.data.filter((g) => g.ownerId.toString() === user._id));
      } else {
        const res = await API.get("/gigs/my-bids");
        // ⚡ map bid → gig info with correct ID
        setGigs(res.data.map((b) => ({
          _id: b.gigId?._id,
          title: b.gigId?.title || b.gigTitle,
          description: b.gigId?.description || "",
          budget: b.gigId?.budget || 0,
          ownerId: b.gigId?.ownerId,
          status: b.gigId?.status || "open",
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGigs();
  }, [user]);

  if (loading) return (
    <div className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
      <p className="text-muted mt-2">Loading your gigs...</p>
    </div>
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-3">{user?.role === "client" ? "My Gigs" : "My Bids"}</h3>
      <Row>
        {gigs.length > 0 ? (
          gigs.map((gig) => (
            <Col md={6} lg={4} key={gig._id}>
              <GigCard gig={gig} refreshGigs={fetchMyGigs} />
            </Col>
          ))
        ) : (
          <p className="text-muted text-center">No gigs found</p>
        )}
      </Row>
    </div>
  );
}

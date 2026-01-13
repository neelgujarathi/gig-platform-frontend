import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import GigCard from "../components/GigCard";
import { Form, Row, Col, Spinner, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch gigs with optional search
  const fetchGigs = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/gigs?search=${search}`);
      setGigs(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch gigs");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch gigs on search change
  useEffect(() => {
    fetchGigs();
  }, [search]);

  return (
    <div className="container mt-4">
      <Row className="mb-3">
        <Col md={6} className="mx-auto d-flex">
          <Form.Control
            type="text"
            placeholder="Search gigs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="primary" className="ms-2" onClick={fetchGigs}>
            Search
          </Button>
        </Col>
      </Row>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading gigs...</p>
        </div>
      )}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && (
        <Row>
          {gigs.length > 0 ? (
            gigs.map((gig) => (
              <Col md={6} lg={4} key={gig._id}>
                <GigCard gig={gig} refreshGigs={fetchGigs} />
              </Col>
            ))
          ) : (
            <p className="text-center text-muted mt-5">No gigs found</p>
          )}
        </Row>
      )}
    </div>
  );
}

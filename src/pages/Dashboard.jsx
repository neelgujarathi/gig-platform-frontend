import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import GigCard from "../components/GigCard";
import { AuthContext } from "../context/AuthContext";
import { Form, Row, Col, Spinner, Button } from "react-bootstrap";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/gigs?search=${search}`);
      setGigs(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGigs(); }, [search]);

  if (loading) return (
    <div className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
      <p className="text-muted mt-2">Loading gigs...</p>
    </div>
  );

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
    </div>
  );
}

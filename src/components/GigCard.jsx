import { Card, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-toastify";

export default function GigCard({ gig, refreshGigs }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  //Delete gig
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;
    try {
      await API.delete(`/gigs/${gig._id}`);
      toast.success("Gig deleted successfully!");
      if (refreshGigs) refreshGigs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete gig");
    }
  };

  //Edit gig
  const handleEdit = () => {
    navigate(`/edit-gig/${gig._id}`);
  };

  // UI rendering
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="mb-1">{gig.title}</Card.Title>

          {/*Status badge */}
          {gig.status === "assigned" ? (
            <Badge bg="success">Assigned</Badge>
          ) : (
            <Badge bg="secondary">Open</Badge>
          )}
        </div>

        <Card.Text className="mt-2">{gig.description}</Card.Text>
        <Card.Text>
          <strong>Budget:</strong> ${gig.budget}
        </Card.Text>

        {/*Show "View Details" */}
        <Link to={`/gig/${gig._id}`}>
          <Button variant="primary">View Details</Button>
        </Link>

        {/*Only owner can edit/delete */}
        {user && user._id === gig.ownerId && (
          <>
            <Button
              variant="warning"
              size="sm"
              className="ms-2"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="ms-2"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        )}

        {/*Show hire summary */}
        {gig.status === "assigned" && gig.hiredFreelancer && (
          <Card.Text className="mt-2">
            <strong>Hired Freelancer:</strong>{" "}
            <span className="text-success">
              {gig.hiredFreelancer?.name || "Freelancer"}
            </span>
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}

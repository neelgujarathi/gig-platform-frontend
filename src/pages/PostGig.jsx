import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";

export default function PostGig() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/gigs", { title, description, budget });
      toast.success("Gig posted successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error posting gig");
    }
  };

  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: "500px" }}>
      <Card.Body>
        <Card.Title className="mb-3">Post a New Gig</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control as="textarea" rows={3} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="number" placeholder="Budget ($)" value={budget} onChange={(e) => setBudget(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">Create Gig</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";

export default function EditGig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await API.get(`/gigs/${id}`);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setBudget(res.data.budget);
      } catch (err) {
        toast.error("Failed to load gig");
      }
    };
    fetchGig();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/gigs/${id}`, { title, description, budget });
      toast.success("Gig updated successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: "500px" }}>
      <Card.Body>
        <Card.Title>Edit Gig</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control value={budget} onChange={(e) => setBudget(e.target.value)} />
          </Form.Group>
          <Button type="submit">Save Changes</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

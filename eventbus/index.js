import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.post("/events", (req, res) => {
	const event = req.body;

	axios.post("http://localhost:4000/events", event);
	axios.post("http://localhost:4001/events", event);
	axios.post("http://localhost:4002/events", event);
	axios.post("http://localhost:4003/events", event);
	axios.post("http://localhost:4004/events", event);
	axios.post("http://localhost:4005/events", event);
	axios.post("http://localhost:4006/events", event);
	axios.post("http://localhost:4007/events", event);
	axios.post("http://localhost:4008/events", event);
	axios.post("http://localhost:4009/events", event);

	res.send("Event received and sent to all services");
});

app.listen(4010, () => {
	console.log("Server listening on port 4010");
});

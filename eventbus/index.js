import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.post("/events", (req, res) => {
	const event = req.body;

	axios.post("http://localhost:4000/events", event).catch((err) => {
		console.log(err.message);
	});
	axios.post("http://localhost:4001/events", event).catch((err) => {
		console.log(err.message);
	});
	axios.post("http://localhost:4002/events", event).catch((err) => {
		console.log(err.message);
	});
	axios.post("http://localhost:4003/events", event).catch((err) => {
		console.log(err.message);
	});
	axios.post("http://localhost:4004/events", event).catch((err) => {
		console.log(err.message);
	});
	axios.post("http://localhost:4005/events", event).catch((err) => {
		console.log(err.message);
	});
	axios.post("http://localhost:4006/events", event).catch((err) => {
		console.log(err.message);
	});
	axios.post("http://localhost:4007/events", event).catch((err) => {
		console.log(err.message);
	});
	axios.post("http://localhost:4008/events", event).catch((err) => {
		console.log(err.message);
	});
	axios.post("http://localhost:4009/events", event).catch((err) => {
		console.log(err.message);
	});

	res.send("Event received and sent to all services");
});

app.listen(4010, () => {
	console.log("Server listening on port 4010");
});

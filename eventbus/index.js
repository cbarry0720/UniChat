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

	console.log(event);

	axios.post("http://auth:4000/events", event).catch((err) => {
		console.log("AUTH: " + err.message);
	});
	axios.post("http://users:4001/events", event).catch((err) => {
		console.log("USERS: " + err.message);
	});
	axios.post("http://posts:4002/events", event).catch((err) => {
		console.log("POSTS: " + err.message);
	});
	axios.post("http://comments:4003/events", event).catch((err) => {
		console.log("COMMENTS: " + err.message);
	});
	axios.post("http://query:4004/events", event).catch((err) => {
		console.log("QUERY: " + err.message);
	});
	axios.post("http://moderation:4005/events", event).catch((err) => {
		console.log("MODERATION: " + err.message);
	});
	axios.post("http://votes:4006/events", event).catch((err) => {
		console.log("VOTES: " + err.message);
	});
	axios.post("http://deadline:4007/events", event).catch((err) => {
		console.log("DEADLINE: " + err.message);
	});
	axios.post("http://group:4008/events", event).catch((err) => {
		console.log("GROUP: " + err.message);
	});
	axios.post("http://notifications:4009/events", event).catch((err) => {
		console.log("NOTIFICATIONS: " + err.message);
	});

	res.send("Event received and sent to all services");
});

app.listen(4010, () => {
	console.log("Server listening on port 4010");
});

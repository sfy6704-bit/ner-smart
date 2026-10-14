import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ================= VEHICLES =================
const vehicles = [
  { id: "V001", type: "Car", location: "Kochi", speed: 48, risk: "Low", status: "Active" },
  { id: "V002", type: "Bus", location: "Kozhikode", speed: 72, risk: "Medium", status: "Active" },
  { id: "V003", type: "Truck", location: "Thiruvananthapuram", speed: 91, risk: "High", status: "Warning" }
];

app.get("/api/vehicles", (req, res) => res.json(vehicles));

// ================= INCIDENTS =================
const incidents = [
  { id: "I001", type: "Overspeeding", location: "Kochi", severity: "High", status: "Active" },
  { id: "I002", type: "Accident", location: "Kozhikode", severity: "Critical", status: "Resolved" },
  { id: "I003", type: "Traffic Violation", location: "Kannur", severity: "Medium", status: "Active" }
];

app.get("/api/incidents", (req, res) => res.json(incidents));

// ================= ALERTS =================
const alerts = [
  { id: "A001", type: "High Traffic", location: "Main Road", priority: "High", message: "Heavy traffic detected" },
  { id: "A002", type: "Accident", location: "NH-44 Junction", priority: "High", message: "Accident reported" },
  { id: "A003", type: "Weather", location: "City Junction", priority: "Medium", message: "Wet road conditions detected" },
  { id: "A004", type: "Emergency Vehicle", location: "Highway Road", priority: "Normal", message: "Ambulance dispatched" }
];

app.get("/api/alerts", (req, res) => res.json(alerts));

// ================= RISK =================
app.get("/api/risk", (req, res) => {
  res.json({
    accidentRisk: { level: "High", location: "Main Road" },
    trafficRisk: { level: "Medium", message: "Heavy traffic expected" },
    weatherRisk: { level: "Low", message: "Normal conditions" },
    overallRisk: "Medium"
  });
});

// ================= MAP =================
app.get("/api/map", (req, res) => {
  res.json({
    roadsOnline: 24,
    incidents: [
      { type: "Accident", location: "Main Road" },
      { type: "Heavy Traffic", location: "NH-44 Junction" },
      { type: "Landslide", location: "City Junction" }
    ],
    vehicles: [
      { type: "Ambulance", id: "AMB-101" },
      { type: "Bus", id: "BUS-204" },
      { type: "Truck", id: "TRK-309" }
    ]
  });
});

// ================= DASHBOARD =================
app.get("/api/dashboard", (req, res) => {
  res.json({
    activeRoads: 24,
    vehicles: vehicles.length,
    activeIncidents: incidents.filter(i => i.status === "Active").length,
    alerts: alerts.length,
    riskLevel: "Medium",
    systemStatus: "Online"
  });
});

// ================= HEALTH =================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "NER Smart Backend is working"
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`NER Smart Backend running on port ${PORT}`);
});
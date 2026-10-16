import { useEffect, useState } from "react";
import "./App.css";

const API = "https://ner-smart-fb3p.onrender.com/api";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [vehicles, setVehicles] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [risk, setRisk] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [status, setStatus] = useState({
    vehicles: "Checking...",
    incidents: "Checking...",
    alerts: "Checking...",
    risk: "Checking...",
    map: "Checking...",
    dashboard: "Checking..."
  });

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadEndpoint(path, key, setter) {
      try {
        const response = await fetch(`${API}/${path}`);

        if (!response.ok) {
          throw new Error(`${path} request failed (${response.status})`);
        }

        const data = await response.json();

        if (!active) return;

        setter(data);

        setStatus(previous => ({
          ...previous,
          [key]: "Connected"
        }));

        setErrors(previous =>
          previous.filter(item => item.key !== key)
        );
      } catch (error) {
        if (!active) return;

        setStatus(previous => ({
          ...previous,
          [key]: "Disconnected"
        }));

        setErrors(previous => [
          ...previous.filter(item => item.key !== key),
          { key, message: error.message }
        ]);
      }
    }

    loadEndpoint("vehicles", "vehicles", data => {
      setVehicles(Array.isArray(data) ? data : data.vehicles || []);
    });

    loadEndpoint("incidents", "incidents", data => {
      setIncidents(Array.isArray(data) ? data : data.incidents || []);
    });

    loadEndpoint("alerts", "alerts", data => {
      setAlerts(Array.isArray(data) ? data : data.alerts || []);
    });

    loadEndpoint("risk", "risk", setRisk);
    loadEndpoint("map", "map", setMapData);
    loadEndpoint("dashboard", "dashboard", setDashboard);

    return () => {
      active = false;
    };
  }, []);

  // FIXED: Display the actual title and details.
  const showDetails = (title, details) => {
    window.alert(`${title}\n\n${details}`);
  };

  const navItems = [
    ["Dashboard", "🏠 Dashboard"],
    ["Map", "🗺️ Live Map"],
    ["Incidents", "🚨 Incidents"],
    ["Vehicles", "🚚 Vehicles"],
    ["Risk", "🤖 AI Risk Prediction"],
    ["Alerts", "🔔 Alerts"]
  ];

  const connectionCard = (
    <div className="card">
      <h2>🔌 Backend Connection Status</h2>

      {Object.entries(status).map(([key, value]) => (
        <p key={key}>
          {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
          <strong>{value}</strong>
        </p>
      ))}

      {errors.length > 0 && (
        <div>
          <p>Some API requests failed:</p>

          {errors.map(error => (
            <p key={error.key}>
              {error.key}: {error.message}
            </p>
          ))}

          <p>Check the backend routes and CORS configuration.</p>
        </div>
      )}
    </div>
  );

  const riskItems = risk
    ? [
        {
          title: "Accident Risk",
          level: risk.accidentRisk?.level || "Unknown",
          location: risk.accidentRisk?.location || "Not specified"
        },
        {
          title: "Traffic Risk",
          level: risk.trafficRisk?.level || "Unknown",
          location: risk.trafficRisk?.message || "Not specified"
        },
        {
          title: "Weather Risk",
          level: risk.weatherRisk?.level || "Unknown",
          location: risk.weatherRisk?.message || "Not specified"
        }
      ]
    : [];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          🚦 <span>NER Smart</span>
        </div>

        <nav>
          {navItems.map(([page, label]) => (
            <button
              key={page}
              className={activePage === page ? "active" : ""}
              onClick={() => setActivePage(page)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        {/* DASHBOARD */}
        {activePage === "Dashboard" && (
          <section>
            <div className="page-header">
              <h1>Road Safety Dashboard</h1>
              <p>Smart road safety monitoring system</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>🚚 Total Vehicles</h3>
                <strong>{dashboard?.vehicles ?? vehicles.length}</strong>
                <p>Backend data</p>
              </div>

              <div className="stat-card">
                <h3>🚨 Incidents</h3>
                <strong>
                  {dashboard?.activeIncidents ??
                    incidents.filter(i => i.status === "Active").length}
                </strong>
                <p>Active incidents</p>
              </div>

              <div className="stat-card">
                <h3>🔔 Alerts</h3>
                <strong>{dashboard?.alerts ?? alerts.length}</strong>
                <p>Backend records</p>
              </div>

              <div className="stat-card">
                <h3>🤖 Road Risk</h3>
                <strong>
                  {risk?.overallRisk || dashboard?.riskLevel || "Loading"}
                </strong>
                <p>Current API assessment</p>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card">
                <h2>🚦 Traffic Overview</h2>
                <div className="traffic-box">
                  <strong>{dashboard?.systemStatus || "Loading"}</strong>
                  <span>
                    {dashboard?.activeRoads ?? mapData?.roadsOnline ?? 0}{" "}
                    roads reported online
                  </span>
                </div>
              </div>

              <div className="card">
                <h2>🔔 Recent Alerts</h2>

                {alerts.length === 0 ? (
                  <p>
                    {status.alerts === "Connected"
                      ? "No alerts available."
                      : "Loading alerts..."}
                  </p>
                ) : (
                  alerts.slice(0, 3).map((alert, index) => (
                    <div className="mini-alert" key={alert.id ?? index}>
                      <strong>{alert.type || "Road Alert"}</strong>
                      <p>{alert.message || alert.location}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {connectionCard}
          </section>
        )}

        {/* LIVE MAP */}
        {activePage === "Map" && (
          <section>
            <div className="page-header">
              <h1>🗺️ Live Map</h1>
              <p>Road map with backend-provided vehicle and incident records</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Roads Online</h3>
                <strong>{mapData?.roadsOnline ?? "—"}</strong>
              </div>

              <div className="stat-card">
                <h3>Mapped Vehicles</h3>
                <strong>{mapData?.vehicles?.length ?? 0}</strong>
              </div>

              <div className="stat-card">
                <h3>Mapped Incidents</h3>
                <strong>{mapData?.incidents?.length ?? 0}</strong>
              </div>
            </div>

            <div className="card">
              <h2>Road Map</h2>

              <iframe
                title="NER Smart Road Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77%2C20%2C94%2C29&layer=mapnik"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: "8px" }}
              />

              <p>
                Map API: <strong>{status.map}</strong>
              </p>

              <p>
                The map shows geographic information. Vehicle records are
                not live GPS positions.
              </p>
            </div>

            <div className="dashboard-grid">
              <div className="card">
                <h2>Vehicles in Map Data</h2>

                {(mapData?.vehicles || []).map((v, index) => (
                  <div className="mini-alert" key={v.id ?? index}>
                    <strong>{v.type || "Vehicle"}</strong>
                    <p>ID: {v.id || "Unknown"}</p>
                  </div>
                ))}
              </div>

              <div className="card">
                <h2>Incidents in Map Data</h2>

                {(mapData?.incidents || []).map((item, index) => (
                  <div className="mini-alert" key={index}>
                    <strong>{item.type || "Incident"}</strong>
                    <p>{item.location || "Location unavailable"}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* INCIDENTS */}
        {activePage === "Incidents" && (
          <section>
            <div className="page-header">
              <h1>🚨 Road Incidents</h1>
              <p>Incident records from the backend</p>
            </div>

            <div className="card">
              <strong>Incident API: {status.incidents}</strong>
            </div>

            <div className="risk-cards">
              {incidents.map((item, index) => {
                const id = item.id ?? index + 1;
                const type = item.type || "Incident";
                const location = item.location || "Unknown location";
                const severity = item.severity || "Unspecified";
                const itemStatus = item.status || "Reported";

                return (
                  <div className="risk-card" key={id}>
                    <h3>🚨 {type}</h3>
                    <strong>{severity}</strong>
                    <p>📍 {location}</p>
                    <p>Status: {itemStatus}</p>

                    <button
                      onClick={() =>
                        showDetails(
                          type,
                          `Location: ${location}\nSeverity: ${severity}\nStatus: ${itemStatus}`
                        )
                      }
                    >
                      View Details
                    </button>
                  </div>
                );
              })}

              {incidents.length === 0 && (
                <div className="card">
                  {status.incidents === "Connected"
                    ? "No incidents available."
                    : "Loading incidents..."}
                </div>
              )}
            </div>
          </section>
        )}

        {/* VEHICLES */}
        {activePage === "Vehicles" && (
          <section>
            <div className="page-header">
              <h1>🚚 Vehicle Monitoring</h1>
              <p>Vehicle records from the backend</p>
            </div>

            <div className="card">
              <strong>Vehicle API: {status.vehicles}</strong>
            </div>

            <div className="risk-cards">
              {vehicles.map((v, index) => {
                const id = v.id ?? `Vehicle ${index + 1}`;
                const location = v.location || "Unknown location";
                const vehicleStatus = v.status || "Unknown";
                const vehicleRisk = v.risk || "Unspecified";
                const speed = v.speed ?? "Unknown";

                return (
                  <div className="risk-card" key={id}>
                    <h3>🚚 {id} — {v.type || "Vehicle"}</h3>
                    <strong>{vehicleStatus}</strong>
                    <p>📍 {location}</p>
                    <p>Speed: {speed} km/h</p>
                    <p>Risk: {vehicleRisk}</p>

                    <button
                      onClick={() =>
                        showDetails(
                          id,
                          `Type: ${v.type || "Vehicle"}\nLocation: ${location}\nSpeed: ${speed} km/h\nRisk: ${vehicleRisk}\nStatus: ${vehicleStatus}`
                        )
                      }
                    >
                      View Details
                    </button>
                  </div>
                );
              })}

              {vehicles.length === 0 && (
                <div className="card">
                  {status.vehicles === "Connected"
                    ? "No vehicles available."
                    : "Loading vehicles..."}
                </div>
              )}
            </div>
          </section>
        )}

        {/* AI RISK PREDICTION */}
        {activePage === "Risk" && (
          <section>
            <div className="page-header">
              <h1>🤖 AI Risk Prediction</h1>
              <p>Road risk information supplied by the risk API</p>
            </div>

            <div className="card">
              <strong>Risk API: {status.risk}</strong>
            </div>

            <div className="risk-cards">
              {riskItems.map(item => (
                <div className="risk-card" key={item.title}>
                  <h3>⚠️ {item.title}</h3>
                  <strong>{item.level}</strong>
                  <p>📍 {item.location}</p>

                  <button
                    onClick={() =>
                      showDetails(
                        item.title,
                        `Risk: ${item.level}\nDetails: ${item.location}`
                      )
                    }
                  >
                    View Details
                  </button>
                </div>
              ))}

              {riskItems.length === 0 && (
                <div className="card">
                  {status.risk === "Connected"
                    ? "No risk information available."
                    : "Loading risk information..."}
                </div>
              )}
            </div>

            <div className="card">
              <h2>Overall Road Risk: {risk?.overallRisk || "Loading"}</h2>
              <p>
                This version displays the backend's current risk assessment.
                The configured values are demo data, not predictions from a
                trained or validated AI model.
              </p>
            </div>
          </section>
        )}

        {/* ALERTS */}
        {activePage === "Alerts" && (
          <section>
            <div className="page-header">
              <h1>🔔 Road Safety Alerts</h1>
              <p>Alerts loaded from the backend</p>
            </div>

            <div className="card">
              <strong>Alerts API: {status.alerts}</strong>
            </div>

            <div className="risk-cards">
              {alerts.map((a, index) => (
                <div className="risk-card" key={a.id ?? index}>
                  <h3>
                    {a.priority === "High" || a.priority === "Critical"
                      ? "🔴"
                      : "🟡"}{" "}
                    {a.type || "Road Alert"}
                  </h3>

                  <strong>{a.priority || "Normal"} Priority</strong>
                  <p>📍 {a.location || "Unknown location"}</p>
                  <p>{a.message || "No additional details"}</p>

                  <button
                    onClick={() =>
                      showDetails(
                        a.type || "Road Alert",
                        `Location: ${a.location || "Unknown"}\nMessage: ${a.message || "No details"}\nPriority: ${a.priority || "Normal"}`
                      )
                    }
                  >
                    View Alert
                  </button>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="card">
                  {status.alerts === "Connected"
                    ? "No alerts available."
                    : "Loading alerts..."}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
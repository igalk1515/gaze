# 👁️ Gaze Heatmap Tracker

This project is a **POC (Proof of Concept)** for tracking user gaze using **MediaPipe FaceMesh** in the browser, generating gaze points, and building a **heatmap** based on where users look on the screen.

It uses:

- MediaPipe FaceMesh for real-time iris tracking
- Flask backend (running inside Docker) to receive gaze points and generate a heatmap image
- A simple front-end (HTML + JS) to display live tracking and send gaze data

---

# 📦 Project Structure

```
gaze-frontend/
  ├── index.html
  ├── gaze.js
  ├── calibration.js

gaze-heatmap-backend/
  ├── app/
      ├── main.py (Flask app)
      ├── requirements.txt
  ├── Dockerfile
```

---

# 🚀 How to Start the Project (Local Setup)

## 1. Clone or Download the Project

```bash
git clone <your_repo_url>
cd gaze-heatmap-backend
```

(or manually download the folders)

---

## 2. Build and Run the Backend (Flask Server inside Docker)

In `gaze-heatmap-backend/`, build the Docker image:

```bash
docker build -t gaze-heatmap .
```

Then run it:

```bash
docker run -p 5000:5000 gaze-heatmap
```

👉 The backend will now listen at `http://localhost:5000`.

---

## 3. Start the Frontend (Local HTML)

Go to the `gaze-frontend/` folder.

Simply open `index.html` **in your browser** (Chrome recommended).

👉 This will:

- Open your webcam
- Start tracking your iris
- Show a red dot indicating your gaze
- Send gaze points every second to the backend
- Display the generated heatmap image

---

# 🧐 How It Works (Short Version)

- **FaceMesh** detects your face and tracks your **iris center**.
- You **calibrate** by looking at 9 dots around the screen.
- A **linear mapping** is built between iris position and screen position.
- Your gaze points are **smoothed** to avoid jitter.
- Every few seconds, gaze points are sent to the Flask server.
- The server builds a **heatmap image** based on where you looked.

---

# ⚙️ Requirements

- **Docker** installed (to run the backend easily)
- **Chrome Browser** (recommended for good webcam access + WebGL support)
- A working **webcam**

---

# 🛠️ Troubleshooting

| Problem                    | Solution                                                       |
| :------------------------- | :------------------------------------------------------------- |
| Docker can't start backend | Make sure port 5000 is free, or change it                      |
| Webcam doesn't start       | Check browser permissions                                      |
| Heatmap not showing        | Make sure the backend server is running on `localhost:5000`    |
| Red dot feels jumpy        | Complete calibration first! Then it will be much more accurate |

---

# ✨ Features to Build Next (Optional)

- [ ] Add **head pose compensation** (to handle user moving back/forth)
- [ ] Draw **real-time gaze trails** (instead of only red dot)
- [ ] Save calibration data in **LocalStorage** (no need to recalibrate every time)
- [ ] Build a full **dashboard** to review multiple users' heatmaps

---

# 📄 License

This project is for **educational and research purposes only**.

---

# 👌 Credits

- [MediaPipe FaceMesh](https://google.github.io/mediapipe/solutions/face_mesh)
- [Flask](https://flask.palletsprojects.com/)
- [Docker](https://www.docker.com/)

---

# 🔥 Quick Start Commands Summary

```bash
# Build and run the backend
cd gaze-heatmap-backend
docker build -t gaze-heatmap .
docker run -p 5000:5000 gaze-heatmap

# Open frontend
cd gaze-frontend
Open index.html manually in Chrome
```

---

# ✅ You're ready to go!

Track where users are looking —  
Build your heatmap —  
**And improve your project step-by-step!** 🚀👁️

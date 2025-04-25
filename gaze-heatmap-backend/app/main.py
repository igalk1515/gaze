from flask import Flask, request, send_file
from io import BytesIO
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
from flask_cors import CORS
import scipy.ndimage

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_gaze_data():
    data = request.json.get("points", [])

    if not data:
        return {"error": "No gaze data provided"}, 400

    width, height = 1920, 1080
    heat = np.zeros((height, width))

    for p in data:
        x, y, w = int(p["x"]), int(p["y"]), p.get("weight", 1)
        if 0 <= x < width and 0 <= y < height:
            heat[y, x] += w

    blurred = scipy.ndimage.gaussian_filter(heat, sigma=30)

    if np.max(blurred) > 0:
        normalized = blurred / np.max(blurred)
    else:
        normalized = blurred

    plt.imshow(normalized, cmap='hot')
    plt.axis('off')
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    plt.close()
    buf.seek(0)

    return send_file(buf, mimetype='image/png')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

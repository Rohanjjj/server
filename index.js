from flask import Flask, request, jsonify
import joblib
import numpy as np
import requests

# Load the trained model
model = joblib.load('model.pkl')

# Initialize Flask app
app = Flask(__name__)

# External server URL to send the prediction
external_server_url = "https://vser.onrender.com"  # Replace with your actual external server URL

@app.route('/', methods=['POST'])
def predict():
    # Get input data from the request (Assuming JSON format)
    data = request.get_json()

    # Extract sensor data from nested structure
    sensor_data = data.get('sensorData', {})

    # Extract features with default fallback
    flex1 = sensor_data.get('flex1', 0)
    flex2 = sensor_data.get('flex2', 0)
    flex3 = sensor_data.get('flex3', 0)
    flex4 = sensor_data.get('flex4', 0)
    accel_x = sensor_data.get('accel_x', 0)
    accel_y = sensor_data.get('accel_y', 0)
    accel_z = sensor_data.get('accel_z', 0)
    gyro_x = sensor_data.get('gyro_x', 0)
    gyro_y = sensor_data.get('gyro_y', 0)
    gyro_z = sensor_data.get('gyro_z', 0)

    # Prepare the feature array (same order as training data)
    features = np.array([[flex1, flex2, flex3, flex4, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z]])

    # Predict the label using the model
    prediction = model.predict(features)

    # Send only the predicted gesture text to the external server
    try:
        response = requests.post(external_server_url, json={'gesture': prediction[0]})
        
        if response.status_code == 200:
            return jsonify({'gesture': prediction[0]})
        else:
            app.logger.error(f"Failed to send prediction. Status code: {response.status_code}")
            return jsonify({'gesture': prediction[0]}), 500

    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error sending request to the external server: {str(e)}")
        return jsonify({'gesture': prediction[0]}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

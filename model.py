import pandas as pd
import pickle
import sys
import json

# Load the model
filename = 'sign_language_model.pkl'
with open(filename, 'rb') as f:
    model = pickle.load(f)

# Read input from stdin (from the Express server)
def predict_from_input():
    try:
        # Read and parse the input data from stdin
        input_data = json.loads(sys.stdin.read())
        
        # Convert input to DataFrame
        input_df = pd.DataFrame([input_data])

        # Ensure correct columns
        expected_cols = ['flex1', 'flex2', 'flex3', 'flex4']
        input_df = input_df[expected_cols]

        # Predict using the model
        prediction = model.predict(input_df)
        print(prediction[0])  # Return only the first prediction
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    predict_from_input()

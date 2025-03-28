import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load the dataset
df = pd.read_csv('sign_language_subset.csv')

# Define features (input columns) and target (output column)
features = ['Thumb', 'Index', 'Middle', 'Ring', 'Little']
target = 'Gesture'

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(df[features], df[target], test_size=0.2, random_state=42)

# Create a Random Forest Classifier model
model = RandomForestClassifier(n_estimators=100, random_state=42)

# Train the model
model.fit(X_train, y_train)

# Save the model to a file
filename = 'sign_language_model.pkl'
pickle.dump(model, open(filename, 'wb'))

print(f"Model saved to {filename}")

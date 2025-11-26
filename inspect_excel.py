import pandas as pd

try:
    df = pd.read_excel('/Users/momento/Desktop/FitOl/Antrenman.xlsx')
    # Fill forward the day column to handle merged cells or empty values
    df.iloc[:, 0] = df.iloc[:, 0].ffill()
    print("Columns:", df.columns.tolist())
    print("First 50 rows:")
    print(df.head(50).to_string())
except Exception as e:
    print(f"Error reading excel: {e}")

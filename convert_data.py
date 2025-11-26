import pandas as pd
import json
import datetime

def convert_excel_to_json():
    try:
        # Read the excel file
        df = pd.read_excel('/Users/momento/Desktop/FitOl/Antrenman.xlsx')
        
        # Fill forward the day column
        df.iloc[:, 0] = df.iloc[:, 0].ffill()
        
        # Rename columns for easier access
        df.columns = ['Day', 'Exercise', 'SetsReps', 'RIR', 'Date1', 'Date2', 'Date3', 'Off1', 'Date4', 'Date5', 'Off2']
        
        # Map Turkish days to English keys for easier logic
        day_map = {
            'Salı': 'Tuesday',
            'Çarşamba': 'Wednesday',
            'Perşembe': 'Thursday',
            'Cumartesi': 'Saturday',
            'Pazar': 'Sunday'
        }
        
        program = {}
        
        for index, row in df.iterrows():
            day_tr = row['Day']
            if pd.isna(day_tr) or day_tr not in day_map:
                continue
                
            day_en = day_map[day_tr]
            
            if day_en not in program:
                program[day_en] = []
            
            exercise = {
                'name': row['Exercise'],
                'sets_reps': row['SetsReps'],
                'rir': row['RIR'] if not pd.isna(row['RIR']) else ""
            }
            program[day_en].append(exercise)
            
        # Save to JSON
        with open('/Users/momento/Desktop/FitOl/workout_program.json', 'w', encoding='utf-8') as f:
            json.dump(program, f, ensure_ascii=False, indent=2)
            
        print("Successfully created workout_program.json")
        
    except Exception as e:
        print(f"Error converting data: {e}")

if __name__ == "__main__":
    convert_excel_to_json()

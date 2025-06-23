import pandas as pd
import json

# 엑셀 파일 경로 (이 부분을 수정해야 합니다!)
excel_file_path = '음료 속 향료 검색 프로그램 자료.xlsx' # <-- 여기를 수정

# JSON 파일로 저장할 경로 (이름을 원하는대로 변경하세요, 보통 'beverages.json'으로 둡니다)
json_file_path = 'beverages.json'

try:
    df = pd.read_excel(excel_file_path)

    if 'flavorings' in df.columns:
        df['flavorings'] = df['flavorings'].astype(str).apply(
            lambda x: [item.strip() for item in x.split(',')] if pd.notna(x) else []
        )

    json_output = df.to_json(orient='records', force_ascii=False, indent=2)

    with open(json_file_path, 'w', encoding='utf-8') as f:
        f.write(json_output)

    print(f"'{excel_file_path}' 파일이 '{json_file_path}'로 성공적으로 변환되었습니다.")

except FileNotFoundError:
    print(f"오류: '{excel_file_path}' 파일을 찾을 수 없습니다. 경로를 확인해주세요.")
except Exception as e:
    print(f"변환 중 오류 발생: {e}")

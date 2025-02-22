import json
import sys


def build_sort_key(shutdown):
    return (
        shutdown["start_date"],
        shutdown["stop_date"],
        shutdown["start_station"],
        shutdown["end_station"],
    )


with open("src/constants/shutdowns.json", "r") as f:
    data = json.load(f)

new_data = {}

for key in data:
    new_data[key] = sorted(data[key], key=build_sort_key)

if "--check" in sys.argv:
    if data == new_data:
        print("shutdowns.json is sorted")
        sys.exit(0)

    print("shutdowns.json is not sorted. Run `python sort-shutdowns.py` to sort it.")
    sys.exit(1)
else:
    with open("src/constants/shutdowns.json", "w") as f:
        json.dump(new_data, f, indent=2)
        f.write("\n")

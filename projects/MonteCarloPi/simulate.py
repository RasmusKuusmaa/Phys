import json
import sys

import numpy as np

MIN_POINTS = 100
MAX_POINTS = 20000


def main():
    n = 2000
    if len(sys.argv) > 1:
        try:
            n = int(sys.argv[1])
        except ValueError:
            pass
    n = max(MIN_POINTS, min(n, MAX_POINTS))

    x = np.random.uniform(0, 1, n)
    y = np.random.uniform(0, 1, n)
    inside = x**2 + y**2 <= 1

    inside_count = int(np.sum(inside))
    pi_estimate = 4 * inside_count / n

    result = {
        "n": n,
        "insideCount": inside_count,
        "piEstimate": pi_estimate,
        "points": [
            {"x": round(float(px), 4), "y": round(float(py), 4), "inside": bool(pin)}
            for px, py, pin in zip(x, y, inside)
        ],
    }

    print(json.dumps(result))


if __name__ == "__main__":
    main()

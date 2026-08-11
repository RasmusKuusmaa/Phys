import json
import sys

from pi_estimate import estimate_pi

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

    result = estimate_pi(n)

    output = {
        "n": n,
        "insideCount": result.inside_count,
        "piEstimate": result.pi_estimate,
        "points": [
            {"x": round(float(px), 4), "y": round(float(py), 4), "inside": bool(pin)}
            for px, py, pin in zip(result.x, result.y, result.inside)
        ],
    }

    print(json.dumps(output))


if __name__ == "__main__":
    main()

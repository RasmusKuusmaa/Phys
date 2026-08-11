from dataclasses import dataclass

import numpy as np


@dataclass
class MonteCarloResult:
    x: np.ndarray
    y: np.ndarray
    inside: np.ndarray
    inside_count: int
    pi_estimate: float


def estimate_pi(n: int) -> MonteCarloResult:
    x = np.random.uniform(0, 1, n)
    y = np.random.uniform(0, 1, n)
    inside = x**2 + y**2 <= 1

    inside_count = int(np.sum(inside))
    pi_estimate = 4 * inside_count / n

    return MonteCarloResult(x, y, inside, inside_count, pi_estimate)

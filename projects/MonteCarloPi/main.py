import matplotlib.pyplot as plt
import numpy as np

from pi_estimate import estimate_pi

fig, ax = plt.subplots()

ax.plot([0,1,1,0,0],
        [0,0,1,1,0])


ax.set_aspect("equal")

ax.set_xlim(0,1)
ax.set_ylim(0,1)

ax.set_xlabel("x")
ax.set_ylabel("y")

theta = np.linspace(0, np.pi /2, 500)

x_circle = np.cos(theta)
y_circle = np.sin(theta)

ax.plot(x_circle, y_circle)

#plot points
n = 100000

result = estimate_pi(n)

ax.scatter(result.x, result.y, s=2)

print("PI = ", result.pi_estimate)

plt.show()

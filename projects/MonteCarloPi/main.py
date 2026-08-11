import numpy as np
import matplotlib.pyplot as plt

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


plt.show()
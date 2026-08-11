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

plt.show()
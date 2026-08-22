import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

import numpy as np
import matplotlib.pyplot as plt

from src.particle import Particle
from src.forces import gravity_force


#Simulation parameters ----

mass = 2.0
initial_pos = 10.0
initial_vel = 0.0

dt = 0.01
sim_time = 2.0

particle = Particle(
    mass=mass,
    position=initial_pos,
    velocity=initial_vel
)

# store simulation data

times = []
positions = []
velocities = []
accelerations = []

#simulation loop ----


time = 0.0

while time <= sim_time:
    force = gravity_force(particle.mass)
    
    particle.update_acceleration(force)
    
    times.append(time)
    positions.append(particle.position)
    velocities.append(particle.velocity)
    accelerations.append(particle.acceleration)
    
    particle.update_velocity(dt)
    particle.update_position(dt)
    
    time += dt
    
    

# convert to numpy arr

times = np.array(times)
positions = np.array(positions)
velocities = np.array(velocities)
accelerations = np.array(accelerations)

plt.figure(figsize=(12, 5))

# plot pos
plt.subplot(1, 2, 1)
plt.plot(times, positions)
plt.xlabel("Time (s)")
plt.ylabel("Position (m)")
plt.title("Falling Object: Position vs Time")
plt.grid()

# plot vel
plt.subplot(1, 2, 2)
plt.plot(times, velocities)
plt.xlabel("Time (s)")
plt.ylabel("Velocity (m/s)")
plt.title("Falling Object: Velocity vs Time")
plt.grid()

plt.tight_layout()
plt.show()
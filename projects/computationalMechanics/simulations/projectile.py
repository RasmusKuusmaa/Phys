import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

import numpy as np
import matplotlib.pyplot as plt

from src.particle_2d import Particle2D


#constants ------

g = 9.81
mass = 1.0
initial_pos = [0.0, 0.0]
initial_speed = 20.0
launch_angle = 20.0

angle = np.radians(launch_angle)

vx = initial_speed * np.cos(angle)
vy = initial_speed * np.sin(angle)

initial_velocity = [vx, vy]


# create particle

particle = Particle2D(
    mass = mass,
    position = initial_pos,
    velocity=initial_velocity
)


#simulation parameters

dt = 0.01

times = []
x_positions = []
y_positions = []

time = 0.0


# simulation loop


while particle.position[1] >= 0:
    #gravity
    force = np.array([
        0.0,
        mass * - g
    ])
    
    # calculate acceleration
    particle.update_acceleration(force)
    
    #store data
    
    times.append(time)
    
    x_positions.append(particle.position[0])
    y_positions.append(particle.position[1])
    
    # update velocity
    particle.update_velocity(dt)
    
    # update position
    particle.update_position(dt)
    
    #advance time
    time += dt
    


#convert arrays

times = np.array(times)
x_positions = np.array(x_positions)
y_positions = np.array(y_positions)


#plot trajectory

plt.figure()

plt.plot(x_positions, y_positions)
plt.xlabel("horizontal positions(m)")
plt.ylabel("vertical_position (m)")
plt.title("projectile Motion")

plt.grid()

plt.show()
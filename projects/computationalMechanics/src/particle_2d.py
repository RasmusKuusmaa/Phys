import numpy as np

class Particle2D:
    
    def __init__(self, mass, position, velocity):
        self.mass = mass
        self.position = np.array(position, dtype=float)
        self.velocity = np.array(velocity, dtype= float)
        self.acceleration = np.zeros(2)
        
    def update_acceleration(self, force):
        #f = ma 
        self.acceleration = force / self.mass
        
    def update_velocity(self, dt):
        self.velocity += self.acceleration * dt
        
    
    def update_position(self, dt):
        self.position += self.velocity * dt
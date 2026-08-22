class Particle:
    def __init__(self, mass, position, velocity=0.0):
        self.mass = mass
        self.position = position
        self.velocity = velocity
        self.acceleration = 0.0
        
    def update_acceleration(self, force):
        "calc accel using Newtons 2nd law"
        self.acceleration = force / self.mass
    
    def update_velocity(self, dt):
        "update vel using accel"
        self.velocity += self.acceleration * dt
    
    def update_position(self, dt):
        "update pos using vel"
        self.position += self.velocity * dt
    
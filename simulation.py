import numpy as np
import numpy.linalg as la
from collections import defaultdict

g = 9.8
k_drag = .0006
k_fric = .01
r_rock = .1524
rp = .117
n_collision_find = 50
t_per_point = r_rock * 2

def R(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, -s],
                     [s, c]])

def R_vec(v):
    v = v / la.norm(v)
    return np.array([[v[0], -v[1]],
                      [v[1], v[0]]])

# angle is deviation from y-axis clockwise
def polar(v):
    return la.norm(v), -np.arctan2(*v)

class Trajectory(object):
    def __init__(self, t0, p0, v0, psi0, curl=1):
        self.t0 = t0
        self.v0 = v0
        self.curl = curl
        self.psi0 = psi0
        self.tf = self.v0 / (k_fric * g)
        
        # Transform Matrix
        self.H = np.row_stack((np.column_stack((R(self.psi0), p0)), [0, 0, 1]))
    
    def p(self, t_absolute):
        t = t_absolute - self.t0
        v0 = self.v0
        tf = self.tf
        x = self.curl * 1/2 * v0**2 * k_drag / rp * t**2 * (1 - t/tf + 1/4 * t**2/tf**2)
        y = v0*t*(1 - t/(2*tf))
        
        return (self.H @ np.array([x, y, 1]).T)[:2]
    
    def pf(self):
        return self.p(self.tf + self.t0)
    
    def psi(self, t_absolute):
        t = t_absolute - self.t0
        v0 = self.v0
        tf = self.tf
        psi = -self.curl * 1/rp * k_drag * v0 * t * (1 - t/(2*tf))
        
        return self.psi0 + psi
    
    def psi_f(self):
        return self.psi(self.tf + self.t0)
    
    def v(self, t_absolute):
        t = t_absolute - self.t0
        return self.v0 * (1 - t/self.tf)
    
    def v_vec(self, t_absolute):
        return R(self.psi(t_absolute)) @ np.array([0, self.v(t_absolute)]).T
    
    def serialize(self, t):
        return {
            't': t,
            'p': list(self.p(t)),
            'v': self.v(t),
            'psi': self.psi(t),
            'curl': self.curl,
        }
            
    
    # Binary search collision point
    def find_first_collision(self, q):
        a = self.t0
        b = a + self.tf
        
        # First attempt to find closest point the rocks get to one another
        for _ in range(n_collision_find):
            m = (a+b) / 2
            
            pa, pm, pb = map(lambda t: la.norm(self.p(m + t*(m-a)/100) - q),
                             [-1, 0, 1])
            
            # Rock passes through rock q at t = m
            if pa < 2*r_rock or pb < 2*r_rock:
                # Search between a and this point to find time of first collision
                b = m
                break
            elif pa < pb:
                b = m
            else:
                a = m
            
        else:
            # No collision found
            return None
        
        # Search for distance being twice the radius of a rock
        for _ in range(n_collision_find):
            m = (a+b) / 2
            if la.norm(self.p(m) - q) < 2*r_rock:
                b = m
            else:
                a = m
        
        return a

def collide(traj, p2, t):
    p1 = traj.p(t)
    v1 = traj.v_vec(t)
    
    d = p2 - p1
    
    R = R_vec(d)
    
    v1_d = R.T @ v1

    v2_d, v1_d = v1_d * np.array([[1, 0],
                                  [0, 1]])
    
    v1 = R @ v1_d
    v2 = R @ v2_d
    
    
    traj1 = Trajectory(t, p1, *polar(v1), traj.curl)
    traj2 = Trajectory(t, p2, *polar(v2), 0)
    
    return traj1, traj2

def simulate(still_rocks, toss):
    trajects = defaultdict(list)
    trajects[toss['id']].append(
        Trajectory(0, toss['p0'], toss['v0'], toss['psi0'], toss['curl']))
    
    moving_rocks = {toss['id']}
    
    while candidates := list(filter(
            lambda d: d[0], 
            ((trajects[a][-1].find_first_collision(still_rocks[b]), a, b)
             for a in moving_rocks
             for b in still_rocks))):
        
        t_next, rock_a, rock_b = min(candidates)
        
        traj_a, traj_b = collide(trajects[rock_a][-1], still_rocks[rock_b], t_next)
        
        trajects[rock_a].append(traj_a)
        trajects[rock_b].append(traj_b)
        
        del still_rocks[rock_b]
        moving_rocks.add(rock_b)
    
    return trajects

def flatten_trajectories(trajects, t_per_point):
    tfs = [traj.t0 for traj in trajects[1:]]
    tfs.append(trajects[-1].tf + trajects[-1].t0)
    
    return  [traj.serialize(t) 
                for traj, tf in zip(trajects, tfs)
                    for t in np.arange(traj.t0, tf, t_per_point)]

def run_simulation(still_rocks, toss):
    sim = simulate(still_rocks, toss)
    return {rock_id: flatten_trajectories(trajects, t_per_point)
                for rock_id, trajects in sim.items()}

import simpy
import random
import numpy as np
import matplotlib.pyplot as plt

SIM_TIME = 100000.0
MU = 1.0
RHO_LEVELS = [0.5, 0.75, 0.95]
RANDOM_SEED = 42

random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

class MM1Queue:
    def __init__(self, env, mu, rho):
        self.env = env
        self.mu = mu
        self.rho = rho
        self.lambd = rho * mu
        self.server = simpy.Resource(env, capacity=1)
        self.wait_times = []
        self.time_in_system = []
        self.queue_length_samples = []
        self.customers_completed = 0
        self.last_event_time = 0.0
        self.last_N = 0
        self.area_N = 0.0

    def _update_area(self):
        now = self.env.now
        dt = now - self.last_event_time
        if dt > 0:
            self.area_N += self.last_N * dt
            self.last_event_time = now

    def _record_arrival(self):
        N_after = self.server.count + len(self.server.queue) + 1
        self._update_area()
        self.last_N = N_after

    def _record_departure(self):
        N_after = self.server.count + len(self.server.queue)
        self._update_area()
        self.last_N = N_after

    def customer_process(self, cust_id):
        arrival_time = self.env.now
        self.queue_length_samples.append(len(self.server.queue))
        self._record_arrival()
        with self.server.request() as req:
            yield req
            service_start = self.env.now
            wait = service_start - arrival_time
            self.wait_times.append(wait)
            service_time = random.expovariate(self.mu)
            yield self.env.timeout(service_time)
            departure_time = self.env.now
            self.time_in_system.append(departure_time - arrival_time)
            self.customers_completed += 1
            self._record_departure()

    def arrivals(self):
        i = 0
        while True:
            inter = random.expovariate(self.lambd)
            yield self.env.timeout(inter)
            i += 1
            self.env.process(self.customer_process(i))

    def finalize(self):
        now = self.env.now
        dt = now - self.last_event_time
        if dt > 0:
            self.area_N += self.last_N * dt
            self.last_event_time = now

    def avg_number_in_system(self):
        return self.area_N / self.env.now if self.env.now > 0 else 0.0

def run_mm1(rho):
    env = simpy.Environment()
    mm1 = MM1Queue(env, MU, rho)
    busy_last_event_time = 0.0
    busy_last_state = 0
    busy_area = 0.0

    def monitor_server_change():
        nonlocal busy_last_event_time, busy_last_state, busy_area
        now = env.now
        cur_state = 1 if mm1.server.count > 0 else 0
        dt = now - busy_last_event_time
        if dt > 0:
            busy_area += busy_last_state * dt
            busy_last_event_time = now
            busy_last_state = cur_state

    orig_record_arrival = mm1._record_arrival
    orig_record_departure = mm1._record_departure

    def wrapped_record_arrival():
        orig_record_arrival()
        monitor_server_change()

    def wrapped_record_departure():
        orig_record_departure()
        monitor_server_change()

    mm1._record_arrival = wrapped_record_arrival
    mm1._record_departure = wrapped_record_departure

    env.process(mm1.arrivals())
    env.run(until=SIM_TIME)
    mm1.finalize()
    now = env.now
    dt = now - busy_last_event_time
    if dt > 0:
        busy_area += busy_last_state * dt

    avg_wait = np.mean(mm1.wait_times) if mm1.wait_times else 0.0
    avg_time_in_sys = np.mean(mm1.time_in_system) if mm1.time_in_system else 0.0
    avg_L = mm1.avg_number_in_system()
    measured_util = busy_area / SIM_TIME
    avg_queue_len_sample = np.mean(mm1.queue_length_samples) if mm1.queue_length_samples else 0.0
    theoretical_Wq = (rho) / (MU * (1 - rho))
    theoretical_L = rho / (1 - rho)

    return {
        'rho': rho,
        'lambda': rho * MU,
        'avg_wait': avg_wait,
        'avg_time_in_sys': avg_time_in_sys,
        'avg_L_timeavg': avg_L,
        'measured_util': measured_util,
        'avg_queue_len_sample': avg_queue_len_sample,
        'wait_times': mm1.wait_times,
        'queue_length_samples': mm1.queue_length_samples,
        'theoretical_Wq': theoretical_Wq,
        'theoretical_L': theoretical_L,
        'customers_completed': mm1.customers_completed
    }

results = []
for rho in RHO_LEVELS:
    r = run_mm1(rho)
    results.append(r)

rhos = [r['rho'] for r in results]
avg_Wqs = [r['avg_wait'] for r in results]
avg_Ls = [r['avg_L_timeavg'] for r in results]
measured_utils = [r['measured_util'] for r in results]
theoretical_utils = rhos

plt.style.use('default')
fig = plt.figure(figsize=(14, 12))

ax1 = fig.add_subplot(3, 2, 1)
ax1.plot(rhos, avg_Wqs, marker='o', label='Measured Wq')
ax1.plot(rhos, [r['theoretical_Wq'] for r in results], marker='x', linestyle='--', label='Theoretical Wq')
ax1.set_title('Average Waiting Time (Wq) vs ρ')
ax1.set_xlabel('ρ')
ax1.set_ylabel('Wq')
ax1.grid(True)
ax1.legend()

ax2 = fig.add_subplot(3, 2, 2)
ax2.plot(rhos, avg_Ls, marker='o', label='Measured L')
ax2.plot(rhos, [r['theoretical_L'] for r in results], marker='x', linestyle='--', label='Theoretical L')
ax2.set_title('Average Number in System (L) vs ρ')
ax2.set_xlabel('ρ')
ax2.set_ylabel('L')
ax2.grid(True)
ax2.legend()

ax3 = fig.add_subplot(3, 2, 3)
ax3.plot(rhos, measured_utils, marker='o', label='Measured Utilization')
ax3.plot(rhos, theoretical_utils, marker='x', linestyle='--', label='Theoretical Utilization (ρ)')
ax3.set_title('Server Utilization vs ρ')
ax3.set_xlabel('ρ')
ax3.set_ylabel('Utilization')
ax3.grid(True)
ax3.legend()

ax4 = fig.add_subplot(3, 2, 4)
for r in results:
    ax4.hist(r['queue_length_samples'], bins=30, alpha=0.5, label=f"ρ={r['rho']}")
ax4.set_title('Queue Length Distribution')
ax4.set_xlabel('Queue length')
ax4.set_ylabel('Frequency')
ax4.legend()

ax5 = fig.add_subplot(3, 2, 5)
for r in results:
    ax5.hist(r['wait_times'], bins=50, alpha=0.5, density=True, label=f"ρ={r['rho']}")
ax5.set_title('Waiting Time Distribution')
ax5.set_xlabel('Waiting time')
ax5.set_ylabel('Density')
ax5.legend()

fig.delaxes(fig.add_subplot(3,2,6))
plt.tight_layout()
plt.show()

#Problem Statement 2
import simpy
import random
import numpy as np
import matplotlib.pyplot as plt

ARRIVAL_RATE = 5  
SIMULATION_TIME_HOURS = 10  
SIMULATION_TIME_MINUTES = SIMULATION_TIME_HOURS * 60


PEAK_HOURS_START = 7 * 60  
PEAK_HOURS_END = 9 * 60   
OFF_PEAK_HOURS_END = 17 * 60 

PEAK_SERVICE_MEAN = 0.5  
PEAK_SERVICE_STD = 0.1  

OFF_PEAK_SERVICE_MEAN = 1.0 
OFF_PEAK_SERVICE_STD = 0.2  

all_waiting_times = []
all_system_lengths = []
queue_lengths_over_time = []

class TollBooth:
    def __init__(self, env, arrival_rate):
        self.env = env
        self.server = simpy.Resource(env, capacity=1)
        self.arrival_rate = arrival_rate
        env.process(self.customer_generator())

    def get_service_time(self):
        current_time = self.env.now
        if PEAK_HOURS_START <= current_time < PEAK_HOURS_END:
            mean = PEAK_SERVICE_MEAN
            std = PEAK_SERVICE_STD
        else: 
            mean = OFF_PEAK_SERVICE_MEAN
            std = OFF_PEAK_SERVICE_STD
        
        return max(0, np.random.normal(mean, std))

    def customer_generator(self):
        i = 0
        while True:
            
            inter_arrival_time = random.expovariate(self.arrival_rate)
            yield self.env.timeout(inter_arrival_time)
            i += 1
            self.env.process(self.customer_process(f'Vehicle_{i}', self.env.now))

    def customer_process(self, name, arrival_time):
        global queue_lengths_over_time
      
        queue_lengths_over_time.append((self.env.now, len(self.server.queue)))

        with self.server.request() as req:
            yield req 
            service_start_time = self.env.now
            waiting_time = service_start_time - arrival_time
            all_waiting_times.append(waiting_time)
            service_time = self.get_service_time()
            yield self.env.timeout(service_time) 

            departure_time = self.env.now
            time_in_system = departure_time - arrival_time
            all_system_lengths.append(time_in_system)
            
            queue_lengths_over_time.append((self.env.now, len(self.server.queue)))

print("Simulating M/G/1 Toll Booth Queue with varying service times...\n")

env = simpy.Environment()

toll_booth = TollBooth(env, ARRIVAL_RATE)

env.run(until=SIMULATION_TIME_MINUTES)

print(f"--- Simulation Results for {SIMULATION_TIME_HOURS} Hours ---")
print(f"Arrival Rate (lambda): {ARRIVAL_RATE} vehicles/minute")
print(f"Peak Hours Service Mean: {PEAK_SERVICE_MEAN} min, Std: {PEAK_SERVICE_STD} min")
print(f"Off-Peak Hours Service Mean: {OFF_PEAK_SERVICE_MEAN} min, Std: {OFF_PEAK_SERVICE_STD} min\n")

if all_waiting_times:
    avg_waiting_time = np.mean(all_waiting_times)
    avg_customers_in_system_L = np.mean(all_system_lengths) 

    total_service_time_sum = sum(t - w for t, w in zip(all_system_lengths, all_waiting_times))
    server_utilization_estimated = total_service_time_sum / SIMULATION_TIME_MINUTES

    print(f"  Average Waiting Time (Wq): {avg_waiting_time:.4f} minutes")
    print(f"  Average Number of Customers in System (L): {avg_customers_in_system_L:.4f}")
    print(f"  Estimated Server Utilization (rho): {server_utilization_estimated:.4f}\n")
else:
    print("  No vehicles processed in this simulation run (likely due to very low arrival rate or short simulation time).\n")

if queue_lengths_over_time:
    times, queue_lengths = zip(*queue_lengths_over_time)
    
    plt.figure(figsize=(10, 6))
    plt.step(times, queue_lengths, where='post')
    plt.title('Queue Length Over Time at Toll Booth')
    plt.xlabel('Time (minutes)')
    plt.ylabel('Number of Vehicles in Queue')
    plt.grid(True)
    plt.show()

if all_waiting_times:
    plt.figure(figsize=(10, 6))
    plt.hist(all_waiting_times, bins=50, density=True, alpha=0.7, color='skyblue')
    plt.title('Waiting Time Distribution at Toll Booth')
    plt.xlabel('Waiting Time (minutes)')
    plt.ylabel('Probability Density')
    plt.grid(True)
    plt.show()

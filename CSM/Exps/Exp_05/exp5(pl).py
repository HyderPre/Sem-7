import simpy
import random
import numpy as np

TOTAL_DURATION = 75000

INCOMING_RATE_GATE1 = 1/1.8
PROCESS_RATE_GATE1 = 1/2.5

PROCESS_RATE_GATE2 = 1/3.2

PROCESS_RATE_GATE3 = 1/4.2
GATE3_WORKERS = 3

class ProcessingNode:
    def __init__(self, environment, worker_count, processing_speed, node_name):
        self.environment = environment
        self.worker_pool = simpy.Resource(environment, capacity=worker_count)
        self.processing_speed = processing_speed
        self.node_name = node_name
        self.delay_records = []
        self.line_records = []
        self.active_duration = 0
        self.items_processed = 0

    def handle_item(self, arrival_moment):
        with self.worker_pool.request() as access_request:
            yield access_request
            delay_duration = self.environment.now - arrival_moment
            self.delay_records.append(delay_duration)
            service_duration = random.expovariate(self.processing_speed)
            yield self.environment.timeout(service_duration)
            self.active_duration += service_duration

        self.items_processed += 1
        self.line_records.append(len(self.worker_pool.queue))

class EntryGate(ProcessingNode):
    def __init__(self, environment):
        super().__init__(environment, 1, PROCESS_RATE_GATE1, "Entry Gate")

class InspectionGate(ProcessingNode):
    def __init__(self, environment):
        super().__init__(environment, 1, PROCESS_RATE_GATE2, "Inspection Gate")

class FinalGate(ProcessingNode):
    def __init__(self, environment):
        super().__init__(environment, GATE3_WORKERS, PROCESS_RATE_GATE3, "Final Gate")

def execute_simulation():
    simulation_env = simpy.Environment()

    entry_point = EntryGate(simulation_env)
    inspection_point = InspectionGate(simulation_env)
    final_point = FinalGate(simulation_env)

    def item_generator(simulation_env):
        while True:
            yield simulation_env.timeout(random.expovariate(INCOMING_RATE_GATE1))
            simulation_env.process(entry_point.handle_item(simulation_env.now))
            
            yield simulation_env.process(inspection_point.handle_item(simulation_env.now))
            
            yield simulation_env.process(final_point.handle_item(simulation_env.now))

    simulation_env.process(item_generator(simulation_env))
    simulation_env.run(until=TOTAL_DURATION)

    def display_statistics(node):
        avg_delay = np.mean(node.delay_records)
        avg_line = np.mean(node.line_records)
        usage_factor = node.active_duration / (TOTAL_DURATION * node.worker_pool.capacity)

        print(f"{node.node_name} Statistics:")
        print(f"Mean Delay: {avg_delay:.2f} units")
        print(f"Mean Line Length: {avg_line:.2f} items")
        print(f"Usage Factor: {usage_factor:.2f}\n")

    display_statistics(entry_point)
    display_statistics(inspection_point)
    display_statistics(final_point)

execute_simulation()
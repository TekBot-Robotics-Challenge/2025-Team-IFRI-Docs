import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseStamped
from nav_msgs.msg import OccupancyGrid
import numpy as np
import random
import sys

# Ajoute l'import pour algo_search
sys.path.append('/home/ashlynx/tekbot_ws/algo_search')
from robot_search import RobotSolving, GridAccessor
from search import astar_search

class Nav2AutoExplore(Node):
    def __init__(self):
        super().__init__('nav2_auto_explore')
        self.goal_pub = self.create_publisher(PoseStamped, '/goal_pose', 10)
        self.map_sub = self.create_subscription(OccupancyGrid, '/map', self.map_callback, 10)
        self.timer = self.create_timer(5.0, self.send_next_goal)
        self.last_goal = None
        self.map_data = None
        self.solved = False

    def map_callback(self, msg):
        self.map_data = msg

    def find_frontier_goal(self):
        if self.map_data is None:
            return None
        grid = np.array(self.map_data.data).reshape(self.map_data.info.height, self.map_data.info.width)
        # Cherche les cellules libres adjacentes à des inconnues
        frontiers = []
        for y in range(1, grid.shape[0] - 1):
            for x in range(1, grid.shape[1] - 1):
                if grid[y, x] == 0:
                    neighbors = grid[y-1:y+2, x-1:x+2].flatten()
                    if -1 in neighbors:
                        frontiers.append((x, y))
        if not frontiers:
            return None
        # Prend une frontière au hasard (ou la plus éloignée de la dernière)
        if self.last_goal:
            # Prend la plus éloignée de la dernière goal
            frontiers.sort(key=lambda f: -((f[0]-self.last_goal[0])**2 + (f[1]-self.last_goal[1])**2))
        goal_x, goal_y = random.choice(frontiers)
        self.last_goal = (goal_x, goal_y)
        # Convertit en coordonnées monde
        map_info = self.map_data.info
        wx = map_info.origin.position.x + (goal_x + 0.5) * map_info.resolution
        wy = map_info.origin.position.y + (goal_y + 0.5) * map_info.resolution
        return wx, wy

    def solve_maze_with_algo_search(self):
        # Appelée quand la carte est complète
        grid = np.array(self.map_data.data).reshape(self.map_data.info.height, self.map_data.info.width)
        height, width = grid.shape
        map_info = self.map_data.info
        rx = width // 2
        ry = height // 2
        # Cherche une cellule libre sur le bord (sortie)
        border_cells = []
        for x in range(width):
            if grid[0, x] == 0:
                border_cells.append((x, 0))
            if grid[height-1, x] == 0:
                border_cells.append((x, height-1))
        for y in range(height):
            if grid[y, 0] == 0:
                border_cells.append((0, y))
            if grid[y, width-1] == 0:
                border_cells.append((width-1, y))
        if not border_cells:
            self.get_logger().info("Aucune sortie trouvée sur le bord de la carte !")
            return
        # Prend la plus proche du centre
        border_cells.sort(key=lambda c: (c[0]-rx)**2 + (c[1]-ry)**2)
        goal = border_cells[0]
        # Prépare la matrice pour algo_search
        matrix = np.zeros_like(grid, dtype=int)
        matrix[grid == 100] = 1
        matrix[grid == -1] = 1
        accessor = GridAccessor(matrix)
        problem = RobotSolving((rx, ry), goal, accessor)
        solution_node, _ = astar_search(problem)
        if solution_node is None:
            self.get_logger().info("Aucun chemin trouvé par algo_search !")
            return
        path = [node.state for node in solution_node.path()]
        self.get_logger().info(f"Chemin trouvé par algo_search ({len(path)} points) :")
        # Conversion grille -> monde et envoi à Nav2 (1 point sur 5 par exemple)
        for i, (x, y) in enumerate(path):
            if i % 5 != 0 and i != len(path) - 1:
                continue  # sous-échantillonnage
            world_x = map_info.origin.position.x + (x + 0.5) * map_info.resolution
            world_y = map_info.origin.position.y + (y + 0.5) * map_info.resolution
            goal_msg = PoseStamped()
            goal_msg.header.frame_id = 'map'
            goal_msg.header.stamp = self.get_clock().now().to_msg()
            goal_msg.pose.position.x = world_x
            goal_msg.pose.position.y = world_y
            goal_msg.pose.position.z = 0.0
            goal_msg.pose.orientation.w = 1.0
            self.goal_pub.publish(goal_msg)
            self.get_logger().info(f"Waypoint envoyé à Nav2 : ({world_x:.2f}, {world_y:.2f})")

    def send_next_goal(self):
        if self.solved:
            return
        goal_pos = self.find_frontier_goal()
        if goal_pos is None:
            self.get_logger().info("Plus de frontières à explorer ou carte complète !")
            self.solve_maze_with_algo_search()
            self.solved = True
            return
        wx, wy = goal_pos
        goal = PoseStamped()
        goal.header.frame_id = 'map'
        goal.header.stamp = self.get_clock().now().to_msg()
        goal.pose.position.x = wx
        goal.pose.position.y = wy
        goal.pose.position.z = 0.0
        goal.pose.orientation.w = 1.0
        self.goal_pub.publish(goal)
        self.get_logger().info(f"Goal Nav2 envoyé pour exploration : x={wx:.2f}, y={wy:.2f}")

def main(args=None):
    rclpy.init(args=args)
    node = Nav2AutoExplore()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
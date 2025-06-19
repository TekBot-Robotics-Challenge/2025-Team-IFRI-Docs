# `WheeledRobot` Class Documentation

![Wheeled Robot](wheeled-robot.svg)

The `WheeledRobot` class is a concrete implementation of the `Robot` abstract base class. It represents a mobile robot that moves using wheels and is capable of navigation, basic obstacle avoidance, and carrying items in a storage bay.

## Purpose

-   To simulate a ground-based robot with wheeled locomotion.
-   To provide functionalities for movement (forward, backward), rotation, and motor speed control.
-   To manage a storage system for collected items.
-   To implement basic obstacle detection and avoidance maneuvers.

## Enum: `State`
Defines the possible operational states of the `WheeledRobot`.

-   `IDLE`: Robot is not performing any specific task.
-   `NAVIGATING`: Robot is actively moving towards a target or along a path.
-   `AVOIDING`: Robot is performing an obstacle avoidance maneuver.
-   `UPDATING_STORAGE`: Robot is in the process of adding an item to its storage.
-   `RETURNING`: Robot is navigating back to a home base or charging station (conceptual).
-   `CHARGING`: Robot is currently charging its generator (conceptual).
-   `SHUTDOWN`: Robot is powered off or in a non-operational state.

## Properties

Inherits all properties from `Robot` (`id`, `name`, `position`, `orientation`, `energy_source`, `generator_level`, `is_active`, `sensors`).

### `wheel_base`
The distance between the centers of the robot's wheels.
-   **Type:** `float` (meters)
-   **Access:** Read-only

### `storage_capacity`
The maximum number of items the robot can store in its `storage_bag`.
-   **Type:** `int`
-   **Access:** Read-only

### `state`
The current operational state of the robot.
-   **Type:** `State` (Enum)
-   **Access:** Read-write

### `storage_bag`
A list representing the items currently held by the robot.
-   **Type:** `List[Any]`
-   **Access:** Read-only (modified via `add_to_storage`)

### `obstacle_threshold`
The minimum distance (in meters) at which an object is considered an obstacle.
-   **Type:** `float`
-   **Access:** Read-write

### `v_lin_cmd`
The commanded linear speed of the robot.
-   **Type:** `float` (m/s)
-   **Access:** Read-only (set via `set_motor_speed` or internal movement logic)

### `v_ang_cmd`
The commanded angular speed of the robot.
-   **Type:** `float` (rad/s)
-   **Access:** Read-only (set via `set_motor_speed` or internal rotation logic)

## Initialization

### `__init__(name, position, orientation, energy_source, wheel_base, storage_capacity)`
Initializes a new `WheeledRobot` instance.

```python
def __init__(
        self,
        name: str,
        position: Tuple[float, float],
        orientation: float,
        energy_source: str,
        wheel_base: float,
        storage_capacity: int,
    ) -> None:
        """
        Initialize the mobile robot with the given parameters.

        Args:
            name (str): Name of the robot.
            position (Tuple[float, float]): Initial position (x, y) in meters.
            orientation (float): Initial orientation in radians.
            energy_source (str): The energy source used by the robot, must be one of the ENERGY_SOURCE list.
            wheel_base (float): Distance between the wheels in meters.
            storage_capacity (int): Maximum number of items the robot can store.

        ENERGY_SOURCE is a list of valid energy sources:
            - "solar"
            - "fossil_fuel"
            - "electric"

        Raises:
            ValueError: If wheel_base is not positive and storage_capacity is not positive.
        """
        super().__init__(name=name, position=position, orientation=orientation, energy_source=energy_source)

        if not isinstance(wheel_base, (int, float)) or wheel_base <= 0:
            raise ValueError("wheel_base must be a positive number.")
        if not isinstance(storage_capacity, int) or storage_capacity <= 0:
            raise ValueError("storage_capacity must be a positive integer.")
        
        self._wheel_base = float(wheel_base)
        self._v_lin_cmd = 0.0 # Linear speed command (m/s)
        self._v_ang_cmd = 0.0 # Angular speed command (rad/s)

        self._stockage_capacity = storage_capacity
        self._storage_bag = []

        self._state = State.IDLE
        self._obstacle_threshold = 0.3 # Min distance to consider an obstacle (meters)
```

-   **Parameters:**
    -   `name` (`str`): Name of the robot.
    -   `position` (`Tuple[float, float]`): Initial (x, y) position in meters.
    -   `orientation` (`float`): Initial orientation in radians.
    -   `energy_source` (`str`): Energy source (from `Robot.ENERGY_SOURCE`).
    -   `wheel_base` (`float`): Distance between wheels (must be positive).
    -   `storage_capacity` (`int`): Maximum storage capacity (must be positive).
-   **Raises:**
    -   `ValueError`: If `wheel_base` or `storage_capacity` are not positive, or if `energy_source` is invalid (via `super().__init__`).
    -   `TypeError`: For invalid parameter types (via `super().__init__` or direct checks).

**Example:**
```python
from robot import Robot
from wheeledRobot import WheeledRobot, State
import math

rover = WheeledRobot(
    name="Mars Rover II",
    position=(0.0, 0.0),
    orientation=0.0, # Facing positive X-axis
    energy_source="solar",
    wheel_base=0.5,  # 0.5 meters
    storage_capacity=10
)
print(f"Created robot: {rover.name} with ID {rover.id}")
print(f"Initial state: {rover.state}")
```

#### Properties & Setters

| Property                  | Description                                         |
| ------------------------- | --------------------------------------------------- |
| `wheel_base`              | Read-only base width.                               |
| `storage_capacity`        | Read-only max storage.                              |
| `state`                   | Getter/setter with validation against `State` enum. |
| `storage_bag`             | Returns a copy of current stored items.             |
| `obstacle_threshold`      | Getter/setter for proximity threshold.              |
| `v_lin_cmd` / `v_ang_cmd` | Read-only linear and angular speed commands.        |

## Methods

### `set_motor_speed(left, right)`
Sets the desired speeds for the left and right wheels, which in turn define the robot's linear and angular velocity.

```python
def set_motor_speed(self, left: float, right: float) -> None:
        """
        Define motors speeds for left and right wheels.

        Args:
            left (float): Speed for the left wheel (m/s).
            right (float): Speed for the right wheel (m/s).
        Raises:
            ValueError: If left or right speed is not a number.
        """
        if not isinstance(left, (int, float)):
            raise ValueError("left speed must be a number.")
        if not isinstance(right, (int, float)):
            raise ValueError("right speed must be a number.")

        self._v_lin_cmd = (left + right) / 2.0
        self._v_ang_cmd = (right - left) / self.wheel_base
        self._logger.info(f"Motors set: v={self._v_lin_cmd:.2f}, ω={self._v_ang_cmd:.2f}")
```
-   **Parameters:**
    -   `left` (`float`): Speed for the left wheel (m/s).
    -   `right` (`float`): Speed for the right wheel (m/s).
-   **Description:** Calculates and sets `_v_lin_cmd` and `_v_ang_cmd` based on differential drive kinematics. Logs the motor settings.
-   **Raises:**
    -   `ValueError`: If `left` or `right` speed is not a number (Note: original code raises this, but `isinstance` check is for `(int, float)` which are numbers. Perhaps meant for non-numeric strings if parsing was involved, but current implementation is fine).
-   **Returns:** `None`
-   **Example:**
    ```python
    rover.start()
    rover.set_motor_speed(left=0.2, right=0.2) 
    print(f"Linear speed: {rover.v_lin_cmd:.2f} m/s, Angular speed: {rover.v_ang_cmd:.2f} rad/s")

    rover.set_motor_speed(left=0.1, right=-0.1)
    print(f"Linear speed: {rover.v_lin_cmd:.2f} m/s, Angular speed: {rover.v_ang_cmd:.2f} rad/s")
    ```

### `add_to_storage(item)`
Adds an item to the robot's `storage_bag` if there is capacity.

```python
def add_to_storage(self, item: Any) -> bool:
    """
    Add an item to the robot's storage bag.
    
    Args:
        item (Any): The item to be added.
    
    Returns:
        bool: True if the item was added, False if storage is full.
    """
    if len(self._storage_bag) >= self._stockage_capacity:
        self._logger.warning("Storage is full, cannot add item.")
        return False
    self.state = State.UPDATING_STORAGE
    self._storage_bag.append(item)
    self._logger.info(f"Item added to storage. Current count: {len(self._storage_bag)}")
    return True
```
-   **Parameters:**
    -   `item` (`Any`): The item to be added.
-   **Returns:** `bool` - `True` if the item was added, `False` if storage is full.
-   **Description:** Changes robot `state` to `UPDATING_STORAGE` during the operation. Logs the action.
-   **Example:**
    ```python
    rock_sample = {"type": "igneous", "weight_kg": 0.5}
    if rover.add_to_storage(rock_sample):
        print(f"Added '{rock_sample['type']}' to storage. Bag: {rover.storage_bag}")
    else:
        print("Storage is full.")
    ```

### `move(direction, distance)`
Moves the robot forward or backward by a specified distance.

```python
    def move(self, direction: str, distance: float) -> None:
        if not self.is_active:
            self._logger.warning("Cannot move: Robot is inactive.")
            return
        if not isinstance(distance, (int, float)):
            raise ValueError("distance must be a number.")
        if distance < 0:
            raise ValueError("distance must be a non-negative number.")

        if direction not in ["forward", "backward"]:
            self._logger.error("Invalid move direction. Use 'forward', 'backward'")
            raise ValueError("move direction must be 'forward', 'backward'.")

        self.state = State.NAVIGATING
        angle = self.orientation if direction == "forward" else self.orientation + math.pi

        # Compute new position based on distance and angle
        dx = distance * math.cos(angle)
        dy = distance * math.sin(angle)
        new_position = (self.position[0] + dx, self.position[1] + dy)

        self._consume_for_motion(distance)
        self.position = new_position

        self._logger.info(f"Moved {direction} by {distance:.2f}m to {self.position}")
```
-   **Parameters:**
    -   `direction` (`str`): "forward" or "backward".
    -   `distance` (`float`): The distance to move in meters (must be non-negative).
-   **Returns:** `None`
-   **Description:** Updates the robot's `position`. Consumes energy based on distance. Sets `state` to `NAVIGATING`. Logs the movement.
-   **Raises:**
    -   `ValueError`: If `distance` is negative or `direction` is invalid.
    -   `TypeError`: If `distance` is not a number.
-   **Example:**
    ```python
    rover.start()
    rover.generator_level = 100 # Ensure enough energy
    print(f"Initial position: {rover.position}")
    rover.move("forward", 2.0)
    print(f"New position: {rover.position}, Energy: {rover.generator_level}%")
    ```

### `rotate(angle)`
Rotates the robot to a new absolute orientation.

```python
    def rotate(self, angle: float) -> None:
        if not self.is_active:
            self._logger.warning("Cannot rotate: Robot is inactive.")
            return

        self._consume_for_rotation(angle)
        self.orientation = angle
```

-   **Parameters:**
    -   `angle` (`float`): The new absolute orientation in radians.
-   **Returns:** `None`
-   **Description:** Updates the robot's `orientation`. Consumes energy based on the rotation. Logs the rotation. (Note: The implementation sets `self.orientation = angle` directly, meaning it's an absolute orientation, not a relative turn. The energy consumption logic `_consume_for_rotation(angle)` might imply relative rotation if `angle` is the change, but the assignment is absolute.)
-   **Example:**
    ```python
    rover.start()
    rover.generator_level = 100
    print(f"Initial orientation: {rover.orientation:.2f} rad")
    rover.rotate(math.pi / 2)
    print(f"New orientation: {rover.orientation:.2f} rad, Energy: {rover.generator_level}%")
    ```

### `stop()`
Stops all robot movement and deactivates it.

```python

    def stop(self) -> None:
        if not self.is_active:
            self._logger.warning("Cannot stop: Robot is inactive.")
            return
        
        self._v_lin_cmd = 0.0
        self._v_ang_cmd = 0.0
        self.is_active = False
        self._logger.info("Robot stopped.")
```

-   **Returns:** `None`
-   **Description:** Sets `_v_lin_cmd` and `_v_ang_cmd` to 0.0. Sets `is_active` to `False`. Logs the stop action.
-   **Example:**
    ```python
    rover.move("forward", 1)
    rover.stop()
    print(f"Robot active: {rover.is_active}, Linear speed: {rover.v_lin_cmd}")
    ```

### `detect_obstacle(obstacle_position)`
Checks if an obstacle is detected within the `obstacle_threshold` distance from the robot's current position.

```python
    def detect_obstacle(self, obstacle_position: Tuple[float, float]) -> bool:
        """
        Check if an obstacle is detected within the threshold distance.
        """
        if not isinstance(obstacle_position, tuple) or len(obstacle_position) != 2:
            raise ValueError("obstacle_position must be a tuple (x, y).")
        
        distance = self.distance_to(obstacle_position)
        if distance < self._obstacle_threshold:
            self._logger.info(f"Obstacle detected at {obstacle_position} (distance: {distance:.2f}m)")
            return True
        return False
```

-   **Parameters:**
    -   `obstacle_position` (`Tuple[float, float]`): The (x, y) coordinates of the potential obstacle.
-   **Returns:** `bool` - `True` if an obstacle is detected, `False` otherwise.
-   **Description:** Logs if an obstacle is detected. Changes `state` to `AVOIDING` if an obstacle is found.
-   **Raises:**
    -   `TypeError`: If `obstacle_position` is not a tuple of two numbers.
-   **Example:**
    ```python
    rover.position = (0.0, 0.0)
    rover.obstacle_threshold = 0.5 # meters
    nearby_rock = (0.0, 0.4) # 0.4m away
    far_rock = (0.0, 1.0)    # 1.0m away
    if rover.detect_obstacle(nearby_rock):
        print(f"Obstacle detected at {nearby_rock}! State: {rover.state}")
    else:
        print(f"No obstacle at {nearby_rock}.")

    if rover.detect_obstacle(far_rock):
        print(f"Obstacle detected at {far_rock}!")
    else:
        print(f"No obstacle at {far_rock}. State: {rover.state}")
    ```

### `avoid_obstacle()`
A simple maneuver to avoid a detected obstacle.

```
    def avoid_obstacle(self) -> bool:
        """Avoid an obstacle by rotating and moving around it."""
        if not self.is_active:
            self._logger.warning("Cannot avoid obstacle: Robot is inactive.")
            return False
        
        self.rotate(math.pi / 2)  # Rotate 90 degrees
        self.move("forward", 0.5)  # Move forward 0.5 meters
        self._logger.info("Obstacle avoided by rotating and moving forward.")
        return True
```

-   **Returns:** `bool` - `True` if the maneuver was attempted (assumes success for this simulation level).
-   **Description:** Rotates the robot 90 degrees (π/2 radians) and moves forward 0.5 meters. Logs the action. Requires the robot to be active.
-   **Example:**
    ```python
    rover.start()
    rover.position = (0.0, 0.0)
    rover.orientation = 0.0
    rover.generator_level = 100

    if rover.detect_obstacle((0.2, 0.0)):
        print(f"Avoiding obstacle. Initial pos: {rover.position}, orient: {rover.orientation:.2f}")
        rover.avoid_obstacle()
        print(f"After avoidance. New pos: {rover.position}, orient: {rover.orientation:.2f}")
    ```

### `is_storage_full()`
Checks if the robot's `storage_bag` has reached its `storage_capacity`.

```python
    def is_storage_full(self) -> bool:
        """Check if the storage bag is full."""
        full = len(self._storage_bag) >= self._stockage_capacity
        if full:
            self._logger.warning("Storage is full.")
        return full
```
-   **Returns:** `bool` - `True` if storage is full, `False` otherwise.
-   **Description:** Logs if storage is full.
-   **Example:**
    ```python
    rover.storage_capacity = 1
    rover.add_to_storage("sample1")
    if rover.is_storage_full():
        print("Storage is now full.")
    rover.add_to_storage("sample2")
    ```

### `status()`
Provides a string summarizing the current status of the `WheeledRobot`.

```python
    
    def status(self) -> str:
        """
        Get the current status of the robot.
        Returns:
            str: A string describing the robot's status.
        """
        status = (
            f"Robot '{self.name}' Status:\n"
            f"Position: {self.position}\n"
            f"Orientation: {self.orientation:.2f} radians\n"
            f"Energy Level: {self.generator_level:.2f}\n"
            f"State: {self.state.value}\n"
            f"Storage Capacity: {len(self._storage_bag)}/{self._stockage_capacity}\n"
            f"Linear Speed Command: {self._v_lin_cmd:.2f} m/s\n"
            f"Angular Speed Command: {self._v_ang_cmd:.2f} rad/s\n"
        )
        return status
```

-   **Returns:** `str`
-   **Description:** Includes ID, name, position, orientation, state, storage count/capacity, active status, and generator level.
-   **Example:**
    ```python
    print(rover.status())
    ```

## Protected Methods (for internal use)

### `_consume_for_motion(distance)`
Reduces energy based on the distance moved.

```python
    def _consume_for_motion(self, distance: float) -> None:
        """
        Consume energy proportionally to the distance moved.
        Args:
            distance (float): Distance moved in meters.
        Raises:
            ValueError: If distance is not a number or is not positive.
        """
        if not isinstance(distance, (int, float)):
            raise ValueError("distance must be a number.")
        if distance <= 0:
            self._logger.warning("Distance must be positive for energy consumption.")
            return
        
        amount = abs(distance) * 0.5 # 0.5% per meter
        self.consume_energy(amount)
```

-   **Parameters:**
    -   `distance` (`float`): The distance moved.
-   **Description:** Calls `self.consume_energy()` with a calculated amount (e.g., `distance * 0.5`).

### `_consume_for_rotation(angle)`
Reduces energy based on the angle rotated.
```python
    def _consume_for_rotation(self, angle: float) -> None:
        """
        Consume energy proportionally to the rotation.
        """
        amount = abs(angle) * 0.002  # 0.002% per degree
        self.consume_energy(amount)
```
-   **Parameters:**
    -   `angle` (`float`): The angle of rotation (absolute or relative, depending on context of call).
-   **Description:** Calls `self.consume_energy()` with a calculated amount (e.g., `abs(angle) * 0.1`).

## Example Scenario: Basic Navigation and Collection

This scenario demonstrates creating a `WheeledRobot`, moving it, detecting an item (simulated), and adding it to storage.

[Test WheeledRobot Example](../../tests/test_wheeledrobot.py)

# `WheeledRobot` Class Documentation

![Wheeled RObot](wheeled-robot.svg)

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
-   **Returns:** `str`
-   **Description:** Includes ID, name, position, orientation, state, storage count/capacity, active status, and generator level.
-   **Example:**
    ```python
    print(rover.status())
    ```

## Protected Methods (for internal use)

### `_consume_for_motion(distance)`
Reduces energy based on the distance moved.
-   **Parameters:**
    -   `distance` (`float`): The distance moved.
-   **Description:** Calls `self.consume_energy()` with a calculated amount (e.g., `distance * 0.5`).

### `_consume_for_rotation(angle)`
Reduces energy based on the angle rotated.
-   **Parameters:**
    -   `angle` (`float`): The angle of rotation (absolute or relative, depending on context of call).
-   **Description:** Calls `self.consume_energy()` with a calculated amount (e.g., `abs(angle) * 0.1`).

## Example Scenario: Basic Navigation and Collection

This scenario demonstrates creating a `WheeledRobot`, moving it, detecting an item (simulated), and adding it to storage.

[Test WheeledRobot Example](../../tests/test_wheeledrobot.py)

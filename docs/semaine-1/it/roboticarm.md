# `RoboticArm` Class Documentation

![Robotic Arm Image](robotic_arm.svg)

The `RoboticArm` class is a concrete implementation of the `Robot` abstract base class. It models an articulated robotic arm with multiple joints, capable of precise movements, picking up, and placing objects.

## Purpose

-   To simulate a stationary or mounted robotic arm with multiple degrees of freedom (represented by joints).
-   To provide functionalities for controlling joint angles, moving the end effector to specific positions, and manipulating objects.
-   To manage the state of the arm, including what item it might be holding.

## Properties

Inherits all properties from `Robot` (`id`, `name`, `position` (base position), `orientation` (base orientation), `energy_source`, `generator_level`, `is_active`, `sensors`).

### `joint_angles`
A list of current angles for each joint of the robotic arm, in degrees.
-   **Type:** `List[float]`
-   **Access:** Read-write (setter normalizes angles to 0-359.99... degrees and logs changes).
-   **Description:** The length of the list is determined by `num_joints`.

### `num_joints`
The number of joints in the robotic arm.
-   **Type:** `int`
-   **Access:** Read-only
-   **Description:** Must be at least 2.

### `end_effector_position`
The current (x, y) coordinates of the arm's end effector (gripper/tool).
-   **Type:** `Tuple[float, float]`
-   **Access:** Read-only (updated by `move` method).

### `holding_item`
The item currently being held by the end effector.
-   **Type:** `Optional[str]` (or `Any`, depending on how items are represented)
-   **Access:** Read-only (updated by `pick` and `place` methods).

## Initialization

### `__init__(name, position, orientation, energy_source, num_joints=6)`
Initializes a new `RoboticArm` instance.

-   **Parameters:**
    -   `name` (`str`): Name of the robotic arm.
    -   `position` (`Tuple[float, float]`): The (x, y) coordinates of the arm's base.
    -   `orientation` (`float`): The base orientation of the arm in radians.
    -   `energy_source` (`str`): Energy source (from `Robot.ENERGY_SOURCE`).
    -   `num_joints` (`int`, optional): The number of joints for the arm. Defaults to 6. Must be >= 2.
-   **Raises:**
    -   `ValueError`: If `num_joints` is less than 2, or if `energy_source` is invalid (via `super().__init__`).
    -   `TypeError`: For invalid parameter types (via `super().__init__` or direct checks).

**Example:**
```python
from robot import Robot
from roboticArm import RoboticArm
import math

arm = RoboticArm(
    name="Dexter",
    position=(0.0, 0.0),
    orientation=0.0,
    energy_source="electric",
    num_joints=4
)
print(f"Created robotic arm: {arm.name} with {arm.num_joints} joints.")
print(f"Initial joint angles: {arm.joint_angles}")
```

#### Properties & Setter

| Property                | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `joint_angles`          | Copy of current angles (degrees).                             |
| `num_joints`            | Read-only joint count.                                        |
| `end_effector_position` | Current (x, y) of end-effector.                               |
| `holding_item`          | Name of grasped item or `None`.                               |
| Setter `joint_angles`   | Validates list length and numeric values, wraps to \[0, 360). |

## Methods

### `move(target_position)`
Moves the arm's end effector to a specified target (x, y) position. This is a simplified 2D movement.
-   **Parameters:**
    -   `target_position` (`Tuple[float, float]`): The desired (x, y) coordinates for the end effector.
-   **Returns:** `None`
-   **Description:** If active, calculates a simplified angle to the target and distributes it among joints. Updates `_end_effector_position`. Consumes energy. Logs the movement.
-   **Raises:**
    -   `ValueError`: If `target_position` is not a tuple (x, y).
-   **Example:**
    ```python
    arm.start()
    arm.generator_level = 100
    print(f"Initial end effector position: {arm.end_effector_position}")
    arm.move((1.0, 0.5)) # Move to (1.0, 0.5)
    print(f"New end effector position: {arm.end_effector_position}, Joint angles: {arm.joint_angles}")
    ```

### `rotate(joint_index, angle)`
Rotates a specific joint of the arm by a given angle (relative rotation).
-   **Parameters:**
    -   `joint_index` (`int`): The index of the joint to rotate (0 to `num_joints - 1`).
    -   `angle` (`float`): The angle in degrees to rotate the joint by (can be positive or negative).
-   **Returns:** `None`
-   **Description:** If active, updates the specified joint's angle (normalized to 0-360). Also updates the arm's base `orientation` by the same angle (this might be an oversimplification depending on the arm's kinematics model). Consumes energy. Logs the rotation.
-   **Raises:**
    -   `IndexError`: If `joint_index` is invalid.
-   **Example:**
    ```python
    arm.start()
    arm.generator_level = 100
    print(f"Initial angle of joint 0: {arm.joint_angles[0]}")
    arm.rotate(joint_index=0, angle=45.0)
    print(f"New angle of joint 0: {arm.joint_angles[0]}, Arm orientation: {arm.orientation} rad")
    ```

### `stop()`
Stops all movements of the robotic arm and deactivates it.
-   **Returns:** `None`
-   **Description:** Sets `is_active` to `False`. Logs the stop action.
-   **Example:**
    ```python
    arm.move((0.5, 0.5))
    arm.stop()
    print(f"Arm active: {arm.is_active}")
    ```

### `status()`
Provides a string summarizing the current status of the `RoboticArm`.
-   **Returns:** `str`
-   **Description:** Includes ID, name, base position, end-effector position, base orientation, joint angles, holding item, active status, and generator level.
-   **Example:**
    ```python
    print(arm.status())
    ```

### `set_joint_angle(joint_index, angle)`
Sets a specific joint to a given absolute angle.
-   **Parameters:**
    -   `joint_index` (`int`): The index of the joint to set.
    -   `angle` (`float`): The desired absolute angle in degrees for the joint (will be normalized to 0-360).
-   **Returns:** `None`
-   **Description:** Logs the action.
-   **Raises:**
    -   `IndexError`: If `joint_index` is invalid.
-   **Example:**
    ```python
    arm.start()
    arm.set_joint_angle(joint_index=1, angle=90.0)
    print(f"Joint 1 angle set to: {arm.joint_angles[1]}")
    ```

### `reset_arm()`
Resets all joint angles to zero, moves the end effector to the arm's base position, and clears any held item.
-   **Returns:** `None`
-   **Description:** Logs the reset action.
-   **Example:**
    ```python
    arm.move((1.0, 1.0))
    arm.pick("SampleBox")
    arm.reset_arm()
    print(f"Arm reset. Joints: {arm.joint_angles}, End Effector: {arm.end_effector_position}, Holding: {arm.holding_item}")
    ```

### `pick(item)`
Picks up an item with the robotic arm's end effector.
-   **Parameters:**
    -   `item` (`str`): The name or identifier of the item to pick up.
-   **Returns:** `None`
-   **Description:** If active and not already holding an item, sets `_holding_item` to the specified `item`. Consumes energy. Logs the action.
-   **Example:**
    ```python
    arm.start()
    arm.generator_level = 100
    arm.move((0.5, 0.2)) # Move to item location
    arm.pick("ComponentA")
    print(f"Arm is now holding: {arm.holding_item}")
    ```

### `place(item, target_position)`
Places the currently held item at a target position.
-   **Parameters:**
    -   `item` (`str`): The name or identifier of the item to place (must match `_holding_item`).
    -   `target_position` (`Tuple[float, float]`): The (x, y) coordinates where the item should be placed.
-   **Returns:** `None`
-   **Description:** If active and holding the specified `item`, moves the end effector to `target_position`, then clears `_holding_item`. Consumes energy. Logs the action.
-   **Example:**
    ```python
    if arm.holding_item == "ComponentA":
        arm.place("ComponentA", (0.8, 0.3))
    print(f"Placed ComponentA. Arm holding: {arm.holding_item}")
    else:
        print("Not holding ComponentA or arm inactive.")
    ```

## Example Scenario: Pick and Place Operation

This scenario demonstrates initializing a `RoboticArm`, activating it, moving its end effector, picking up an object, moving again, and then placing the object.

[Test RoboticArm Example](../../tests/test_robotic_arm.py)

### Class: `Robot` (Abstract Base Class)

![UML Class Diagram](diagram.png)



1- [Wheeled Robot](wheeledrobot.md)

2- [Robotic Arm](roboticarm.md)
#### Overview

The `Robot` class is an abstract base class (ABC) that defines the common interface and core functionalities for all robot types within the simulation environment. It handles fundamental attributes like identity, position, orientation, energy, and basic actions. Being an ABC, it cannot be instantiated directly; instead, concrete robot classes must inherit from it and implement its abstract methods.

## Class Variables

### `ENERGY_SOURCE`
A list of valid energy sources for a robot.
-   **Type:** `List[str]`
-   **Default:** `["solar", "fossil_fuel", "electric"]`

### `LOW_BATTERY_THRESHOLD`
The generator level (percentage) at which a low battery warning is triggered.
-   **Type:** `int`
-   **Default:** `20`

#### Constructor

```python
def __init__(
    self,
    name: str,
    position: Tuple[float, float],
    orientation: float,
    energy_source: str,
) -> None:
```

**Parameters:**

* `name`: Human-readable identifier for the robot.
* `position`: Tuple `(x, y)` in meters.
* `orientation`: Angle in degrees (converted internally to radians).
* `energy_source`: Must be one of `Robot.ENERGY_SOURCE` (`"solar"`, `"fossil_fuel"`, `"electric"`).

**Validations:**

* `name` must be `str`.
* `position` must be a length-2 tuple of numbers.
* `orientation` must be numeric.
* `energy_source` must match one of the predefined options (case-insensitive).

**Initialization:**

* Generates a unique `uuid4` identifier.
* Sets `_is_active` to `False`.
* Initializes `_generator_level` to `100`.
* Prepares an empty `_sensors` list and configures logging.

#### Properties and Setters

| Property          | Type                  | Description                                                             |
| ----------------- | --------------------- | ----------------------------------------------------------------------- |
| `id`              | `UUID`                | Unique identifier.                                                      |
| `name`            | `str`                 | Robot name.                                                             |
| `position`        | `Tuple[float, float]` | Getter/setter for position. Validates tuple format.                     |
| `orientation`     | `float`               | Getter/setter for orientation in radians. Normalizes to \[0, 2π).       |
| `energy_source`   | `str`                 | Read-only energy source.                                                |
| `generator_level` | `int`                 | Getter/setter for remaining energy (0–100).                             |
| `is_active`       | `bool`                | Getter/setter for active status; cannot activate if energy is depleted. |
| `sensors`         | `List[Any]`           | Getter adds new sensors via setter.                                     |

#### Core Methods

* **`start(self) -> None`**

  * Activates the robot if `generator_level > 0`.
  * Logs activation event.

* **`distance_to(self, other: Tuple[float, float]) -> float`**

  * Returns Euclidean distance to `other` point.

* **`consume_energy(self, amount: float) -> None`**

  * Deducts `amount` from `generator_level` if `is_active`.
  * Raises `ValueError` on negative consumption.

* **`add_sensor(self, sensor: Any) -> None` / `remove_sensor(self, sensor: Any) -> None`**

  * Manage `_sensors` list with warnings on duplicates or missing items.

* **Abstract Methods (must be implemented by subclasses):**

  * `move(self, direction: str, distance: float) -> None`
  * `rotate(self, angle: float) -> None`
  * `stop(self) -> None`
  * `status(self) -> str`

* **Dunder Overloads:**

  * `__str__` returns the output of `status()`.
  * `__repr__` shows class name and core attributes for debugging.
  * `__eq__` compares robots by `id` and raises `TypeError` if other object is not a `Robot`.

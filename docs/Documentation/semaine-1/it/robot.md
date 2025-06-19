### Class: `Robot` (Abstract Base Class)

![Robot](diagram.png)

1. [Wheeled Robot](wheeledrobot.md)

2. [Robotic Arm](roboticarm.md)

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

```python
def start(self) -> None:
        """
        Start the robot's operations.
        """
        if self._generator_level <= 0:
            self._logger.warning("Cannot start: Generator level is zero.")
            return
        self.is_active = True
        self._logger.info(f"Robot {self.name} started.")
```
  * Activates the robot if `generator_level > 0`.
  * Logs activation event.

* **`distance_to(self, other: Tuple[float, float]) -> float`**

```python
def distance_to(self, other: Tuple[float, float]) -> float:
        """
        Calculate the distance from the robot to another point.

        Args:
            other (Tuple[float, float]): The (x, y) coordinates of the other point.

        Returns:
            float: The distance to the other point.
        """
        x0, y0 = self.position
        x1, y1 = other
        return math.hypot(x1 - x0, y1 - y0)
```

  * Returns Euclidean distance to `other` point.

* **`consume_energy(self, amount: float) -> None`**

```python
    def consume_energy(self, amount: float) -> None:
        """Consume energy from the robot's battery."""
        if not self._is_active:
            self._logger.warning("Robot is inactive, cannot consume energy.")
            return
        if amount < 0:
            raise ValueError("Energy consumption must be positive.")
        self._generator_level -= amount
        self._logger.info(f"Consumed {amount} energy. Generator level is now {self._generator_level}.")
```

  * Deducts `amount` from `generator_level` if `is_active`.
  * Raises `ValueError` on negative consumption.

* **`add_sensor(self, sensor: Any) -> None` / `remove_sensor(self, sensor: Any) -> None`**

```python
    def add_sensor(self, sensor: Any) -> None:
        """
        Add a sensor to the robot.
        
        Args:
            sensor (Any): The sensor to add.
        """
        if sensor not in self._sensors:
            self._sensors.append(sensor)
            self._logger.info(f"Sensor {sensor} added to robot {self.name}.")
        else:
            self._logger.warning(f"Sensor {sensor} is already attached to robot {self.name}.")

    def remove_sensor(self, sensor: Any) -> None:
        """
        Remove a sensor from the robot.
        
        Args:
            sensor (Any): The sensor to remove.
        """
        if sensor in self._sensors:
            self._sensors.remove(sensor)
            self._logger.info(f"Sensor {sensor} removed from robot {self.name}.")
        else:
            self._logger.warning(f"Sensor {sensor} not found on robot {self.name}.")
```

  * Manage `_sensors` list with warnings on duplicates or missing items.

* **Abstract Methods (must be implemented by subclasses):**

```python
@abstractmethod
    def move(self, direction: str, distance: float) -> None:
        """
        Move the robot in a specified direction by a certain distance.
        
        Args:
            direction (str): The direction to move ('forward', 'backward').
            distance (float): The distance to move in the specified direction.
        """
        raise NotImplementedError

    @abstractmethod
    def rotate(self, angle: float) -> None:
        """
        Rotate the robot by a certain angle.

        Args:
            angle (float): The angle to rotate the robot, in radians.
        """
        raise NotImplementedError

    @abstractmethod
    def stop(self) -> None:
        """
        Stop the robot's movement.
        """
        raise NotImplementedError

    @abstractmethod
    def status(self) -> str:
        """
        Get the current status of the robot.
        
        Returns:
            str: A string representation of the robot's current status.
        """
        return (f"Robot(ID: {self.id}, Name: {self.name}, Position: {self.position}, "
                f"Orientation: {self.orientation}, Energy Source: {self.energy_source}, "
                f"Active: {self.is_active}), Generator Level: {self.generator_level}")
 ```

  * `move(self, direction: str, distance: float) -> None`
  * `rotate(self, angle: float) -> None`
  * `stop(self) -> None`
  * `status(self) -> str`

* **Dunder Overloads:**

```python
    def __str__(self) -> str:
        """
        Return a string representation of the robot.
        
        Returns:
            str: A string containing the robot's ID, name, position, orientation, energy source, and active status.
        """
        return self.status()
    
    def __repr__(self) -> str:
        """
        Return a detailed string representation of the robot for debugging.
        
        Returns:
            str: A string containing the class name and the robot's attributes.
        """
        return (f"{self.__class__.__name__}(ID={self.id}, Name={self.name}, "
                f"Position={self.position}, Orientation={self.orientation}, "
                f"Energy Source={self.energy_source}, Active={self.is_active})")
    
    def __eq__(self, other: object) -> bool:
        """
        Check if two robots are equal based on their ID.
        
        Args:
            other (object): The object to compare with.
        
        Returns:
            bool: True if the IDs are the same, False otherwise.
        """
        if not isinstance(other, Robot):
            raise TypeError("Comparison is only supported between Robot instances.")
        return self.id == other.id
```

  * `__str__` returns the output of `status()`.
  * `__repr__` shows class name and core attributes for debugging.
  * `__eq__` compares robots by `id` and raises `TypeError` if other object is not a `Robot`.

## UML Diagram
![UML Diagram](robot.svg)

# `sensor_publisher.py`

## Description générale

Ce script définit un **nœud ROS 2** nommé `sensor_publisher` qui **publie périodiquement** des mesures **simulées** de température, humidité et pression toutes les **0.5 secondes** sur le topic `/sensor_data`.  

Les données sont envoyées sous la forme d’un message `Float32MultiArray` contenant trois valeurs flottantes correspondant à **[température, humidité, pression]**.

---

## Détail par bloc de code

### 1- Importations
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32MultiArray
import time
import random
```

**Fonction : Importe les modules nécessaires**
- `rclpy` : pour manipuler les nœuds ROS 2,
- `Float32MultiArray` : message ROS pour transmettre un vecteur de float,
- `random` : génération aléatoire de données simulées.

### 2- Définition de la classe `SensorPublisher`
```python
class SensorPublisher(Node):
```

**Fonction :** Crée un nœud ROS 2 dérivé de `Node`, qui publiera des données simulées.

### 3- Constructeur `__init__`
```python
def __init__(self):
    super().__init__('sensor_publisher')
    self.publisher_ = self.create_publisher(Float32MultiArray, '/sensor_data', 10)
    timer_period = 0.5
    self.timer = self.create_timer(timer_period, self.timer_callback)
    self.get_logger().info('SensorPublisher initialisé, publication toutes les 0.5s.')
```

**Fonction :** 
- Initialise le nœud sous le nom `sensor_publisher`,
- Crée un publisher ROS sur le topic `/sensor_data`,
- Définit un timer pour appeler `timer_callback` toutes les 0.5 secondes,
- Affiche un message dans les logs ROS à l'initialisation.


### 4- Méthode `timer_callback`
```python
def timer_callback(self):
    temp = random.uniform(15.0, 35.0)
    hum = random.uniform(30.0, 70.0)
    pres = random.uniform(950.0, 1050.0)

    msg = Float32MultiArray()
    msg.data = [float(temp), float(hum), float(pres)]
    self.publisher_.publish(msg)
    self.get_logger().info(f'Publié: temp={temp:.2f}°C, hum={hum:.2f}%, pres={pres:.2f}hPa')
```

**Fonction :** 
- Génère 3 valeurs aléatoires représentant :
  - température (15–35 °C),
  - humidité (30–70 %),
  - pression (950–1050 hPa),
- Crée un message ROS `Float32MultiArray` avec ces 3 valeurs,
- Publie le message,
- Affiche les données publiées dans les logs ROS.


### 5- Fonction `main`
```python
def main(args=None):
    rclpy.init(args=args)
    node = SensorPublisher()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.get_logger().info('SensorPublisher arrêt.')
        node.destroy_node()
        rclpy.shutdown()
```

**Fonction :** 
- Initialise le système ROS 2,
- Lance le nœud `SensorPublisher`,
- Reste actif (avec `rclpy.spin`) jusqu'à interruption (Ctrl+C),
- Nettoie et ferme proprement le nœud ROS à l’arrêt.

---

## Commande d’exécution

```bash
source install/setup.bash
ros2 run sensor_data_evaluation sensor_publisher
```

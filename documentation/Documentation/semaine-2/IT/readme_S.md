# `sensor_subscriber.py`

## Description générale

Ce script définit un **nœud ROS 2** nommé `sensor_subscriber` qui **écoute** les messages publiés sur le topic `/sensor_data`.  

Il lit les mesures de température, d'humidité et de pression, vérifie si elles sont dans des **plages prédéfinies**, affiche des **logs d'alerte** si nécessaire, puis **enregistre les dernières valeurs reçues** dans un fichier JSON (`latest_sensor_data.json`).  

Ce fichier sert ensuite d’entrée à l’application **Streamlit** pour l’affichage des données en temps réel.

---

## Détail par bloc de code

### 1- Importations
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32MultiArray
import json
from datetime import datetime
```

**Fonction : Importe les modules nécessaires**
- `rclpy` & `Node` : pour créer un nœud ROS 2,
- `Float32MultiArray` : type de message ROS attendu,
- `json` : pour sauvegarder les données vers un fichier JSON,
- `datetime` : pour ajouter un timestamp ISO aux données.


### 2- Classe `SensorSubscriber`
```python
class SensorSubscriber(Node):
```

**Fonction :** Définit un nœud abonné au topic `/sensor_data`.


### 3- Constructeur `__init__`
```python
def __init__(self):
    super().__init__('sensor_subscriber')
    self.subscription = self.create_subscription(
        Float32MultiArray,
        '/sensor_data',
        self.listener_callback,
        10)
    ...
```

**Fonction :**
- Crée le nœud ROS nommé `sensor_subscriber`,
- Crée une abonnement au topic `/sensor_data`,
- Définit les **plages valides** pour chaque mesure :
  - Température : 15.0–35.0 °C
  - Humidité : 30.0–70.0 %
  - Pression : 950.0–1050.0 hPa


### 4- Méthode `listener_callback`
```python
def listener_callback(self, msg: Float32MultiArray):
```

**Fonction :** Fonction appelée à chaque message reçu. Elle :
- Vérifie que le message contient bien **3 éléments** (temp, hum, pres).
- Vérifie si chaque mesure est dans sa plage normale.
- Affiche des **logs d’erreur** si l’une des valeurs est hors plage.
- Crée un dictionnaire structuré avec les données et un **timestamp ISO**.
- Enregistre ce dictionnaire dans un fichier JSON (`latest_sensor_data.json`).


### 5- Vérification des valeurs
```python
temp_ok = self.temp_range[0] <= temp <= self.temp_range[1]
hum_ok = self.hum_range[0] <= hum <= self.hum_range[1]
pres_ok = self.pres_range[0] <= pres <= self.pres_range[1]
```

**Fonction :** Vérifie que chaque mesure se situe dans les plages prédéfinies.


### 6- Sauvegarde JSON
```python
sensor_data = {
    'temperature': float(temp),
    'humidity': float(hum),
    'pressure': float(pres),
    'timestamp': datetime.now().isoformat(),
    'temp_ok': temp_ok,
    'hum_ok': hum_ok,
    'pres_ok': pres_ok
}
with open('latest_sensor_data.json', 'w') as f:
    json.dump(sensor_data, f, indent=2)
```

**Fonction :** 
- Structure les données avec leur statut (`ok` ou non),
- Ajoute l’heure d’acquisition,
- Écrit le tout dans un fichier JSON utilisé par Streamlit.


### 7- Gestion des erreurs
```python
except Exception as e:
    self.get_logger().warning(f'Erreur sauvegarde: {e}')
```

**Fonction :** Si la sauvegarde du fichier échoue (ex: permissions, espace disque), un avertissement est affiché.


### 8- Fonction `main`
```python
def main(args=None):
    rclpy.init(args=args)
    node = SensorSubscriber()
    ...
```

**Fonction :** 
- Initialise ROS 2,
- Instancie et lance le nœud `SensorSubscriber`,
- Reste actif en attente de messages,
- Libère les ressources proprement à la fermeture (Ctrl+C).

---

## Commande d’exécution
```bash
source install/setup.bash
ros2 run sensor_data_evaluation sensor_subscriber
```

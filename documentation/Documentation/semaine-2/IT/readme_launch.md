# `sensor_launch.py`

## Description générale

Ce script définit un fichier **launch** ROS 2 en Python qui permet de **lancer simultanément** deux nœuds :  
- `sensor_publisher` : génère des données simulées,  
- `sensor_subscriber` : consomme et analyse ces données.  

C’est une façon pratique d’exécuter les deux programmes avec une seule commande.  

---

## Détail par bloc de code  

### 1- Importation des modules
```python
from launch import LaunchDescription  
from launch_ros.actions import Node  
```
**Fonction :** 
- `LaunchDescription` : décrit le contenu du lancement,  
- `Node` : permet de définir un nœud ROS à lancer.  



### 2- Fonction `generate_launch_description`  
```python
def generate_launch_description():  
```
**Fonction :** Point d’entrée pour le système de lancement ROS 2. Elle retourne la description des actions à effectuer au démarrage.  



### 3- Déclaration des nœuds
```python
    return LaunchDescription([
        Node(
            package='sensor_data_evaluation',
            executable='sensor_publisher',
            name='sensor_publisher'
        ),
        Node(
            package='sensor_data_evaluation',
            executable='sensor_subscriber',
            name='sensor_subscriber'
        ),
    ])
```
**Fonction :** 
- Crée une liste de deux actions :
  
  - Lancement du nœud `sensor_publisher`,  
  - Lancement du nœud `sensor_subscriber`,  
- Chaque `Node` précise :  
  - `package` : le nom du package ROS (`sensor_data_evaluation`),  
  - `executable` : le script à lancer (`sensor_publisher` ou `sensor_subscriber`),  
  - `name` : nom attribué au nœud ROS.  


---

## Commande d’exécution
```bash
source install/setup.bash
ros2 launch sensor_data_evaluation sensor_launch.py
```

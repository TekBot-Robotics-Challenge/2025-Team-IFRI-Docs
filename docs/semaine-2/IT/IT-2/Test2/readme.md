# ROS2 Sensor Data Evaluation

Ce test a pour objectif de mettre en pratique ROS2 (en Python) en créant un package `sensor_data_evaluation` qui contient :
- Un **node publisher** qui génère des données aléatoires de capteurs (température, humidité, pression) et publie sur un topic ROS2.
- Un **node subscriber** qui reçoit ces données, vérifie qu’elles sont dans les plages attendues, loggue les éventuelles alertes, et écrit la dernière mesure dans un fichier JSON.
- Une **application Streamlit** qui lit ce fichier JSON et affiche un dashboard en temps réel des mesures (métriques, historique, graphiques, statistiques, alertes).

---

## Structure du projet

```
Test2/
└── src/
    └── sensor_data_evaluation/
        ├── launch/
        │   └── sensor_launch.py         # Lance publisher et subscriber ensemble.
        ├── resource/
        ├── sensor_data_evaluation/      # Package principal
        │   ├── sensor_publisher.py      # Node ROS2 qui publie des données aléatoires.
        │   ├── sensor_subscriber.py     # Node ROS2 qui vérifie les données reçues et les sauvegarde dans un JSON.
        │   └── streamlit_app.py         # Interface Streamlit qui lit les données JSON et les affiche.
        ├── test/
        ├── package.xml
        ├── setup.cfg
        └── setup.py
```
---

## Compilation et exécution rapide

### 1. Compilation
```bash
colcon build --packages-select sensor_data_evaluation
```

### 2. Sourcing
```bash
source install/setup.bash
```

### 3. Exécution séparée
**Publisher:** Dans Terminal 1
```bash
ros2 run sensor_data_evaluation sensor_publisher
```
**Subscriber:** Dans Terminal 2
```bash
ros2 run sensor_data_evaluation sensor_subscriber
```

### 4. Exécution via launch
```bash
ros2 launch sensor_data_evaluation sensor_launch.py
```

### 5. Lancement de l'interface Streamlit
```bash
cd src/sensor_data_evaluation/sensor_data_evaluation/
streamlit run streamlit_app.py
```

---

## Documentation

- [`sensor_publisher`](https://github.com/TekBot-Robotics-Challenge/2025-Team-IFRI-Docs/blob/main/docs/semaine-2/IT/IT%202/Test2/readme_P.md)
- [`sensor_subscriber`](https://github.com/TekBot-Robotics-Challenge/2025-Team-IFRI-Docs/blob/main/docs/semaine-2/IT/IT%202/Test2/readme_S.md)
- [`sensor_launch`](https://github.com/TekBot-Robotics-Challenge/2025-Team-IFRI-Docs/blob/main/docs/semaine-2/IT/IT%202/Test2/readme_launch.md)
- [`app streamlit`](https://github.com/TekBot-Robotics-Challenge/2025-Team-IFRI-Docs/blob/main/docs/semaine-2/IT/IT%202/Test2/readme_st.md)

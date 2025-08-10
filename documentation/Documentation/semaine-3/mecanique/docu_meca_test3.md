# 🛠️ Documentation – Test 3: Advanced Level

## 📋 Table of Contents

1. [Context and Objective of the Test](#context)  
2. [Specifications and Deliverables](#specifications)  
3. [Process and Methodology](#process)  
4. [Tasks to Complete](#tasks)  
5. [Success Criteria](#criteria)  
6. [Part to Model](#part)  
7. [Presentation of Results](#results)  
8. [Resources and References](#resources)  
9. [Appendices](#appendices)

---

<a name="context"></a>
## 1. 🎯 Context and Objective of the Test

**Test 3 – Advanced Level**  
Evaluate the ability to design, model, and validate a complex mechanical part while respecting:  
- The provided geometry (2D drawings and 3D renders)  
- The target mass (calculated to two decimal places)  
- Proper handling of units and rounding  

---

<a name="specifications"></a>
## 2. 📐 Specifications and Deliverables

- **Units**: MMGS (millimeter, gram, second)  
- **Precision**: 2 decimal places  
- **Material**: Aluminum 1060 (ρ = 2700 kg/m³)  
- **Fillets**: 12 × R10  
- **Holes**: All through unless otherwise noted  

### Deliverables

1. **CAD file** of the modeled part (.SLDPRT or equivalent)  
2. **Mass calculation table** for the three dimension sets  
3. **Detailed report** describing your approach and rounding rules  

---

<a name="process"></a>
## 3. Process and Methodology

All dimensions and tolerances from the provided document were strictly followed. Each step includes space to insert your screenshots to illustrate progress.

---

### 1. Import Plans and Prepare the File  
- **Goal**: Load the 2D/3D views and set the origin.  
- **Actions**:  
  1. Open the base CAD template.  
  2. Insert sketches of the top, front, and section views.  
  3. Verify the MMGS units and origin placement.  

---

### 2. Sketch the Main Outline  
- **Goal**: Draw the trapezoidal shape and the primary cutouts.  
- **Actions**:  
  1. On the top plane, sketch the outer contour using the correct dimensions.  
  2. Add the centered square cavities.  
  3. Define a symmetry axis to facilitate mirrored features.  

---

### 3. Extrusion and Initial Cut  
- **Goal**: Establish the base thickness and define volumes to remove.  
- **Actions**:  
  1. Extrude the main sketch to the specified heights (lower and upper zones).  
  2. Apply a planar cut to separate the two thickness levels.  

---

### 4. Create Secondary Cutouts and Grooves  
- **Goal**: Form the central groove and side cutouts.  
- **Actions**:  
  1. On the top face, sketch the groove (5 mm wide, 2.5 mm deep).  
  2. Perform an extrude-cut to remove material.  
  3. Mirror the operation on the opposite side.  

---

### 5. Drilling and Filleting  
- **Goal**: Add all through-holes and round internal edges.  
- **Actions**:  
  1. Model each Ø10 mm hole at the specified locations.  
  2. Apply R10 fillets to the 12 internal edges.  

---

### 6. Angled Cut and Angular Features  
- **Goal**: Execute the 130° cut and transition features.  
- **Actions**:  
  1. Sketch the inclined cut line on the side view.  
  2. Perform an extrude-cut through the entire body.  
  3. Verify the angle and adjust as needed.  

---

### 7. Final Details and Quality Check  
- **Goal**: Validate the part and prepare the final export.  
- **Actions**:  
  1. Measure all critical dimensions with the measurement tool.  
  2. Visually compare with the provided 3D renders (color, feature placement).  
  3. Save and correctly name the final `.SLDPRT` file.  

---

#### Illustrations (insert your images here)

![Step 1](Documentation/semaine-3/mecanique/assets/process_images/img_1.png)  
![Step 2](Documentation/semaine-3/mecanique/assets/process_images/img_2.png)  
![Step 3](Documentation/semaine-3/mecanique/assets/process_images/img_3.png)  
…  
![Step 29](Documentation/semaine-3/mecanique/assets/process_images/img_29.png)  

*Figure: Step-by-step images showing the construction process of the Test 3 part.*

---

<a name="tasks"></a>
## 4. 🛠️ Tasks to Complete

For each dimension set, calculate the mass of the part (in grams):

- **Q3a.** A = 193 mm; B = 88 mm; W = B/2; X = A/4; Y = B + 5.5 mm; Z = B + 15 mm  
- **Q3b.** A = 205 mm; B = 100 mm; W = B/2; X = A/4; Y = B + 5.5 mm; Z = B + 15 mm  
- **Q3c.** A = 210 mm; B = 105 mm; W = B/2; X = A/4; Y = B + 5.5 mm; Z = B + 15 mm  

> **To provide**:  
> - Mass values (g) rounded to 2 decimals  
> - Screenshot of the volume/mass calculation in your CAD software  

---

<a name="criteria"></a>
## 5. ✅ Success Criteria

- Mass accuracy within ±1 % of the target.  
- Geometric conformity (all dimensions and tolerances met).  
- Clear presentation of calculation table and report.  
- Well-structured and properly named CAD file.  

---

<a name="part"></a>
## 6. 🧩 Part to Model

![3D Render – View 1](Documentation/semaine-3/mecanique/assets/imgs/a_modeliser_1.png)  
*Render 1: Top-right isometric view*

![3D Render – View 2](Documentation/semaine-3/mecanique/assets/imgs/a_modeliser_2.png)  
*Render 2: Front isometric view*

---

<a name="results"></a>
## 7. 📊 Presentation of Results

| Case | A (mm) | B (mm) | Calculated Mass (g) |
|:----:|:------:|:------:|:-------------------:|
| Q3a  | 193    | 88     | **1393.82**         |
| Q3b  | 205    | 100    | **1492.49**         |
| Q3c  | 210    | 105    | **1531.19**         |

---

<a name="resources"></a>
## 8. 📚 Resources and References

- **SolidWorks 2025** for modeling and volume calculation  
- **MS Excel** for mass tables and rounding  
- Technical documentation on fillets and drilling  

---

<a name="appendices"></a>
## 9. 📎 Appendices

None at the moment. This section may later include:  
- Detailed drawings  
- Advanced calculations  
- Technical correspondence  

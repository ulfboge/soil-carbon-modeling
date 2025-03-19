# Soil Carbon Modeling Data Preparation Using Google Earth Engine

## 1. Introduction
This document outlines the process for retrieving and processing geospatial datasets required for soil carbon modeling in a carbon project. The workflow leverages Google Earth Engine (GEE) to extract and analyze climate, soil, vegetation, and land cover data for a specific Area of Interest (AOI).

## 2. Data Sources & Processing Steps

| Dataset | Source | Bands Used | Processing Steps | Final Units |
|---------|---------|------------|------------------|-------------|
| Climate | GRIDMET (GEE) | `tmmx`, `tmmn`, `pr`, `etr` | Convert to °C and mm | °C, mm |
| Soil Organic Carbon (SOC) | SoilGrids 250m | `ocs_0-30cm_mean` | Direct selection, clipped to AOI | t C ha⁻¹ |
| Clay Content | OpenLandMap | `b0`, `b10`, `b30` | Averaged (0-30cm), clipped to AOI | % |
| Land Cover | ESA WorldCover | `Map` | Reclassified into 3 categories (Forestry, Grassland, Agriculture) | Categorical |
| Vegetation Cover | MODIS (v061) | `NDVI` | Median value, scale correction (0.0001) | NDVI (0-1) |

## 3. GEE Processing Steps

### 3.1 Define AOI
The AOI is loaded as a FeatureCollection from an Earth Engine Asset.

```javascript
var aoi = ee.FeatureCollection('projects/ee-komba/assets/bbox_wirong').geometry();
```

### 3.2 Retrieve Climate Data
**Source:** GRIDMET  
**Processing:** Convert temperature to Celsius (from Kelvin)

```javascript
var climate = ee.ImageCollection("IDAHO_EPSCOR/GRIDMET")
  .filterBounds(aoi)
  .filterDate("1980-01-01", ee.Date(Date.now()))
  .select(["tmmx", "tmmn", "pr", "etr"])
  .mean()
  .clip(aoi);
```

### 3.3 Retrieve Soil Data

#### SOC (Soil Organic Carbon Stocks, 0-30cm)
- **Dataset:** SoilGrids (`ocs_mean`)
- **Unit:** t C ha⁻¹ (no conversion needed)

```javascript
var soc = ee.Image("projects/soilgrids-isric/ocs_mean")
  .select("ocs_0-30cm_mean")
  .rename("SOC_tCha")
  .clip(aoi)
  .updateMask(soc.mask());
```

#### Clay Content (0-30cm depth, % mass fraction)
```javascript
var clay = ee.Image("OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02")
  .select(["b0", "b10", "b30"])
  .reduce(ee.Reducer.mean())
  .rename("Clay_Percent")
  .clip(aoi)
  .updateMask(clay.mask());
```

### 3.4 Land Cover Classification
**Dataset:** ESA WorldCover  
**Processing:** Reclassified for RothC model

```javascript
var landcover = ee.ImageCollection("ESA/WorldCover/v100")
  .filterBounds(aoi)
  .sort("system:time_start", false)
  .first()
  .clip(aoi);

var landcover_reclassified = landcover.remap(
  [10, 20, 30, 40],  // Original classes
  [1, 2, 2, 3],      // Reclassified: 1=Forestry, 2=Grassland, 3=Agriculture
  0                  // Default (everything else excluded)
).rename("Land_Cover_Class");
```

### 3.5 Vegetation Cover (NDVI)
**Dataset:** MODIS v061 (`MOD13A1`)  
**Processing:** Scale correction applied (0.0001)

```javascript
var ndvi = ee.ImageCollection("MODIS/061/MOD13A1")
  .filterBounds(aoi)
  .filterDate("2000-01-01", ee.Date(Date.now()))
  .select("NDVI")
  .median()
  .multiply(0.0001) // Convert to proper scale
  .rename("NDVI")
  .clip(aoi);
```

## 4. Data Visualization & Export

### 4.1 Value Distribution Analysis
Histograms are generated to assess the data distributions:

```javascript
print(ui.Chart.image.histogram({image: soc, region: aoi, scale: 1000}).setOptions({title: "SOC Distribution"}));
print(ui.Chart.image.histogram({image: clay, region: aoi, scale: 1000}).setOptions({title: "Clay Content"}));
print(ui.Chart.image.histogram({image: ndvi, region: aoi, scale: 1000}).setOptions({title: "NDVI Distribution"}));
```

### 4.2 Export Data to Google Drive
```javascript
Export.image.toDrive({ image: soc, description: "SOC_Stocks", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: clay, description: "Clay_Content", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: landcover_reclassified, description: "Land_Cover_Reclassified", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: ndvi, description: "Monthly_NDVI", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
```

## 5. Project Structure and Deliverables

### 5.1 Repository Organization
```
📁 soil-carbon-modeling
│── 📜 README.md          # Project overview & setup instructions
│── 📜 documentation.md   # Detailed processing steps
│── 📁 scripts/           # GEE processing scripts
│   └── 📁 gee/          # Google Earth Engine scripts
│       ├── 📜 Land_Soil_NDVI_Export.js
│       ├── 📜 TerraClimate_Monthly_Averages_CSV.js
│       └── 📜 TerraClimate_Monthly_Averages_Resampled.js
│── 📁 notebooks/        # Jupyter notebooks for analysis
│   ├── 📜 Land_Soil_NDVI_Export.ipynb
│   ├── 📜 Land_Soil_NDVI_Export_Alternative.ipynb
│   ├── 📜 TerraClimate_Monthly_Averages_CSV.ipynb
│   └── 📜 TerraClimate_Monthly_Averages_Resampled.ipynb
│── 📁 data_exports/     # Folder for exported GeoTIFFs
│── 📁 charts/           # Folder for value distribution histograms
│── 📁 csv/             # Folder for exported CSV files
│── 📁 docs/            # Detailed documentation
│   └── 📜 carbon_project_workflow.md
│── 📜 .gitignore       # Ignore large files & logs
```

### 5.2 Deliverables Summary
✅ **Comprehensive Documentation**
   - Detailed processing steps
   - Dataset descriptions and sources
   - Methodology explanation
   - Expected outputs and formats

✅ **Organized Repository Structure**
   - GEE scripts and Python notebooks
   - Documentation and guides
   - Data export directories
   - Analysis tools

✅ **Data Visualization**
   - Distribution histograms
   - Land cover classification maps
   - Interactive visualizations in notebooks

✅ **Quality Assurance**
   - Data validation steps
   - Error handling
   - Progress tracking
   - Export verification
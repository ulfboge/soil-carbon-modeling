# Soil Carbon Modeling Documentation

## Overview
This repository contains tools and documentation for preparing geospatial datasets for soil carbon modeling using Google Earth Engine (GEE). The workflow processes climate, soil, vegetation, and land cover data for defined Areas of Interest (AOI).

## 📚 Documentation Structure

- [Carbon Project Workflow](docs/carbon_project_workflow.md) - Detailed step-by-step guide for data processing
- [README.md](README.md) - Project overview and setup instructions

## 🛠️ Available Scripts and Notebooks

### Google Earth Engine Scripts
Located in `scripts/gee/`:
- `Land_Soil_NDVI_Export.js`: Export NDVI data for land and soil analysis
- `TerraClimate_Monthly_Averages_CSV.js`: Process TerraClimate data and export as CSV
- `TerraClimate_Monthly_Averages_Resampled.js`: Resample TerraClimate data for specific regions

### Jupyter Notebooks
Located in `notebooks/`:
- `Land_Soil_NDVI_Export.ipynb`: Interactive NDVI data processing and visualization
- `Land_Soil_NDVI_Export_Alternative.ipynb`: Alternative approach for NDVI processing
- `TerraClimate_Monthly_Averages_CSV.ipynb`: TerraClimate data processing and CSV export
- `TerraClimate_Monthly_Averages_Resampled.ipynb`: TerraClimate data resampling and analysis

## 📊 Data Sources

### Climate Data
- **GRIDMET**: Basic climate variables (temperature, precipitation, etc.)
- **TerraClimate**: Detailed monthly climate data

### Soil Data
- **SoilGrids 250m**: Soil organic carbon stocks
- **OpenLandMap**: Clay content and soil texture

### Land Cover
- **ESA WorldCover**: Land cover classification

### Vegetation
- **MODIS v061**: NDVI data for vegetation cover

## 🔧 Processing Steps

1. **Area of Interest (AOI) Definition**
   - Load AOI from Earth Engine Asset
   - Define spatial boundaries

2. **Climate Data Processing**
   - Retrieve GRIDMET data
   - Process TerraClimate monthly averages
   - Convert units and apply corrections

3. **Soil Data Processing**
   - Extract SOC stocks
   - Calculate clay content
   - Apply spatial masks

4. **Land Cover Classification**
   - Load ESA WorldCover data
   - Reclassify for RothC model
   - Generate categorical maps

5. **Vegetation Analysis**
   - Process NDVI data
   - Apply scale corrections
   - Generate temporal composites

## 📈 Data Visualization

- Distribution histograms for all variables
- Land cover classification maps
- Interactive visualizations in notebooks
- Time series analysis for climate data

## 📤 Export Options

### GeoTIFF Exports
- SOC stocks
- Clay content
- Land cover classification
- NDVI data

### CSV Exports
- Monthly climate variables
- Statistical summaries
- Point data

## 🔍 Quality Assurance

- Data validation steps
- Error handling procedures
- Progress tracking
- Export verification

## 📝 Usage Instructions

1. Review the [Carbon Project Workflow](docs/carbon_project_workflow.md) for detailed processing steps
2. Choose the appropriate script or notebook for your analysis
3. Follow the setup instructions in the documentation
4. Run the analysis and export results

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
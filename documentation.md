# Soil Carbon Modeling Documentation

## Overview
This repository contains tools and documentation for preparing geospatial datasets for soil carbon modeling using Google Earth Engine (GEE). The workflow processes climate, soil, vegetation, and land cover data for defined Areas of Interest (AOI).

## 📚 Documentation Structure

- [Carbon Project Workflow](docs/carbon_project_workflow.md) - Detailed step-by-step guide for data processing
- [README.md](README.md) - Project overview and setup instructions

## 🛠️ Available Scripts and Notebooks

### Setup Notebook
- `00_Setup_and_Mount.ipynb`: Initial setup notebook that:
  - Installs required packages (geemap, folium, matplotlib, seaborn)
  - Mounts Google Drive for data storage
  - Sets up Earth Engine authentication
  - Creates necessary directories (data_exports, charts, csv)
  - Provides common functions and variables for all notebooks
  - Must be run before using any other notebooks

### Google Earth Engine Scripts and Notebooks
Each GEE script has a corresponding Jupyter notebook version for interactive analysis:

1. **Land and Soil NDVI Analysis**
   - GEE Script: `Land_Soil_NDVI_Export.js`
   - Notebook: `Land_Soil_NDVI_Export.ipynb`
   - Alternative Notebook: `Land_Soil_NDVI_Export_Alternative.ipynb`
   - Functionality: Export NDVI data for land and soil analysis
   - Interactive Features:
     - Real-time visualization
     - Parameter adjustment
     - Distribution analysis
     - Custom export options

2. **TerraClimate Data Processing**
   - GEE Script: `TerraClimate_Monthly_Averages_CSV.js`
   - Notebook: `TerraClimate_Monthly_Averages_CSV.ipynb`
   - Functionality: Process TerraClimate data and export as CSV
   - Interactive Features:
     - Time range selection
     - Variable selection
     - Statistical analysis
     - Export customization

3. **TerraClimate Data Resampling**
   - GEE Script: `TerraClimate_Monthly_Averages_Resampled.js`
   - Notebook: `TerraClimate_Monthly_Averages_Resampled.ipynb`
   - Functionality: Resample TerraClimate data for specific regions
   - Interactive Features:
     - Resolution adjustment
     - Visualization parameters
     - Spatial analysis
     - Export format selection

The Jupyter notebooks provide an interactive environment for:
- Modifying parameters and rerunning analysis
- Visualizing results in real-time
- Exploring data distributions
- Customizing export options
- Debugging and testing different approaches
- Documenting the analysis process

## 📊 Data Sources

### Climate Data
- **GRIDMET**: Basic climate variables (temperature, precipitation, etc.)
- **TerraClimate**: Detailed monthly climate data (1980-2024)
  - Monthly mean temperature (derived from max/min)
  - Monthly mean precipitation
  - Monthly mean potential evapotranspiration (PET)

### Soil Data
- **SoilGrids 250m**: 
  - Soil organic carbon stocks (0-30cm)
  - Units: t C ha⁻¹
- **OpenLandMap**: 
  - Clay content and soil texture
  - Aggregated from multiple depth layers (0-10cm, 10-30cm, 30-50cm)

### Land Cover
- **ESA WorldCover v100**: 
  - 10m resolution land cover classification
  - Reclassified for RothC model:
    - 1: Forestry
    - 2: Grassland
    - 3: Agriculture

### Vegetation
- **MODIS v061**: 
  - NDVI data for vegetation cover
  - Scale factor: 0.0001
  - Temporal coverage: 2000-present

## 🔧 Processing Steps

0. **Initial Setup**
   - Run the setup notebook (`00_Setup_and_Mount.ipynb`)
   - Mount Google Drive
   - Set up Earth Engine authentication
   - Create necessary directories
   - Import common libraries and functions

1. **Area of Interest (AOI) Definition**
   - Load AOI from Earth Engine Asset
   - Define spatial boundaries
   - Set up projection and scale parameters

2. **Climate Data Processing**
   - Retrieve TerraClimate data (1980-2024)
   - Compute monthly averages for:
     - Temperature (mean of max/min)
     - Precipitation
     - Potential evapotranspiration
   - Apply unit conversions (e.g., temperature scaling)
   - Generate both CSV (AOI-wide) and GeoTIFF (spatial) outputs

3. **Soil Data Processing**
   - Extract SOC stocks from SoilGrids
   - Calculate clay content from OpenLandMap
   - Apply spatial masks and quality filters
   - Generate distribution histograms

4. **Land Cover Classification**
   - Load ESA WorldCover v100 data
   - Reclassify for RothC model categories
   - Generate categorical maps
   - Calculate class frequencies

5. **Vegetation Analysis**
   - Process MODIS NDVI data
   - Apply scale corrections (0.0001)
   - Generate temporal composites
   - Create NDVI distribution histograms

## 📈 Data Visualization

- Distribution histograms for all variables
- Land cover classification maps with custom color schemes
- Interactive visualizations in notebooks
- Time series analysis for climate data
- Custom visualization parameters for:
  - Temperature (15-35°C, blue-yellow-red palette)
  - Precipitation (0-300mm, white-blue palette)
  - PET (0-200mm, white-green palette)
  - NDVI (0-1, red-yellow-green palette)

## 📤 Export Options

### GeoTIFF Exports
- SOC stocks (t C ha⁻¹)
- Clay content (%)
- Land cover classification (RothC categories)
- NDVI data
- Monthly climate variables (1000m resolution)

### CSV Exports
- Monthly climate variables (AOI-wide statistics)
- Statistical summaries
- Point data
- Temporal analysis results

## 🔍 Quality Assurance

- Data validation steps
  - Unit conversion verification
  - Scale factor application
  - Mask application
- Error handling procedures
  - Missing data handling
  - Projection consistency
  - Scale compatibility
- Progress tracking
  - Export task monitoring
  - Processing status updates
- Export verification
  - File format validation
  - Data completeness checks
  - Resolution confirmation

## 📝 Usage Instructions

1. Review the [Carbon Project Workflow](docs/carbon_project_workflow.md) for detailed processing steps
2. Choose the appropriate script or notebook for your analysis
3. Follow the setup instructions in the documentation
4. Run the analysis and export results

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
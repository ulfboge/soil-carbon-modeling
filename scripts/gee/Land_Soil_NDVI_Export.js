{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Land and Soil NDVI Export\n",
    "[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ulfboge/soil-carbon-modeling/blob/main/notebooks/Land_Soil_NDVI_Export.ipynb)\n",
    "\n",
    "## Overview\n",
    "This notebook processes and exports various geospatial datasets for soil carbon modeling, including:\n",
    "- Soil Organic Carbon (SOC) stocks\n",
    "- Clay content\n",
    "- Land cover classification\n",
    "- Normalized Difference Vegetation Index (NDVI)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Setup and Authentication\n",
    "First, we need to authenticate with Google Earth Engine and import necessary libraries."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "source": [
    "# Import required libraries\n",
    "import ee\n",
    "import geemap\n",
    "import folium\n",
    "import matplotlib.pyplot as plt\n",
    "import seaborn as sns\n",
    "\n",
    "# Initialize Earth Engine\n",
    "try:\n",
    "    ee.Initialize()\n",
    "except Exception as e:\n",
    "    ee.Authenticate()\n",
    "    ee.Initialize()\n",
    "\n",
    "# Create a map centered on the AOI\n",
    "Map = geemap.Map()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Define Area of Interest"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "source": [
    "# Define your Area of Interest (AOI)\n",
    "aoi = ee.FeatureCollection('projects/ee-komba/assets/bbox_wirong').geometry()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1. Soil Datasets Processing"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "source": [
    "# Load SOC stocks (0-30cm, already in t C ha⁻¹)\n",
    "soc = ee.Image(\"projects/soilgrids-isric/ocs_mean\") \\\n",
    "    .select(\"ocs_0-30cm_mean\") \\\n",
    "    .rename(\"SOC_tCha\") \\\n",
    "    .clip(aoi) \\\n",
    "    .updateMask(ee.Image(\"projects/soilgrids-isric/ocs_mean\").select(0).mask())\n",
    "\n",
    "# Load Clay dataset\n",
    "clay_raw = ee.Image(\"OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02\")\n",
    "clay = clay_raw \\\n",
    "    .select([\"b0\", \"b10\", \"b30\"]) \\\n",
    "    .reduce(ee.Reducer.mean()) \\\n",
    "    .rename(\"Clay_Percent\") \\\n",
    "    .clip(aoi) \\\n",
    "    .updateMask(clay_raw.select(0).mask())"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 2. Land Cover Classification"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "source": [
    "# Load and process ESA WorldCover\n",
    "landcover = ee.ImageCollection(\"ESA/WorldCover/v100\") \\\n",
    "    .filterBounds(aoi) \\\n",
    "    .sort(\"system:time_start\", False) \\\n",
    "    .first() \\\n",
    "    .clip(aoi)\n",
    "\n",
    "# Reclassify land cover for RothC\n",
    "landcover_reclassified = landcover.remap(\n",
    "    [10, 20, 30, 40],  # Original classes\n",
    "    [1, 2, 2, 3],      # Reclassified: 1=Forestry, 2=Grassland, 3=Agriculture\n",
    "    0                  # Default (everything else excluded)\n",
    ").rename(\"Land_Cover_Class\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 3. NDVI Processing"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "source": [
    "# Process NDVI from MODIS\n",
    "ndvi = ee.ImageCollection(\"MODIS/061/MOD13A1\") \\\n",
    "    .filterBounds(aoi) \\\n",
    "    .filterDate(\"2000-01-01\", ee.Date(ee.Date.now())) \\\n",
    "    .select(\"NDVI\") \\\n",
    "    .median() \\\n",
    "    .multiply(0.0001) \\\n",
    "    .rename(\"NDVI\") \\\n",
    "    .clip(aoi)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 4. Visualization"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "source": [
    "# Center map on AOI\n",
    "Map.centerObject(aoi, 6)\n",
    "\n",
    "# Add layers to the map\n",
    "Map.addLayer(soc, {'min': 0, 'max': 200, 'palette': ['blue', 'green', 'yellow', 'red']}, 'SOC (t C ha⁻¹)')\n",
    "Map.addLayer(clay, {'min': 0, 'max': 100, 'palette': ['yellow', 'brown', 'red']}, 'Clay Content (%)')\n",
    "Map.addLayer(landcover_reclassified, {'min': 1, 'max': 3, 'palette': ['green', 'yellow', 'brown']}, 'Reclassified Land Cover')\n",
    "Map.addLayer(ndvi, {'min': 0, 'max': 1, 'palette': ['red', 'yellow', 'green']}, 'NDVI')\n",
    "\n",
    "# Display the map\n",
    "Map"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 5. Data Export"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "source": [
    "# Export functions\n",
    "def export_image(image, description, scale=1000):\n",
    "    task = ee.batch.Export.image.toDrive({\n",
    "        'image': image,\n",
    "        'description': description,\n",
    "        'scale': scale,\n",
    "        'region': aoi,\n",
    "        'fileFormat': 'GeoTIFF'\n",
    "    })\n",
    "    task.start()\n",
    "    print(f\"Started export task: {description}\")\n",
    "\n",
    "# Export all datasets\n",
    "export_image(soc, \"SOC_Stocks\")\n",
    "export_image(clay, \"Clay_Content\")\n",
    "export_image(landcover_reclassified, \"Land_Cover_Reclassified\")\n",
    "export_image(ndvi, \"Monthly_NDVI\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 6. Value Distribution Analysis"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "source": [
    "# Function to create histograms\n",
    "def create_histogram(image, title, xlabel, color='blue'):\n",
    "    histogram = image.reduceRegion(\n",
    "        reducer=ee.Reducer.histogram(),\n",
    "        geometry=aoi,\n",
    "        scale=1000,\n",
    "        maxPixels=1e6\n",
    "    )\n",
    "    \n",
    "    # Convert to numpy array for plotting\n",
    "    hist_data = ee.Dictionary(histogram).get(image.bandNames().get(0)).getInfo()\n",
    "    \n",
    "    # Create plot\n",
    "    plt.figure(figsize=(10, 6))\n",
    "    plt.hist(hist_data['histogram'], bins=hist_data['bucketCount'], color=color)\n",
    "    plt.title(title)\n",
    "    plt.xlabel(xlabel)\n",
    "    plt.ylabel('Frequency')\n",
    "    plt.show()\n",
    "\n",
    "# Create histograms for each dataset\n",
    "create_histogram(soc, 'SOC Distribution (t C ha⁻¹)', 'SOC', 'blue')\n",
    "create_histogram(clay, 'Clay Content Distribution (%)', 'Clay %', 'brown')\n",
    "create_histogram(ndvi, 'NDVI Distribution', 'NDVI', 'green')\n",
    "\n",
    "# Special handling for land cover histogram\n",
    "landcover_hist = landcover_reclassified.reduceRegion(\n",
    "    reducer=ee.Reducer.frequencyHistogram(),\n",
    "    geometry=aoi,\n",
    "    scale=1000,\n",
    "    maxPixels=1e6\n",
    ")\n",
    "\n",
    "landcover_data = ee.Dictionary(landcover_hist).get('Land_Cover_Class').getInfo()\n",
    "\n",
    "plt.figure(figsize=(10, 6))\n",
    "plt.bar(['Forestry', 'Grassland', 'Agriculture'], \n",
    "        [landcover_data['1'], landcover_data['2'], landcover_data['3']],\n",
    "        color=['green', 'yellow', 'brown'])\n",
    "plt.title('Land Cover Distribution')\n",
    "plt.xlabel('Land Cover Category')\n",
    "plt.ylabel('Frequency')\n",
    "plt.show()"
   ]
  }
 ],
 "metadata": {
  "accelerator": "GPU",
  "colab": {
   "name": "Land_Soil_NDVI_Export.ipynb",
   "provenance": []
  },
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.8.0"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 4
}
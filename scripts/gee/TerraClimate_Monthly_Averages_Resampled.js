// Define your Area of Interest (AOI)
var aoi = ee.FeatureCollection('projects/ee-komba/assets/bbox_wirong').geometry();

// Define the time range
var startDate = '1980-01-01';
var endDate = '2024-12-01';

// Load TerraClimate dataset
var terraclimate = ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE')
                    .filterBounds(aoi)
                    .filterDate(startDate, endDate);

// Get projection information
var projection = terraclimate.first().projection();

// Compute Monthly Averages
var months = ee.List.sequence(1, 12);

var monthlyClimate = ee.ImageCollection.fromImages(
  months.map(function(m) {
    var filtered = terraclimate.filter(ee.Filter.calendarRange(m, m, 'month'));

    // Compute mean temperature (average of max and min)
    var meanTemp = filtered.select('tmmx').mean().multiply(0.1)
                   .add(filtered.select('tmmn').mean().multiply(0.1))
                   .divide(2)
                   .rename('mean_temperature');

    // Compute mean precipitation
    var precipitation = filtered.select('pr').mean().rename('mean_precipitation');

    // Compute mean potential evapotranspiration
    var pet = filtered.select('pet').mean().multiply(0.1).rename('mean_pet');

    return meanTemp.addBands([precipitation, pet])
                   .set('month', m); // Add metadata
  })
);

// Reduce the ImageCollection to a single multi-band image
var monthlyStack = monthlyClimate.toBands().setDefaultProjection(projection);

// Resample to 1000m resolution
var resampledClimate = monthlyStack
  .reduceResolution({
    reducer: ee.Reducer.mean(),
    bestEffort: true
  })
  .reproject({
    crs: projection,
    scale: 1000
  })
  .clip(aoi); // Clip directly after resampling

// Visualization Parameters
var visParamsTemp = {min: 15, max: 35, palette: ['blue', 'yellow', 'red']};
var visParamsPrecip = {min: 0, max: 300, palette: ['white', 'blue']};
var visParamsPET = {min: 0, max: 200, palette: ['white', 'green']};

// Add only the resampled layers to the map
Map.centerObject(aoi, 6);
Map.addLayer(resampledClimate.select('0_mean_temperature'), visParamsTemp, 'Jan Temp (1000m)');
Map.addLayer(resampledClimate.select('0_mean_precipitation'), visParamsPrecip, 'Jan Precip (1000m)');
Map.addLayer(resampledClimate.select('0_mean_pet'), visParamsPET, 'Jan PET (1000m)');

// Export the resampled dataset to Google Drive
Export.image.toDrive({
  image: resampledClimate,
  description: 'MonthlyClimate_AOI_1000m',
  scale: 1000,
  region: aoi,
  fileFormat: 'GeoTIFF'
});

// Imports the Google Cloud client library
const monitoring = require('@google-cloud/monitoring');

// Creates a client
const client = new monitoring.MetricServiceClient();


//  OpenCensus
const {TagMap, globalStats, MeasureUnit, AggregationType} = require('@opencensus/core');
const {StackdriverStatsExporter} = require('@opencensus/exporter-stackdriver');

class MetricsManager {
    //keyFilename
    constructor(config) { 
        this.projectId = config.projectId;
    }

    async opencensusTargetLanguage(target_language){
        'use strict';
        //const exporter = new StackdriverTraceExporter({projectId: this.projectId});
        //tracing.registerExporter(exporter).start();
        try
        {

        const EXPORT_INTERVAL = 60;
        const MEASURE_REQUEST_COUNT = globalStats.createMeasureInt64(
            'https://custom.googleapis.com/michaelchi_demo/intent_detection_request',
            MeasureUnit.UNIT,
            'Dialogflow Intent Requests'
        );
        const tags = new TagMap();
        tags.set('requested_target_language', {value: target_language});
        
        // Register the view. It is imperative that this step exists,
        // otherwise recorded metrics will be dropped and never exported.
        const view = globalStats.createView(
          'michaelchi_demo_request_count',
          MEASURE_REQUEST_COUNT,
          AggregationType.COUNT,
          [],
          'Dialogflow Requested translation'
        );
        
        // Then finally register the views
        globalStats.registerView(view);
        
        // Enable OpenCensus exporters to export metrics to Stackdriver Monitoring.
        // Exporters use Application Default Credentials (ADCs) to authenticate.
        // See https://developers.google.com/identity/protocols/application-default-credentials
        // for more details.
        // Expects ADCs to be provided through the environment as ${GOOGLE_APPLICATION_CREDENTIALS}
        // A Stackdriver workspace is required and provided through the environment as ${GOOGLE_PROJECT_ID}
        
        // The minimum reporting period for Stackdriver is 1 minute.
        const exporter = new StackdriverStatsExporter({
          projectId: this.projectId,
          period: EXPORT_INTERVAL * 1000,
        });
        
        // Pass the created exporter to Stats
        globalStats.registerExporter(exporter);
        
        //container_name namespace_name
        //tags.set('container_name','fulfillment');
        //tags.set('namespace_name','default');
        globalStats.record([
            {
              measure: MEASURE_REQUEST_COUNT,
              value: 1,
            },
          ],
          tags
          );
        
        /**
         * The default export interval is 60 seconds. The thread with the
         * StackdriverStatsExporter must live for at least the interval past any
         * metrics that must be collected, or some risk being lost if they are recorded
         * after the last export.
         */
        setTimeout(() => {
          console.log('Done recording metrics.');
        }, EXPORT_INTERVAL * 1000);
      }catch(ex){
        console.error(`[ERROR]${ex}`);
      }
    }

    async opencensusTargetLanguage2(target_language){
      'use strict';
      //const exporter = new StackdriverTraceExporter({projectId: this.projectId});
      //tracing.registerExporter(exporter).start();
      try
      {

      const EXPORT_INTERVAL = 60;
      const MEASURE_REQUEST_COUNT = globalStats.createMeasureInt64(
          'https://custom.googleapis.com/michaelchi_demo/intent_detection_request_2',
          MeasureUnit.UNIT,
          'Dialogflow Intent Requests 2'
      );
      const tags = new TagMap();
      tags.set('requested_target_language_2', {value: target_language});
      
      // Register the view. It is imperative that this step exists,
      // otherwise recorded metrics will be dropped and never exported.
      const view = globalStats.createView(
        'michaelchi_demo_request_count_2',
        MEASURE_REQUEST_COUNT,
        AggregationType.COUNT,
        [],
        'Dialogflow Requested translation 2'
      );
      
      // Then finally register the views
      globalStats.registerView(view);
      
      // Enable OpenCensus exporters to export metrics to Stackdriver Monitoring.
      // Exporters use Application Default Credentials (ADCs) to authenticate.
      // See https://developers.google.com/identity/protocols/application-default-credentials
      // for more details.
      // Expects ADCs to be provided through the environment as ${GOOGLE_APPLICATION_CREDENTIALS}
      // A Stackdriver workspace is required and provided through the environment as ${GOOGLE_PROJECT_ID}
      
      // The minimum reporting period for Stackdriver is 1 minute.
      const exporter = new StackdriverStatsExporter({
        projectId: this.projectId,
        period: EXPORT_INTERVAL * 1000,
      });
      
      // Pass the created exporter to Stats
      globalStats.registerExporter(exporter);
      
      //container_name namespace_name
      //tags.set('container_name','fulfillment');
      //tags.set('namespace_name','default');
      globalStats.record([
          {
            measure: MEASURE_REQUEST_COUNT,
            value: 1,
          },
        ],
        tags
        );
      
      
    }catch(ex){
      console.error(`[ERROR]${ex}`);
    }
  }
    async createTargetLanguageMetric() {
        try
        {
            const request = {
                name: client.projectPath(this.projectId),
                metricDescriptor: {
                description: 'Translation Target Language',
                displayName: 'Target Language',
                type: 'custom.googleapis.com/translation/target_language',
                metricKind: 'GAUGE',
                valueType: 'INT64',
                unit: '{Request}',
                labels: [
                        {
                        key: 'target_language',
                        valueType: 'STRING',
                        description: 'Target Language of ßthis translation request.',
                        },
                    ],
                },
            };
          ß
        }catch(ex){
            console.log(`Exception: ${ex}`);
        }
    }
    async targetLanguage(target_language){
        // Imports the Google Cloud client library
        const monitoring = require('@google-cloud/monitoring');

        // Creates a client
        const client = new monitoring.MetricServiceClient();
        
        const dataPoint = {
                interval: {
                    endTime: {
                        seconds: Date.now() / 1000,
                    },
                },
                value: {
                    int64Value: 1,
                    doubleValue: 1
                },
            };
          
          const timeSeriesData = {
            metric: {
              type: 'custom.googleapis.com/translation/target_language',
              labels: {
                target_language: target_language,
              },
            },
            resource: {
              type: 'global',
              labels: {
                project_id: this.projectId,
              },
            },
            points: [dataPoint],
          };
          
          const request = {
            name: client.projectPath(this.projectId),
            timeSeries: [timeSeriesData],
          };
          
          // Writes time series data
          try
          {
            const result = await client.createTimeSeries(request);
            console.log(`Done writing time series data.`, result);
          }catch(ex){
            //  To address this error : 3 INVALID_ARGUMENT: One or more TimeSeries could not be written: One or more points were written more frequently th
            //                          an the maximum sampling period configured for the metric. {Metric: custom.googleapis.com/translation/target_language
            console.log(`error ingesting metric: ${ex}`);
          }
    }
}
module.exports = MetricsManager;
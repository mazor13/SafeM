terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project
  region  = var.region
}

# 1. Log Metric (זה כבר נוצר בהצלחה, אבל נשאיר את זה כאן)
resource "google_logging_metric" "kms_sign_errors" {
  name        = "kms_sign_errors"
  description = "Counts KMS/signature verification errors from functions"
  filter      = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=(\"generatePdfReport\" OR \"verifySignatureEndpoint\") AND severity>=ERROR AND (textPayload:\"KMS\" OR textPayload:\"sign\" OR textPayload:\"signature\")"
  metric_descriptor {
    metric_kind = "DELTA"
    value_type  = "INT64"
  }
}

# 2. Alert Policy (תיקון: הוספת resource.type לפילטר)
resource "google_monitoring_alert_policy" "kms_error_policy" {
  display_name = "KMS sign/verification errors"
  combiner = "OR"
  notification_channels = [] 

  conditions {
    display_name = "KMS errors rate"
    condition_threshold {
      # כאן התיקון הגדול - הוספנו את ה-Cloud Run Revision
      filter = "metric.type=\"logging.googleapis.com/user/kms_sign_errors\" AND resource.type=\"cloud_run_revision\""
      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_RATE"
      }
      comparison = "COMPARISON_GT"
      threshold_value = 0.05
      duration = "300s"
      trigger {
        count = 1
      }
    }
  }
}

# 3. Uptime Check (זה עבד בפעם הקודמת, משאירים אותו תקין)
resource "google_monitoring_uptime_check_config" "verify_endpoint" {
  display_name = "verifySignatureEndpoint uptime"
  timeout      = "10s"
  period       = "300s"

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project
      host       = "us-central1-ozen-staging-2025.cloudfunctions.net"
    }
  }

  http_check {
    path = "/verifySignatureEndpoint?docId=${var.smoke_doc_id}"
    port = 443
    use_ssl = true
  }

  project = var.project
}

# 4. Dashboard (תיקון: הוספת שם המטריקה לפילטר)
resource "google_monitoring_dashboard" "basic" {
  dashboard_json = <<JSON
{
  "displayName": "OZEN Functions Overview",
  "gridLayout": {
    "columns": 2,
    "widgets": [
      {
        "title": "KMS Verification Errors",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"logging.googleapis.com/user/kms_sign_errors\" AND resource.type=\"cloud_run_revision\"",
                  "aggregation": {
                    "perSeriesAligner": "ALIGN_RATE",
                    "crossSeriesReducer": "REDUCE_SUM",
                    "alignmentPeriod": "60s"
                  }
                }
              }
            }
          ]
        }
      }
    ]
  }
}
JSON
}

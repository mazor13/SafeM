variable "project" {
  type = string
}

variable "region" {
  type = string
  default = "us-central1"
}

variable "smoke_doc_id" {
  type = string
  description = "Document ID to use for uptime checks"
}

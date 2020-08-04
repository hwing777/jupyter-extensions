# Lint as: python3
"""Request handler classes for the extensions."""

import re
import json
import base64
import math
import datetime
from google.cloud import bigquery
from google.cloud.datacatalog import DataCatalogClient, enums, types

SCOPE = ("https://www.googleapis.com/auth/cloud-platform",)


class BigQueryService:
  """Provides an authenticated BigQuery Client and project info"""

  _instance = None

  def __init__(self,
               client=bigquery.Client(),
               datacatalog_client=DataCatalogClient()):
    self._client = client
    self._datacatalog_client = datacatalog_client

  @property
  def client(self):
    return self._client

  @classmethod
  def get(cls):
    if not cls._instance:
      cls._instance = BigQueryService()
    return cls._instance

  def list_projects(self):
    project = self._client.project
    projects_list = {
      format(project): {
        'id': format(project),
        'name': format(project),
      }
    }
    project_ids = [format(project)]
    return {'projects': projects_list, 'projectIds': project_ids}

  def list_datasets(self, project):
    datasets = list(self._client.list_datasets(project))

    datasets_list = {}
    dataset_ids = []
    for dataset in datasets:
      dataset_full_id = '{}.{}'.format(dataset.project, dataset.dataset_id)
      datasets_list[dataset_full_id] = {
          'id': dataset_full_id,
          'name': dataset.dataset_id,
          'projectId': format(dataset.project),
      }
      dataset_ids.append(dataset_full_id)

    return {'datasets': datasets_list, 'datasetIds': dataset_ids}

  def list_tables(self, dataset_id):
    dataset = self._client.get_dataset(dataset_id)
    tables = list(self._client.list_tables(dataset))

    tables_list = {}
    table_ids = []
    for table in tables:
      table_full_id = '{}.{}.{}'.format(table.project, table.dataset_id, table.table_id)
      tables_list[table_full_id] = {
        'id': table_full_id,
        'name': table.table_id,
        'datasetId': dataset_id,
        'type': table.table_type,
      }
      table_ids.append(table_full_id)

    return {'tables': tables_list, 'tableIds': table_ids}

  def list_models(self, dataset_id):
    dataset = self._client.get_dataset(dataset_id)
    models = list(self._client.list_models(dataset))

    models_list = {}
    model_ids = []
    for model in models:
      model_full_id = '{}.{}.{}'.format(model.project, model.dataset_id, model.model_id)
      models_list[model_full_id] = {
        'id': model_full_id,
        'name': model.model_id,
        'datasetId': dataset_id,
      }
      model_ids.append(model_full_id)

    return {'models': models_list, 'modelIds': model_ids}

  def list_jobs(self, project):
    jobs = list(self._client.list_jobs(project))

    jobs_list = {}
    job_ids = []
    for job in jobs:
      print(job.job_type)
      print(job.query)
      job_full_id = '{}:{}'.format(job.project, job.job_id)
      jobs_list[job_full_id] = {
          'id': job_full_id,
      }
      job_ids.append(job_full_id)

    # return {'jobs': jobs_list, 'jobIds': job_ids}

  def search_projects(self, search_key, project_id):
    scope = types.SearchCatalogRequest.Scope()
    scope.include_project_ids.append(project_id)
    results = self._datacatalog_client.search_catalog(
        scope=scope,
        query='name:{} projectid:{}'.format(search_key, project_id))

    fetched_results = []
    for result in results:
      resource = result.linked_resource
      result_type = format(result.search_result_subtype)
      if result_type == 'entry.dataset':
        res = re.search('datasets/(.*)', resource)
        dataset = res.group(1)
        fetched_results.append({
            'type': 'dataset',
            'parent': project_id,
            'name': dataset,
            'id': '{}.{}'.format(project_id, dataset)
        })
      elif result_type == 'entry.table':
        res = re.search('datasets/(.*)/tables/(.*)', resource)
        dataset = res.group(1)
        table = res.group(2)
        fetched_results.append({
            'type': 'table',
            'parent': dataset,
            'name': table,
            'id': '{}.{}.{}'.format(project_id, dataset, table)
        })
      elif result_type == 'entry.table.view':
        res = re.search('datasets/(.*)/tables/(.*)', resource)
        dataset = res.group(1)
        view = res.group(2)
        fetched_results.append({
            'type': 'view',
            'parent': dataset,
            'name': view,
            'id': '{}.{}.{}'.format(project_id, dataset, view)
        })
      elif result_type == 'entry.model':
        res = re.search('datasets/(.*)/models/(.*)', resource)
        dataset = res.group(1)
        model = res.group(2)
        fetched_results.append({
            'type': 'model',
            'parent': dataset,
            'name': model,
            'id': '{}.{}.{}'.format(project_id, dataset, model)
        })

    return {'results': fetched_results}

  def create_custom_client(self, project_id):
    return bigquery.Client(project=project_id)

  def get_project(self, custom_client):
    project = custom_client.project
    formatted_project = {
        'id': format(project),
        'name': format(project),
    }
    return formatted_project

  def format_value(self, value):
    if value is None:
      return None
    elif isinstance(value, bytes):
      return base64.b64encode(value).__str__()[2:-1]
    elif isinstance(value, float):
      if value == float('inf'):
        return 'Infinity'
      elif value == float('-inf'):
        return '-Infinity'
      elif math.isnan(value):
        return 'NaN'
      else:
        return value
    elif isinstance(value, datetime.datetime):
      return json.dumps(value.strftime('%b %e, %G, %l:%M:%S %p'))[1:-1]
    else:
      return value.__str__()

  def get_table(self, tableRef):
    try:
      tableId = self._client.get_table(tableRef).id
      return tableId
    except:
      return 'Expired temporary table'

  def list_jobs(self, project):
    jobs = list(self._client.list_jobs(project))

    jobs_list = {}
    job_ids = []
    for job in jobs:
      if job.job_type != 'query':
        continue
      jobs_list[job.job_id] = {
          'query': job.query,
          'id': job.job_id,
          'created': self.format_value(job.created),
      }
      job_ids.append(job.job_id)

    return {'jobs': jobs_list, 'jobIds': job_ids}

  def get_job_details(self, job_id):
    job = self._client.get_job(job_id)
    job_details = {
        'query': job.query,
        'id': job_id,
        'user': job.user_email,
        'location': job.location,
        'created': self.format_value(job.created),
        'started': self.format_value(job.started),
        'ended': self.format_value(job.ended),
        'duration': job.slot_millis,
        'bytesProcessed': job.estimated_bytes_processed,
        'priority': job.priority,
        'destination': self.get_table(job.destination),
        'useLegacySql': job.use_legacy_sql,
        'state': job.state,
        'errors': job.errors,
        'errorResult': job.error_result
    }

    return job_details

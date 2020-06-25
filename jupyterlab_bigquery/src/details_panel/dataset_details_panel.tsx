import * as React from 'react';

import { DatasetDetailsService } from './service/list_dataset_details';
import LoadingPanel from '../loading_panel';
import { DetailsPanel } from './details_panel';

interface Props {
  datasetDetailsService: DatasetDetailsService;
  isVisible: boolean;
  dataset_id: string;
}

interface State {
  hasLoaded: boolean;
  isLoading: boolean;
  // TODO(cxjia): type these details
  details: any;
  rows: any[];
}

export default class DatasetDetailsPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasLoaded: false,
      isLoading: true,
      details: { details: {} },
      rows: [],
    };
  }

  async componentDidMount() {
    try {
      // empty
    } catch (err) {
      console.warn('Unexpected error', err);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const isFirstLoad =
      !(this.state.hasLoaded || prevProps.isVisible) && this.props.isVisible;
    if (isFirstLoad) {
      this.getDetails();
    }
  }

  private async getDetails() {
    try {
      this.setState({ isLoading: true });
      const detailsResult = await this.props.datasetDetailsService.listDatasetDetails(
        this.props.dataset_id
      );

      const details = detailsResult.details;
      const rows = [
        { name: 'Dataset ID', value: details.id },
        { name: 'Created', value: details.date_created },
        {
          name: 'Default table expiration',
          value: details.default_expiration
            ? details.default_expiration
            : 'Never',
        },
        { name: 'Last modified', value: details.last_modified },
        {
          name: 'Data location',
          value: details.location ? details.location : 'None',
        },
      ];

      this.setState({ hasLoaded: true, details, rows });
    } catch (err) {
      console.warn('Error retrieving dataset details', err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingPanel />;
    } else {
      return (
        <DetailsPanel
          details={this.state.details}
          rows={this.state.rows}
          type="dataset"
        />
      );
    }
  }
}

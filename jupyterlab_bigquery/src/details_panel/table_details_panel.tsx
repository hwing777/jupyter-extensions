import * as React from 'react';

import { TableDetailsService } from './service/list_table_details';
import LoadingPanel from '../loading_panel';
import { DetailsPanel } from './details_panel';

interface Props {
  tableDetailsService: TableDetailsService;
  isVisible: boolean;
  table_id: string;
}

interface State {
  hasLoaded: boolean;
  isLoading: boolean;
  // TODO(cxjia): type these details
  details: any;
  rows: any[];
}

export default class TableDetailsPanel extends React.Component<Props, State> {
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
      const detailsResult = await this.props.tableDetailsService.listTableDetails(
        this.props.table_id
      );

      let details = detailsResult.details;
      const rows = [
        { name: 'Table ID', value: details.id },
        { name: 'Table size', value: `${details.num_bytes} Bytes` },
        { name: 'Number of rows', value: details.num_rows },
        { name: 'Created', value: details.date_created },
        {
          name: 'Table expiration',
          value: details.expires ? details.expires : 'Never',
        },
        { name: 'Last modified', value: details.last_modified },
        {
          name: 'Data location',
          value: details.location ? details.location : 'None',
        },
      ];

      this.setState({ hasLoaded: true, details, rows });
    } catch (err) {
      console.warn('Error retrieving table details', err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingPanel />;
    } else {
      return (
        <div>
          <DetailsPanel details={this.state.details} rows={this.state.rows} />
          <div>
            <b>Schema: </b>
            {this.state.details.schema
              ? this.state.details.schema.map((value, index) => {
                  return (
                    <div key={index}>
                      {value.name}: {value.type}
                    </div>
                  );
                })
              : 'None'}
          </div>
        </div>
      );
    }
  }
}

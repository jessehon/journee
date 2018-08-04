import React, {Component} from 'react';
import Eos from 'eosjs'; // https://github.com/EOSIO/eosjs
// material-ui dependencies
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MyMap from '../components/MyMap';
import QrModalWrapped from '../components/QrModalWrapped';
import UploadModalWrapped from '../components/UploadModalWrapped';
import TreeRowCard from '../components/TreeRowCard';
import * as _ from 'lodash';
import {Timeline, TimelineEvent} from 'react-event-timeline';
import SnackbarContent from '@material-ui/core/SnackbarContent';

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 20,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0.
  },
});

const ENDPOINT = 'http://172.16.96.83:8888';

const sortTreeTable = (treeTable) => {
  return _.sortBy(treeTable, (row) => {
    const data = JSON.parse(row.message);
    return data.index;
  });
}

// Index component
class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTreeRowId: null,
      treeTable: null, // to store the table rows from smart contract
      qrModalOpen: false,
      uploadModalOpen: false,
      loading: false,
    };

    this.search = this.search.bind(this);
    this.renderCtas = this.renderCtas.bind(this);
    this.renderWhenEmpty = this.renderWhenEmpty.bind(this);
    this.renderWhenMissing = this.renderWhenMissing.bind(this);
  }

  handleTreeRowClick = (row) => {
    this.setState({ activeTreeRowId: row.prim_key });
  }

  handleQrModalOpen = () => {
      this.setState({ qrModalOpen: true });
  };

  handleQrModalClose = code => {
      if (code !== null) {
          alert(code);
      }
      this.setState({ qrModalOpen: false });
  };

  handleUploadModalOpen = () => {
      this.setState({ uploadModalOpen: true });
  };

  handleUploadModalClose = dna => {
      if (dna !== undefined && dna !== null) {
          this.search({dna});
      }
      this.setState({ uploadModalOpen: false });
  };

  // gets table data from the blockchain
  // and saves it into the component state: "treeTable"
  async search(query = {}) {
    this.setState({ loading: true, activeTreeRowId: null });

    const result = await Eos({httpEndpoint: ENDPOINT})
        .getTableRows({
            "json": true,
            "code": "treechainacc",   // contract who owns the table
            "scope": "treechainacc",  // scope of the table
            "table": "treestruct",    // name of the table as specified by the contract abi
            "limit": 100,
        });
    const rows = _.filter(result.rows, query);
    const treeTable = sortTreeTable(rows);

    this.setState({
      treeTable,
      activeTreeRowId: _.get(_.first(treeTable), 'prim_key'),
      loading: false
    });
  }

  getActiveTreeRow = () => {
    if (!_.isNumber(this.state.activeTreeRowId) || _.isEmpty(this.state.treeTable)) {
      return null;
    }

    return _.find(this.state.treeTable, { prim_key: this.state.activeTreeRowId });
  }

  getViewport = () => {
    const activeTreeRow = this.getActiveTreeRow();

    if (!activeTreeRow) {
      return {
        width: 400,
        height: 400,
        latitude: 151.1956613,
        longitude: -33.8726628,
        zoom: 8
      };
    }

    const activeTreeRowData = JSON.parse(activeTreeRow.message);
    return {
      width: 400,
      height: 400,
      latitude: activeTreeRowData.lat,
      longitude: activeTreeRowData.lng,
      zoom: 8
    };
  }

  renderCtas() {
    return (
      <div style={{padding:20}}>
          <Grid container>
              <Grid item xs={5}>
                  <Button
                      variant="contained"
                      color="primary"
                      className={this.props.classes.formButton}
                      type="submit"
                      style={{display:'block'}}
                      onClick={this.handleQrModalOpen}>
                      Scan Code
                  </Button>
              </Grid>
              <Grid item xs={2} style={{textAlign: 'center', paddingTop: 15}}>or</Grid>
              <Grid item xs={5}>
                  <Button
                      variant="contained"
                      color="primary"
                      className={this.props.classes.formButton}
                      type="submit"
                      style={{display:'block'}}
                      onClick={this.handleUploadModalOpen}>
                      Upload DNA
                  </Button>
              </Grid>
          </Grid>
      </div>
    )
  }

  renderWhenEmpty() {
    return (
      <SnackbarContent
        className={ this.props.classes.margin }
        message="DNA not found"
        style={{ marginLeft: 20 }}
      />
    );
  }

  renderWhenMissing() {
    return (
      <div style={{ marginLeft: 20 }}>
          <img style={{ margin: "20px", width:"100px" }} src="/img/oak.png" />
          <p>Source: Argentinian Redwood</p>
          <p>Sustainability factor: Argentinian Redwood</p>
          <p>Grower: EOS Forestry Pty Ltd</p>
          <p>Auditor: Forest Green</p>
      </div>
    );
  }

  render() {
    const { treeTable } = this.state
    const { classes } = this.props;

    const viewport = this.getViewport();

    return (
      <div style={{height: '100%'}}>
          <QrModalWrapped
              open={this.state.qrModalOpen}
              onClose={this.handleQrModalClose}
              classes={classes}
          />
          <UploadModalWrapped
              open={this.state.uploadModalOpen}
              onClose={this.handleUploadModalClose}
              classes={classes}
          />
        <AppBar position="fixed" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
             Journee
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container style={{height: '100%'}}>
            <Grid item xs={12} sm={8} style={{height: '100%'}}>
                <MyMap
                  treeTable={treeTable || []}
                  viewport={viewport}
                />
            </Grid>
            <Grid item xs={12} sm={4} style={{height: '100%', overflow: 'auto', paddingTop: 64}}>
                {/** Actions */}
                {this.renderCtas()}

                {!treeTable && (
                  this.renderWhenMissing()
                )}

                {treeTable && treeTable.length == 0 && (
                  this.renderWhenEmpty()
                )}

                {treeTable && treeTable.length > 0 && (
                  <div>
                      {/** First item */}
                      <TreeRowCard
                        onClick={() => this.handleTreeRowClick(treeTable[0])}
                        classes={classes}
                        treeRow={treeTable[0]}
                      />

                      {/** Body items */}
                      <Timeline style={{marginTop: -20}}>
                          {
                            _.map(_.slice(treeTable, 1, -1), (row, k) => (
                              <TimelineEvent
                                  key={k}
                                  onClick={() => this.handleTreeRowClick(row)}
                                  style={{fontSize: '12px'}}
                                  className="MuiTypography-body1-55 MuiTypography-colorTextSecondary-68"
                                  title={row.dna}
                                  createdAt={new Date(row.timestamp*1000).toString()}
                                  icon={<i className="material-icons md-18">textsms</i>}>
                                <Typography>{row.message}</Typography>
                              </TimelineEvent>
                            ))
                          }
                      </Timeline>

                      {/** Last item */}
                      {
                        treeTable.length >= 2 && (
                          <TreeRowCard
                            onClick={() => this.handleTreeRowClick(treeTable[treeTable.length - 1])}
                            classes={classes}
                            treeRow={treeTable[treeTable.length - 1]}
                          />
                        )
                      }
                  </div>
                )}
            </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Index);

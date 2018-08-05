import React, {Component} from 'react';
import Eos from 'eosjs'; // https://github.com/EOSIO/eosjs
// material-ui dependencies
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MyMap from '../components/MyMap';
import QrModalWrapped from '../components/QrModalWrapped';
import UploadModalWrapped from '../components/UploadModalWrapped';
import HomeModalWrapped from '../components/HomeModalWrapped';
import TreeTitleCard from '../components/TreeTitleCard';
import TreeRowCard from '../components/TreeRowCard';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Timeline, TimelineEvent} from 'react-event-timeline';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Collapse from '@material-ui/core/Collapse';

const profiles = require('../data/profiles.json');

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
      homeModalOpen: true,
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
      if (!_.isEmpty(dna)) {
          this.search({
            dna: _.truncate(dna, {length: 11, omission: ''})
          });
      }
      this.setState({ uploadModalOpen: false });
  };


    handleHomeModalOpen = () => {
        this.setState({ homeModalOpen: true });
    };

    handleHomeModalClose = () => {
        this.setState({homeModalOpen: false});
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

  findTreeProfileByDna = (dna) => {
    return _.find(profiles.tree_profiles, { dna });
  }

  findSupplierProfileByName = (name) => {
    return _.find(profiles.supplier_profiles, { name });
  }

  getViewport = () => {
    const activeTreeRow = this.getActiveTreeRow();

    if (!activeTreeRow) {
      return {
        width: 400,
        height: 400,
        latitude: 151.1956613,
        longitude: -33.8726628,
        zoom: 0
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
                      size="large"
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
                      size="large"
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

  getRowData = (row) => {
    return JSON.parse(row.message);
  }

  renderWhenMissing() {
    return (
        <div style={{paddingLeft: 20}} className="intro">
            <h4>Things to know</h4>
              <div style={{ marginLeft: 20 }} className="things">
                  <h3><span className="yellow">TRACABILITY</span></h3>
                  <h3>TRANSPARENCY</h3>
                  <h3><span className="blue">TRUSTWORTHY</span></h3>
              </div>
            <h4>Read the map</h4>
            <div style={{textAlign: 'center'}}>
                <h4 className="yellow" style={{display: 'inline-block', margin: '0 15px'}}>Legal Logging</h4>
                <h4 className="green" style={{display: 'inline-block', margin: '0 15px'}}>Forest Areas</h4>
            </div>
        </div>
    );
  }

  render() {
    const { treeTable } = this.state
    const { classes } = this.props;

    const viewport = this.getViewport();

    return (
      <div style={{height: '100%'}}>
          <HomeModalWrapped
              open={this.state.homeModalOpen}
              onClose={this.handleHomeModalClose}
              classes={classes}
          />
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
              <a href="/"><img src="img/logo.svg" className="logo" /></a>
            <Typography variant="title" color="inherit">Journee</Typography>
            <Typography className="slogan">Trust in timber</Typography>
          </Toolbar>
        </AppBar>
        <Grid container style={{height: '100%'}}>
            <Grid item xs={12} sm={8} style={{height: '100%'}}>
                <MyMap
                  treeTable={treeTable || []}
                  viewport={viewport}
                />
            </Grid>
            <Grid item xs={12} sm={4} style={{height: '100%', overflow: 'auto', paddingTop: 64}} className="sidebar">
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
                      <TreeTitleCard
                        classes={classes}
                        treeProfile={this.findTreeProfileByDna(treeTable[0].dna)}
                      />

                      {/** Body items */}
                      <Timeline
                          style={{marginTop: -20, marginBottom: -20}} lineStyle={{background: "#ffd000", width: 3}}>
                          {
                            _.map(_.slice(treeTable, 0, -1), (row, k) => (
                              <TimelineEvent
                                  key={k}
                                  onClick={() => this.handleTreeRowClick(row)}
                                  style={{fontSize: '12px'}}
                                  className="MuiTypography-body1-55 MuiTypography-colorTextSecondary-68 timeline-item"
                                  title={this.getRowData(row).from_now}
                                  titleStyle={{color: "#4B92E2", paddingTop: 8}}
                                  contentStyle={{ width: 'auto', backgroundColor: "#04394c", color: "#fff", borderRadius: 5, boxShadow: '0 2px 4px 0 rgba(0,0,0,0.5)', cursor: 'pointer'}}
                                  bubbleStyle={{backgroundColor: "#ffd000", borderColor: '#ffd000'}}
                                  icon={<i className="material-icons md-18" style={{color: '#ffd000'}}>textsms</i>}>
                                  <Collapse in={this.state.activeTreeRowId === row.prim_key} collapsedHeight="40px">
                                      <Typography className="status">{this.getRowData(row).description}</Typography>
                                      <Typography className="location">{this.getRowData(row).location_name}</Typography>
                                      <div style={{marginTop: 15}}>
                                          <img src={this.findSupplierProfileByName(row.user).image_url} width={175} style={{float: 'left', marginRight: '1em', marginBottom: '0.5em'}}/>
                                          <div>
                                            <Typography component="p">
                                                Supplier: <br />{this.findSupplierProfileByName(row.user).title}<br />
                                            </Typography>
                                            <br />
                                            <Typography component="p">
                                                {this.findSupplierProfileByName(row.user).description}<br />
                                            </Typography>
                                          </div>
                                      </div>
                                  </Collapse>
                              </TimelineEvent>
                            ))
                          }
                      </Timeline>

                      {/** Last item */}
                      {
                        treeTable.length >= 2 && (
                          <TreeRowCard
                            title={`Destination`}
                            onClick={() => this.handleTreeRowClick(treeTable[treeTable.length - 1])}
                            activeTreeRowId={this.state.activeTreeRowId}
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

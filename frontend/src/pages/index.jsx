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
  }

  handleTreeRowClick = (row) => {
    debugger;
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
    this.setState({ loading: true });

    const result = await Eos({httpEndpoint: ENDPOINT})
        .getTableRows({
            "json": true,
            "code": "treechainacc",   // contract who owns the table
            "scope": "treechainacc",  // scope of the table
            "table": "treestruct",    // name of the table as specified by the contract abi
            "limit": 100,
        });
    const rows = _.filter(result.rows, query);

    this.setState({
      treeTable: rows,
      activeTreeRowId: _.get(_.first(rows), 'id'),
      loading: false
    });
  }


  render() {
    const treeTable = this.state.treeTable
      ? sortTreeTable(this.state.treeTable)
      : null;
    const { classes } = this.props;

    let viewport = {
      width: 400,
      height: 400,
      latitude: 151.1956613,
      longitude: -33.8726628,
      zoom: 8
    };

    if (treeTable) {
      const activeTreeRow = _.find(treeTable, { id: this.state.activeTreeRowId });
      if (activeTreeRow) {
        const activeTreeRowData = JSON.parse(activeTreeRow.message);
        viewport = _.merge({}, viewport, {
          latitude: activeTreeRowData.lat,
          longitude: activeTreeRowData.lng,
        })
      }
    }

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
                <div style={{padding:20}}>
                    <Grid container>
                        <Grid item xs={5}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.formButton}
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
                                className={classes.formButton}
                                type="submit"
                                style={{display:'block'}}
                                onClick={this.handleUploadModalOpen}>
                                Upload DNA
                            </Button>
                        </Grid>
                    </Grid>
                </div>

                {treeTable && treeTable.length > 0 && (
                  <div>
                      <Card className={classes.card}>
                          <CardContent>
                              <Typography variant="headline" component="h2">
                                  {treeTable[0].user}
                              </Typography>
                              <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
                                  {new Date(treeTable[0].timestamp*1000).toString()}
                              </Typography>
                              <Typography component="pre">
                                  {treeTable[0].dna}
                              </Typography>
                              <Typography component="pre">
                                  {treeTable[0].message}
                              </Typography>
                          </CardContent>
                      </Card>
                      <Timeline style={{marginTop: -20}}>
                          {treeTable.map((row, k)=> (
                              <TimelineEvent
                                  key={k}
                                  onClick={() => this.handleTreeRowClick(row)}
                                  style={{fontSize: '12px'}}
                                  className="MuiTypography-body1-55 MuiTypography-colorTextSecondary-68"
                                  title={row.dna}
                                  createdAt={new Date(row.timestamp*1000).toString()}
                                  icon={<i className="material-icons md-18">textsms</i>}>
                              <Typography>{row.message}</Typography>
                          </TimelineEvent>))}
                      </Timeline>
                  </div>
                )}

                {!treeTable && (
                  <div style={{marginLeft:20}}>
                      <img style={{ margin: "20px", width:"100px" }} src="/img/oak.png"/>
                      <p>Source: Argentinian Redwood</p>
                      <p>Sustainability factor: Argentinian Redwood</p>
                      <p>Grower: EOS Forestry Pty Ltd</p>
                      <p>Auditor: Forest Green</p>
                  </div>
                )}

                {treeTable && treeTable.length == 0 && (
                  <SnackbarContent className={classes.margin} message="DNA not found" style={{marginLeft:20}}/>
                )}
            </Grid>
        </Grid>
      </div>
    );
  }

}

/*

        {treeCards}
        <Paper className={classes.paper}>
          <form onSubmit={this.handleFormEvent}>
            <TextField
              name="account"
              autoComplete="off"
              label="Account"
              margin="normal"
              fullWidth
            />
            <TextField
              name="privateKey"
              autoComplete="off"
              label="Private key"
              margin="normal"
              fullWidth
            />
            <TextField
              name="dna"
              autoComplete="off"
              label="DNA"
              margin="normal"
              fullWidth
            />
            <TextField
              name="message"
              autoComplete="off"
              label="Message (Optional)"
              margin="normal"
              multiline
              rows="10"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.formButton}
              type="submit">
              Add tree
            </Button>
          </form>
        </Paper>
        <pre className={classes.pre}>
          Below is a list of pre-created accounts information for add/update tree:
          <br/><br/>
          accounts = { JSON.stringify(accounts, null, 2) }
        </pre>
 */

export default withStyles(styles)(Index);

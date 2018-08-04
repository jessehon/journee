import React, { Component } from 'react';
import Eos from 'eosjs'; // https://github.com/EOSIO/eosjs

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MyMap from '../components/MyMap';
import QrModalWrapped from '../components/QrModalWrapped';
import * as _ from 'lodash';

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

// Index component
class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeTable: [], // to store the table rows from smart contract
      qrModalOpen: false,
      loading: false,
    };
    this.handleSearch = this.handleSearch.bind(this);
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

    this.setState({ treeTable: rows, loading: false });
  }

  async handleSearch(event) {
    event.preventDefault();

    const dna = event.target.dna.value;
    this.search({ dna });
  }

  getTable() {
    this.search();
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    const { treeTable } = this.state;
    const { classes } = this.props;

    // generate each tree as a card
    const generateCard = (key, timestamp, user, dna, message) => (
      <Card className={classes.card} key={key}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {user}
          </Typography>
          <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
            {new Date(timestamp*1000).toString()}
          </Typography>
          <Typography component="pre">
            {dna}
          </Typography>
          <Typography component="pre">
            {message}
          </Typography>
        </CardContent>
      </Card>
    );
    let treeCards = treeTable.map((row, i) =>
      generateCard(i, row.timestamp, row.user, row.dna, row.message));

    return (
      <div style={{height: '100%'}}>
          <QrModalWrapped
              open={this.state.qrModalOpen}
              onClose={this.handleQrModalClose}
              classes={classes}
          />
        <AppBar position="fixed" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
             Journee 
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container style={{height: '100%', marginTop: '64px'}}>
            <Grid item xs={12} sm={8} style={{height: '100%'}}>
                <MyMap
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.formButton}
                    type="submit"
                    onClick={this.handleQrModalOpen}>
                    Scan Code
                </Button>
              <Paper className={classes.paper}>
                <form onSubmit={this.handleSearch}>
                  <TextField
                      name="dna"
                      autoComplete="off"
                      label="DNA"
                      margin="normal"
                      fullWidth
                  />
                  <Button
                      variant="contained"
                      color="primary"
                      className={classes.formButton}
                      type="submit">
                      Search
                  </Button>
                </form>
              </Paper>
              {treeCards}
      <div>
        <img style={{ margin: "20px", width:"100px" }} src="/img/oak.png"/>
        <p>Source: Argentinian Redwood</p>
        <p>Sustainability factor: Argentinian Redwood</p>
        <p>Grower: EOS Forestry Pty Ltd</p>
        <p>Auditor: Forest Green</p>
      </div>
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

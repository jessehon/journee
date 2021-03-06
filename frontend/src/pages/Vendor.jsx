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
import * as _ from 'lodash';

// NEVER store private keys in any source code in your real life development
// This is for demo purposes only!
const accounts = [
  {"name":"useraaaaaaaa", "privateKey":"5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5", "publicKey":"EOS6kYgMTCh1iqpq9XGNQbEi8Q6k5GujefN9DSs55dcjVyFAq7B6b"},
  {"name":"useraaaaaaab", "privateKey":"5KLqT1UFxVnKRWkjvhFur4sECrPhciuUqsYRihc1p9rxhXQMZBg", "publicKey":"EOS78RuuHNgtmDv9jwAzhxZ9LmC6F295snyQ9eUDQ5YtVHJ1udE6p"},
  {"name":"useraaaaaaac", "privateKey":"5K2jun7wohStgiCDSDYjk3eteRH1KaxUQsZTEmTGPH4GS9vVFb7", "publicKey":"EOS5yd9aufDv7MqMquGcQdD6Bfmv6umqSuh9ru3kheDBqbi6vtJ58"},
  {"name":"useraaaaaaad", "privateKey":"5KNm1BgaopP9n5NqJDo9rbr49zJFWJTMJheLoLM5b7gjdhqAwCx", "publicKey":"EOS8LoJJUU3dhiFyJ5HmsMiAuNLGc6HMkxF4Etx6pxLRG7FU89x6X"},
  {"name":"useraaaaaaae", "privateKey":"5KE2UNPCZX5QepKcLpLXVCLdAw7dBfJFJnuCHhXUf61hPRMtUZg", "publicKey":"EOS7XPiPuL3jbgpfS3FFmjtXK62Th9n2WZdvJb6XLygAghfx1W7Nb"},
  {"name":"useraaaaaaaf", "privateKey":"5KaqYiQzKsXXXxVvrG8Q3ECZdQAj2hNcvCgGEubRvvq7CU3LySK", "publicKey":"EOS5btzHW33f9zbhkwjJTYsoyRzXUNstx1Da9X2nTzk8BQztxoP3H"},
  {"name":"useraaaaaaag", "privateKey":"5KFyaxQW8L6uXFB6wSgC44EsAbzC7ideyhhQ68tiYfdKQp69xKo", "publicKey":"EOS8Du668rSVDE3KkmhwKkmAyxdBd73B51FKE7SjkKe5YERBULMrw"}
];

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

// Vendor component
class Vendor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeTable: [], // to store the table rows from smart contract
      loading: false,
    };

    this.seed = this.seed.bind(this);
    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

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

  async seed() {
    const trees = require('../fixtures/trees.json');

    return await Promise.all(
      _.map(trees, tree => {
        return this.insertRow(tree.name, tree.private_key, tree.dna, tree.message);
      })
    );
  }

  async insertRow(account, privateKey, dna, message) {
    // define actionName and action according to event type
    const actionName = "insert";
    const actionData = {
      _user: account,
      _dna: dna,
      _message: message,
    };

    // eosjs function call: connect to the blockchain
    const eos = Eos({
        httpEndpoint: ENDPOINT,
        keyProvider: privateKey
    });
    return await eos.transaction({
      actions: [{
        account: "treechainacc",
        name: actionName,
        authorization: [{
          actor: account,
          permission: 'active',
        }],
        data: actionData,
      }],
    });
  }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    let account = event.target.account.value;
    let privateKey = event.target.privateKey.value;
    let dna = event.target.dna.value;
    let message = event.target.message.value;

    const result = await this.insertRow(account, privateKey, dna, message);

    console.log(result);
    this.getTable();
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
    const generateCard = (key, timestamp, id, user, dna, message) => (
      <Card className={classes.card} key={key}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {user}
          </Typography>
          <Typography component="pre">
            {id}
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
      generateCard(i, row.timestamp, row.prim_key, row.user, row.dna, row.message));

    return (
      <div style={{height: '100%'}}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Tree Chain
            </Typography>
          </Toolbar>
        </AppBar>
        {treeCards}
        <Paper className={classes.paper}>
          <Button
            variant="contained"
            color="primary"
            className={classes.formButton}
            onClick={this.seed}
            type="button">
            Seed data
          </Button>

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
      </div>
    );
  }

}

export default withStyles(styles)(Vendor);

import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const TreeRowCard = (props) => {
  const { classes, treeRow, onClick } = props;

  return (
    <Card
      className={classes.card}
      onClick={onClick}
    >
      <CardContent>
          <Typography variant="headline" component="h2">
              {treeRow.user}
          </Typography>
          <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
              {new Date(treeRow.timestamp*1000).toString()}
          </Typography>
          <Typography component="pre">
              {treeRow.dna}
          </Typography>
          <Typography component="pre">
              {treeRow.message}
          </Typography>
      </CardContent>
    </Card>
  );
};

export default TreeRowCard;

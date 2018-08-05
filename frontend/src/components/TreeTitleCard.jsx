import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import CardMedia from "@material-ui/core/es/CardMedia";
import * as _ from 'lodash';

const profiles = require('../data/profiles.json');

const findTreeProfileByDna = (dna) => {
  return _.find(profiles.tree_profiles, { dna });
}

const findSupplierProfileByName = (name) => {
  return _.find(profiles.supplier_profiles, { name });
}

const TreeDestinationCard = (props) => {
  const { classes, treeProfile, title } = props;

  return (
    <Card
      className={classes.card}
    >
        <CardContent>
            <Typography variant="headline" component="h2">
                {title || treeProfile.title}
            </Typography>
            <Typography style={{fontSize: 12}} color="textSecondary" gutterBottom>
                {treeProfile.description}
            </Typography>
            <div style={{marginTop: 15}} className="more">
                <div>
                    <Typography component="p">
                        DNA: ****************
                    </Typography>
                    <Typography component="p">
                        Certificate: {treeProfile.certificate}
                    </Typography>
                    <Typography component="p">
                        Total CO2: {treeProfile.co2_kg}KG
                    </Typography>
                    <Typography component="p">
                        Weight: {treeProfile.weight_kg}KG
                    </Typography>
                </div>
            </div>
        </CardContent>
    </Card>
  );
};

export default TreeDestinationCard;

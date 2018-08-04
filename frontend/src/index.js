import React from 'react';
import ReactDOM from 'react-dom';
import Index from './pages/index';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
    palette: {
        primary1Color: "rgba(0, 200, 83, 0.85)",
        primary2Color: "#00c853",
        primary3Color: "#9e9e9e",
        accent1Color: "#311b92",
        textColor: "rgba(0, 0, 0, 0.75)",
        shadowColor: "rgba(0, 0, 0, 0.4)"
    }
});

ReactDOM.render(<MuiThemeProvider theme={theme}><Index /></MuiThemeProvider>, document.getElementById('root'));

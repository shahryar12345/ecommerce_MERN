import { createMuiTheme } from '@material-ui/core/styles';


module.exports = {
    customTheme: createMuiTheme({
        palette: {
            primary: { main: 'rgb(39,44,48)' },
            secondary: { main: 'rgb(236,239,234)' },
        },
        typography: { useNextVariants: true },
    })
}
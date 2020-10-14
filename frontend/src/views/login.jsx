import React, { useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Container from '@material-ui/core/Container';
import { useDispatch } from 'react-redux'
import { ACTION_TYPE } from '../utils/constants'
import Api from '../Api'


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


export default function Login() {
    const [success, setSuccess] = React.useState(false);
    const [warning, setWarning] = React.useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const classes = useStyles();
    const dispatch = useDispatch();
    async function handleLogin() {
        if (!username || !password) {
            setWarning(true);
            return
        }
        await Api.login({
            username,
            password
        })
        dispatch({
            type: ACTION_TYPE.SAVE_USER_INFO,
            payload: {
                name: 'name'
            }
        })
    }
    return <div className="login" data-testid="login">
        <Container component="main" maxWidth="xs">
            <Snackbar 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={warning} autoHideDuration={3000} onClose={()=>setWarning(false)}
            >
                <Alert onClose={()=>setWarning(false)} severity="warning">
                    User name or password can not empty
                </Alert>
            </Snackbar>
            <Snackbar 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={success} autoHideDuration={3000} onClose={()=>setSuccess(true)}
            >
                <Alert onClose={()=>setSuccess(true)} severity="success">
                    Login success
                </Alert>
            </Snackbar>
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <FormControl className={classes.form} noValidate>
                    <TextField
                        value={username}
                        onChange={e=>setUsername(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="username"
                        label="User Name"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleLogin}
                    >
                        Sign In
                    </Button>
                </FormControl>
            </div>
        </Container>
    </div>
}
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import CSS from "csstype";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Stack,
  Input,
  Button,
  useToast,
  FormLabel,
  FormControl,
  Avatar,
} from "@chakra-ui/react";
import useRequest from "../hooks/useRequest";
import { ACTION_TYPE } from "../constants";
import Api from "../Api";

const style: { [key: string]: CSS.Properties } = {
  container: {
    width: "100%",
    textAlign: "center",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  Wrapper: {
    maxWidth: "400px",
    width: "90vw",
    margin: "0 auto",
    position: "relative",
  },
  Title: {
    fontSize: "revert",
    fontWeight: "initial",
  },
  AvatarContainer: {
    left: "31%",
    bottom: "100%",
    textAlign: "center",
  },
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const dispatch = useDispatch();
  const toast = useToast();
  const history = useLocation();
  async function handleLogin() {
    if (!username || !password) {
      toast({
        title: "Warning.",
        description: "Please Input Username & password.",
        status: "error",
        position: "top",
        duration: 1000,
      });
      return;
    }
    dispatch({ type: ACTION_TYPE.FETCH_START });
    const userInfo = await Api.login({
      username,
      password,
    });
    dispatch({ type: ACTION_TYPE.FETCH_SUCCESS });
    if (!userInfo) return;
    dispatch({
      type: ACTION_TYPE.SAVE_USER_INFO,
      payload: {
        trigger: Math.random(),
      },
    });
  }
  const navigate = useNavigate();
  function handleRegister() {
    return navigate("/register");
  }
  const { run, loading } = useRequest<string>();

  async function handleInputUsername(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    setUsername(input);
    const userImage = await run<string>({
      url: "/userImage",
      method: "get",
      data: { input },
    });
    setImageUrl(userImage);
  }
  return (
    <div style={style.container} data-testid="login">
      <div style={style.Wrapper}>
        <div style={style.AvatarContainer}>
          <Avatar size="xl" name="?" src={imageUrl} />
        </div>
        <h1 style={style.Title}>Login</h1>
        <FormControl id="username" isRequired>
          <FormLabel>User Name</FormLabel>
          <Input
            type="text"
            autoComplete="true"
            autoFocus
            value={username}
            onChange={handleInputUsername}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            autoComplete="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl id="button">
          <FormLabel></FormLabel>
          <Stack spacing={2} direction="row" align="center">
            <Button onClick={handleLogin} colorScheme="green">
              Login
            </Button>
            <Button
              onClick={handleRegister}
              colorScheme="green"
              variant="outline"
            >
              Register
            </Button>
          </Stack>
        </FormControl>
      </div>
    </div>
  );
}

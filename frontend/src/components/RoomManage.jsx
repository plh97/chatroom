import React, { useEffect,useRef, useState } from 'react'
import {
    InputGroup,
    InputLeftElement,
    AlertDialog,
    FormControl,
    FormLabel,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    Stack,
    Checkbox,
    CheckboxGroup,
    AlertDialogFooter,
    Divider,
    Input,
    Avatar,
    Button,
    ButtonGroup,
    IconButton,
    useToast,
} from "@chakra-ui/react"
import { SearchIcon, AddIcon } from '@chakra-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import Api from '@/Api'
import './RoomManage.scoped.scss'
import { ACTION_TYPE } from '@/utils/constants'
import { Link } from "react-router-dom";

export default function RoomManage() {
    let userInfo = useSelector(state => state.user)
    const [user, setUser] = useState([])
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false)
    const [searchContent, setSearchContent] = useState('')
    const [selectUser, setSelectUser] = useState([])
    const [roomname, setRoomname] = useState('')
    const dispatch = useDispatch();
    const onClose = () => setIsOpen(false)
    const cancelRef = useRef()
    useEffect(() => {
        if (searchContent.length === 0) return;
        (async () => {
            const data = await Api.queryUser({ username: searchContent })
            setUser(data)
        })()
    }, [searchContent])
    async function handleAddRoom() {
        if (!roomname || !selectUser.length) {
            return toast({
                title: "Warning.",
                description: "Please Input Room Name & Room member.",
                status: "error",
                position: "top",
                duration: 1000,
            })
        }
        await Api.addRoom({
            name: roomname,
            member: selectUser
        })
        setIsOpen(false)
        let newUserInfo = await Api.getUserInfo()
        dispatch({
            type: ACTION_TYPE.SAVE_USER_INFO,
            payload: newUserInfo
        })
    }
    async function handleAddUser(data) {
        if (!data) return;
        await Api.addFriend(data)
        let newUserInfo = await Api.getUserInfo()
        dispatch({
            type: ACTION_TYPE.SAVE_USER_INFO,
            payload: newUserInfo
        })
    }
    return <div
        className="App-RoomManage"
        data-testid="RoomManage"
    >
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={cancelRef}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Cteate Room
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <FormControl id="name" isRequired>
                            <FormLabel>room name</FormLabel>
                            <Input type="text" autoComplete="true" autoFocus value={roomname} onChange={e=>setRoomname(e.target.value)} />
                        </FormControl>
                        <FormControl id="name" isRequired>
                            <FormLabel>select member</FormLabel>
                            <CheckboxGroup colorScheme="green" value={selectUser} onChange={e=>setSelectUser(e)}>
                                <Stack spacing={10} direction="row">
                                    {userInfo.friend.map(fri => <Checkbox key={fri._id} value={fri._id}>{fri.username}</Checkbox>)}
                                </Stack>
                            </CheckboxGroup>
                        </FormControl>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="green" onClick={handleAddRoom} ml={3}>
                            Add
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
        <div className="search-bar">
            <InputGroup size="sm">
                <InputLeftElement size="sm">
                    <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input size="sm" value={searchContent} onChange={e => setSearchContent(e.target.value)} placeholder="search room/user" />
            </InputGroup>
            <ButtonGroup className="button" size="sm" isAttached variant="outline">
                <IconButton onClick={e=>setIsOpen(true)} aria-label="Add to friends" icon={<AddIcon />} />
            </ButtonGroup>
        </div>
        {
            searchContent ? 
            <span className="search-result">
                {
                    user.length ? (
                        <>
                            <h4 className="title">User Result</h4>
                            <Divider className="divider" orientation="horizontal" />
                        </>
                    ) : ''
                }
                {user.map(user => <div key={user._id} className="line-user" onClick={e => handleAddUser(user)}>
                    <Avatar className="avatar" name={user.username} src={user.image} />
                    <span className="username">{user.username}</span>
                    <AddIcon className="icon" />
                </div>)}
            </span>
        :
            // room-container
            <div className="search-result">
                {userInfo.room.map(room => (
                    <Link to={`/room/${room._id}`} key={room._id} className="line-user">
                        <Avatar className="avatar" name={room.name} src={room.image} />
                        <span className="username">{room.name}</span>
                    </Link>
                ))}
            </div>
        }
    </div>
}

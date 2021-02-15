import React, { useEffect, useRef, useState } from 'react'
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
    HStack,
    VStack,
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
import { Link } from "react-router-dom";
import { getMyUserInfo } from '@/store/actions/user'
import { drawCombineImage } from '@/utils/draw'
import cs from 'classnames'

export default function RoomManage({ match }) {
    let myUserInfo = useSelector(state => state.user)
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
            image: await drawCombineImage([
                myUserInfo.image,
                ...selectUser.map(userId => myUserInfo.friend.find(fri => fri._id === userId).image)
            ]),
            name: roomname,
            member: selectUser
        })
        setIsOpen(false)
        dispatch(getMyUserInfo())
    }
    async function handleAddUser(user) {
        if (!user) return;
        const data = await Api.addFriend({
            _id: user._id,
            image: await drawCombineImage([user.image, myUserInfo.image]),
            username: `${user.username},${myUserInfo.username}`
        })
        if (data) {
            dispatch(getMyUserInfo())
            setSearchContent('');
        }
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
                            <Input type="text" autoComplete="true" autoFocus value={roomname} onChange={e => setRoomname(e.target.value)} />
                        </FormControl>
                        <FormControl id="name" isRequired>
                            <FormLabel>select member</FormLabel>
                            <CheckboxGroup colorScheme="green" value={selectUser} onChange={e => setSelectUser(e)}>
                                <HStack align="start">
                                    <VStack wrap="flexWrap" spacing={4} align="start">
                                        {myUserInfo.friend.map((fri, i) => i % 3 === 0 ? <Checkbox key={fri._id} value={fri._id}>{fri.username}</Checkbox> : '')}
                                    </VStack>
                                    <VStack wrap="flexWrap" spacing={4} align="start">
                                        {myUserInfo.friend.map((fri, i) => i % 3 === 1 ? <Checkbox key={fri._id} value={fri._id}>{fri.username}</Checkbox> : '')}
                                    </VStack>
                                    <VStack wrap="flexWrap" spacing={4} align="start">
                                        {myUserInfo.friend.map((fri, i) => i % 3 === 2 ? <Checkbox key={fri._id} value={fri._id}>{fri.username}</Checkbox> : '')}
                                    </VStack>
                                </HStack>
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
                <IconButton onClick={e => setIsOpen(true)} aria-label="Add to friends" icon={<AddIcon />} />
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
                        <Avatar className="avatar" name={user.username} src={user.image} borderRadius="5px" />
                        <span className="username">{user.username}</span>
                        <AddIcon className="icon" />
                    </div>)}
                </span>
                :
                // room-container
                <div className="search-result">
                    {myUserInfo.room.map(room => (
                        <Link
                            key={room._id}
                            to={`/room/${room._id}`}
                            className={cs({ active: match?.params?.roomId === room._id }, 'line-room')}
                        >
                            <Avatar className="avatar" name={room.name} src={room.image} borderRadius="5px" />
                            <span className="username">{room.name}</span>
                        </Link>
                    ))}
                </div>
        }
    </div>
}

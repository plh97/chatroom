import React, { useEffect } from 'react'
import {
    InputGroup,
    InputLeftElement,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Divider,
    Input,
    Avatar,
    Button,
    ButtonGroup,
    IconButton,
} from "@chakra-ui/react"
import { SearchIcon, AddIcon } from '@chakra-ui/icons'
import { useSelector } from 'react-redux'
import Api from '@/Api'
import './RoomManage.scoped.scss'

export default function RoomManage() {
    let userInfo = useSelector(state => state.user)
    const [isOpen, setIsOpen] = React.useState(false)
    const [user, setUser] = React.useState([])
    const [username, setUsername] = React.useState('')
    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef()
    useEffect(() => {
        if (username.length === 0) return;
        (async () => {
            const data = await Api.queryUser({ username })
            setUser(data)
        })()
    }, [username])
    async function handleAddRoom() {
        await Api.addRoom({
            name: 'new room'
        })
    }
    async function handleAddUser(data) {
        await Api.addFriend(data)
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
                        Add Room
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <div>
                            room name: <Input />
                        </div>
                        <div>
                            room member: <Input />
                        </div>
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
                <Input size="sm" value={username} onChange={e => setUsername(e.target.value)} placeholder="search room/user" />
            </InputGroup>
            <ButtonGroup className="button" size="sm" isAttached variant="outline">
                <IconButton onClick={() => setIsOpen(true)} aria-label="Add to friends" icon={<AddIcon />} />
            </ButtonGroup>
        </div>
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
        {userInfo.room.map(room => <span key={room._id}>{room.name}</span>)}
    </div>
}

import React from 'react'
import {
    InputGroup,
    InputLeftElement,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Input,
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
    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef()
    async function handleAddRoom() {
        await Api.addRoom({
            name: 'new room'
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
                <Input size="sm" placeholder="search room/user" />
            </InputGroup>
            <ButtonGroup className="button" size="sm" isAttached variant="outline">
                <IconButton onClick={() => setIsOpen(true)} aria-label="Add to friends" icon={<AddIcon />} />
            </ButtonGroup>
            {/* <Button  size="sm" onClick={handleAddRoom}>+ Room</Button> */}
        </div>
        {userInfo.room.map(room => <span key={room._id}>{room.name}</span>)}
    </div>
}

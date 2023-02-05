import { Dispatch } from "@reduxjs/toolkit";
import CSS from "csstype";
import { useDispatch, useSelector } from "react-redux";
import { USER } from "@/interfaces/IUser";
import { RootState } from "@/store/index";
import { addRoomThunk } from "@/store/reducer/room";
import { logoutThunk } from "@/store/reducer/user";
import { ROOM } from "@/interfaces/IRoom";

const style: { [key: string]: CSS.Properties } = {
  sider: {
    backgroundColor: "#212121",
    display: "flex",
    flex: "0 0 300px",
    flexDirection: "column",
  },
  control: {
    display: "flex",
    height: "50px",
    alignItems: "center",
    justifyContent: "center",
  },
  roomList: {
    flex: 1,
    overflowY: "auto",
    padding: "0 0.5rem",
  },
};

export function SidebarComponent() {
  const myUserInfo = useSelector<RootState, Partial<USER>>((state) => {
    return state.user.data;
  });
  const { id = "" } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roomName, setRoomName] = useState("");
  const dispatch = useDispatch<Dispatch<any>>();
  const navigation = useNavigate();
  const toast = useToast();
  async function handleAddRoom() {
    if (!myUserInfo._id) {
      return;
    }
    if (!roomName) {
      toast({
        title: "Warning.",
        description: "Please input room name",
        status: "error",
        position: "top",
        duration: 1000,
      });
      return;
    }
    const { payload } = await dispatch<any>(
      addRoomThunk({
        name: roomName,
        member: [myUserInfo._id ?? ""],
      })
    );
    console.log(payload);
    onClose();
    setRoomName("");
    navigation(`/room/${payload._id}`);
  }
  function handleLogout() {
    dispatch(logoutThunk());
  }
  return (
    <div style={style.sider}>
      <div style={style.control}>
        <Button colorScheme="grey" variant="outline" onClick={onOpen}>
          Add Room
        </Button>
      </div>
      <ul style={style.roomList}>
        {myUserInfo.room?.map((room) => (
          <RoomItemComponent
            active={room._id == id}
            key={room._id}
            data={room}
          />
        ))}
      </ul>
      <div style={style.control}>
        <Button colorScheme="grey" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="roomname">
              <FormLabel>Room Name</FormLabel>
              <Input
                type="text"
                autoComplete="true"
                autoFocus
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddRoom}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

import { Dispatch } from "@reduxjs/toolkit";
import CSS from "csstype";
import { useDispatch, useSelector } from "react-redux";
import { USER } from "@/interfaces/IUser";
import { RootState } from "@/store/index";
import { addRoomThunk, joinRoomThunk } from "@/store/reducer/room";
import { logoutThunk } from "@/store/reducer/user";

const style: { [key: string]: CSS.Properties } = {
  sider: {
    backgroundColor: "#212121",
    flexBasis: "300px",
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
    onClose();
    setRoomName("");
    navigation(`/room/${payload._id}`);
  }
  async function handleJoinDefaultRoom() {
    const { payload } = await dispatch<any>(joinRoomThunk({}));
    if (payload._id) {
      navigation(`/room/${payload._id}`);
    }
  }
  function handleLogout() {
    dispatch(logoutThunk());
  }
  return (
    <div style={style.sider} className="flex flex-col basis-72 flex-0">
      <div className="flex items-center justify-center h-14">
        <Button colorScheme="grey" variant="outline" onClick={onOpen}>
          Add Room
        </Button>
      </div>
      <ul className="flex-1 overflow-y-auto px-2">
        {myUserInfo.room?.map((room) => (
          <RoomItemComponent
            active={room._id == id}
            key={room._id}
            data={room}
          />
        ))}
        {myUserInfo.room?.length === 0 && (
          <p>
            you haven&apos;t joined any room now! Do you want to join a&nbsp;
            <strong
              className="text-blue-600	text-sm	cursor-pointer"
              onClick={handleJoinDefaultRoom}
            >
              LOBBY Room
            </strong>
            ?
          </p>
        )}
      </ul>
      <div className="flex items-center justify-center h-14">
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
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddRoom}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

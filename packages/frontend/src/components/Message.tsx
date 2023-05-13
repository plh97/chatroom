import { MESSAGE } from "@/interfaces/IMessage";
import { USER } from "@/interfaces/IUser";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

interface IProps {
  data: MESSAGE;
}
/**
 * Pure Componennt
 *
 * @export
 * @param {IProps} { data }
 * @return {JSX.Element}
 */
export function MessageComponent({ data }: IProps): JSX.Element {
  const myUserInfo = useSelector<RootState, Partial<USER>>((state) => {
    return state.user.data;
  });
  const isMe = myUserInfo?._id === data.user?._id;
  return (
    <div
      className={classnames("relative flex flex-row items-start mb-2", {
        "flex-row-reverse": isMe,
      })}
    >
      <Avatar name={data.user?.username} src={data.user?.image} />
      <span className="mx-2.5 p-2.5 max-w-[60%] rounded-lg whitespace-pre-wrap bg-gray-800 shadow-md">
        <div className="img">
          {data.images.map((img) => (
            <img key={img} src={img} alt="img" />
          ))}
        </div>
        <span className="text">{data.text}</span>
      </span>
    </div>
  );
}

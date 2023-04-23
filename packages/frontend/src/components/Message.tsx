import { MESSAGE } from "@/interfaces/IMessage";

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
  return (
    <div className="relative flex flex-row items-start mb-2">
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

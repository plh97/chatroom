import { Properties } from "csstype";
import { useCallback } from "react";

import { ROOM } from "@/interfaces/IRoom";

interface IProps {
  data: ROOM;
  active: boolean;
}

const style: { [key: string]: Properties } = {
  container: {
    padding: "4px 8px",
    display: 'flex',
    flexDirection: "row",
    borderRadius: '10px',
    overflow: 'hidden',
  },
  activeContainer: {
    background: 'rgba(255,255,255,0.1)'
  },
  content: {
    marginLeft: '8px',
    display: "inline-flex",
    flexDirection: "column",
    lineHeight: '1em'
  },
  name: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  text: {
    fontWeight: '400',
    fontSize: '12px',
    color: '#999',
    marginTop: '8px',
  },
}

export function RoomItemComponent(props: IProps) {
  const { data } = props
  const text = useCallback(() => {
    try {
      return props.data.message[props.data.message.length - 1].text
    } catch (error) {
      return '-'
    }
  }, [props.data])
  const containerStyle = props.active ? style.activeContainer : {}
  return (
    <li key={data._id}>
      <Link to={"/room/" + data._id} style={{ ...style.container, ...containerStyle }}>
        <Avatar name={data.name} src={data.image} />
        <span style={style.content}>
          <span style={style.name}>
            {data.name}
          </span>
          <span style={style.text}>
            {text()}
          </span>
        </span>
      </Link>
    </li>
  )
}

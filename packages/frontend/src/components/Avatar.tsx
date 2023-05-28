

interface IProps {
  name: string;
  src: string;
}

export const AvatarComponnet = ({ name, src }: IProps) => {
  const c = useMemo(() => {
    return <Avatar name={name} src={src} />
  }, [name, src]);
  return c
} 
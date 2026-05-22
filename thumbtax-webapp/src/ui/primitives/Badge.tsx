type Props = {
  children: React.ReactNode;
};

export function Badge({ children }: Props) {
  return <span>{children}</span>;
}

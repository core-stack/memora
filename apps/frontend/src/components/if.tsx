export type IfProps = {
  condition?: boolean;
  children: React.ReactNode
}
export const If = ({ children, condition = true }: IfProps) => {
  if (condition) return children;
}
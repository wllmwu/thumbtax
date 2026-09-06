import styles from "#src/ui/primitives/DialogFooter.module.css";

type Props = {
  children: React.ReactNode;
};

export function DialogFooter({ children }: Props): React.ReactNode {
  return <div className={styles.dialogFooter}>{children}</div>;
}

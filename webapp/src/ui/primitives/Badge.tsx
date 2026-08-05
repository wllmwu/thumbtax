import styles from "#src/ui/primitives/Badge.module.css";

type Props = {
  children: React.ReactNode;
};

export function Badge({ children }: Props) {
  return <span className={styles.badge}>{children}</span>;
}

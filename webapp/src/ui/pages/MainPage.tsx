import { FormList } from "#src/ui/forms/FormList";
import styles from "#src/ui/pages/MainPage.module.css";

export function MainPage() {
  return (
    <div className={styles.mainPage}>
      <h1>Tax forms</h1>
      <FormList />
    </div>
  );
}

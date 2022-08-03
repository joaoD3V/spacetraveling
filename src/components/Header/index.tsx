import styles from './header.module.scss';
import common from '../../styles/common.module.scss';

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={`${styles.headerContent} ${common.content}`}>
        <img src="/images/logo.svg" alt="logo" />
      </div>
    </header>
  );
}

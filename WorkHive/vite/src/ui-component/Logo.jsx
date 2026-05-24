import { Link } from 'react-router-dom';

// project imports
import config from 'config';

// assets
import workHiveLogo from 'assets/images/icons/workhivelogo.jpg';

export default function Logo() {
  return (
    <Link to={config.defaultPath} aria-label="Work Hive">
      <img
        src={workHiveLogo}
        alt="Work Hive"
        style={{
          height: 48,
          width: 'auto',
          display: 'block'
        }}
      />
    </Link>
  );
}
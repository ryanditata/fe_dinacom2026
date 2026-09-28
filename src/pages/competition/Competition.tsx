import { useDataUser } from '../../context/GlobalDataUser';
import { Navigate } from 'react-router-dom';

const Competition = () => {
    const {user} = useDataUser()

  if(!user.data?.team) return <Navigate to="/dashboard/competition/choose-role" replace />;

  return <Navigate to="/dashboard/competition/team-detail" replace />
}

export default Competition
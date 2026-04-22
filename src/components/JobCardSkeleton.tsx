import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import './JobCard.css';

export default function JobCardSkeleton() {
  return (
    <Card className="card" sx={{ borderRadius: '6px', boxShadow: 'none' }}>
      <CardContent className="card-content" sx={{ padding: 0 }}>
        <Skeleton className="company" animation="wave" variant="text" width="40%" height={24} />
        <div className="job">
          <Skeleton animation="wave" variant="circular" width={18} height={18} />
          <Skeleton animation="wave" variant="text" width="30%" />
        </div>
        <div className="education">
          <Skeleton animation="wave" variant="circular" width={18} height={18} />
          <Skeleton animation="wave" variant="text" width="30%" />
        </div>
        <div className="salary">
          <Skeleton animation="wave" variant="circular" width={18} height={18} />
          <Skeleton animation="wave" variant="text" width="40%" />
        </div>
        <Skeleton className="preview" animation="wave" variant="text" width="90%" />
      </CardContent>
      <CardActions className="card-actions">
        <Skeleton animation="wave" variant="text" width={80} height={24} />
      </CardActions>
    </Card>
  );
}

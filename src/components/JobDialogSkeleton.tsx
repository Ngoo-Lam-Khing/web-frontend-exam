import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import './JobDialog.css';

export default function JobDialogSkeleton() {
  return (
    <>
      {/* subtitle */}
      <Box className="subtitle">
        <Skeleton className="company" variant="text" width="40%" height={32} />
        <Skeleton className="job" variant="text" width="30%" height={24} />
      </Box>

      {/* company photo */}
      <Box className="company-photo">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={150} // ⚠️ match swiper height
        />
      </Box>

      {/* desc title */}
      <Skeleton className="desc" variant="text" width={120} height={28} />

      {/* content */}
      <Box className="content">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </Box>
    </>
  );
}

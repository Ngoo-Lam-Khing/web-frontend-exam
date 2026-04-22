import { memo, useCallback } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import { type JobListItem } from '../types/index';
import './JobCard.css';
import personSvg from '../assets/person-outline.svg';
import bookSvg from '../assets/book-outline.svg';
import currencySvg from '../assets/currency-outline.svg';

interface BaseCardProps {
  job: JobListItem & { educationLabel: string; salaryLabel: string };
  handleClickOpen: (id: string) => void;
}

const JobCard = memo(({ job, handleClickOpen }: BaseCardProps) => {
  const handleClick = useCallback(() => handleClickOpen(job.id), [job.id, handleClickOpen]);

  return (
    <Card className="card" sx={{ borderRadius: '6px', boxShadow: 'none' }}>
      <CardContent className="card-content" sx={{ padding: 0 }}>
        <h2 className="company">{job.companyName}</h2>
        <div className="job">
          <img className="icon" src={personSvg} alt="" />
          {job.jobTitle}
        </div>
        <div className="education">
          <img className="icon" src={bookSvg} alt="" />
          {job.educationLabel}
        </div>
        <div className="salary">
          <img className="icon" src={currencySvg} alt="" />
          {job.salaryLabel}
        </div>
        <p className="preview">{job.preview}</p>
      </CardContent>
      <CardActions className="card-actions">
        <Button className="detail" onClick={handleClick}>
          查看細節
        </Button>
      </CardActions>
    </Card>
  );
});

export default JobCard;

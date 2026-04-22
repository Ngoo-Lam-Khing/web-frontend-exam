import DOMPurify from 'dompurify';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import JobDialogSkeleton from './JobDialogSkeleton';
import { type JobDetail } from '../types/index';
import 'swiper/css';
import 'swiper/css/pagination';
import './JobDialog.css';

interface BaseDialogProps {
  open: boolean;
  handleClose: () => void;
  detail: null | JobDetail;
  loading: boolean;
}
export default function BaseDialog({ open, handleClose, detail, loading }: BaseDialogProps) {
  const pagination = {
    clickable: true,
    el: '.swiper-pagination',
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      role="dialog"
    >
      <DialogTitle className="dialog-title">詳細資訊</DialogTitle>
      <DialogContent dividers>
        {loading || !detail ? (
          <JobDialogSkeleton />
        ) : (
          <>
            <Box className="subtitle">
              <h2 className="company">{detail.companyName}</h2>
              <h2 className="job">{detail.jobTitle}</h2>
            </Box>
            <Box className="company-photo">
              <Swiper
                slidesPerView="auto"
                spaceBetween={8}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={pagination}
                modules={[Autoplay, Pagination]}
              >
                {detail.companyPhoto.map((photo) => (
                  <SwiperSlide>
                    <img src={photo} alt="" />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-pagination" />
            </Box>
            <h2 className="desc">工作內容</h2>
            <article
              className="content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(detail.description) }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button className="close" onClick={handleClose}>
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
}

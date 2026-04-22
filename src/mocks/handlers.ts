import { http, HttpResponse, delay } from 'msw';
import jobList from '../constants/jobList';
import educationList from '../constants/educationList';
import salaryList from '../constants/salaryList';
import { type JobListItem } from '../types/index';

const filterFormat = (
  data: JobListItem[],
  companyName: string | null,
  educationLevel: number,
  salaryLevel: number,
): JobListItem[] => {
  let result = data;

  if (companyName) {
    result = result.filter((item) => item.companyName.includes(companyName));
  }
  if (educationLevel) {
    result = result.filter((item) => item.educationId === educationLevel);
  }
  if (salaryLevel) {
    result = result.filter((item) => item.salaryId === salaryLevel);
  }

  return result;
};

export const handlers = [
  http.get('/api/v1/jobs', async ({ request }) => {
    await delay(5000);
    const url = new URL(request.url);
    const companyName = url.searchParams.get('company_name');
    const educationLevel = Number(url.searchParams.get('education_level'));
    const salaryLevel = Number(url.searchParams.get('salary_level'));
    const prePage = Number(url.searchParams.get('pre_page'));
    const page = Number(url.searchParams.get('page'));

    const data = jobList.map(({ companyPhoto, description, ...rest }) => rest);

    if (!Number.isNaN(prePage) && !Number.isNaN(page) && prePage > 0 && page > 0) {
      const startIndex = (page - 1) * prePage;
      const endIndex = startIndex + prePage;
      const filterData = filterFormat(data, companyName, educationLevel, salaryLevel);
      const resultData = filterData.slice(startIndex, endIndex);
      return HttpResponse.json({ data: resultData, total: filterData.length });
    }
    const result = filterFormat(data, companyName, educationLevel, salaryLevel);
    return HttpResponse.json({ data: result, total: result.length });
  }),

  http.get('/api/v1/jobs/:id', async ({ params }) => {
    // await delay(5000);

    const { id } = params;
    const data = jobList.find((job) => job.id === id);

    if (data) {
      const { preview, educationId, salaryId, ...rest } = data;
      return HttpResponse.json(rest);
    }
    return HttpResponse.json([]);
  }),

  http.get('/api/v1/educationLevelList', () => HttpResponse.json(educationList)),

  http.get('/api/v1/salaryLevelList', () => HttpResponse.json(salaryList)),
];

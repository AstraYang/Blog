import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright.jsx';
import ChartUserByCountry from './ChartUserByCountry.jsx';
import ArticleCountCard from "./ArticleCountCard.jsx";
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import {getUserCount} from "../../../api/User.js";
import SessionsChart from "./SessionsChart.jsx";
import {getBookCount} from "../../../api/books.js";
import {fetchCommentCount} from "../../../api/comments.js";

const iconMap = {
  user: PermContactCalendarOutlinedIcon,
  comments: ChatOutlinedIcon,
  books: MenuBookOutlinedIcon,
};

export default function MainGrid() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCount = await getUserCount();
        const commentCount = await fetchCommentCount();
        const bookCount = await getBookCount();
        const transformedData = [
          {
            title: '用户数',
            value: userCount.data,
            IconComponent: iconMap.user,
          },
          {
            title: '评论数',
            value: commentCount.data,
            IconComponent: iconMap.comments,
          },
          {
            title: '书籍数',
            value: bookCount.data,
            IconComponent: iconMap.books,
          },
        ];

        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          数据统计
        </Typography>
        <Grid
            container
            spacing={2}
            columns={12}
            sx={{ mb: (theme) => theme.spacing(2) }}
        >
          {data.map((card, index) => (
              <Grid key={index} size={{ xs: 12, sm: 2, lg: 3 }}>
                <ArticleCountCard {...card} />
              </Grid>
          ))}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <ChartUserByCountry />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }} >
            <SessionsChart />
          </Grid>
        </Grid>
        <Copyright sx={{ my: 4 }} />
      </Box>
  );
}

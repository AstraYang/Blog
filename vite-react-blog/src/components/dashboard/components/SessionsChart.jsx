import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useState } from 'react';
import { fetchSessionData } from '../../../api/data.js';

// 定义线性渐变组件
function AreaGradient({ color, id }) {
  return (
      <defs>
        <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.5} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

// 获取指定月份的天数
function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  return Array.from({ length: daysInMonth }, (_, i) => `${monthName} ${i + 1}`);
}

// 主组件
export default function SessionsChart() {
  const theme = useTheme();
  const [data, setData] = useState([]); // 用于存储日期
  const [currentMonthData, setCurrentMonthData] = useState([]); // 用于存储本月数据
  const [currentMonth, setCurrentMonth] = useState(null);
  const [precedingMonth,  setPrecedingMonth] = useState(null);
  const [precedingMonthData, setPrecedingMonthData] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0); // 总访问量
  const [loading, setLoading] = useState(true); // 加载状态

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 开始加载
      try {
        const result = await fetchSessionData();
        if (result.code === 200) {
          const visitData = result.data;

          const currentDate = new Date();
          const year = currentDate.getFullYear(); // 获取当前年份
          const month = currentDate.getMonth() + 1; // 获取当前月份，注意 JavaScript 中月份是从0开始的

          // 使用 getDaysInMonth 函数获取指定月份的天数
          const daysInMonth = getDaysInMonth(month, year); // 使用当前年月
          setData(daysInMonth);

          console.log('data:',result.data)
          setPrecedingMonth(visitData[0].month);
          setCurrentMonth(visitData[1].month);


          //上月数据
          const PrecedingCounts = visitData.length > 0 ? visitData[0].count : [];
          setPrecedingMonthData(PrecedingCounts);
          // 本月数据
          const CurrentCounts = visitData.length > 0 ? visitData[1].count : [];
          setCurrentMonthData(CurrentCounts);

          // 计算本月总访问量
          const total = CurrentCounts.reduce((sum, count) => sum + count, 0);
          setTotalVisits(total);
          console.log('currentMonthData:', currentMonth)

        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // 完成加载
      }
    };

    fetchData();
  }, []);

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  if (loading) {
    return <Typography variant="caption">加载中...</Typography>; // 加载状态
  }

  return (
      <Card variant="outlined" sx={{ width: '100%' }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            网站访问量
          </Typography>
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
                direction="row"
                sx={{
                  alignContent: { xs: 'center', sm: 'flex-start' },
                  alignItems: 'center',
                  gap: 1,
                }}
            >
              <Typography variant="h4" component="p">
                {totalVisits.toLocaleString()} {/* 显示总访问量 */}
              </Typography>
            </Stack>
          </Stack>
          <LineChart
              colors={colorPalette}
              xAxis={[
                {
                  scaleType: 'point',
                  data,
                  tickInterval: (index, i) => (i + 1) % 5 === 0,
                },
              ]}
              series={[
                {
                  id: 'referral',
                  label: `${precedingMonth}月`,
                  showMark: false,
                  curve: 'linear',
                  stack: 'total',
                  area: true,
                  stackOrder: 'ascending',
                  data: precedingMonthData.length > 0 ? precedingMonthData : [0],
                },
                {
                  id: 'direct',
                  label: `${currentMonth}月`,
                  showMark: false,
                  curve: 'linear',
                  stack: 'total',
                  area: true,
                  stackOrder: 'ascending',
                  data: currentMonthData.length > 0 ? currentMonthData : [0], // 确保有数据

                }
              ]}
              height={250}
              margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
              grid={{ horizontal: true }}
              sx={{
                '& .MuiAreaElement-series-organic': {
                  fill: "url('#organic')",
                },
                '& .MuiAreaElement-series-referral': {
                  fill: "url('#referral')",
                },
                '& .MuiAreaElement-series-direct': {
                  fill: "url('#direct')",
                },
              }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
          >
            <AreaGradient color={theme.palette.primary.dark} id="organic" />
            <AreaGradient color={theme.palette.primary.main} id="referral" />
            <AreaGradient color={theme.palette.primary.light} id="direct" />
          </LineChart>
        </CardContent>
      </Card>
  );
}

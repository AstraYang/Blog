import * as React from 'react';
import PropTypes from 'prop-types';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { useEffect } from "react";
import { fetchCategories } from "../../../api/category.js";
const StyledText = styled('text')(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
}));

function PieCenterLabel({ primaryData, secondaryText }) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
      <React.Fragment>
        <StyledText x={left + width / 2} y={primaryY}>
          {primaryData}
        </StyledText>
        <StyledText x={left + width / 2} y={secondaryY}>
          {secondaryText}
        </StyledText>
      </React.Fragment>
  );
}

PieCenterLabel.propTypes = {
  primaryData: PropTypes.number.isRequired,
  secondaryText: PropTypes.string.isRequired,
};

export default function ChartUserByCountry() {
  const [data, setData] = React.useState([]);
  const [colors, setColors] = React.useState([]);
  const [totalValue, setTotalValue] = React.useState(0);

  // 使用 useEffect 只在组件首次渲染时请求分类数据
  useEffect(() => {
    const fetchCategorie = async () => {
      const response = await fetchCategories();
      setColors(generateColors(response.length));
      const Data = response.map(item => ({
        label: item.categoryName,
        value: item.count
      }));
      setData(Data);
    };

    fetchCategorie();
  }, []); // 空依赖数组，表示只在组件挂载时执行一次

  useEffect(() => {
    // 每当 data 更新时，重新计算总值
    const total = data.reduce((sum, item) => sum + item.value, 0);
    setTotalValue(total);
  }, [data]);

  function generateColors(num) {
    const colors = [];
    const saturation = 75; // 饱和度
    const lightnessStep = 100 / num; // 计算每个颜色的亮度步长

    for (let i = 0; i < num; i++) {
      const lightness = (i * lightnessStep) + 10; // 确保亮度在 10% 到 90% 之间
      colors.push(`hsl(220, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  }

  return (
      <Card
          variant="outlined"
          sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
      >
        <CardContent>
          <Typography component="h3" variant="subtitle2">
            文章数
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PieChart
                colors={colors}
                margin={{
                  left: 20,
                  right: 20,
                  top: 20,
                  bottom: 20,
                }}
                series={[
                  {
                    data,
                    innerRadius: 55,
                    outerRadius: 75,
                    paddingAngle: 0,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                  },
                ]}
                height={150}
                width={150}
                slotProps={{
                  legend: { hidden: true },
                }}
            >
              <PieCenterLabel primaryData={totalValue} secondaryText="总计" />
            </PieChart>
          </Box>
        </CardContent>
      </Card>
  );
}

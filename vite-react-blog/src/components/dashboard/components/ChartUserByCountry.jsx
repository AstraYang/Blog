import * as React from 'react';
import PropTypes from 'prop-types';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import {useEffect} from "react";
import {fetchCategories} from "../../../api/category.js";

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Stack from "@mui/material/Stack";


import {
  IndiaFlag,
  UsaFlag,
  BrazilFlag,
  GlobeFlag,
} from '../internals/components/CustomIcons';
import {Divider} from "@mui/material";
const countries = [
  {
    name: 'India',
    value: 50,
    flag: <IndiaFlag />,
    color: 'hsl(220, 25%, 65%)',
  },
  {
    name: 'USA',
    value: 35,
    flag: <UsaFlag />,
    color: 'hsl(220, 25%, 45%)',
  },
  // {
  //   name: 'Brazil',
  //   value: 10,
  //   flag: <BrazilFlag />,
  //   color: 'hsl(220, 25%, 30%)',
  // },
  // {
  //   name: 'Other',
  //   value: 5,
  //   flag: <GlobeFlag />,
  //   color: 'hsl(220, 25%, 20%)',
  // },
];

const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

function PieCenterLabel({ primaryData, secondaryText }) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
      <React.Fragment>
        <StyledText variant="primary" x={left + width / 2} y={primaryY}>
          {primaryData}
        </StyledText>
        <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
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
  const [data,setData] = React.useState([]);
  const [colors, setColors] = React.useState([]);
  const [totalValue, setTotalValue] = React.useState(0);

  useEffect(() => {
    fetchCategorie();
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
  const fetchCategorie = async () => {
    const response = await fetchCategories();
    setColors(generateColors(response.length))
    const Data = response.map(item => ({
      label: item.categoryName,
      value: item.count
    }));
    setData(Data);
  };

  return (
      <Card
          variant="outlined"
          sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
      >
        <CardContent>
          <Typography component="h2" variant="subtitle2">
            分类数据
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PieChart
                colors={colors}
                margin={{
                  left: 80,
                  right: 80,
                  top: 80,
                  bottom: 80,
                }}
                series={[
                  {
                    data,
                    innerRadius: 75,
                    outerRadius: 100,
                    paddingAngle: 0,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                  },
                ]}
                height={260}
                width={260}
                slotProps={{
                  legend: { hidden: true },
                }}
            >
              <PieCenterLabel primaryData={totalValue} secondaryText="总计" />
            </PieChart>
          </Box>
          {/*{countries.map((country, index) => (*/}
          {/*    <Stack*/}
          {/*        key={index}*/}
          {/*        direction="row"*/}
          {/*        sx={{ alignItems: 'center', gap: 2, pb: 2 }}*/}
          {/*    >*/}
          {/*      {country.flag}*/}
          {/*      <Stack sx={{ gap: 1, flexGrow: 1 }}>*/}
          {/*        <Stack*/}
          {/*            direction="row"*/}
          {/*            sx={{*/}
          {/*              justifyContent: 'space-between',*/}
          {/*              alignItems: 'center',*/}
          {/*              gap: 2,*/}
          {/*            }}*/}
          {/*        >*/}
          {/*          <Typography variant="body2" sx={{ fontWeight: '500' }}>*/}
          {/*            {country.name}*/}
          {/*          </Typography>*/}
          {/*          <Typography variant="body2" sx={{ color: 'text.secondary' }}>*/}
          {/*            {country.value}%*/}
          {/*          </Typography>*/}
          {/*        </Stack>*/}
          {/*        <LinearProgress*/}
          {/*            variant="determinate"*/}
          {/*            aria-label="Number of users by country"*/}
          {/*            value={country.value}*/}
          {/*            sx={{*/}
          {/*              [`& .${linearProgressClasses.bar}`]: {*/}
          {/*                backgroundColor: country.color,*/}
          {/*              },*/}
          {/*            }}*/}
          {/*        />*/}
          {/*      </Stack>*/}
          {/*    </Stack>*/}
          {/*))}*/}
          {/*<Divider sx={{ my: 1, backgroundColor: '#4a4f4f', height: 1}} />*/}

          {/*<Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
          {/*  <PieChart*/}
          {/*      colors={colors}*/}
          {/*      margin={{*/}
          {/*        left: 80,*/}
          {/*        right: 80,*/}
          {/*        top: 80,*/}
          {/*        bottom: 80,*/}
          {/*      }}*/}
          {/*      series={[*/}
          {/*        {*/}
          {/*          data,*/}
          {/*          innerRadius: 75,*/}
          {/*          outerRadius: 100,*/}
          {/*          paddingAngle: 0,*/}
          {/*          highlightScope: { faded: 'global', highlighted: 'item' },*/}
          {/*        },*/}
          {/*      ]}*/}
          {/*      height={260}*/}
          {/*      width={260}*/}
          {/*      slotProps={{*/}
          {/*        legend: { hidden: true },*/}
          {/*      }}*/}
          {/*  >*/}
          {/*    <PieCenterLabel primaryData={totalValue} secondaryText="总计" />*/}
          {/*  </PieChart>*/}
          {/*</Box>*/}

        </CardContent>
      </Card>
  );
}

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Link from '@mui/material/Link'; // 用于点击导航

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

// 定义面包屑导航的映射
const breadcrumbMap = {
  controlPanel: "主控制台",
  markdown: "撰写文章",
  clients: "客户管理",
  tasks: "任务列表",
  edit: "编辑页面",
};

export default function NavbarBreadcrumbs({ selectedMenu, onMenuSelect }) {
  return (
      <StyledBreadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextRoundedIcon fontSize="small" />}
      >
        {/* 首页导航 */}
        <Link
            component="button"
            variant="body1"
            onClick={() => onMenuSelect('controlPanel')}
            sx={{ cursor: 'pointer' }}
        >
          Dashboard
        </Link>

        {/* 当前页面 */}
        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {breadcrumbMap[selectedMenu] || "未知页面"}
        </Typography>
      </StyledBreadcrumbs>
  );
}

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PropTypes from "prop-types";

export default function Copyright(props) {
  return (
    <Typography
      variant="body2"
      align="center"
      {...props}
      sx={[
        {
          color: 'text.secondary',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://blog.struct.fun/">
        AstraYang
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

Copyright.propTypes = {
    sx: PropTypes.oneOfType([
        PropTypes.array, // 允许 sx 是数组
        PropTypes.object, // 允许 sx 是对象
    ]),
};
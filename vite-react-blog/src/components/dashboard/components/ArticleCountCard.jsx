import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ArticleCountCard = ({ title, value, IconComponent }) => {
    return (
        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 2 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography component="h3" variant="subtitle2" sx={{ mb: 1 }}>
                    {title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {IconComponent && (
                        <IconComponent sx={{ fontSize: 90, color: 'primary.main', mr: 2 }} />
                    )}
                    <Typography variant="h2" component="div" justifyContent="center" sx={{ color: 'primary.main' }}>
                        {value}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

ArticleCountCard.propTypes = {
    value: PropTypes.number.isRequired, // 修改为 value
    title: PropTypes.string.isRequired,
    IconComponent: PropTypes.elementType,
};

export default ArticleCountCard;

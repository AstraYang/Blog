import React from "react";
import PropTypes from "prop-types";
import { Typography, List, ListItem, ListItemButton, ListItemText, Box } from "@mui/material";

const TableOfContents = ({ toc, onTocClick }) => {
    return (
        <Box sx={{
            width: 200,
            flexShrink: 0,
            marginLeft: 4,
            position: "sticky",
            top: 20,
            alignSelf: "flex-start"
        }}>
            <Typography variant="h6" gutterBottom>
                目录
            </Typography>
            <List dense>
                {toc.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{ pl: (item.level - 1) * 2 }}
                    >
                        <ListItemButton onClick={() => onTocClick(item.id)}>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

TableOfContents.propTypes = {
    toc: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            level: PropTypes.number.isRequired,
        })
    ).isRequired,
    onTocClick: PropTypes.func.isRequired,
};

export default TableOfContents;

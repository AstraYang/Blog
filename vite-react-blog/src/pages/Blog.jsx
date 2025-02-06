import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../shared-theme/AppTheme.jsx';
import AppAppBar from '../components/blog/AppAppBar.jsx';
import MainContent from '../components/blog/MainContent.jsx';
import Latest from '../components/blog/Latest.jsx';
import Footer from '../components/blog/Footer.jsx';

export default function Blog(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        {/*<MainContent />*/}
        <Latest />
      </Container>
      <Footer />
    </AppTheme>
  );
}

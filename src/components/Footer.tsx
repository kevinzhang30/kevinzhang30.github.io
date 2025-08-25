import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Link,
  Divider,
} from '@mui/material';
import {
  Email,
  LinkedIn,
  GitHub,
  Twitter,
  Instagram,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Email, href: 'mailto:kevin@example.com', label: 'Email' },
    { icon: LinkedIn, href: 'https://linkedin.com/in/kevin-zhang73', label: 'LinkedIn' },
    { icon: GitHub, href: 'https://github.com/kevinzhang30', label: 'GitHub' },
    { icon: Instagram, href: 'https://instagram.com/kev.z_375', label: 'Instagram' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.100',
        py: 4,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'grey.300',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 Kevin Zhang. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                component={Link}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              >
                <social.icon />
              </IconButton>
            ))}
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Computer Science Student & Aspiring Software Engineer
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

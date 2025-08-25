import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Download, GitHub, LinkedIn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentWork, setCurrentWork] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const fullText = "Hi, I'm Kevin. I'm a Computer Science student and aspiring Software Engineer.";
  
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // Fetch skills configuration
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/config/skills-config.json');
        const data = await response.json();
        setSkills(data.skills);
      } catch (error) {
        console.error('Error loading skills config:', error);
        // Fallback to default skills if config fails to load
        setSkills([
          'C/C++', 'Python', 'Java', 'Bash', 'Kotlin', 'JavaScript', 'SQL', 'CSS', 'HTML', 'TypeScript', 'Ruby',
          'Linux', 'MySQL', 'Git', 'GitLab', 'React', 'Figma', 'Spring Boot', 'AWS', 'Firebase', 'Rails'
        ]);
      }
    };

    fetchSkills();
  }, []);

  // Fetch current work configuration
  useEffect(() => {
    const fetchCurrentWork = async () => {
      try {
        const response = await fetch('/config/current-work-config.json');
        const data = await response.json();
        setCurrentWork(data.currentWork);
      } catch (error) {
        console.error('Error loading current work config:', error);
        // Fallback to default current work if config fails to load
        setCurrentWork([
          {
            icon: "🚀",
            description: "Working as Instructional Support Assistant at University of Waterloo"
          },
          {
            icon: "📚",
            description: "Pursuing dual degree in Computer Science & Business Administration"
          },
          {
            icon: "🔍",
            description: "Developing full-stack applications and systems programming projects"
          },
          {
            icon: "🏊‍♂️",
            description: "When I'm not coding, you'll find me swimming or exploring new technologies"
          }
        ]);
      }
    };

    fetchCurrentWork();
  }, []);



  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              component="p"
              color="text.primary"
              sx={{
                fontFamily: 'monospace',
                minHeight: '2.5rem',
                mb: 4,
                fontSize: '1.5rem',
              }}
            >
              {text}
              <span className="typewriter-cursor">|</span>
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Download />}
                onClick={() => navigate('/resume')}
                sx={{ px: 4, py: 1.5 }}
              >
                View Resume
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<GitHub />}
                href="https://github.com/kevinzhang30"
                target="_blank"
                sx={{ px: 4, py: 1.5 }}
              >
                GitHub
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<LinkedIn />}
                href="https://linkedin.com/in/kevin-zhang73"
                target="_blank"
                sx={{ px: 4, py: 1.5 }}
              >
                LinkedIn
              </Button>
            </Box>
          </motion.div>
        </Box>
      </motion.div>

      {/* About Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'primary.main',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 4px 15px rgba(0, 131, 143, 0.2)',
          }}
        >
          <motion.div variants={itemVariants}>
                        <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3, textAlign: 'center', color: 'primary.main' }}
            >
              Skills & Technologies
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {skills.map((skill, index) => (
                <Chip
                  key={skill}
                  label={skill}
                  variant="outlined"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                />
              ))}
            </Box>
          </motion.div>
        </Paper>
      </motion.div>

      {/* What I'm Currently Working On Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 6,
            border: '2px solid',
            borderColor: 'primary.main',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 4px 15px rgba(0, 131, 143, 0.2)',
          }}
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3, textAlign: 'center', color: 'primary.main' }}
            >
              What I'm Currently Working On
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {currentWork.slice(0, 2).map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Typography variant="body2" paragraph sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
                    {item.icon} {item.description}
                  </Typography>
                </motion.div>
              ))}
              {currentWork.slice(2).map((item, index) => (
                <motion.div key={index + 2} variants={itemVariants}>
                  <Typography variant="body2" paragraph sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
                    {item.icon} {item.description}
                  </Typography>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Paper>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
        <motion.div variants={itemVariants}>
                           <Paper
                 elevation={3}
                 sx={{
                   p: 4,
                   textAlign: 'center',
                   cursor: 'pointer',
                   borderRadius: 3,
                   border: '2px solid',
                   borderColor: 'primary.main',
                   background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
                   boxShadow: '0 4px 15px rgba(0, 131, 143, 0.2)',
                   '&:hover': {
                     transform: 'translateY(-8px)',
                     boxShadow: '0 12px 35px rgba(0, 131, 143, 0.4)',
                     borderColor: 'primary.dark',
                     background: 'linear-gradient(135deg, #b2dfdb 0%, #80cbc4 100%)',
                     transition: 'all 0.3s ease-in-out',
                   },
                 }}
                 onClick={() => navigate('/resume')}
               >
                             <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                 Resume
               </Typography>
               <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                 My Skills & Experience
               </Typography>
            </Paper>
          </motion.div>
          <motion.div variants={itemVariants}>
                                                                                                       <Paper
                 elevation={3}
                 sx={{
                   p: 4,
                   textAlign: 'center',
                   cursor: 'pointer',
                   borderRadius: 3,
                   border: '2px solid',
                   borderColor: 'primary.main',
                   background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
                   boxShadow: '0 4px 15px rgba(0, 131, 143, 0.2)',
                   '&:hover': {
                     transform: 'translateY(-8px)',
                     boxShadow: '0 12px 35px rgba(0, 131, 143, 0.4)',
                     borderColor: 'primary.dark',
                     background: 'linear-gradient(135deg, #b2dfdb 0%, #80cbc4 100%)',
                     transition: 'all 0.3s ease-in-out',
                   },
                 }}
                 onClick={() => navigate('/projects')}
                 >
                              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Projects
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Cool Stuff I Built
                </Typography>
            </Paper>
          </motion.div>
          
          <motion.div variants={itemVariants}>
                                                                                                       <Paper
                 elevation={3}
                 sx={{
                   p: 4,
                   textAlign: 'center',
                   cursor: 'pointer',
                   borderRadius: 3,
                   border: '2px solid',
                   borderColor: 'primary.main',
                   background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
                   boxShadow: '0 4px 15px rgba(0, 131, 143, 0.2)',
                   '&:hover': {
                     transform: 'translateY(-8px)',
                     boxShadow: '0 12px 35px rgba(0, 131, 143, 0.4)',
                     borderColor: 'primary.dark',
                     background: 'linear-gradient(135deg, #b2dfdb 0%, #80cbc4 100%)',
                     transition: 'all 0.3s ease-in-out',
                   },
                 }}
                 onClick={() => navigate('/gallery')}
                 >
                              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Gallery
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Some Cool Photos
                </Typography>
            </Paper>
          </motion.div>
          
          <motion.div variants={itemVariants}>
                                                   <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
                  boxShadow: '0 4px 15px rgba(0, 131, 143, 0.2)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 35px rgba(0, 131, 143, 0.4)',
                    borderColor: 'primary.dark',
                    background: 'linear-gradient(135deg, #b2dfdb 0%, #80cbc4 100%)',
                    transition: 'all 0.3s ease-in-out',
                  },
                }}
                onClick={() => navigate('/map')}
                >
                              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Travel Map
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Places I've Been
                </Typography>
            </Paper>
          </motion.div>
          
          
        </Box>
      </motion.div>


    </Container>
  );
};

export default Home;
